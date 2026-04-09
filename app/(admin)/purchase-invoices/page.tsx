"use client";

// Feature 4 — Purchase Invoices (Admin)
// Assigned to: [Rijan Karki]
// Branch: feature/purchase-invoices
// API endpoints: GET/POST /api/invoices/purchase

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Badge, { statusVariant } from "@/components/ui/Badge";
import { usePurchaseInvoices } from "@/hooks/useInvoices";
import { Plus } from "lucide-react";

export default function PurchaseInvoicesPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = usePurchaseInvoices(page);

  return (
    <div>
      <PageHeader
        title="Purchase Invoices"
        subtitle="Track stock purchases from vendors"
        breadcrumb={[{ label: "Admin" }, { label: "Purchase Invoices" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> New Invoice
          </Button>
        }
      />

      {/* TODO [Rijan Karki]: Implement purchase invoice table with vendor name, items summary,
          total amount, status badge, and view detail modal.
          Use CreatePurchaseInvoiceForm inside the add modal. */}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            { key: "id",          header: "Invoice #",  render: (r) => <span className="font-mono font-medium text-zinc-700">#{r.id}</span> },
            { key: "vendor",      header: "Vendor",     render: (r) => <span className="font-medium text-zinc-800">{String((r.vendor as Record<string, unknown>)?.name ?? "—")}</span> },
            { key: "totalAmount", header: "Total",      render: (r) => <span className="tabular-nums font-medium">Rs. {Number(r.totalAmount ?? 0).toLocaleString()}</span> },
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
          emptyMessage="No purchase invoices found."
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="New Purchase Invoice" size="xl">
        {/* TODO [Rijan Karki]: Replace with <CreatePurchaseInvoiceForm onSuccess={() => setModalOpen(false)} /> */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}
