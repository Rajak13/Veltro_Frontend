"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { User, Mail, Phone, Lock, Briefcase, Eye, EyeOff, AlertCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useCreateStaff } from "@/hooks/useStaff";

const schema = z
  .object({
    firstName:  z.string().min(1, "First name is required"),
    lastName:   z.string().min(1, "Last name is required"),
    email:      z.string().email("Enter a valid email address"),
    phone:      z.string().min(10, "Enter a valid phone number"),
    position:   z.string().min(1, "Please select a position"),
    password:   z.string().min(6, "Password must be at least 6 characters"),
    confirm:    z.string().min(1, "Please confirm the password"),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

type FormValues = z.infer<typeof schema>;

interface Props {
  onSuccess: () => void;
}

export default function CreateStaffForm({ onSuccess }: Props) {
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const { mutateAsync, isPending } = useCreateStaff();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit(values: FormValues) {
    await mutateAsync({
      fullName: `${values.firstName} ${values.lastName}`.trim(),
      email:    values.email,
      password: values.password,
      position: values.position,
    });
    reset();
    onSuccess();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-0">

      {/* ── Personal Information ── */}
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-100 mb-4">
        Personal Information
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
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

      <div className="grid grid-cols-2 gap-3 mb-4">
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
        <Field label="Phone Number" required error={errors.phone?.message}>
          <IconInput icon={<Phone className="w-3.5 h-3.5" />} error={!!errors.phone}>
            <input
              {...register("phone")}
              type="tel"
              placeholder="98XXXXXXXX"
              className={inputCls(!!errors.phone)}
            />
          </IconInput>
        </Field>
      </div>

      {/* ── Role ── */}
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-100 mb-4 mt-5">
        Role & Access
      </p>

      <Field label="Position" required error={errors.position?.message} hint="Determines which features this staff member can access.">
        <IconInput icon={<Briefcase className="w-3.5 h-3.5" />} error={!!errors.position}>
          <select {...register("position")} className={selectCls(!!errors.position)}>
            <option value="">Select a position</option>
            <option value="Sales">Sales — Sell parts &amp; create invoices</option>
            <option value="Service">Service — Handle appointments</option>
            <option value="Manager">Manager — Sales + reports access</option>
          </select>
        </IconInput>
      </Field>

      {/* ── Credentials ── */}
      <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest pb-2 border-b border-zinc-100 mb-4 mt-5">
        Account Credentials
      </p>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Field label="Password" required error={errors.password?.message}>
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
              placeholder="Min. 6 characters"
              className={inputCls(!!errors.password)}
            />
          </IconInput>
        </Field>
        <Field label="Confirm Password" required error={errors.confirm?.message}>
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
              placeholder="Re-enter password"
              className={inputCls(!!errors.confirm)}
            />
          </IconInput>
        </Field>
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-2.5 pt-2">
        <Button type="button" variant="outline" onClick={() => { reset(); onSuccess(); }}>
          Cancel
        </Button>
        <Button type="submit" loading={isPending}>
          Add Staff Member
        </Button>
      </div>
    </form>
  );
}

/* ── Helpers ── */
function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
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
      {hint && !error && <p className="text-[10px] text-zinc-400">{hint}</p>}
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
