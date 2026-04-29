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
import { useMyProfile } from "@/hooks/useCustomers";
import toast from "react-hot-toast";

const schema = z.object({
  vehicleId:     z.string().min(1, "Please select a vehicle"),
  serviceType:   z.string().min(1, "Service type is required"),
  scheduledDate: z.string().min(1, "Date is required"),
  notes:         z.string().optional(),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function BookAppointmentForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateAppointment();
  const { data: profile, isLoading: loadingProfile } = useMyProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Convert date string to ISO DateTime format for backend
      const appointmentData = {
        vehicleId: data.vehicleId,
        serviceType: data.serviceType,
        scheduledDate: new Date(data.scheduledDate).toISOString(),
        notes: data.notes || undefined,
      };
      console.log("Form data:", data);
      console.log("Sending appointment data:", appointmentData);
      console.log("VehicleId type:", typeof data.vehicleId, "Value:", data.vehicleId);
      await mutateAsync(appointmentData as never);
      toast.success("Appointment booked successfully");
      onSuccess?.();
    } catch (error: any) {
      console.error("Appointment booking error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(error.response?.data?.title || "Failed to book appointment");
    }
  };

  const vehicles = profile?.vehicles || [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-zinc-700 block mb-1.5">Vehicle</label>
          {loadingProfile ? (
            <div className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-400">
              Loading vehicles...
            </div>
          ) : vehicles.length === 0 ? (
            <div className="w-full rounded-lg border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-orange-600">
              No vehicles found. Please add a vehicle in your profile first.
            </div>
          ) : (
            <select
              {...register("vehicleId")}
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
            >
              <option value="">Select a vehicle...</option>
              {vehicles.map((vehicle) => {
                const id = vehicle.vehicleId || vehicle.id?.toString();
                return (
                  <option key={id} value={id}>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                    {vehicle.registrationNumber ? ` - ${vehicle.registrationNumber}` : ""}
                  </option>
                );
              })}
            </select>
          )}
          {errors.vehicleId && <p className="text-xs text-red-500 mt-1">{errors.vehicleId.message}</p>}
        </div>
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
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-2">
        <Button type="submit" loading={isPending} disabled={vehicles.length === 0} className="w-full sm:w-auto">Book Appointment</Button>
      </div>
    </form>
  );
}
