"use client";

import { useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { useCreateAppointment, useBookedSlots, ALL_SLOTS, SLOT_START } from "@/hooks/useAppointments";
import { useMyProfile } from "@/hooks/useCustomers";
import toast from "react-hot-toast";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Textarea from "@/components/ui/Textarea";
import { Clock, AlertCircle, Ban, Car, Wrench, Calendar, StickyNote } from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_CAPACITY = 5;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatHour(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const display = h % 12 === 0 ? 12 : h % 12;
  return `${display}:00 ${period}`;
}

function minBookableDate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toISOString().split("T")[0];
}

function isAtLeast24HoursAway(dateStr: string, hour: number): boolean {
  if (!dateStr) return false;
  const [y, m, day] = dateStr.split("-").map(Number);
  const slotTime = new Date(y, m - 1, day, hour, 0, 0);
  return slotTime.getTime() - Date.now() >= 24 * 60 * 60 * 1000;
}

function isSundayDate(dateStr: string): boolean {
  if (!dateStr) return false;
  const [y, m, day] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, day).getDay() === 0;
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
  } = useForm<FormData>({ resolver: zodResolver(schema) as never });

  const selectedDate = watch("date");
  const selectedHour = watch("hour");

  const isSunday = selectedDate ? isSundayDate(selectedDate) : false;

  const { data: slotData, isFetching: loadingSlots } = useBookedSlots(
    selectedDate && !isSunday ? selectedDate : null
  );

  // For each slot: is it disabled and why?
  const slotInfo = useMemo(() => {
    return ALL_SLOTS.map((h) => {
      const count = slotData?.slotCounts?.[h] ?? 0;
      const remaining = MAX_CAPACITY - count;
      const tooSoon = !isAtLeast24HoursAway(selectedDate, h);
      const full = remaining <= 0;
      const disabled = isSunday || full || tooSoon;
      return { h, count, remaining, tooSoon, full, disabled };
    });
  }, [slotData, selectedDate, isSunday]);

  const vehicles = profile?.vehicles ?? [];

  const onSubmit = async (data: FormData) => {
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
      const msg = err.response?.data?.message || err.response?.data?.title || "Failed to book appointment";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Vehicle + Service Type */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          {loadingProfile ? (
            <div className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400">Loading vehicles…</div>
          ) : vehicles.length === 0 ? (
            <div className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-600">
              No vehicles found. Add one in your profile first.
            </div>
          ) : (
            <Select label="Vehicle" icon={Car} {...register("vehicleId")} error={errors.vehicleId?.message}>
              <option value="">Select a vehicle…</option>
              {vehicles.map((v) => {
                const id = String(v.vehicleId ?? "");
                return (
                  <option key={id} value={id}>
                    {v.year} {v.make} {v.model}{v.registrationNumber ? ` — ${v.registrationNumber}` : ""}
                  </option>
                );
              })}
            </Select>
          )}
        </div>

        <Select label="Service Type" icon={Wrench} {...register("serviceType")} error={errors.serviceType?.message}>
          <option value="">Select service type…</option>
          <option value="Oil Change">Oil Change</option>
          <option value="Brake Service">Brake Service</option>
          <option value="Tire Rotation">Tire Rotation</option>
          <option value="Engine Tune-Up">Engine Tune-Up</option>
          <option value="General Inspection">General Inspection</option>
          <option value="Other">Other</option>
        </Select>
      </div>

      <Input
        label="Preferred Date"
        icon={Calendar}
        type="date"
        min={minBookableDate()}
        hint="At least 24 hours ahead · closed Sundays"
        {...register("date", {
          onChange: () => setValue("hour", undefined as never),
        })}
        error={errors.date?.message}
      />
      {isSunday && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-[12px] text-red-700">
          <Ban className="w-3.5 h-3.5 flex-shrink-0" />
          The garage is closed on Sundays. Please choose a different day.
        </div>
      )}

      {/* Time slot grid */}
      {selectedDate && !isSunday && (
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
                {slotInfo.map(({ h, remaining, full, tooSoon, disabled }) => {
                  const selected = field.value === h;
                  // Colour the capacity indicator
                  const capacityColor =
                    remaining === 0 ? "bg-red-400" :
                    remaining <= 2 ? "bg-amber-400" :
                    "bg-green-400";

                  return (
                    <button
                      key={h}
                      type="button"
                      disabled={disabled}
                      onClick={() => !disabled && field.onChange(h)}
                      title={
                        full     ? "Fully booked" :
                        tooSoon  ? "Must book 24h in advance" :
                        `${remaining} spot${remaining !== 1 ? "s" : ""} left`
                      }
                      className={[
                        "relative py-2 px-1 rounded-lg text-[12px] font-medium border transition-all text-center",
                        selected
                          ? "bg-orange-500 border-orange-500 text-white shadow-sm"
                          : disabled
                          ? "bg-zinc-50 border-zinc-100 text-zinc-300 cursor-not-allowed"
                          : "bg-white border-zinc-200 text-zinc-700 hover:border-orange-300 hover:bg-orange-50 cursor-pointer",
                      ].join(" ")}
                    >
                      {formatHour(h)}
                      {/* Capacity dot */}
                      {!tooSoon && (
                        <span
                          className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-white ${capacityColor}`}
                        />
                      )}
                      {/* Remaining spots label */}
                      {!disabled && !selected && (
                        <div className="text-[9px] text-zinc-400 mt-0.5 leading-none">
                          {remaining}/{MAX_CAPACITY}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />

          {/* Legend */}
          <div className="flex items-center gap-4 mt-2.5 text-[11px] text-zinc-400 flex-wrap">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Available
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" /> Filling up
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 inline-block" /> Full
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 inline-block" /> Selected
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

      <Textarea
        label="Notes (optional)"
        icon={StickyNote}
        {...register("notes")}
        rows={2}
        placeholder="Any additional details about the service…"
      />

      {/* Booking summary */}
      {selectedDate && !isSunday && selectedHour !== undefined && (
        <div className="p-3 rounded-xl bg-orange-50 border border-orange-100 text-[12px] text-orange-800">
          <span className="font-semibold">Booking summary: </span>
          {new Date(
            ...((selectedDate.split("-").map(Number) as [number, number, number]).map(
              (v, i) => (i === 1 ? v - 1 : v)
            ) as [number, number, number]),
            selectedHour
          ).toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}{" "}
          at {formatHour(selectedHour)}
          {" · "}
          {(slotInfo.find(s => s.h === selectedHour)?.remaining ?? MAX_CAPACITY) - 1} other spot{
            (slotInfo.find(s => s.h === selectedHour)?.remaining ?? MAX_CAPACITY) - 1 !== 1 ? "s" : ""
          } remaining after this booking
        </div>
      )}

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          loading={isPending}
          disabled={vehicles.length === 0 || isSunday}
          className="w-full sm:w-auto"
        >
          Book Appointment
        </Button>
      </div>
    </form>
  );
}
