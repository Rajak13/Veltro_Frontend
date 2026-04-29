"use client";

// Feature 7 — Create Sales Invoice (Staff)
// Assigned to: [Krish Adhikari]
// Branch: feature/sales-invoices
// API endpoints: GET/POST /api/invoices/sales

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Badge, { statusVariant } from "@/components/ui/Badge";
import CreateSalesInvoiceForm from "@/components/forms/CreateSalesInvoiceForm";
import { useSalesInvoices, useSendInvoiceEmail } from "@/hooks/useInvoices";
import { Plus, Tag, Mail } from "lucide-react";
import type { SalesInvoice } from "@/types";

export default function SalesInvoicesPage() {
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SalesInvoice | null>(null);

  const { data, isLoading } = useSalesInvoices(page);

  return (
    <div>
      <PageHeader
        title="Sales Invoices"
        subtitle="Create and manage customer sales"
        breadcrumb={[{ label: "Staff" }, { label: "Sales Invoices" }]}
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="w-4 h-4" /> New Invoice
          </Button>
        }
      />

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            {
              key: "invoiceId",
              header: "Invoice #",
              render: (r) => (
                <span className="font-mono font-medium text-zinc-700">
                  #{String(r.invoiceId ?? r.id ?? "").slice(0, 8).toUpperCase()}
                </span>
              ),
            },
            {
              key: "customer",
              header: "Customer",
              render: (r) => (
                <div>
                  <p className="font-medium text-zinc-800">
                    {String(r.customerName ?? (r.customer as Record<string, unknown>)?.user
                      ? ((r.customer as Record<string, unknown>).user as Record<string, unknown>)?.name
                      : "—")}
                  </p>
                  {r.customerEmail ? (
                    <p className="text-xs text-zinc-400">{String(r.customerEmail)}</p>
                  ) : null}
                </div>
              ),
            },
            {
              key: "items",
              header: "Items",
              render: (r) => (
                <span className="tabular-nums text-zinc-500">
                  {Array.isArray(r.items) ? r.items.length : "—"} item
                  {Array.isArray(r.items) && r.items.length !== 1 ? "s" : ""}
                </span>
              ),
            },
            {
              key: "totalAmount",
              header: "Total",
              render: (r) => (
                <span className="tabular-nums text-zinc-600">
                  Rs. {Number(r.totalAmount ?? 0).toLocaleString()}
                </span>
              ),
            },
            {
              key: "discountApplied",
              header: "Discount",
              render: (r) => {
                const disc = Number(r.discountApplied ?? 0);
                return disc > 0 ? (
                  <span className="inline-flex items-center gap-1 text-green-600 tabular-nums text-xs font-medium">
                    <Tag className="w-3 h-3" />
                    Rs. {disc.toLocaleString()}
                  </span>
                ) : (
                  <span className="text-zinc-300">—</span>
                );
              },
            },
            {
              key: "finalAmount",
              header: "Final",
              render: (r) => (
                <span className="tabular-nums font-semibold text-zinc-900">
                  Rs. {Number(r.finalAmount ?? r.totalAmount ?? 0).toLocaleString()}
                </span>
              ),
            },
            {
              key: "isPaid",
              header: "Status",
              render: (r) => {
                const paid = Boolean(r.isPaid);
                return (
                  <Badge
                    label={paid ? "Paid" : "Unpaid"}
                    variant={paid ? "success" : "warning"}
                  />
                );
              },
            },
            {
              key: "saleDate",
              header: "Date",
              render: (r) => (
                <span className="text-zinc-500 tabular-nums text-xs">
                  {new Date(String(r.saleDate ?? r.createdAt ?? "")).toLocaleDateString()}
                </span>
              ),
            },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedInvoice(r as unknown as SalesInvoice)}
                >
                  View
                </Button>
              ),
            },
          ]}
          data={(data?.data ?? []) as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages}
          onPageChange={setPage}
          emptyMessage="No sales invoices found."
        />
      </div>

      {/* ── Create invoice modal ── */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="New Sales Invoice"
        size="xl"
      >
        <CreateSalesInvoiceForm onSuccess={() => setCreateOpen(false)} />
      </Modal>

      {/* ── View invoice detail modal ── */}
      <Modal
        open={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        title={`Invoice #${String((selectedInvoice as unknown as Record<string, unknown>)?.invoiceId ?? "").slice(0, 8).toUpperCase()}`}
        size="lg"
      >
        {selectedInvoice && (
          <InvoiceDetail
            invoice={selectedInvoice as unknown as Record<string, unknown>}
            onClose={() => setSelectedInvoice(null)}
          />
        )}
      </Modal>
    </div>
  );
}

// ─── Invoice detail panel ─────────────────────────────────────────────────────
function InvoiceDetail({
  invoice,
  onClose,
}: {
  invoice: Record<string, unknown>;
  onClose: () => void;
}) {
  const { mutate: sendEmail, isPending: isSending } = useSendInvoiceEmail();

  const items = Array.isArray(invoice.items) ? (invoice.items as Record<string, unknown>[]) : [];
  const totalAmount = Number(invoice.totalAmount ?? 0);
  const discount = Number(invoice.discountApplied ?? 0);
  const finalAmount = Number(invoice.finalAmount ?? totalAmount);
  const isPaid = Boolean(invoice.isPaid);
  const invoiceId = String(invoice.invoiceId ?? "");

  return (
    <div className="space-y-5 text-sm">
      {/* Meta */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Customer</p>
          <p className="font-medium text-zinc-800">{String(invoice.customerName ?? "—")}</p>
          <p className="text-zinc-500 text-xs">{String(invoice.customerEmail ?? "")}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Staff</p>
          <p className="font-medium text-zinc-800">{String(invoice.staffName ?? "—")}</p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Sale Date</p>
          <p className="text-zinc-700">
            {new Date(String(invoice.saleDate ?? invoice.createdAt ?? "")).toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-xs text-zinc-400 mb-0.5">Payment</p>
          <Badge label={isPaid ? "Paid" : "Unpaid"} variant={isPaid ? "success" : "warning"} />
          {isPaid && invoice.paidAt ? (
            <p className="text-xs text-zinc-400 mt-0.5">
              {new Date(String(invoice.paidAt)).toLocaleDateString()}
            </p>
          ) : null}
        </div>
      </div>

      {/* Line items */}
      {items.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
            Items
          </p>
          <div className="rounded-xl border border-zinc-100 overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-zinc-50 border-b border-zinc-100">
                  <th className="px-3 py-2 text-left font-semibold text-zinc-500">Part</th>
                  <th className="px-3 py-2 text-right font-semibold text-zinc-500">Qty</th>
                  <th className="px-3 py-2 text-right font-semibold text-zinc-500">Unit Price</th>
                  <th className="px-3 py-2 text-right font-semibold text-zinc-500">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={i} className="border-b border-zinc-50 last:border-0">
                    <td className="px-3 py-2 text-zinc-700">
                      {String(item.partName ?? item.partId ?? "—")}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-zinc-600">
                      {Number(item.quantity)}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums text-zinc-600">
                      Rs. {Number(item.unitPrice ?? 0).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums font-medium text-zinc-800">
                      Rs.{" "}
                      {Number(
                        item.lineTotal ?? Number(item.quantity) * Number(item.unitPrice ?? 0)
                      ).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Totals */}
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

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-1 border-t border-zinc-100">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
        <Button
          size="sm"
          loading={isSending}
          onClick={() => sendEmail(invoiceId)}
          disabled={!invoiceId}
        >
          <Mail className="w-3.5 h-3.5" />
          Send Invoice Email
        </Button>
      </div>
    </div>
  );
}
