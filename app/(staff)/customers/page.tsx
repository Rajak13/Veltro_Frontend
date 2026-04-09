"use client";

// Feature 6 — Register Customer (Staff)
// Assigned to: [Punya Kumari Tamang]
// Branch: feature/register-customer
// API endpoints: GET/POST /api/customers

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { useCustomers } from "@/hooks/useCustomers";
import { Plus, Eye, Users } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function CustomersPage() {
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const { data, isLoading } = useCustomers(page);

  return (
    <div>
      <PageHeader
        title="Customers"
        subtitle="Register and manage customers"
        breadcrumb={[{ label: "Staff" }, { label: "Customers" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Register Customer
          </Button>
        }
      />

      {/* TODO [Punya Kumari Tamang]: Implement customer list table with search by name/phone,
          view detail link, and register customer modal.
          Use CreateCustomerForm inside the modal. */}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            {
              key: "name", header: "Name",
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                    {String((r.user as Record<string, unknown>)?.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-zinc-800">{String((r.user as Record<string, unknown>)?.name ?? "")}</span>
                </div>
              ),
            },
            { key: "email",   header: "Email",   render: (r) => <span className="text-zinc-500">{String((r.user as Record<string, unknown>)?.email ?? "")}</span> },
            { key: "phone",   header: "Phone",   render: (r) => <span className="tabular-nums text-zinc-500">{String(r.phone ?? "")}</span> },
            {
              key: "loyalty", header: "Loyalty",
              render: (r) => (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-orange-50 text-orange-600 border border-orange-100">
                  {r.loyaltyPoints ?? 0} pts
                </span>
              ),
            },
            {
              key: "actions", header: "Actions",
              render: (r) => (
                <Link href={ROUTES.STAFF_CUSTOMER_DETAIL(Number(r.id))}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                </Link>
              ),
            },
          ]}
          data={(data?.data ?? []) as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages}
          onPageChange={setPage}
          emptyMessage="No customers found."
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Register Customer" size="lg">
        {/* TODO [Punya Kumari Tamang]: Replace with <CreateCustomerForm onSuccess={() => setModalOpen(false)} /> */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}
