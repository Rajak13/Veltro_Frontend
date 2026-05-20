"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useCreateCustomer } from "@/hooks/useCustomers";
import toast from "react-hot-toast";
import {
  ChevronDown, ChevronUp, Car, User, Mail, Lock, Phone, MapPin,
  Calendar, Hash, Gauge,
} from "lucide-react";

const schema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email:    z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone:    z.string().min(1, "Phone is required"),
  address:  z.string().min(1, "Address is required"),
  vehicleMake:               z.string().optional(),
  vehicleModel:              z.string().optional(),
  vehicleYear:               z.string().optional(),
  vehicleRegistrationNumber: z.string().optional(),
  vehicleMileage:            z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

export default function CreateCustomerForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreateCustomer();
  const [showVehicle, setShowVehicle] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const payload: Record<string, unknown> = {
        fullName: data.fullName,
        email:    data.email,
        password: data.password,
        phone:    data.phone,
        address:  data.address,
      };

      if (showVehicle && data.vehicleMake && data.vehicleModel) {
        payload.vehicle = {
          make:               data.vehicleMake,
          model:              data.vehicleModel,
          year:               data.vehicleYear ? parseInt(data.vehicleYear, 10) : undefined,
          registrationNumber: data.vehicleRegistrationNumber || undefined,
          mileage:            data.vehicleMileage ? parseInt(data.vehicleMileage, 10) : undefined,
        };
      }

      await mutateAsync(payload);
      toast.success("Customer registered successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to register customer");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input label="Full Name" icon={User} {...register("fullName")} error={errors.fullName?.message} />
      <Input label="Email" icon={Mail} type="email" {...register("email")} error={errors.email?.message} />
      <Input label="Password" icon={Lock} type="password" showPasswordToggle {...register("password")} error={errors.password?.message} />
      <Input label="Phone" icon={Phone} type="tel" {...register("phone")} error={errors.phone?.message} />
      <Input label="Address" icon={MapPin} {...register("address")} error={errors.address?.message} />

      <div className="border border-zinc-200 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setShowVehicle((v) => !v)}
          className="w-full flex items-center justify-between px-4 py-3 bg-zinc-50 hover:bg-zinc-100 transition-colors text-sm font-medium text-zinc-700"
        >
          <span className="flex items-center gap-2">
            <Car className="w-4 h-4 text-zinc-400" />
            Register a Vehicle (optional)
          </span>
          {showVehicle
            ? <ChevronUp className="w-4 h-4 text-zinc-400" />
            : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {showVehicle && (
          <div className="p-4 space-y-3 border-t border-zinc-100">
            <div className="grid grid-cols-2 gap-3">
              <Input label="Make" icon={Car} {...register("vehicleMake")} placeholder="e.g. Toyota" />
              <Input label="Model" icon={Car} {...register("vehicleModel")} placeholder="e.g. Corolla" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Year" icon={Calendar} {...register("vehicleYear")} type="number" placeholder="e.g. 2020" />
              <Input label="Mileage (km)" icon={Gauge} {...register("vehicleMileage")} type="number" placeholder="e.g. 45000" />
            </div>
            <Input label="Registration Number" icon={Hash} {...register("vehicleRegistrationNumber")} placeholder="e.g. BA 1 CHA 1234" />
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Register Customer</Button>
      </div>
    </form>
  );
}
