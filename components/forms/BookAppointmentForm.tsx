"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { useCreateAppointment } from "@/hooks/useAppointments";
import { useBookedSlots, ALL_SLOTS, SLOT_START } from "@/hooks/useAppointments";
import { useMyProfile } from "@/hooks/useCustomers";
import toast from "react-hot-toast";
import { Clock, AlertCircle } from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format a 0-23 hour number as "8:00 AM" */
function formatHour(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

/** Returns the minimum bookable date (today + 1 day) as a YYYY-MM-DD string */
function minBookableDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

/** Returns true if the given date string is at least 24 hours from now */
function isAtLeast24HoursAway(dateStr: string, hour: number): boolean {
  if (!dateStr) return false;
  const [y, m, day] = dateStr.split("-").map(Number);
  const slotTime = new Date(y, m - 1, day, hour, 0, 0);
  return slotTime.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
}

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  vehicleId:   z.string().min(1, "Please select a vehicle"),
  serviceType: z.string().min(1, "Service type is required"),
  date:        z.string().min(1, "Date is required"),
  hour:        z.number({ message: "Please select a time slot" }).int().min(8).max(17),
  notes:       z.string().optional(),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

// ─── Component ────────────────────────────────────────────────────────────────

export default function BookAppointmentForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateAppointment();
  const { data: profile, isLoading: loadingProfile } = useMyProfile();

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  });

  const selectedDate = watch("date");
  const selectedHour = watch("hour");

  // Fetch booked slots whenever the date changes
  const { data: bookedSlots = [], isFetching: loadingSlots } = useBookedSlots(
    selectedDate || null
  );

  // Slots that are unavailable: already booked OR within 24 hours
  const unavailableSlots = useMemo(() => {
    return new Set(
      ALL_SLOTS.filter(
        (h) => bookedSlots.includes(h) || !isAtLeast24HoursAway(selectedDate, h)
      )
    );
  }, [bookedSlots, selectedDate]);

  const vehicles = profile?.vehicles ?? [];

  const onSubmit = async (data: FormData) => {
    // Build a local datetime string that preserves the intended hour.
    // Format: "YYYY-MM-DDTHH:00:00" — no timezone suffix so the backend
    // receives the local time and can read the hour directly from it.
    const pad = (n: number) => String(n).padStart(2, "0");
    const scheduledDate = `${data.date}T${pad(data.hour)}:00:00`;

    try {
      await mutateAsync({
        vehicleId: data.vehicleId as never,
        serviceType: data.serviceType,
        scheduledDate,
        notes: data.notes || undefined,
      } as never);
      toast.success("Appointment booked successfully");
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string; title?: string } } };
      const msg =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Failed to book appointment";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Vehicle + Service Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1.5">Vehicle</label>
          {loadingProfile ? (
            <div className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400">
              Loading vehicles…
            </div>
          ) : vehicles.length === 0 ? (
            <div className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-600">
              No vehicles found. Add one in your profile first.
            </div>
          ) : (
            <select
              {...register("vehicleId")}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Select a vehicle…</option>
              {vehicles.map((v) => {
                const id = String(v.vehicleId ?? "");
                return (
                  <option key={id} value={id}>
                    {v.year} {v.make} {v.model}
                    {v.registrationNumber ? ` — ${v.registrationNumber}` : ""}
                  </option>
                );
              })}
            </select>
          )}
          {errors.vehicleId && (
            <p className="text-xs text-red-500 mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1.5">Service Type</label>
          <select
            {...register("serviceType")}
            className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          >
            <option value="">Select service type…</option>
            <option value="Oil Change">Oil Change</option>
            <option value="Brake Service">Brake Service</option>
            <option value="Tire Rotation">Tire Rotation</option>
            <option value="Engine Tune-Up">Engine Tune-Up</option>
            <option value="General Inspection">General Inspection</option>
            <option value="Other">Other</option>
          </select>
          {errors.serviceType && (
            <p className="text-xs text-red-500 mt-1">{errors.serviceType.message}</p>
          )}
        </div>
      </div>

      {/* Date picker */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1.5">
          Preferred Date
          <span className="ml-1.5 text-[11px] font-normal text-zinc-400">
            (must be at least 24 hours from now)
          </span>
        </label>
        <input
          type="date"
          min={minBookableDate()}
          {...register("date", {
            onChange: () => {
              // Clear selected slot when date changes
              setValue("hour", undefined as never);
            },
          })}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        />
        {errors.date && (
          <p className="text-xs text-red-500 mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Time slot grid */}
      {selectedDate && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              Select Time Slot
            </label>
            {loadingSlots && (
              <span className="text-[11px] text-zinc-400">Checking availability…</span>
            )}
          </div>

          <Controller
            name="hour"
            control={control}
            render={({ field }) => (
              <div className="grid grid-cols-5 gap-2">
                {ALL_SLOTS.map((h) => {
                  const booked = bookedSlots.includes(h);
                  const tooSoon = !isAtLeast24HoursAway(selectedDate, h);
                  const disabled = booked || tooSoon;
                  const selected = field.value === h;

                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && field.onChange(h)}
                      className={[
                        "relative py-2 px-1 rounded-lg text-[12px] font-medium border transition-all text-center",
                        selected
                          ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                          : disabled
                          ? "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
                          : "bg-white border-zinc-200 text-zinc-700 hover:border-orange-300 hover:bg-orange-50 cursor-pointer",
                      ].join(" ")}
                      title={
                        booked
                          ? "This slot is already booked"
                          : tooSoon
                          ? "Must book at least 24 hours in advance"
                          : formatHour(h)
                      }
                    >
                      {formatHour(h)}
                      {booked && (
                        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-400 border border-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2.5 text-[11px] text-zinc-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-orange-500 inline-block" />
              Selected
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-zinc-100 border border-zinc-200 inline-block" />
              Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-zinc-50 border border-zinc-100 inline-block" />
              Unavailable
            </span>
          </div>

          {errors.hour && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.hour.message ?? "Please select a time slot"}
            </p>
          )}
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1.5">
          Notes <span className="font-normal text-zinc-400">(optional)</span>
        </label>
        <textarea
          {...register("notes")}
          rows={2}
          placeholder="Any additional details about the service…"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
        />
      </div>

      {/* Summary */}
      {selectedDate && selectedHour !== undefined && (
        <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-[12px] text-orange-800">
          <span className="font-semibold">Booking summary: </span>
          {new Date(
            ...((selectedDate.split("-").map(Number) as [number, number, number]).map(
              (v, i) => (i === 1 ? v - 1 : v)
            ) as [number, number, number]),
            selectedHour
          ).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          at {formatHour(selectedHour)}
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          loading={isPending}
          disabled={vehicles.length === 0}
          className="w-full sm:w-auto"
        >
          Book Appointment
        </Button>
      </div>
    </form>
  );
}
