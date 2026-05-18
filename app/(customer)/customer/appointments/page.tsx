"use client";

// Feature — Book Appointments (Customer)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/book-appointments
// API endpoints: GET /api/appointments, POST /api/appointments, PUT /api/appointments/:id

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { appointmentStatusEquals, formatAppointmentStatus } from "@/lib/status";
import { useMyAppointments, useCancelAppointment } from "@/hooks/useAppointments";
import { useMyProfile } from "@/hooks/useCustomers";
import BookAppointmentForm from "@/components/forms/BookAppointmentForm";
import { Plus, Car, X, CalendarDays } from "lucide-react";
import toast from "react-hot-toast";
import type { Appointment } from "@/types";

type RichAppointment = Appointment & { serviceType?: string; vehicleLabel?: string };

export default function AppointmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: appointments, isLoading } = useMyAppointments();
  const { data: profile } = useMyProfile();
  const { mutateAsync: cancelAppointment, isPending: isCancelling } = useCancelAppointment();

  // Build a vehicleId → label map from the customer's profile vehicles
  const vehicleMap = Object.fromEntries(
    (profile?.vehicles ?? []).map((v) => {
      const id = String(v.vehicleId ?? "");
      const label = `${v.year ?? ""} ${v.make ?? ""} ${v.model ?? ""}`.trim();
      return [id, label];
    })
  );

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled");
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

  const canCancel = (appt: RichAppointment) =>
    appointmentStatusEquals(appt.status, "Pending") ||
    appointmentStatusEquals(appt.status, "Confirmed");

  return (
    <div>
      <PageHeader
        title="My Appointments"
        subtitle="Book and manage your service appointments"
        breadcrumb={[{ label: "Customer" }, { label: "Appointments" }]}
        action={
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Book Appointment
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : appointments?.length ? (
        <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Date &amp; Time
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Vehicle
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Service Type
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {(appointments as RichAppointment[]).map((appt, idx) => {
                  const id = appt.appointmentId || appt.id?.toString() || String(idx);
                  const date = new Date(appt.scheduledDate);
                  const vehicleLabel =
                    appt.vehicleLabel ||
                    vehicleMap[appt.vehicleId] ||
                    appt.vehicleId ||
                    "—";
                  const serviceType = appt.serviceType || appt.notes || "Service";

                  return (
                    <tr
                      key={id}
                      className="border-b border-zinc-50 hover:bg-zinc-50/60 transition-colors last:border-b-0"
                    >
                      {/* Date & Time */}
                      <td className="px-5 py-3.5">
                        <div className="text-[13px] font-semibold text-zinc-800">
                          {date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          {date.toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </td>

                      {/* Vehicle */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-md bg-zinc-100 flex items-center justify-center flex-shrink-0">
                            <Car className="w-3.5 h-3.5 text-zinc-400" />
                          </div>
                          <span className="text-[13px] text-zinc-700 font-medium">
                            {vehicleLabel}
                          </span>
                        </div>
                      </td>

                      {/* Service Type */}
                      <td className="px-5 py-3.5">
                        <span className="text-[13px] text-zinc-600">{serviceType}</span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <Badge
                          label={formatAppointmentStatus(appt.status)}
                          variant={statusVariant(appt.status)}
                        />
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        {canCancel(appt) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancel(id)}
                            loading={isCancelling}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 text-[11px]"
                          >
                            <X className="w-3 h-3" /> Cancel
                          </Button>
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
      ) : (
        <div className="h-48 flex flex-col items-center justify-center gap-3 text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          <CalendarDays className="w-10 h-10 text-zinc-200" />
          <p>No appointments yet.</p>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <Plus className="w-3.5 h-3.5" /> Book Your First Appointment
          </Button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Book Appointment" size="lg">
        <BookAppointmentForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
