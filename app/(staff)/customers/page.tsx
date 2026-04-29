"use client";

// Feature 6 — Register Customer (Staff)
// Assigned to: [Punya Kumari Tamang]
// Branch: feature/customer-registration
// API endpoints: GET /api/staff/customers, POST /api/staff/customers

import { useState, useEffect, useRef } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import CreateCustomerForm from "@/components/forms/CreateCustomerForm";
import { useCustomers } from "@/hooks/useCustomers";
import { Plus, Eye, Search } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/constants/routes";

export default function CustomersPage() {
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 400ms debounce so we don't fire on every keystroke
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 400);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [search]);

  const { data, isLoading } = useCustomers(page, 10, debouncedSearch || undefined);

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

      {/* Search bar */}
      <div className="mb-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or phone..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-zinc-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-300 transition"
          />
        </div>
      </div>

      {/* Customer table */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table
          columns={[
            {
              key: "name",
              header: "Name",
              render: (r) => {
                const name = String((r as { fullName?: string }).fullName ?? "");
                return (
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                      {name.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="font-medium text-zinc-800">{name}</span>
                  </div>
                );
              },
            },
            {
              key: "email",
              header: "Email",
              render: (r) => (
                <span className="text-zinc-500">
                  {String((r as { email?: string }).email ?? "")}
                </span>
              ),
            },
            {
              key: "phone",
              header: "Phone",
              render: (r) => (
                <span className="tabular-nums text-zinc-500">
                  {String((r as { phone?: string }).phone ?? "—")}
                </span>
              ),
            },
            {
              key: "vehicles",
              header: "Vehicles",
              render: (r) => {
                const vehicles = (r as { vehicles?: unknown[] }).vehicles ?? [];
                return (
                  <span className="text-zinc-500 text-sm">
                    {vehicles.length > 0 ? `${vehicles.length} registered` : "None"}
                  </span>
                );
              },
            },
            {
              key: "actions",
              header: "Actions",
              render: (r) => (
                <Link href={ROUTES.STAFF_CUSTOMER_DETAIL(String((r as { customerId?: string }).customerId ?? ""))}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                </Link>
              ),
            },
          ]}
          data={(data?.items ?? []) as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages}
          onPageChange={setPage}
          emptyMessage={debouncedSearch ? `No customers found for "${debouncedSearch}".` : "No customers found."}
        />
      </div>

      {/* Register Customer Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Customer"
        size="lg"
      >
        <CreateCustomerForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
