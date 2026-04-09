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
import { useMyAppointments } from "@/hooks/useAppointments";
import { Plus, Calendar } from "lucide-react";

export default function AppointmentsPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const { data: appointments, isLoading } = useMyAppointments();

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

      {/* TODO [Siddhartha Raj Thapa]: Implement appointment list with status badges,
          cancel button for pending appointments, and BookAppointmentForm in modal.
          Show date, service type, vehicle, and status for each appointment. */}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size="lg" className="text-orange-500" />
        </div>
      ) : appointments?.length ? (
        <div className="space-y-3">
          {appointments.map((appt) => (
            <Card key={appt.id} padding="md" className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-800">{appt.serviceType}</p>
                  <p className="text-xs text-zinc-400">{new Date(appt.scheduledDate).toLocaleDateString()}</p>
                </div>
              </div>
              <Badge label={appt.status} variant={statusVariant(appt.status)} />
            </Card>
          ))}
        </div>
      ) : (
        <div className="h-48 flex items-center justify-center text-zinc-400 text-sm border-2 border-dashed border-zinc-100 rounded-xl">
          No appointments yet. Book your first service.
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Book Appointment" size="lg">
        {/* TODO [Siddhartha Raj Thapa]: Replace with <BookAppointmentForm onSuccess={() => setModalOpen(false)} /> */}
        <p className="text-sm text-zinc-400">Form coming soon...</p>
      </Modal>
    </div>
  );
}
