"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import ListFilters from "@/components/filters/ListFilters";
import {
  useStaffPartRequests,
  useUpdatePartRequestStatus,
} from "@/hooks/usePartRequests";
import { formatPartRequestStatus } from "@/lib/status";
import { filterBySearch } from "@/lib/invoices";
import { Check, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function StaffPartRequestsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
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

  const setStatus = async (requestId: string, status: "Pending" | "Fulfilled" | "Rejected") => {
    try {
      await updateStatus.mutateAsync({ requestId, status });
      toast.success(`Request marked as ${formatPartRequestStatus(status)}`);
    } catch {
      toast.error("Failed to update request");
    }
  };

  return (
    <div>
      <PageHeader
        title="Part Requests"
        subtitle="Review and fulfil customer requests for unavailable parts"
        breadcrumb={[{ label: "Staff" }, { label: "Part Requests" }]}
      />

      <ListFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search part, customer, phone…"
        status={statusFilter}
        onStatusChange={setStatusFilter}
        statusLabel="Status"
        statusOptions={[
          { value: "", label: "All" },
          { value: "Pending", label: "Pending" },
          { value: "Sourced", label: "Sourced / Fulfilled" },
          { value: "Unavailable", label: "Unavailable" },
        ]}
        onClear={() => {
          setSearch("");
          setStatusFilter("");
        }}
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
        <div className="space-y-3">
          {filtered.map((req) => {
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
                        onClick={() => setStatus(req.requestId, "Fulfilled")}
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
                        onClick={() => setStatus(req.requestId, "Rejected")}
                        disabled={updateStatus.isPending}
                      >
                        <X className="w-3.5 h-3.5" /> Unavailable
                      </Button>
                    )}
                    {label !== "Pending" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setStatus(req.requestId, "Pending")}
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
      )}
    </div>
  );
}
