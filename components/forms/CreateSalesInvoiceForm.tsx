"use client";

// TODO: Implement CreateSalesInvoiceForm
// Fields: customerId, items (array of { partId, quantity })
// Auto-calculate total; apply 10% discount if total >= 5000
// On submit: call useCreateSalesInvoice() mutation, show toast, call onSuccess()

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateSalesInvoice } from "@/hooks/useInvoices";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";

const schema = z.object({
  customerId: z.coerce.number().positive("Customer is required"),
  items: z.array(z.object({
    partId:   z.coerce.number().positive("Part is required"),
    quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  })).min(1, "At least one item is required"),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreateSalesInvoiceForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateSalesInvoice();
  const { register, handleSubmit, control, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { items: [{ partId: 0, quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data as never);
      toast.success("Sales invoice created");
      onSuccess?.();
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Customer ID"
        {...register("customerId")}
        error={errors.customerId?.message}
        type="number"
        hint="TODO: Replace with customer search/select"
      />

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-700">Line Items</label>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ partId: 0, quantity: 1 })}>
            <Plus className="w-3.5 h-3.5" /> Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start">
              <Input
                placeholder="Part ID"
                {...register(`items.${i}.partId`)}
                error={errors.items?.[i]?.partId?.message}
                type="number"
                hint="TODO: Replace with part search"
              />
              <Input
                placeholder="Qty"
                {...register(`items.${i}.quantity`)}
                error={errors.items?.[i]?.quantity?.message}
                type="number"
                className="w-24"
              />
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(i)} className="mt-7 p-2 text-red-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.items?.message && <p className="text-xs text-red-500 mt-1">{errors.items.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Create Invoice</Button>
      </div>
    </form>
  );
}
