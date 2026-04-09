"use client";

// TODO: Implement CreatePartForm
// Fields: name, description, sku, price, stockQuantity, vendorId
// Validation: zod schema — price and stock must be positive numbers
// On submit: call useCreatePart() mutation, show toast, call onSuccess()

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreatePart } from "@/hooks/useParts";
import toast from "react-hot-toast";

const schema = z.object({
  name:          z.string().min(1, "Name is required"),
  description:   z.string().min(1, "Description is required"),
  sku:           z.string().min(1, "SKU is required"),
  price:         z.coerce.number().positive("Price must be positive"),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  vendorId:      z.coerce.number().positive("Vendor is required"),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreatePartForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreatePart();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Part added successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to add part");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Part Name"    {...register("name")}          error={errors.name?.message} />
      <Input label="Description"  {...register("description")}   error={errors.description?.message} />
      <Input label="SKU"          {...register("sku")}           error={errors.sku?.message} />
      <div className="grid grid-cols-2 gap-4">
        <Input label="Price (Rs.)"  {...register("price")}         error={errors.price?.message}         type="number" />
        <Input label="Stock Qty"    {...register("stockQuantity")} error={errors.stockQuantity?.message} type="number" />
      </div>
      <Input label="Vendor ID"    {...register("vendorId")}      error={errors.vendorId?.message}      type="number" hint="TODO: Replace with vendor dropdown" />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Add Part</Button>
      </div>
    </form>
  );
}
