"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Button from "@/components/ui/Button";
import { useUpdateMyProfile } from "@/hooks/useCustomers";
import type { CustomerSearchResult } from "@/hooks/useCustomers";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Phone, User } from "lucide-react";
import toast from "react-hot-toast";

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  profile: CustomerSearchResult;
  onSuccess?: () => void;
}

export default function EditProfileForm({ profile, onSuccess }: Props) {
  const { user } = useAuth();
  const { mutateAsync, isPending } = useUpdateMyProfile();
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: profile.fullName || user?.name || "",
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
        icon={User}
        {...register("name")}
        error={errors.name?.message}
        placeholder="John Doe"
      />

      <Input
        label="Phone Number"
        icon={Phone}
        type="tel"
        {...register("phone")}
        error={errors.phone?.message}
        placeholder="+977 98XXXXXXXX"
      />

      <Textarea
        label="Address"
        icon={MapPin}
        rows={3}
        {...register("address")}
        error={errors.address?.message}
        placeholder="123 Main St, City, State, ZIP"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit" loading={isPending}>Save Changes</Button>
      </div>
    </form>
  );
}
