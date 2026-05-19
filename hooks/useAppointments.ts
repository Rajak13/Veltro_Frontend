import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type { Appointment, ApiResponse } from "@/types";
import { formatAppointmentStatus } from "@/lib/status";

// ─── Time slot constants ──────────────────────────────────────────────────────
export const SLOT_START = 8;  // 08:00
export const SLOT_END   = 17; // last slot starts at 17:00, ends 18:00
export const ALL_SLOTS  = Array.from({ length: SLOT_END - SLOT_START + 1 }, (_, i) => SLOT_START + i);
// → [8, 9, 10, 11, 12, 13, 14, 15, 16, 17]

function mapAppointment(raw: Record<string, unknown>): Appointment & { serviceType?: string; vehicleLabel?: string } {
  // Try to build a vehicle label from nested vehicle object if present
  const v = (raw.vehicle ?? raw.Vehicle) as Record<string, unknown> | undefined;
  const vehicleLabel = v
    ? `${v.year ?? v.Year ?? ""} ${v.make ?? v.Make ?? ""} ${v.model ?? v.Model ?? ""}`.trim()
    : undefined;

  return {
    appointmentId: String(raw.appointmentId ?? raw.AppointmentId ?? ""),
    id: raw.id as number | undefined,
    vehicleId: String(raw.vehicleId ?? raw.VehicleId ?? ""),
    scheduledDate: String(raw.scheduledDate ?? raw.ScheduledDate ?? ""),
    status: formatAppointmentStatus(raw.status ?? raw.Status) as Appointment["status"],
    notes: (raw.notes ?? raw.Notes) as string | undefined,
    createdAt: (raw.createdAt ?? raw.CreatedAt) as string | undefined,
    serviceType: String(raw.serviceType ?? raw.ServiceType ?? raw.notes ?? raw.Notes ?? "Service"),
    vehicleLabel,
  };
}

export const useAppointments = () =>
  useQuery({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Appointment[]>>("/appointments");
      return (res.data.data ?? []).map((a) => mapAppointment(a as Record<string, unknown>));
    },
  });

export const useMyAppointments = () =>
  useQuery({
    queryKey: ["appointments", "mine"],
    queryFn: async () => {
      const res = await api.get<ApiResponse<Appointment[]>>("/appointments");
      return (res.data.data ?? []).map((a) => mapAppointment(a as Record<string, unknown>));
    },
    refetchInterval: 10_000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

export const useCreateAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Appointment>) =>
      api.post<ApiResponse<Appointment>>("/appointments", data).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

export const useCancelAppointment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      api.put<ApiResponse<Appointment>>(`/appointments/${id}`).then((r) => r.data.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["appointments"] }),
  });
};

export interface SlotAvailability {
  isSunday: boolean;
  /** hour (8–17) → number of bookings already made (max 5) */
  slotCounts: Record<number, number>;
}

/// <summary>Returns slot availability for a given date string (YYYY-MM-DD).</summary>
export const useBookedSlots = (date: string | null) =>
  useQuery({
    queryKey: ["appointments", "slots", date],
    queryFn: async () => {
      const res = await api.get<ApiResponse<SlotAvailability>>("/appointments/slots", {
        params: { date },
      });
      const raw = res.data.data as { isSunday: boolean; slotCounts: Record<string, number> };
      // Normalise keys to numbers
      const slotCounts: Record<number, number> = {};
      for (const [k, v] of Object.entries(raw.slotCounts ?? {})) {
        slotCounts[Number(k)] = v;
      }
      return { isSunday: raw.isSunday ?? false, slotCounts } as SlotAvailability;
    },
    enabled: !!date,
    staleTime: 30_000,
  });

// ─── Staff appointment types & hooks ─────────────────────────────────────────

export interface StaffAppointment {
  appointmentId: string;
  scheduledDate: string;
  serviceType?: string;
  notes?: string;
  status: string;
  customerName: string;
  customerPhone?: string;
  customerEmail?: string;
  vehicle: string;
  vehicleReg?: string;
}

export const useStaffAppointments = (statusFilter?: string) =>
  useQuery({
    queryKey: ["appointments", "staff", statusFilter],
    queryFn: async () => {
      const params = statusFilter ? { status: statusFilter } : {};
      const res = await api.get<ApiResponse<StaffAppointment[]>>("/staff/appointments", { params });
      return res.data.data ?? [];
    },
    refetchInterval: 15_000,
  });

export const useUpdateAppointmentStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, status }: { appointmentId: string; status: string }) =>
      api.put(`/staff/appointments/${appointmentId}/status`, { status }).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
};
