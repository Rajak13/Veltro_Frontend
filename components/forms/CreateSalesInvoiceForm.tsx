"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateSalesInvoice } from "@/hooks/useInvoices";
import { useCustomers } from "@/hooks/useCustomers";
import { useParts } from "@/hooks/useParts";
import toast from "react-hot-toast";
import { Plus, Trash2, Tag } from "lucide-react";
import type { Part, Customer } from "@/types";

// ─── Zod schema ──────────────────────────────────────────────────────────────
// Backend CreateSalesInvoiceDto: { customerId: Guid, items: [{ partId: Guid, quantity: int }] }
// UUIDs are sent as strings; quantity must be a positive integer.
const schema = z.object({
  customerId: z.string().uuid("Please select a valid customer"),
  items: z
    .array(
      z.object({
        partId: z.string().uuid("Please select a valid part"),
        quantity: z.coerce
          .number()
          .int()
          .positive("Quantity must be at least 1"),
      })
    )
    .min(1, "At least one item is required"),
});

type FormData = z.output<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

// ─── Discount constants (mirrors LoyaltyService.cs) ──────────────────────────
const DISCOUNT_THRESHOLD = 5000;
const DISCOUNT_RATE = 0.1;

export default function CreateSalesInvoiceForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateSalesInvoice();

  // Load all customers (search-filtered) and all parts (large page for dropdown)
  const [customerSearch, setCustomerSearch] = useState("");
  const { data: customersData } = useCustomers(1, 50, customerSearch || undefined);
  const { data: partsData } = useParts(1, 200);

  const customers: Customer[] = useMemo(
    () => customersData?.data ?? [],
    [customersData]
  );
  const parts: Part[] = useMemo(() => partsData?.data ?? [], [partsData]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
    defaultValues: { customerId: "", items: [{ partId: "", quantity: 1 }] },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  // ─── Live order summary ───────────────────────────────────────────────────
  const watchedItems = watch("items");

  const { subtotal, discount, finalAmount } = useMemo(() => {
    const sub = watchedItems.reduce((acc, item) => {
      const part = parts.find((p) => String(p.id) === String(item.partId));
      const qty = Number(item.quantity) || 0;
      return acc + (part?.price ?? 0) * qty;
    }, 0);
    const disc = sub > DISCOUNT_THRESHOLD ? Math.round(sub * DISCOUNT_RATE * 100) / 100 : 0;
    return { subtotal: sub, discount: disc, finalAmount: sub - disc };
  }, [watchedItems, parts]);

  // ─── Submit ───────────────────────────────────────────────────────────────
  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data as never);
      toast.success("Sales invoice created successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to create sales invoice");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* ── Customer select ── */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-zinc-700">Customer</label>
        <Input
          placeholder="Search by name or email…"
          value={customerSearch}
          onChange={(e) => setCustomerSearch(e.target.value)}
          className="mb-1"
        />
        <select
          {...register("customerId")}
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100 disabled:bg-zinc-50"
        >
          <option value="">— Select customer —</option>
          {customers.map((c) => (
            <option key={c.id} value={String(c.id)}>
              {c.user?.name} ({c.user?.email})
            </option>
          ))}
        </select>
        {errors.customerId && (
          <p className="text-xs text-red-500">{errors.customerId.message}</p>
        )}
      </div>

      {/* ── Line items ── */}
      <div>
        <div className="flex items-center justify-between mb-2">
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

        <div className="space-y-2">
          {fields.map((field, i) => {
            const selectedPart = parts.find(
              (p) => String(p.id) === String(watchedItems[i]?.partId)
            );
            return (
              <div
                key={field.id}
                className="flex gap-2 items-start p-3 rounded-xl border border-zinc-100 bg-zinc-50"
              >
                {/* Part select */}
                <div className="flex-1 flex flex-col gap-1">
                  <select
                    {...register(`items.${i}.partId`)}
                    className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="">— Select part —</option>
                    {parts.map((p) => (
                      <option key={p.id} value={String(p.id)}>
                        {p.name} — Rs. {Number(p.price).toLocaleString()} (Stock: {p.stockQuantity})
                      </option>
                    ))}
                  </select>
                  {errors.items?.[i]?.partId && (
                    <p className="text-xs text-red-500">
                      {errors.items[i]?.partId?.message}
                    </p>
                  )}
                  {selectedPart && (
                    <p className="text-xs text-zinc-400">
                      Unit price: Rs. {Number(selectedPart.price).toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="w-24">
                  <Input
                    placeholder="Qty"
                    {...register(`items.${i}.quantity`)}
                    error={errors.items?.[i]?.quantity?.message}
                    type="number"
                    min={1}
                  />
                </div>

                {/* Line subtotal */}
                {selectedPart && (
                  <div className="mt-2 text-xs text-zinc-500 tabular-nums whitespace-nowrap pt-1.5">
                    Rs.{" "}
                    {(
                      (Number(selectedPart.price) || 0) *
                      (Number(watchedItems[i]?.quantity) || 0)
                    ).toLocaleString()}
                  </div>
                )}

                {/* Remove */}
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(i)}
                    className="mt-2 p-1.5 text-red-400 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
        {errors.items?.message && (
          <p className="text-xs text-red-500 mt-1">{errors.items.message}</p>
        )}
      </div>

      {/* ── Order summary ── */}
      {subtotal > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 space-y-2 text-sm">
          <div className="flex justify-between text-zinc-600">
            <span>Subtotal</span>
            <span className="tabular-nums">Rs. {subtotal.toLocaleString()}</span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between text-green-600">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Loyalty discount (10%)
              </span>
              <span className="tabular-nums">− Rs. {discount.toLocaleString()}</span>
            </div>
          ) : subtotal > 0 ? (
            <p className="text-xs text-zinc-400">
              Add Rs. {(DISCOUNT_THRESHOLD - subtotal).toLocaleString()} more to unlock 10% loyalty discount
            </p>
          ) : null}
          <div className="flex justify-between font-semibold text-zinc-900 border-t border-zinc-100 pt-2">
            <span>Total</span>
            <span className="tabular-nums">Rs. {finalAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3 pt-1">
        <Button type="submit" loading={isPending}>
          Create Invoice
        </Button>
      </div>
    </form>
  );
}
