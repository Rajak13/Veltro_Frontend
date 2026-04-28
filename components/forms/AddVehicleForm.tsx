"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useAddVehicle } from "@/hooks/useCustomers";
import toast from "react-hot-toast";

const schema = z.object({
  make: z.string().min(2, "Make is required"),
  model: z.string().min(2, "Model is required"),
  year: z.coerce.number().min(1900).max(new Date().getFullYear() + 1, "Invalid year"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  mileage: z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export default function AddVehicleForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useAddVehicle();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Vehicle added successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to add vehicle");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Make"
          {...register("make")}
          error={errors.make?.message}
          placeholder="Honda"
        />
        
        <Input
          label="Model"
          {...register("model")}
          error={errors.model?.message}
          placeholder="Civic"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Year"
          {...register("year")}
          error={errors.year?.message}
          type="number"
          placeholder="2020"
        />
        
        <Input
          label="Registration Number"
          {...register("registrationNumber")}
          error={errors.registrationNumber?.message}
          placeholder="ABC-1234"
        />
      </div>

      <Input
        label="Mileage (optional)"
        {...register("mileage")}
        error={errors.mileage?.message}
        type="number"
        placeholder="50000"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Add Vehicle</Button>
      </div>
    </form>
  );
}
