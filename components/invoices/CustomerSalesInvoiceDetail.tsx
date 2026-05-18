"use client";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { Tag } from "lucide-react";

import type { CustomerInvoiceDetail } from "@/lib/invoices";

export type { CustomerInvoiceDetail };

interface Props {
  invoice: CustomerInvoiceDetail | null | undefined;
  isLoading?: boolean;
  error?: string;
  onClose: () => void;
}

export default function CustomerSalesInvoiceDetail({ invoice, isLoading, error, onClose }: Props) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner className="text-orange-500" />
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="py-8 text-center space-y-3">
        <p className="text-sm text-red-600">{error ?? "Invoice not found."}</p>
        <p className="text-xs text-zinc-500">
          Restart the backend if you recently updated the app, then try again.
        </p>
      </div>
    );
  }

  const items = invoice.items ?? [];
  const totalAmount = Number(invoice.totalAmount ?? 0);
  const discount = Number(invoice.discountApplied ?? 0);
  const finalAmount = totalAmount - discount;
  const isPaid = Boolean(invoice.isPaid);
  const saleDate = invoice.saleDate ?? invoice.createdAt ?? "";

  return (
    <div className="space-y-5 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Served by</p>
          <p className="font-medium text-zinc-800">{invoice.staffName ?? "Veltro staff"}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Sale date</p>
          <p className="text-zinc-700">
            {saleDate ? new Date(saleDate).toLocaleString() : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Payment</p>
          <Badge label={isPaid ? "Paid" : "Unpaid"} variant={isPaid ? "success" : "warning"} />
        </div>
      </div>

      {items.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">Items</p>
          <div className="rounded-xl border border-zinc-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-3 py-2 text-left font-semibold text-zinc-500">Part</th>
                  <th className="px-3 py-2 text-right font-semibold text-zinc-500">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold text-zinc-500">Unit price</th>
                  <th className="px-3 py-2 text-right font-semibold text-zinc-500">Line total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-zinc-50 last:border-0">
                    <td className="px-3 py-2 text-zinc-700">{item.partName ?? "Part"}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-zinc-600">{item.quantity ?? 0}</td>
                    <td className="px-3 py-2 text-right tabular-nums text-zinc-600">
                      Rs. {Number(item.unitPrice ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium text-zinc-800">
                      Rs.{" "}
                      {Number(
                        item.lineTotal ?? (item.quantity ?? 0) * (item.unitPrice ?? 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-2">
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal</span>
          <span className="tabular-nums">Rs. {totalAmount.toLocaleString()}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Loyalty discount (10%)
            </span>
            <span className="tabular-nums">− Rs. {discount.toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between font-semibold text-zinc-900 border-t border-zinc-200 pt-2">
          <span>Total</span>
          <span className="tabular-nums">Rs. {finalAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex justify-end pt-1 border-t border-zinc-100">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
}
