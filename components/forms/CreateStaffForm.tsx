"use client";

// TODO: Implement CreateStaffForm
// Fields: name, email, password, phone, position
// On submit: call POST /api/admin/staff, show toast, call onSuccess()

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import api from "@/lib/api";

const schema = z.object({
  name:     z.string().min(1, "Name is required"),
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone:    z.string().min(1, "Phone is required"),
  position: z.string().min(1, "Position is required"),
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreateStaffForm({ onSuccess }: Props) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await api.post("/admin/staff", data);
      toast.success("Staff member added");
      onSuccess?.();
    } catch {
      toast.error("Failed to add staff member");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" {...register("name")}     error={errors.name?.message} />
      <Input label="Email"     {...register("email")}    error={errors.email?.message}    type="email" />
      <Input label="Password"  {...register("password")} error={errors.password?.message} type="password" />
      <Input label="Phone"     {...register("phone")}    error={errors.phone?.message} />
      <Input label="Position"  {...register("position")} error={errors.position?.message} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isSubmitting}>Add Staff</Button>
      </div>
    </form>
  );
}
