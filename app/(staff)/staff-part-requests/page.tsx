"use client";

import { useState, useMemo } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/ui/Modal";
import ListFilters from "@/components/filters/ListFilters";
import { useStaffPartRequests, useUpdatePartRequestStatus, type StaffPartRequest } from "@/hooks/usePartRequests";
import { formatPartRequestStatus } from "@/lib/status";
import { filterBySearch } from "@/lib/invoices";
import { Check, X, Clock, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

const PAGE_SIZE = 10;

type PendingAction = {
  req: StaffPartRequest;
  status: "Fulfilled" | "Rejected" | "Pending";
};

export default function StaffPartRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal state for note entry
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);
  const [staffNote, setStaffNote] = useState("");

  const { data: requests, isLoading } = useStaffPartRequests(
    statusFilter === "Sourced"
      ? "Fulfilled"
      : statusFilter === "Unavailable"
        ? "Rejected"
        : statusFilter || undefined
  );
  const updateStatus = useUpdatePartRequestStatus();

  const filtered = filterBySearch(requests ?? [], search, (r) =>
    `${r.partName} ${r.description ?? ""} ${r.customerName ?? ""} ${r.customerPhone ?? ""}`
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = useMemo(
    () => filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filtered, page]
  );

  const handleFilterChange = (fn: () => void) => { fn(); setPage(1); };

  // Open the note modal before committing a status change
  const openActionModal = (req: StaffPartRequest, status: PendingAction["status"]) => {
    setPendingAction({ req, status });
    setStaffNote("");
  };

  const confirmAction = async () => {
    if (!pendingAction) return;
    try {
      await updateStatus.mutateAsync({
        requestId: pendingAction.req.requestId,
        status: pendingAction.status,
        staffNote: staffNote.trim() || undefined,
      });
      toast.success(`Request marked as ${formatPartRequestStatus(pendingAction.status)}`);
      setPendingAction(null);
      setStaffNote("");
    } catch {
      toast.error("Failed to update request");
    }
  };

  const actionLabel = pendingAction
    ? pendingAction.status === "Fulfilled"
      ? "Mark as Sourced"
      : pendingAction.status === "Rejected"
        ? "Mark as Unavailable"
        : "Reset to Pending"
    : "";

  const actionColor = pendingAction?.status === "Fulfilled"
    ? "bg-green-500 hover:bg-green-600 text-white"
    : pendingAction?.status === "Rejected"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-zinc-700 hover:bg-zinc-800 text-white";

  return (
    <div>
      <PageHeader
        title="Part Requests"
        subtitle="Review and fulfil customer requests for unavailable parts"
        breadcrumb={[{ label: "Staff" }, { label: "Part Requests" }]}
      />

      <ListFilters
        search={search}
        onSearchChange={(v) => handleFilterChange(() => setSearch(v))}
        searchPlaceholder="Search part, customer, phone…"
        status={statusFilter}
        onStatusChange={(v) => handleFilterChange(() => setStatusFilter(v))}
        statusLabel="Status"
        statusOptions={[
          { value: "",            label: "All" },
          { value: "Pending",     label: "Pending" },
          { value: "Sourced",     label: "Sourced / Fulfilled" },
          { value: "Unavailable", label: "Unavailable" },
        ]}
        onClear={() => handleFilterChange(() => { setSearch(""); setStatusFilter(""); })}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          No part requests found.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paged.map((req) => {
              const label = formatPartRequestStatus(req.status);
              return (
                <Card key={req.requestId} padding="md">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-zinc-900">{req.partName}</h3>
                        <Badge label={label} variant={statusVariant(label)} />
                      </div>
                      {req.description && (
                        <p className="text-sm text-zinc-600 mt-2">{req.description}</p>
                      )}
                      {/* Show existing staff note if present */}
                      {req.staffNote && (
                        <div className="mt-2 flex items-start gap-1.5 text-xs text-zinc-500 bg-zinc-50 border border-zinc-100 rounded-lg px-3 py-2">
                          <MessageSquare className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0 mt-0.5" />
                          <span><span className="font-medium text-zinc-600">Staff note:</span> {req.staffNote}</span>
                        </div>
                      )}
                      <p className="text-xs text-zinc-500 mt-2">
                        {req.customerName}
                        {req.customerPhone ? ` · ${req.customerPhone}` : ""}
                        {" · "}
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {label !== "Sourced" && (
                        <Button
                          size="sm"
                          onClick={() => openActionModal(req, "Fulfilled")}
                          disabled={updateStatus.isPending}
                        >
                          <Check className="w-3.5 h-3.5" /> Mark sourced
                        </Button>
                      )}
                      {label !== "Unavailable" && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 border-red-200"
                          onClick={() => openActionModal(req, "Rejected")}
                          disabled={updateStatus.isPending}
                        >
                          <X className="w-3.5 h-3.5" /> Unavailable
                        </Button>
                      )}
                      {label !== "Pending" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openActionModal(req, "Pending")}
                          disabled={updateStatus.isPending}
                        >
                          <Clock className="w-3.5 h-3.5" /> Pending
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            totalCount={filtered.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      {/* ── Status update modal with note ── */}
      <Modal
        open={!!pendingAction}
        onClose={() => setPendingAction(null)}
        title={actionLabel}
        size="md"
      >
        {pendingAction && (
          <div className="space-y-4">
            {/* Request summary */}
            <div className="p-3 bg-zinc-50 border border-zinc-100 rounded-xl text-sm">
              <p className="font-semibold text-zinc-800">{pendingAction.req.partName}</p>
              {pendingAction.req.description && (
                <p className="text-zinc-500 text-xs mt-0.5">{pendingAction.req.description}</p>
              )}
              <p className="text-zinc-400 text-xs mt-1">
                Requested by {pendingAction.req.customerName ?? "customer"}
                {pendingAction.req.customerPhone ? ` · ${pendingAction.req.customerPhone}` : ""}
              </p>
            </div>

            {/* Note textarea */}
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Note to customer
                <span className="text-zinc-400 font-normal ml-1">(optional)</span>
              </label>
              <textarea
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                rows={3}
                placeholder={
                  pendingAction.status === "Fulfilled"
                    ? "e.g. Part is in stock, available for collection from Monday…"
                    : pendingAction.status === "Rejected"
                      ? "e.g. This part is discontinued. We can suggest an alternative…"
                      : "e.g. Still checking with suppliers, will update soon…"
                }
                className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-all focus:border-orange-400 focus:ring-2 focus:ring-orange-500/10 resize-none"
              />
              <p className="text-[11px] text-zinc-400 mt-1">
                This note will be included in the notification and email sent to the customer.
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setPendingAction(null)}
              >
                Cancel
              </Button>
              <button
                onClick={confirmAction}
                disabled={updateStatus.isPending}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${actionColor}`}
              >
                {updateStatus.isPending ? "Saving…" : actionLabel}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
