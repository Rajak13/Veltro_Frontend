"use client";

// Feature — Staff Appointment Management
// Staff can view all appointments and update their status (Confirm, Complete, Cancel)

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import Button from "@/components/ui/Button";
import ListFilters from "@/components/filters/ListFilters";
import { useStaffAppointments, useUpdateAppointmentStatus } from "@/hooks/useAppointments";
import { filterBySearch } from "@/lib/invoices";
import { formatAppointmentStatus } from "@/lib/status";
import { Car, User, Check, X, Clock, CalendarCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function StaffAppointmentsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const { data: appointments, isLoading } = useStaffAppointments(statusFilter || undefined);
  const updateStatus = useUpdateAppointmentStatus();

  const filtered = filterBySearch(appointments ?? [], search, (a) =>
    `${a.customerName} ${a.customerPhone ?? ""} ${a.vehicle} ${a.vehicleReg ?? ""} ${a.serviceType ?? ""} ${a.notes ?? ""}`
  );

  const setApptStatus = async (appointmentId: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ appointmentId, status });
      toast.success(`Appointment marked as ${formatAppointmentStatus(status)}`);
    } catch {
      toast.error("Failed to update appointment");
    }
  };

  const pending   = (appointments ?? []).filter(a => a.status === "Pending").length;
  const confirmed = (appointments ?? []).filter(a => a.status === "Confirmed").length;

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="View and manage all customer service appointments"
        breadcrumb={[{ label: "Staff" }, { label: "Appointments" }]}
      />

      {/* Summary chips */}
      <div className="flex gap-2 flex-wrap mb-4">
        {[
          { label: "Pending",   count: pending,   color: "bg-amber-50 border-amber-200 text-amber-700" },
          { label: "Confirmed", count: confirmed,  color: "bg-green-50 border-green-200 text-green-700" },
        ].map(({ label, count, color }) => (
          <button
            key={label}
            onClick={() => setStatusFilter(statusFilter === label ? "" : label)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium border transition-all ${
              statusFilter === label ? color : "bg-white border-zinc-200 text-zinc-500 hover:border-zinc-300"
            }`}
          >
            {label}
            <span className={`min-w-[1.2rem] h-[1.2rem] px-1 rounded-full text-[10px] font-bold flex items-center justify-center ${
              statusFilter === label ? "bg-white/60" : "bg-zinc-100"
            }`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      <ListFilters
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search customer, vehicle, service type…"
        status={statusFilter}
        onStatusChange={setStatusFilter}
        statusLabel="Status"
        statusOptions={[
          { value: "",           label: "All" },
          { value: "Pending",    label: "Pending" },
          { value: "Confirmed",  label: "Confirmed" },
          { value: "Completed",  label: "Completed" },
          { value: "Cancelled",  label: "Cancelled" },
        ]}
        onClear={() => { setSearch(""); setStatusFilter(""); }}
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          <CalendarCheck className="w-10 h-10 text-zinc-200" />
          <p>No appointments found.</p>
        </div>
      ) : (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-100">
                  {["Date & Time", "Customer", "Vehicle", "Service Type", "Notes", "Status", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((appt) => {
                  const date = new Date(appt.scheduledDate);
                  const statusLabel = formatAppointmentStatus(appt.status);
                  const isPending   = appt.status === "Pending";
                  const isConfirmed = appt.status === "Confirmed";
                  const isActive    = isPending || isConfirmed;

                  return (
                    <tr key={appt.appointmentId} className="border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors last:border-b-0">
                      {/* Date & Time */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <div className="text-[13px] font-semibold text-zinc-800">
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                        </div>
                      </td>

                      {/* Customer */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            <User className="w-3.5 h-3.5 text-zinc-400" />
                          </div>
                          <div>
                            <div className="text-[13px] font-medium text-zinc-800">{appt.customerName}</div>
                            {appt.customerPhone && (
                              <div className="text-[11px] text-zinc-400">{appt.customerPhone}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <Car className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
                          <div>
                            <div className="text-[13px] text-zinc-700">{appt.vehicle}</div>
                            {appt.vehicleReg && (
                              <div className="text-[11px] text-zinc-400">{appt.vehicleReg}</div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Service Type */}
                      <td className="px-4 py-3.5">
                        <span className="text-[13px] text-zinc-600">{appt.serviceType || "—"}</span>
                      </td>

                      {/* Notes */}
                      <td className="px-4 py-3.5 max-w-[180px]">
                        <span className="text-[12px] text-zinc-500 line-clamp-2">{appt.notes || "—"}</span>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge label={statusLabel} variant={statusVariant(statusLabel)} />
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {isActive ? (
                          <div className="flex items-center gap-1.5">
                            {isPending && (
                              <Button
                                size="sm"
                                onClick={() => setApptStatus(appt.appointmentId, "Confirmed")}
                                disabled={updateStatus.isPending}
                                className="text-[11px]"
                              >
                                <Check className="w-3 h-3" /> Confirm
                              </Button>
                            )}
                            {isConfirmed && (
                              <Button
                                size="sm"
                                onClick={() => setApptStatus(appt.appointmentId, "Completed")}
                                disabled={updateStatus.isPending}
                                className="text-[11px]"
                              >
                                <CalendarCheck className="w-3 h-3" /> Complete
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setApptStatus(appt.appointmentId, "Cancelled")}
                              disabled={updateStatus.isPending}
                              className="text-red-600 border-red-200 hover:bg-red-50 text-[11px]"
                            >
                              <X className="w-3 h-3" /> Cancel
                            </Button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-zinc-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
