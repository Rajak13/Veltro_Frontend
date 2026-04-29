"use client";

// Feature 3 — Parts Management (Admin)
// Assigned to: [Rijan Karki]
// Branch: feature/parts-management
// API endpoints: GET/POST/PUT/DELETE /api/parts

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import { useParts } from "@/hooks/useParts";
import { Plus, Package, AlertTriangle } from "lucide-react";

export default function PartsPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useParts(page);

  const lowStockCount = Array.isArray(data?.data) ? data.data.filter((p) => (p.stockQuantity ?? 0) < 10).length : 0;

  return (
    <div>
      <PageHeader
        title="Parts Management"
        subtitle="Manage inventory and stock levels"
        breadcrumb={[{ label: "Admin" }, { label: "Parts" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Part
          </Button>
        }
      />

      {/* Low stock banner */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-2.5 px-4 py-3 mb-4 rounded-xl bg-orange-50 border border-orange-200">
          <AlertTriangle className="w-4 h-4 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-700">
            <span className="font-semibold">{lowStockCount} part{lowStockCount > 1 ? "s" : ""}</span> below 10 units — consider restocking soon.
          </p>
        </div>
      )}

      {/* TODO [Rijan Karki]: Implement full parts table with search/filter by vendor,
          stock level indicators (low stock warning), edit/delete modals.
          Use CreatePartForm and UpdatePartForm inside modals. */}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            {
              key: "name", header: "Part Name",
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Package className="w-3.5 h-3.5 text-orange-500" />
                  </div>
                  <span className="font-medium text-zinc-800">{String(r.name ?? "")}</span>
                </div>
              ),
            },
            { key: "sku", header: "SKU", render: (r) => <span className="font-mono text-xs text-zinc-500">{String(r.sku ?? "—")}</span> },
            { key: "price", header: "Price", render: (r) => <span className="tabular-nums font-medium">Rs. {Number(r.price ?? 0).toLocaleString()}</span> },
            {
              key: "stockQuantity", header: "Stock",
              render: (r) => (
                <Badge
                  label={`${r.stockQuantity} units`}
                  variant={Number(r.stockQuantity) < 10 ? "danger" : Number(r.stockQuantity) < 30 ? "warning" : "success"}
                />
              ),
            },
            {
              key: "actions", header: "Actions",
              render: () => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="danger" size="sm">Delete</Button>
                </div>
              ),
            },
          ]}
          data={(Array.isArray(data?.data) ? data.data : []) as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages}
          onPageChange={setPage}
          emptyMessage="No parts found. Add your first part."
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Part">
        {/* TODO [Rijan Karki]: Replace with <CreatePartForm onSuccess={() => setModalOpen(false)} /> */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}
