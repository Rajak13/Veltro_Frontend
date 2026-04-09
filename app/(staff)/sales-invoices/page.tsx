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
import { useSalesInvoices } from "@/hooks/useInvoices";
import { Plus } from "lucide-react";

export default function SalesInvoicesPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useSalesInvoices(page);

  return (
    <div>
      <PageHeader
        title="Sales Invoices"
        subtitle="Create and manage customer sales"
        breadcrumb={[{ label: "Staff" }, { label: "Sales Invoices" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> New Invoice
          </Button>
        }
      />

      {/* TODO [Krish Adhikari]: Implement sales invoice table with customer name, items count,
          total, discount applied, final amount, status badge, and view detail.
          Use CreateSalesInvoiceForm inside the modal — it should support adding multiple line items,
          auto-apply 10% discount when total >= Rs. 5000. */}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            { key: "id",          header: "Invoice #",  render: (r) => <span className="font-mono font-medium text-zinc-700">#{r.id}</span> },
            { key: "customer",    header: "Customer",   render: (r) => <span className="font-medium text-zinc-800">{String((r.customer as Record<string, unknown>)?.user ? ((r.customer as Record<string, unknown>).user as Record<string, unknown>)?.name : "—")}</span> },
            { key: "totalAmount", header: "Total",      render: (r) => <span className="tabular-nums">Rs. {Number(r.totalAmount ?? 0).toLocaleString()}</span> },
            { key: "finalAmount", header: "Final",      render: (r) => <span className="tabular-nums font-medium">Rs. {Number(r.finalAmount ?? 0).toLocaleString()}</span> },
            {
              key: "status", header: "Status",
              render: (r) => <Badge label={String(r.status ?? "")} variant={statusVariant(String(r.status ?? ""))} />,
            },
            { key: "createdAt",   header: "Date",       render: (r) => <span className="text-zinc-500 tabular-nums">{new Date(String(r.createdAt)).toLocaleDateString()}</span> },
            {
              key: "actions", header: "Actions",
              render: () => <Button variant="outline" size="sm">View</Button>,
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Sales Invoice" size="xl">
        {/* TODO [Krish Adhikari]: Replace with <CreateSalesInvoiceForm onSuccess={() => setModalOpen(false)} /> */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}
