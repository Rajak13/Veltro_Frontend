"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Cog, Mail, Lock, Eye, EyeOff, User, Phone,
  Brain, Gift, CalendarCheck, PackageSearch, ShieldCheck, ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import { sendOtp, verifyOtp, register } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

// ── Password strength helper ──────────────────────────────────────────────────
function getStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  let s = 0;
  if (pw.length >= 6) s++;
  if (pw.length >= 10) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw) && /[^A-Za-z0-9]/.test(pw)) s++;
  return s as 0 | 1 | 2 | 3 | 4;
}
const strengthMeta = [
  { label: "6+ characters with letters, numbers & symbols", color: "text-zinc-400", bars: "bg-zinc-200" },
  { label: "Weak — add more characters",                    color: "text-red-500",   bars: "bg-red-400" },
  { label: "Fair — try adding numbers or symbols",          color: "text-amber-600", bars: "bg-amber-400" },
  { label: "Good — almost there",                           color: "text-sky-600",   bars: "bg-sky-400" },
  { label: "Strong — looks great!",                         color: "text-green-600", bars: "bg-green-500" },
];

// ── Step type ─────────────────────────────────────────────────────────────────
type Step = "form" | "otp" | "done";

export default function RegisterPage() {
  // ── Step 1 form state ──────────────────────────────────────────────────────
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [password, setPassword] = useState("");

  // ── Shared state ───────────────────────────────────────────────────────────
  const [step, setStep]       = useState<Step>("form");
  const [loading, setLoading] = useState(false);

  // Captured from step 1, used in step 3
  const formDataRef = useRef<{
    firstName: string; lastName: string; email: string;
    phone: string; password: string;
  } | null>(null);

  // ── Step 2 OTP state ───────────────────────────────────────────────────────
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [resendCooldown, setResendCooldown] = useState(0);

  const { setAuth } = useAuthStore();
  const router = useRouter();

  const strength = getStrength(password);
  const meta     = strengthMeta[strength];

  // ── Step 1: validate form and send OTP ────────────────────────────────────
  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const pw  = (form.elements.namedItem("password") as HTMLInputElement).value;
    const cpw = (form.elements.namedItem("confirm")  as HTMLInputElement).value;

    if (pw !== cpw)   { toast.error("Passwords do not match.");                  return; }
    if (pw.length < 6){ toast.error("Password must be at least 6 characters.");  return; }

    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value.trim();
    const lastName  = (form.elements.namedItem("lastName")  as HTMLInputElement).value.trim();
    const email     = (form.elements.namedItem("email")     as HTMLInputElement).value.trim();
    const phone     = (form.elements.namedItem("phone")     as HTMLInputElement).value.trim();

    formDataRef.current = { firstName, lastName, email, phone, password: pw };

    setLoading(true);
    try {
      await sendOtp(email);
      toast.success(`Verification code sent to ${email}`);
      setStep("otp");
      startResendCooldown();
    } catch {
      toast.error("Failed to send verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: verify OTP ────────────────────────────────────────────────────
  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const otp = otpDigits.join("");
    if (otp.length < 6) { toast.error("Please enter the full 6-digit code."); return; }

    setLoading(true);
    try {
      await verifyOtp(formDataRef.current!.email, otp);
      // OTP verified — now create the account
      const { firstName, lastName, email, phone, password: pw } = formDataRef.current!;
      const data = await register({
        fullName: `${firstName} ${lastName}`.trim(),
        email, password: pw, phone, address: "",
      });
      setAuth(
        { id: 0, name: data.user.name, email: data.user.email,
          role: data.user.role as "Admin" | "Staff" | "Customer",
          createdAt: new Date().toISOString() },
        data.token,
      );
      setStep("done");
      toast.success("Account created! Welcome to Veltro.");
      setTimeout(() => router.push("/customer/dashboard"), 1200);
    } catch {
      toast.error("Invalid or expired code. Please try again.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────────────────
  function startResendCooldown() {
    setResendCooldown(60);
    const id = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
  }

  async function handleResend() {
    if (resendCooldown > 0 || !formDataRef.current) return;
    setLoading(true);
    try {
      await sendOtp(formDataRef.current.email);
      toast.success("New code sent.");
      setOtpDigits(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
      startResendCooldown();
    } catch {
      toast.error("Failed to resend code.");
    } finally {
      setLoading(false);
    }
  }

  // ── OTP digit input handler ───────────────────────────────────────────────
  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = digit;
    setOtpDigits(next);
    if (digit && index < 5) otpRefs.current[index + 1]?.focus();
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setOtpDigits(pasted.split(""));
      otpRefs.current[5]?.focus();
    }
  }

  // ── Shared left panel ─────────────────────────────────────────────────────
  const LeftPanel = (
    <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 flex-col justify-between p-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />
      <div className="relative z-10">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
            <Cog className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-semibold text-white">Veltro</span>
        </Link>
      </div>
      <div className="relative z-10 max-w-md">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="text-xs text-orange-400 font-medium">Free to get started</span>
        </div>
        <h2 className="text-3xl font-semibold text-white leading-tight mb-4">
          Join thousands of<br />vehicle owners.
        </h2>
        <p className="text-sm text-zinc-400 leading-relaxed mb-10">
          Create your free account to browse parts, book appointments, receive AI maintenance alerts, and earn loyalty discounts.
        </p>
        <div className="space-y-3">
          {[
            { icon: Brain,         title: "AI Part Failure Prediction",  sub: "Get alerts before parts break down" },
            { icon: Gift,          title: "10% Loyalty Discount",        sub: "Auto-applied on purchases over Rs. 5,000" },
            { icon: CalendarCheck, title: "Easy Appointment Booking",    sub: "Schedule services in just a few clicks" },
            { icon: PackageSearch, title: "Request Unavailable Parts",   sub: "Can't find a part? Submit a request" },
          ].map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/60 border border-zinc-700/60 hover:bg-zinc-800 transition-colors">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-orange-500/10 border border-orange-500/15">
                <Icon className="w-4 h-4 text-orange-400" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">{title}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-xs text-zinc-600">© 2026 Veltro. All rights reserved.</p>
      </div>
    </div>
  );

  // ── Step 1: Registration form ─────────────────────────────────────────────
  if (step === "form") return (
    <div className="min-h-screen flex bg-[#fafafa]" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
      {LeftPanel}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <div className="w-full max-w-[26rem] py-8">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Cog className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-zinc-900">Veltro</span>
          </div>
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-zinc-900 mb-1.5">Create your account</h1>
            <p className="text-sm text-zinc-500">Start managing your vehicle&apos;s health today</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-2xl p-7 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-6 right-6 h-[3px] bg-orange-500 rounded-b-full" />
            <form onSubmit={handleFormSubmit} noValidate className="mt-2">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[{ id: "firstName", placeholder: "First name" }, { id: "lastName", placeholder: "Last name" }].map(({ id, placeholder }) => (
                  <div key={id} className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input name={id} type="text" placeholder={placeholder} required
                      className="w-full pl-10 pr-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10" />
                  </div>
                ))}
              </div>
              {/* Email */}
              <div className="relative mb-4">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input name="email" type="email" placeholder="Email address" required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10" />
              </div>
              {/* Phone */}
              <div className="relative mb-4">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input name="phone" type="tel" placeholder="Phone number" required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10" />
              </div>
              {/* Password */}
              <div className="relative mb-3">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input name="password" type={showPw ? "text" : "password"} placeholder="Create password"
                  required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-0.5">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Strength meter */}
              <div className="mb-4">
                <div className="flex gap-1.5 mb-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`h-[3px] flex-1 rounded-full transition-colors duration-200 ${i <= strength ? meta.bars : "bg-zinc-100"}`} />
                  ))}
                </div>
                <p className={`text-xs transition-colors ${meta.color}`}>{meta.label}</p>
              </div>
              {/* Confirm password */}
              <div className="relative mb-5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input name="confirm" type={showCpw ? "text" : "password"} placeholder="Confirm password"
                  required minLength={6}
                  className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10" />
                <button type="button" onClick={() => setShowCpw(!showCpw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-0.5">
                  {showCpw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Terms */}
              <label className="flex items-start gap-2.5 mb-6 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-zinc-300 accent-orange-500 cursor-pointer flex-shrink-0" />
                <span className="text-xs text-zinc-500 leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-orange-600 hover:text-orange-700 font-medium">Privacy Policy</a>
                </span>
              </label>
              <button type="submit" disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/20 active:translate-y-0">
                {loading ? "Sending verification code…" : "Continue"}
              </button>
            </form>
          </div>
          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );

  // ── Step 2: OTP verification ──────────────────────────────────────────────
  if (step === "otp") return (
    <div className="min-h-screen flex bg-[#fafafa]" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
      {LeftPanel}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[26rem]">
          <button onClick={() => setStep("form")}
            className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors mb-8">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <div className="mb-8">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6 text-orange-500" />
            </div>
            <h1 className="text-2xl font-semibold text-zinc-900 mb-1.5">Check your email</h1>
            <p className="text-sm text-zinc-500">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-zinc-800">{formDataRef.current?.email}</span>
            </p>
          </div>

          <div className="bg-white border border-zinc-200 rounded-2xl p-7 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-6 right-6 h-[3px] bg-orange-500 rounded-b-full" />

            <form onSubmit={handleOtpSubmit} noValidate className="mt-2">
              {/* 6-digit OTP input */}
              <div className="flex gap-2.5 justify-center mb-6" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-11 h-14 text-center text-xl font-bold text-zinc-900 bg-zinc-50 border-2 border-zinc-200 rounded-xl outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10 caret-orange-500"
                  />
                ))}
              </div>

              <button type="submit" disabled={loading || otpDigits.join("").length < 6}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/20 active:translate-y-0 mb-4">
                {loading ? "Verifying…" : "Verify & Create Account"}
              </button>

              <p className="text-center text-xs text-zinc-400">
                Didn&apos;t receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-zinc-400">Resend in {resendCooldown}s</span>
                ) : (
                  <button type="button" onClick={handleResend}
                    className="text-orange-600 hover:text-orange-700 font-medium transition-colors">
                    Resend code
                  </button>
                )}
              </p>
            </form>
          </div>

          <p className="text-center text-xs text-zinc-400 mt-4">
            The code expires in 10 minutes.
          </p>
        </div>
      </div>
    </div>
  );

  // ── Step 3: Success screen (briefly shown before redirect) ────────────────
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-4">
          <ShieldCheck className="w-8 h-8 text-green-500" />
        </div>
        <h2 className="text-xl font-semibold text-zinc-900 mb-1">Account created!</h2>
        <p className="text-sm text-zinc-500">Redirecting to your dashboard…</p>
      </div>
    </div>
  );
}
