"use client";

// TODO: Implement BookAppointmentForm
// Fields: vehicleId, serviceType, scheduledDate, notes
// On submit: call useCreateAppointment() mutation, show toast, call onSuccess()

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateAppointment } from "@/hooks/useAppointments";
import toast from "react-hot-toast";

const schema = z.object({
  vehicleId:     z.coerce.number().positive("Vehicle is required"),
  serviceType:   z.string().min(1, "Service type is required"),
  scheduledDate: z.string().min(1, "Date is required"),
  notes:         z.string().optional(),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function BookAppointmentForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateAppointment();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data as never);
      toast.success("Appointment booked successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to book appointment");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Vehicle"
        {...register("vehicleId")}
        error={errors.vehicleId?.message}
        type="number"
        hint="TODO: Replace with vehicle dropdown from customer profile"
      />
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1.5">Service Type</label>
        <select
          {...register("serviceType")}
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        >
          <option value="">Select service type...</option>
          <option value="Oil Change">Oil Change</option>
          <option value="Brake Service">Brake Service</option>
          <option value="Tire Rotation">Tire Rotation</option>
          <option value="Engine Tune-Up">Engine Tune-Up</option>
          <option value="General Inspection">General Inspection</option>
          <option value="Other">Other</option>
        </select>
        {errors.serviceType && <p className="text-xs text-red-500 mt-1">{errors.serviceType.message}</p>}
      </div>
      <Input label="Preferred Date" {...register("scheduledDate")} error={errors.scheduledDate?.message} type="date" />
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1.5">Notes (optional)</label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Any additional details..."
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Book Appointment</Button>
      </div>
    </form>
  );
}
