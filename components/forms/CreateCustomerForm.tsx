"use client";

// TODO: Implement CreateCustomerForm
// Fields: name, email, password, phone, address
// On submit: call POST /api/customers, show toast, call onSuccess()

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateCustomer } from "@/hooks/useCustomers";
import toast from "react-hot-toast";

const schema = z.object({
  name:     z.string().min(1, "Name is required"),
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone:    z.string().min(1, "Phone is required"),
  address:  z.string().min(1, "Address is required"),
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreateCustomerForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateCustomer();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Customer registered successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to register customer");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" {...register("name")}     error={errors.name?.message} />
      <Input label="Email"     {...register("email")}    error={errors.email?.message}    type="email" />
      <Input label="Password"  {...register("password")} error={errors.password?.message} type="password" />
      <Input label="Phone"     {...register("phone")}    error={errors.phone?.message} />
      <Input label="Address"   {...register("address")}  error={errors.address?.message} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Register Customer</Button>
      </div>
    </form>
  );
}
