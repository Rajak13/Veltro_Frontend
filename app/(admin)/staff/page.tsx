"use client";

// Feature 2 — Staff Management (Admin)
// Assigned to: Abdul Razzaq Ansari
// Branch: feature/staff-management
// API endpoints: GET/POST/PUT/DELETE /api/admin/staff

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Table from "@/components/ui/Table";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import CreateStaffForm from "@/components/forms/CreateStaffForm";
import { useStaff, useDeactivateStaff, type StaffMember } from "@/hooks/useStaff";
import { Plus, UserCheck, UserX, AlertCircle } from "lucide-react";

export default function StaffPage() {
  const [modalOpen, setModalOpen]           = useState(false);
  const [confirmId, setConfirmId]           = useState<string | null>(null);
  const [confirmName, setConfirmName]       = useState("");

  const { data: staff = [], isLoading }     = useStaff();
  const { mutateAsync: deactivate, isPending: deactivating } = useDeactivateStaff();

  async function handleDeactivate() {
    if (!confirmId) return;
    await deactivate(confirmId);
    setConfirmId(null);
  }

  return (
    <div>
      <PageHeader
        title="Staff Management"
        subtitle="Manage your team members and their access"
        breadcrumb={[{ label: "Admin" }, { label: "Staff" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Add Staff
          </Button>
        }
      />

      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <Table<StaffMember>
          columns={[
            {
              key: "fullName",
              header: "Name",
              render: (r) => (
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-xs font-bold text-orange-600 flex-shrink-0">
                    {r.fullName?.charAt(0).toUpperCase() ?? "?"}
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-zinc-800">{r.fullName}</p>
                    <p className="text-[11px] text-zinc-400">{r.email}</p>
                  </div>
                </div>
              ),
            },
            {
              key: "position",
              header: "Position",
              render: (r) => (
                <span className="text-[13px] text-zinc-600">{r.position ?? "—"}</span>
              ),
            },
            {
              key: "isActive",
              header: "Status",
              render: (r) => (
                <Badge
                  label={r.isActive ? "Active" : "Inactive"}
                  variant={r.isActive ? "success" : "danger"}
                />
              ),
            },
            {
              key: "createdAt",
              header: "Joined",
              render: (r) => (
                <span className="text-[12px] text-zinc-400 tabular-nums">
                  {new Date(r.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              ),
            },
            {
              key: "id",
              header: "Actions",
              render: (r) => (
                <div className="flex gap-2">
                  {r.isActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { setConfirmId(r.id); setConfirmName(r.fullName); }}
                    >
                      <UserX className="w-3.5 h-3.5" /> Deactivate
                    </Button>
                  ) : (
                    <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                      <UserCheck className="w-3.5 h-3.5" /> Deactivated
                    </span>
                  )}
                </div>
              ),
            },
          ]}
          data={staff}
          isLoading={isLoading}
          emptyMessage="No staff members yet. Add your first team member."
        />
      </div>

      {/* Add Staff Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Add Staff Member">
        <CreateStaffForm onSuccess={() => setModalOpen(false)} />
      </Modal>

      {/* Deactivate Confirmation Modal */}
      <Modal open={!!confirmId} onClose={() => setConfirmId(null)} title="Deactivate Staff Member">
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
            <AlertCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-orange-700">
              <span className="font-semibold">{confirmName}</span> will no longer be able to log in.
              This action can be reversed by contacting a developer.
            </p>
          </div>
          <div className="flex justify-end gap-2.5">
            <Button variant="outline" onClick={() => setConfirmId(null)}>Cancel</Button>
            <Button variant="danger" loading={deactivating} onClick={handleDeactivate}>
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
