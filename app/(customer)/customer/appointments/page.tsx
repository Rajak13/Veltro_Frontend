"use client";

// Feature 13 — Book Appointments (Customer)
// Assigned to: [Siddhartha Raj Thapa]
// Branch: feature/book-appointments
// API endpoints: GET /api/appointments/my, POST /api/appointments

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Badge, { statusVariant } from "@/components/ui/Badge";
import Spinner from "@/components/ui/Spinner";
import { useMyAppointments, useCancelAppointment } from "@/hooks/useAppointments";
import BookAppointmentForm from "@/components/forms/BookAppointmentForm";
import { Plus, Calendar, X, Clock } from "lucide-react";
import toast from "react-hot-toast";

export default function AppointmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: appointments, isLoading } = useMyAppointments();
  const { mutateAsync: cancelAppointment, isPending: isCancelling } = useCancelAppointment();

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    
    try {
      await cancelAppointment(id);
      toast.success("Appointment cancelled successfully");
    } catch {
      toast.error("Failed to cancel appointment");
    }
  };

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
        <div className="space-y-3">
          {appointments.map((appt) => {
            const id = appt.appointmentId || appt.id?.toString() || "";
            return (
            <Card key={id} padding="md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-zinc-800">Service Appointment</p>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-xs text-zinc-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(appt.scheduledDate).toLocaleDateString("en-US", { 
                          weekday: "short", 
                          year: "numeric", 
                          month: "short", 
                          day: "numeric" 
                        })}
                      </p>
                      {appt.notes && (
                        <p className="text-xs text-zinc-400">• {appt.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge label={appt.status} variant={statusVariant(appt.status)} />
                  {(appt.status === "Pending" || appt.status === "Confirmed") && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCancel(id)}
                      loading={isCancelling}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                    >
                      <X className="w-3.5 h-3.5" /> Cancel
                    </Button>
                  )}
                </div>
              </div>
            </Card>
            );
          })}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          No appointments yet. Book your first service.
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Book Appointment" size="lg">
        <BookAppointmentForm onSuccess={() => setModalOpen(false)} />
      </Modal>
    </div>
  );
}
