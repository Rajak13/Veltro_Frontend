"use client";

// TODO: Implement CreatePurchaseInvoiceForm
// Fields: vendorId, items (array of { partId, quantity, unitPrice })
// On submit: call useCreatePurchaseInvoice() mutation, show toast, call onSuccess()

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreatePurchaseInvoice } from "@/hooks/useInvoices";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  vendorId: z.coerce.number().positive("Vendor is required"),
  items: z.array(z.object({
    partId:    z.coerce.number().positive("Part is required"),
    quantity:  z.coerce.number().int().positive("Quantity must be at least 1"),
    unitPrice: z.coerce.number().positive("Unit price must be positive"),
  })).min(1, "At least one item is required"),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreatePurchaseInvoiceForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreatePurchaseInvoice();
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { items: [{ partId: 0, quantity: 1, unitPrice: 0 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data as never);
      toast.success("Purchase invoice created");
      onSuccess?.();
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Vendor ID"
        {...register("vendorId")}
        error={errors.vendorId?.message}
        type="number"
        hint="TODO: Replace with vendor dropdown"
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-700">Items</label>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ partId: 0, quantity: 1, unitPrice: 0 })}>
            <Plus className="w-3.5 h-3.5" /> Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Input placeholder="Part ID"    {...register(`items.${i}.partId`)}    error={errors.items?.[i]?.partId?.message}    type="number" />
              <Input placeholder="Qty"        {...register(`items.${i}.quantity`)}  error={errors.items?.[i]?.quantity?.message}  type="number" className="w-24" />
              <Input placeholder="Unit Price" {...register(`items.${i}.unitPrice`)} error={errors.items?.[i]?.unitPrice?.message} type="number" />
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(i)} className="mt-7 p-2 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Create Invoice</Button>
      </div>
    </form>
  );
}
