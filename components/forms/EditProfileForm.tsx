"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useUpdateMyProfile } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import toast from "react-hot-toast";
import type { Customer } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  profile: Customer;
  onSuccess?: () => void;
}

export default function EditProfileForm({ profile, onSuccess }: Props) {
  const { user } = useAuth();
  const { mutateAsync, isPending } = useUpdateMyProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.user?.name || user?.name || "",
      phone: profile.phone || "",
      address: profile.address || "",
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await mutateAsync(data);
      toast.success("Profile updated successfully");
      onSuccess?.();
    } catch {
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Full Name"
        {...register("name")}
        error={errors.name?.message}
        placeholder="John Doe"
      />
      
      <Input
        label="Phone Number"
        {...register("phone")}
        error={errors.phone?.message}
        placeholder="+1 234 567 8900"
      />
      
      <div>
        <label className="text-sm font-medium text-zinc-700 block mb-1.5">Address</label>
        <textarea
          {...register("address")}
          rows={3}
          placeholder="123 Main St, City, State, ZIP"
          className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 resize-none"
        />
        {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address.message}</p>}
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Save Changes</Button>
      </div>
    </form>
  );
}
