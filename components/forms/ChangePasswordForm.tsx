"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { changePassword } from "@/lib/auth";
import { Lock } from "lucide-react";
import toast from "react-hot-toast";

const schema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password"),
    newPassword: z.string().min(6, "New password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((d) => d.currentPassword !== d.newPassword, {
    message: "New password must be different from your current password",
    path: ["newPassword"],
  });

type FormData = z.infer<typeof schema>;

interface Props {
  onSuccess?: () => void;
}

export default function ChangePasswordForm({ onSuccess }: Props) {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success("Password updated successfully");
      reset();
      onSuccess?.();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Failed to update password";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-zinc-500">
        Enter your current password, then choose a new one (at least 6 characters).
      </p>

      <Input
        label="Current password"
        icon={Lock}
        type="password"
        autoComplete="current-password"
        showPasswordToggle
        {...register("currentPassword")}
        error={errors.currentPassword?.message}
      />
      <Input
        label="New password"
        icon={Lock}
        type="password"
        autoComplete="new-password"
        showPasswordToggle
        {...register("newPassword")}
        error={errors.newPassword?.message}
      />
      <Input
        label="Confirm new password"
        icon={Lock}
        type="password"
        autoComplete="new-password"
        showPasswordToggle
        {...register("confirmPassword")}
        error={errors.confirmPassword?.message}
      />

      <div className="flex justify-end pt-1">
        <Button type="submit" loading={submitting}>
          Update password
        </Button>
      </div>
    </form>
  );
}
