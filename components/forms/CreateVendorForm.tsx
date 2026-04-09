"use client";

// TODO: Implement CreateVendorForm
// Fields: name, contactPerson, email, phone, address
// Validation: zod schema — all fields required, email must be valid
// On submit: call useCreateVendor() mutation, show toast, call onSuccess()

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateVendor } from "@/hooks/useVendors";
import toast from "react-hot-toast";

const schema = z.object({
  name:          z.string().min(1, "Name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email:         z.string().email("Invalid email"),
  phone:         z.string().min(1, "Phone is required"),
  address:       z.string().min(1, "Address is required"),
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreateVendorForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateVendor();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Vendor added successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to add vendor");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Vendor Name"     {...register("name")}          error={errors.name?.message} />
      <Input label="Contact Person"  {...register("contactPerson")} error={errors.contactPerson?.message} />
      <Input label="Email"           {...register("email")}         error={errors.email?.message} type="email" />
      <Input label="Phone"           {...register("phone")}         error={errors.phone?.message} />
      <Input label="Address"         {...register("address")}       error={errors.address?.message} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Add Vendor</Button>
      </div>
    </form>
  );
}
