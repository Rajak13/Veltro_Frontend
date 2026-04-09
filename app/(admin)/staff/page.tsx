"use client";

// Feature 2 — Staff Management (Admin)
// Assigned to: [Abdul Razzaq Ansari]
// Branch: feature/staff-management
// API endpoints: GET/POST/PUT/DELETE /api/admin/staff

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import { Plus, Users } from "lucide-react";
import type { Staff } from "@/types";

export default function StaffPage() {
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: Replace with useQuery hook for staff list
  const staff: Staff[] = [];
  const isLoading = false;

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle="Manage your team members"
        breadcrumb={[{ label: "Admin" }, { label: "Staff" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Staff
          </Button>
        }
      />

      {/* TODO [Abdul Razzaq Ansari]: Implement staff table with columns: Name, Email, Position, Phone, Actions
          Add edit and delete functionality with confirmation modal.
          Use CreateStaffForm inside the add modal. */}

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table<Record<string, unknown>>
          columns={[
            {
              key: "name", header: "Name",
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-zinc-100 flex items-center justify-center text-xs font-bold text-zinc-500 flex-shrink-0">
                    {String(r.name ?? "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-zinc-800">{String(r.name ?? "")}</span>
                </div>
              ),
            },
            { key: "email",    header: "Email",    render: (r) => <span className="text-zinc-500">{String(r.email ?? "—")}</span> },
            { key: "position", header: "Position", render: (r) => <span className="text-zinc-600">{String(r.position ?? "—")}</span> },
            { key: "phone",    header: "Phone",    render: (r) => <span className="tabular-nums text-zinc-500">{String(r.phone ?? "—")}</span> },
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
          data={staff as unknown as Record<string, unknown>[]}
          isLoading={isLoading}
          emptyMessage="No staff members found. Add your first team member."
        />
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        {/* TODO [Abdul Razzaq Ansari]: Replace with <CreateStaffForm onSuccess={() => setModalOpen(false)} /> */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}
