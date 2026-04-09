"use client";

// Feature 5 — Vendor Management (Admin)
// Assigned to: [Rijan Karki]
// Branch: feature/vendor-management
// API endpoints: GET/POST/PUT/DELETE /api/vendors

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { useVendors } from "@/hooks/useVendors";
import { Plus, Truck } from "lucide-react";

export default function VendorsPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useVendors(page);

  return (
    <div>
      <PageHeader
        title="Vendor Management"
        subtitle="Manage your parts suppliers"
        breadcrumb={[{ label: "Admin" }, { label: "Vendors" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Vendor
          </Button>
        }
      />

      {/* TODO [Rijan Karki]: Implement vendor list table, add/edit/delete modals.
          Use CreateVendorForm and UpdateVendorForm inside modals. */}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            {
              key: "name", header: "Vendor Name",
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                    <Truck className="w-3.5 h-3.5 text-zinc-400" />
                  </div>
                  <span className="font-medium text-zinc-800">{String(r.name ?? "")}</span>
                </div>
              ),
            },
            { key: "contactPerson", header: "Contact",  render: (r) => <span className="text-zinc-600">{String(r.contactPerson ?? "—")}</span> },
            { key: "email",         header: "Email",    render: (r) => <span className="text-zinc-500">{String(r.email ?? "—")}</span> },
            { key: "phone",         header: "Phone",    render: (r) => <span className="tabular-nums text-zinc-500">{String(r.phone ?? "—")}</span> },
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
          data={(data?.data ?? []) as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages}
          onPageChange={setPage}
          emptyMessage="No vendors found. Add your first supplier."
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Vendor">
        {/* TODO [Rijan Karki]: Replace with <CreateVendorForm onSuccess={() => setModalOpen(false)} /> */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}
