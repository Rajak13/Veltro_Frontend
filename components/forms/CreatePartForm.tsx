"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Button from "@/components/ui/Button";
import { useCreatePart } from "@/hooks/useParts";
import { useVendors } from "@/hooks/useVendors";
import toast from "react-hot-toast";
import {
  Package, FileText, Tag, DollarSign, Layers,
  Building2, Upload, X, AlertCircle,
} from "lucide-react";

const schema = z.object({
  name:          z.string().min(1, "Name is required"),
  description:   z.string().min(1, "Description is required"),
  price:         z.coerce.number().positive("Price must be positive"),
  stockQuantity: z.coerce.number().int().min(0, "Stock cannot be negative"),
  vendorId:      z.string().min(1, "Please select a vendor"),
});

type FormData = z.output<typeof schema>;

interface Props { onSuccess?: () => void; }

// ── Shared field wrapper ──────────────────────────────────────────────────────
function Field({
  label, required, icon, error, children,
}: { label: string; required?: boolean; icon: React.ReactNode; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-medium text-zinc-600">
        {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      <div className={`flex items-center gap-2 px-3 rounded-lg border-[1.5px] transition-all bg-zinc-50 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/10 ${error ? "border-red-300 bg-red-50/30" : "border-zinc-200"}`}>
        <span className="text-zinc-400 flex-shrink-0">{icon}</span>
        <div className="flex-1">{children}</div>
      </div>
      {error && (
        <p className="flex items-center gap-1 text-[10px] text-red-500">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

const inputCls = "w-full py-2.5 bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none";
const selectCls = "w-full py-2.5 bg-transparent text-[13px] text-zinc-900 outline-none appearance-none cursor-pointer";

export default function CreatePartForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreatePart();
  const { data: vendorsData } = useVendors(1, 100);
  const vendors = vendorsData?.data ?? [];

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
      toast.success("Part added successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to add part");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">

      {/* Part image */}
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-medium text-zinc-600">Part Photo <span className="text-zinc-400">(optional)</span></label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border border-zinc-200 bg-zinc-50">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="Part preview" className="w-full h-36 object-contain p-2" />
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
            className="flex flex-col items-center justify-center gap-2 h-28 rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 hover:border-orange-300 hover:bg-orange-50/30 transition-all text-zinc-400 hover:text-orange-500"
          >
            <Upload className="w-5 h-5" />
            <span className="text-xs font-medium">Upload part photo</span>
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

      {/* Name */}
      <Field label="Part Name" required icon={<Package className="w-3.5 h-3.5" />} error={errors.name?.message}>
        <input {...register("name")} placeholder="e.g. Brake Pad Set" className={inputCls} />
      </Field>

      {/* Description */}
      <Field label="Description" required icon={<FileText className="w-3.5 h-3.5" />} error={errors.description?.message}>
        <input {...register("description")} placeholder="Brief description of the part" className={inputCls} />
      </Field>

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-3">
        <Field label="Price (Rs.)" required icon={<DollarSign className="w-3.5 h-3.5" />} error={errors.price?.message}>
          <input {...register("price")} type="number" step="0.01" placeholder="0.00" className={inputCls} />
        </Field>
        <Field label="Stock Qty" required icon={<Layers className="w-3.5 h-3.5" />} error={errors.stockQuantity?.message}>
          <input {...register("stockQuantity")} type="number" placeholder="0" className={inputCls} />
        </Field>
      </div>

      {/* Vendor dropdown */}
      <Field label="Vendor" required icon={<Building2 className="w-3.5 h-3.5" />} error={errors.vendorId?.message}>
        <select {...register("vendorId")} className={selectCls}>
          <option value="">Select a vendor</option>
          {vendors.map((v) => (
            <option key={String(v.vendorId)} value={String(v.vendorId)}>
              {v.name}
            </option>
          ))}
        </select>
      </Field>

      <div className="flex justify-end gap-3 pt-1">
        <Button type="submit" loading={isPending}>
          <Tag className="w-3.5 h-3.5" /> Add Part
        </Button>
      </div>
    </form>
  );
}
