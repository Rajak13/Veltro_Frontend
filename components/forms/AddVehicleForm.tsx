"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { useAddVehicle } from "@/hooks/useCustomers";
import toast from "react-hot-toast";
import {
  Car, Wrench, Calendar, Hash, Gauge, Camera, X, Upload,
} from "lucide-react";

const schema = z.object({
  make:               z.string().min(2, "Make is required"),
  model:              z.string().min(2, "Model is required"),
  year:               z.coerce.number().min(1900).max(new Date().getFullYear() + 1, "Invalid year"),
  registrationNumber: z.string().min(3, "Registration number is required"),
  mileage:            z.coerce.number().min(0).optional(),
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

// ── Shared field wrapper with icon ────────────────────────────────────────────
function Field({
  label, icon, error, children,
}: { label: string; icon: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-zinc-600">{label}</label>
      <div className={`flex items-center gap-2 px-3 rounded-lg border-[1.5px] transition-all bg-zinc-50 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/10 ${error ? "border-red-300 bg-red-50/30" : "border-zinc-200"}`}>
        <span className="text-zinc-400 flex-shrink-0">{icon}</span>
        <div className="flex-1">{children}</div>
      </div>
      {error && <p className="text-[10px] text-red-500">{error}</p>}
    </div>
  );
}

const inputCls = "w-full py-2.5 bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none";

export default function AddVehicleForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useAddVehicle();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema) as never,
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image must be under 2 MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync({ ...data, imageUrl: imagePreview ?? undefined } as never);
      toast.success("Vehicle added successfully");
      onSuccess?.();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(msg ?? "Failed to add vehicle");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      {/* Image upload */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-zinc-600">Vehicle Photo <span className="text-zinc-400">(optional)</span></label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Vehicle preview" className="w-full h-40 object-cover" />
            <button
              type="button"
              onClick={() => { setImagePreview(null); if (fileRef.current) fileRef.current.value = ""; }}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-zinc-900/60 flex items-center justify-center text-white hover:bg-zinc-900/80 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-orange-300 hover:bg-orange-50/30 transition-all text-zinc-400 hover:text-orange-500"
          >
            <Upload className="w-6 h-6" />
            <span className="text-xs font-medium">Click to upload photo</span>
            <span className="text-[10px]">JPG, PNG — max 2 MB</span>
          </button>
        )}
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleImageChange}
        />
      </div>

      {/* Make + Model */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Make" icon={<Car className="w-3.5 h-3.5" />} error={errors.make?.message}>
          <input {...register("make")} placeholder="Honda" className={inputCls} />
        </Field>
        <Field label="Model" icon={<Wrench className="w-3.5 h-3.5" />} error={errors.model?.message}>
          <input {...register("model")} placeholder="Civic" className={inputCls} />
        </Field>
      </div>

      {/* Year + Registration */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Year" icon={<Calendar className="w-3.5 h-3.5" />} error={errors.year?.message}>
          <input {...register("year")} type="number" placeholder="2020" className={inputCls} />
        </Field>
        <Field label="Registration No." icon={<Hash className="w-3.5 h-3.5" />} error={errors.registrationNumber?.message}>
          <input {...register("registrationNumber")} placeholder="BA 1 CHA 1234" className={inputCls} />
        </Field>
      </div>

      {/* Mileage */}
      <Field label="Mileage (optional)" icon={<Gauge className="w-3.5 h-3.5" />} error={errors.mileage?.message}>
        <input {...register("mileage")} type="number" placeholder="50,000 km" className={inputCls} />
      </Field>

      <div className="flex justify-end gap-3 pt-1">
        <Button type="submit" loading={isPending}>
          <Car className="w-3.5 h-3.5" /> Add Vehicle
        </Button>
      </div>
    </form>
  );
}
