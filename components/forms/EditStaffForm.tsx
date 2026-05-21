"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Lock, Briefcase, Eye, EyeOff, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import { useUpdateStaff, type StaffMember } from "@/hooks/useStaff";

const schema = z
  .object({
    firstName: z.string().min(1, "First name is required"),
    lastName:  z.string().min(1, "Last name is required"),
    email:     z.string().email("Enter a valid email address"),
    position:  z.string().min(1, "Please select a position"),
    // Password is optional on edit — blank means "keep existing"
    password:  z.string().optional(),
    confirm:   z.string().optional(),
  })
  .refine(
    (d) => !d.password || d.password.length >= 6,
    { message: "Password must be at least 6 characters", path: ["password"] }
  )
  .refine(
    (d) => !d.password || d.password === d.confirm,
    { message: "Passwords do not match", path: ["confirm"] }
  );

type FormValues = z.infer<typeof schema>;

interface Props {
  staff: StaffMember;
  onSuccess: () => void;
}

export default function EditStaffForm({ staff, onSuccess }: Props) {
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const { mutateAsync, isPending } = useUpdateStaff();

  // Pre-split the full name into first / last for the form
  const nameParts  = (staff.fullName ?? "").trim().split(" ");
  const firstName  = nameParts[0] ?? "";
  const lastName   = nameParts.slice(1).join(" ");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName,
      lastName,
      email:    staff.email,
      position: staff.position ?? "",
      password: "",
      confirm:  "",
    },
  });

  async function onSubmit(values: FormValues) {
    try {
      await mutateAsync({
        id:       staff.id,
        fullName: `${values.firstName} ${values.lastName}`.trim(),
        email:    values.email,
        position: values.position,
        // Only send password if the admin actually typed one
        ...(values.password ? { password: values.password } : {}),
      });
      toast.success("Staff member updated successfully.");
      onSuccess();
    } catch {
      toast.error("Failed to update staff member. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">

      {/* ── Personal Information ── */}
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-100 mb-4">
        Personal Information
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <Field label="First Name" required error={errors.firstName?.message}>
          <IconInput icon={<User className="w-3.5 h-3.5" />} error={!!errors.firstName}>
            <input
              {...register("firstName")}
              placeholder="First name"
              className={inputCls(!!errors.firstName)}
            />
          </IconInput>
        </Field>
        <Field label="Last Name" required error={errors.lastName?.message}>
          <IconInput icon={<User className="w-3.5 h-3.5" />} error={!!errors.lastName}>
            <input
              {...register("lastName")}
              placeholder="Last name"
              className={inputCls(!!errors.lastName)}
            />
          </IconInput>
        </Field>
      </div>

      <div className="mb-4">
        <Field label="Email Address" required error={errors.email?.message}>
          <IconInput icon={<Mail className="w-3.5 h-3.5" />} error={!!errors.email}>
            <input
              {...register("email")}
              type="email"
              placeholder="name@veltro.com"
              className={inputCls(!!errors.email)}
            />
          </IconInput>
        </Field>
      </div>

      {/* ── Role ── */}
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-100 mb-4 mt-5">
        Role & Access
      </p>

      <Field label="Position" required error={errors.position?.message}>
        <IconInput icon={<Briefcase className="w-3.5 h-3.5" />} error={!!errors.position}>
          <select {...register("position")} className={selectCls(!!errors.position)}>
            <option value="">Select a position</option>
            <option value="Sales">Sales — Sell parts &amp; create invoices</option>
            <option value="Service">Service — Handle appointments</option>
            <option value="Manager">Manager — Sales + reports access</option>
          </select>
        </IconInput>
      </Field>

      {/* ── Change Password (optional) ── */}
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-100 mb-4 mt-5">
        Change Password
        <span className="ml-1.5 normal-case font-normal text-zinc-400">(leave blank to keep existing)</span>
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <Field label="New Password" error={errors.password?.message}>
          <IconInput icon={<Lock className="w-3.5 h-3.5" />} error={!!errors.password}
            suffix={
              <button type="button" onClick={() => setShowPw(!showPw)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            }
          >
            <input
              {...register("password")}
              type={showPw ? "text" : "password"}
              placeholder="Leave blank to keep current"
              className={inputCls(!!errors.password)}
            />
          </IconInput>
        </Field>
        <Field label="Confirm New Password" error={errors.confirm?.message}>
          <IconInput icon={<Lock className="w-3.5 h-3.5" />} error={!!errors.confirm}
            suffix={
              <button type="button" onClick={() => setShowCpw(!showCpw)} className="text-zinc-400 hover:text-zinc-600 transition-colors">
                {showCpw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            }
          >
            <input
              {...register("confirm")}
              type={showCpw ? "text" : "password"}
              placeholder="Re-enter new password"
              className={inputCls(!!errors.confirm)}
            />
          </IconInput>
        </Field>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-2.5 pt-2">
        <Button type="button" variant="outline" onClick={onSuccess} className="w-full sm:w-auto">
          Cancel
        </Button>
        <Button type="submit" loading={isPending} className="w-full sm:w-auto">
          Save Changes
        </Button>
      </div>
    </form>
  );
}

/* ── Helpers ── */
function Field({ label, required, error, children }: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1 mb-0">
      <label className="text-[11px] font-medium text-zinc-600">
        {label}{required && <span className="text-orange-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-[10px] text-red-500 mt-0.5">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  );
}

function IconInput({ icon, suffix, error, children }: {
  icon: React.ReactNode; suffix?: React.ReactNode; error?: boolean; children: React.ReactNode;
}) {
  return (
    <div className={`flex items-center gap-2 px-3 rounded-lg border-[1.5px] transition-all bg-zinc-50 focus-within:bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/10 ${error ? "border-red-300 bg-red-50/30" : "border-zinc-200"}`}>
      <span className="text-zinc-400 flex-shrink-0">{icon}</span>
      <div className="flex-1">{children}</div>
      {suffix && <span className="flex-shrink-0">{suffix}</span>}
    </div>
  );
}

const inputCls = (err: boolean) =>
  `w-full py-2.5 bg-transparent text-[13px] text-zinc-900 placeholder:text-zinc-400 outline-none ${err ? "placeholder:text-red-300" : ""}`;

const selectCls = (err: boolean) =>
  `w-full py-2.5 bg-transparent text-[13px] text-zinc-900 outline-none appearance-none cursor-pointer ${err ? "text-red-400" : ""}`;
