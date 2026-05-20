"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useCreatePartRequest } from "@/hooks/usePartRequests";
import { FileText, Package } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  partName: z.string().min(3, "Part name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export default function CreatePartRequestForm({ onSuccess }: Props) {
  const { mutateAsync, isPending } = useCreatePartRequest();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Part request submitted successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to submit part request");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Part Name"
        icon={Package}
        {...register("partName")}
        error={errors.partName?.message}
        placeholder="e.g., Front Brake Pads - Honda Civic 2020"
      />

      <Textarea
        label="Description"
        icon={FileText}
        rows={4}
        {...register("description")}
        error={errors.description?.message}
        placeholder="Provide details about the part you need (make, model, year, specifications)..."
      />

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <p className="text-xs text-blue-700">
          We&apos;ll notify you when the part is sourced and available for purchase.
        </p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Submit Request</Button>
      </div>
    </form>
  );
}
