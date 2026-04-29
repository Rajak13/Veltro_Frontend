"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateAppointment } from "@/hooks/useAppointments";
import toast from "react-hot-toast";

const schema = z.object({
  vehicleId:     z.coerce.number().positive("Vehicle is required"),
  scheduledDate: z.string().min(1, "Date is required"),
  notes:         z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function BookAppointmentForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateAppointment();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Appointment booked successfully");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to book appointment");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Vehicle ID"
        {...register("vehicleId")}
        error={errors.vehicleId?.message}
        type="number"
        placeholder="Enter your vehicle ID"
        hint="You can find your vehicle ID in your profile"
      />
      
      <Input 
        label="Preferred Date & Time" 
        {...register("scheduledDate")} 
        error={errors.scheduledDate?.message} 
        type="datetime-local" 
      />
      
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1.5">Notes (optional)</label>
        <textarea
          {...register("notes")}
          rows={3}
          placeholder="Describe the service you need (e.g., Oil change, brake inspection, etc.)"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
        />
      </div>
      
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Book Appointment</Button>
      </div>
    </form>
  );
}
