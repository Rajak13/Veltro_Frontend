"use client";

// Feature 7 — Create Sales Invoice (Staff)
// Fields: customerId, items (array of { partId, quantity })
// Auto-calculate total; apply 10% discount if total >= 5000
// On submit: call useCreateSalesInvoice() mutation, show toast, call onSuccess()

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useMemo } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateSalesInvoice } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";
import { useParts } from "@/hooks/useParts";
import toast from "react-hot-toast";
import { Plus, Trash2, Search, User, Package, Tag } from "lucide-react";

const schema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  items: z.array(z.object({
    partId:   z.string().min(1, "Part is required"),
    quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  })).min(1, "At least one item is required"),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreateSalesInvoiceForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateSalesInvoice();
  const { data: customersData } = useCustomers(1, 100);
  const { data: partsData } = useParts(1, 100);
  
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<{ id: string; name: string } | null>(null);
  
  const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { customerId: "", items: [{ partId: "", quantity: 1 }] },
  });
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const customers = customersData?.items ?? [];
  const parts = partsData?.data ?? [];
  
  const filteredCustomers = useMemo(() => {
    if (!customerSearch) return customers.slice(0, 5);
    const q = customerSearch.toLowerCase();
    return customers.filter(c => 
      c.fullName?.toLowerCase().includes(q) || 
      c.phone?.toLowerCase().includes(q)
    ).slice(0, 5);
  }, [customers, customerSearch]);

  const items = watch("items");
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const part = parts.find(p => p.partId === item.partId);
      return sum + (part?.price ?? 0) * (item.quantity || 0);
    }, 0);
  }, [items, parts]);

  const discount = subtotal >= 5000 ? subtotal * 0.1 : 0;
  const total = subtotal - discount;

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data as never);
      toast.success("Sales invoice created successfully!");
      onSuccess?.();
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Customer Selection */}
      <div>
        <label className="text-sm font-medium text-zinc-700 mb-2 block">Customer</label>
        {selectedCustomer ? (
          <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="w-8 h-8 rounded-md bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-600">
              {selectedCustomer.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-zinc-800">{selectedCustomer.name}</p>
              <p className="text-xs text-zinc-500">Customer ID: {selectedCustomer.id}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCustomer(null);
                setValue("customerId", "");
              }}
              className="text-xs text-orange-600 hover:text-orange-700 font-medium"
            >
              Change
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Search by name or phone..."
                value={customerSearch}
                onChange={(e) => setCustomerSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>
            {customerSearch && (
              <div className="border border-zinc-200 rounded-lg overflow-hidden max-h-60 overflow-y-auto">
                {filteredCustomers.length === 0 ? (
                  <p className="text-sm text-zinc-400 text-center py-4">No customers found</p>
                ) : (
                  filteredCustomers.map(c => (
                    <button
                      key={c.customerId}
                      type="button"
                      onClick={() => {
                        setSelectedCustomer({ id: c.customerId, name: c.user?.name ?? "Unknown" });
                        setValue("customerId", c.customerId);
                        setCustomerSearch("");
                      }}
                      className="w-full flex items-center gap-2 p-3 hover:bg-zinc-50 border-b border-zinc-100 last:border-0 text-left"
                    >
                      <User className="w-4 h-4 text-zinc-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-zinc-800">{c.user?.name}</p>
                        <p className="text-xs text-zinc-500">{c.phone}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        )}
        {errors.customerId && <p className="text-xs text-red-500 mt-1">{errors.customerId.message}</p>}
      </div>

      {/* Line Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-medium text-zinc-700">Line Items</label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={() => append({ partId: "", quantity: 1 })}
          >
            <Plus className="w-3.5 h-3.5" /> Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {fields.map((field, i) => (
            <div key={field.id} className="flex gap-2 items-start p-3 bg-zinc-50 rounded-lg border border-zinc-200">
              <div className="flex-1 space-y-2">
                <select
                  {...register(`items.${i}.partId`)}
                  className="w-full px-3 py-2 border border-zinc-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a part...</option>
                  {parts.map(p => (
                    <option key={p.partId} value={p.partId}>
                      {p.name} - Rs. {p.price?.toLocaleString()} (Stock: {p.stockQuantity})
                    </option>
                  ))}
                </select>
                {errors.items?.[i]?.partId && (
                  <p className="text-xs text-red-500">{errors.items[i]?.partId?.message}</p>
                )}
              </div>
              <div className="w-24">
                <Input
                  placeholder="Qty"
                  {...register(`items.${i}.quantity`)}
                  error={errors.items?.[i]?.quantity?.message}
                  type="number"
                  min="1"
                />
              </div>
              {fields.length > 1 && (
                <button 
                  type="button" 
                  onClick={() => remove(i)} 
                  className="mt-2 p-2 text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.items?.message && <p className="text-xs text-red-500 mt-1">{errors.items.message}</p>}
      </div>

      {/* Price Summary */}
      {subtotal > 0 && (
        <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-600">Subtotal</span>
            <span className="font-medium text-zinc-900 tabular-nums">Rs. {subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-green-600 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Loyalty Discount (10%)
              </span>
              <span className="font-medium text-green-600 tabular-nums">- Rs. {discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-semibold border-t border-zinc-200 pt-2">
            <span className="text-zinc-900">Total</span>
            <span className="text-orange-600 tabular-nums">Rs. {total.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* Submit */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending} disabled={!selectedCustomer || items.length === 0}>
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
