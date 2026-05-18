/** Normalizes API status values (string or numeric enum) for display and comparisons. */

const APPOINTMENT_STATUSES = ["Pending", "Confirmed", "Completed", "Cancelled"] as const;
const PART_REQUEST_STATUSES = ["Pending", "Fulfilled", "Rejected"] as const;

export type AppointmentStatusLabel = (typeof APPOINTMENT_STATUSES)[number];

export function formatAppointmentStatus(status: unknown): AppointmentStatusLabel | string {
  if (typeof status === "string" && status.length > 0) {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  }
  if (typeof status === "number" && status >= 0 && status < APPOINTMENT_STATUSES.length) {
    return APPOINTMENT_STATUSES[status];
  }
  return "Unknown";
}

/** UI label for part requests (maps Fulfilled → Sourced, Rejected → Unavailable). */
export function formatPartRequestStatus(status: unknown): string {
  const raw =
    typeof status === "number" && status >= 0 && status < PART_REQUEST_STATUSES.length
      ? PART_REQUEST_STATUSES[status]
      : typeof status === "string"
        ? status
        : "";

  if (raw === "Fulfilled") return "Sourced";
  if (raw === "Rejected") return "Unavailable";
  if (raw) return raw.charAt(0).toUpperCase() + raw.slice(1).toLowerCase();
  return "Unknown";
}

export function appointmentStatusEquals(status: unknown, expected: AppointmentStatusLabel): boolean {
  return formatAppointmentStatus(status).toLowerCase() === expected.toLowerCase();
}

export function partRequestStatusEquals(status: unknown, expected: "Pending" | "Sourced" | "Unavailable"): boolean {
  return formatPartRequestStatus(status).toLowerCase() === expected.toLowerCase();
}

/** Generic status normalizer for badges (appointments, invoices, part requests). */
export function normalizeStatusLabel(status: unknown): string {
  if (status == null) return "Unknown";
  if (typeof status === "string") return status;
  if (typeof status === "number") {
    if (status >= 0 && status < APPOINTMENT_STATUSES.length) return APPOINTMENT_STATUSES[status];
    if (status >= 0 && status < PART_REQUEST_STATUSES.length) return formatPartRequestStatus(status);
  }
  return String(status);
}
