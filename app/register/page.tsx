"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cog, Mail, Lock, Eye, EyeOff, User, Phone,
  Brain, Gift, CalendarCheck, PackageSearch,
} from "lucide-react";

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

export default function RegisterPage() {
  const [showPw, setShowPw]     = useState(false);
  const [showCpw, setShowCpw]   = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [toast, setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const strength = getStrength(password);
  const meta     = strengthMeta[strength];

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const pw  = (form.elements.namedItem("password") as HTMLInputElement).value;
    const cpw = (form.elements.namedItem("confirm")  as HTMLInputElement).value;
    if (pw !== cpw) { showToast("Passwords do not match.", "error"); return; }
    if (pw.length < 6) { showToast("Password must be at least 6 characters.", "error"); return; }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    showToast("Account created! Please sign in.");
  }

  return (
    <div className="min-h-screen flex bg-[#fafafa]" style={{ fontFamily: "var(--font-inter, 'Inter', sans-serif)" }}>

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border
          ${toast.type === "success" ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-700"}`}>
          <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`} />
          {toast.msg}
        </div>
      )}

      {/* ════ LEFT — brand panel ════ */}
      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 flex-col justify-between p-10 relative overflow-hidden">

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Orange glow */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

        {/* Parts shelf illustration */}
        <div className="absolute bottom-0 right-0 opacity-[0.05] pointer-events-none">
          <svg width="500" height="320" viewBox="0 0 500 320" fill="none">
            {/* Shelves */}
            <rect x="20"  y="55"  width="460" height="7" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
            <rect x="20"  y="155" width="460" height="7" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
            <rect x="20"  y="255" width="460" height="7" rx="2" stroke="white" strokeWidth="1.5" fill="none"/>
            {/* Vertical supports */}
            <rect x="20"  y="55" width="5" height="207" rx="1" stroke="white" strokeWidth="1" fill="none"/>
            <rect x="475" y="55" width="5" height="207" rx="1" stroke="white" strokeWidth="1" fill="none"/>
            <rect x="247" y="55" width="5" height="207" rx="1" stroke="white" strokeWidth="1" fill="none"/>
            {/* Shelf 1 items */}
            <rect x="45"  y="22" width="32" height="33" rx="4" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="90"  y="15" width="24" height="40" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="148" cy="38" r="16" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="148" cy="38" r="8"  stroke="white" strokeWidth="1"   fill="none"/>
            <rect x="175" y="28" width="38" height="27" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="225" y="18" width="18" height="37" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            {/* Shelf 1 right bay */}
            <rect x="270" y="20" width="30" height="35" rx="4" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="330" cy="36" r="18" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="330" cy="36" r="9"  stroke="white" strokeWidth="1"   fill="none"/>
            <rect x="360" y="25" width="40" height="30" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="415" y="15" width="22" height="40" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            {/* Shelf 2 items */}
            <rect x="45"  y="115" width="44" height="40" rx="4" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="125" cy="133" r="20" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="125" cy="133" r="10" stroke="white" strokeWidth="1"   fill="none"/>
            <rect x="158" y="112" width="32" height="43" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="205" y="120" width="34" height="28" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            {/* Shelf 2 right bay */}
            <rect x="270" y="118" width="28" height="37" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="312" y="110" width="50" height="45" rx="4" stroke="white" strokeWidth="1.2" fill="none"/>
            <rect x="376" y="122" width="26" height="30" rx="3" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="435" cy="133" r="16" stroke="white" strokeWidth="1.2" fill="none"/>
            <circle cx="435" cy="133" r="8"  stroke="white" strokeWidth="1"   fill="none"/>
            {/* Price tags */}
            <rect x="50"  y="10" width="20" height="10" rx="2" stroke="white" strokeWidth="0.8" fill="none"/>
            <rect x="165" y="16" width="20" height="10" rx="2" stroke="white" strokeWidth="0.8" fill="none"/>
            <rect x="320" y="13" width="20" height="10" rx="2" stroke="white" strokeWidth="0.8" fill="none"/>
          </svg>
        </div>

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Cog className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-white">Veltro</span>
          </Link>
        </div>

        {/* Middle content */}
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

          {/* Benefit rows */}
          <div className="space-y-3 mb-8">
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

          {/* Trust row */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/40 border border-zinc-700/40">
            <div className="flex -space-x-2">
              {["RK", "AS", "PM", "BS"].map((l) => (
                <div key={l} className="w-7 h-7 rounded-full bg-zinc-700 border-2 border-zinc-900 flex items-center justify-center text-[9px] font-semibold text-zinc-300">
                  {l}
                </div>
              ))}
            </div>
            <div>
              <div className="text-xs font-semibold text-white">830+ customers</div>
              <div className="text-xs text-zinc-500">trust Veltro for their vehicles</div>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-xs text-zinc-600">© 2026 Veltro. All rights reserved.</p>
        </div>
      </div>

      {/* ════ RIGHT — form ════ */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-10 overflow-y-auto">
        <div className="w-full max-w-[26rem] py-8">

          {/* Mobile logo */}
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

          {/* Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-7 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-6 right-6 h-[3px] bg-orange-500 rounded-b-full" />

            <form onSubmit={handleSubmit} className="mt-2">
              {/* Name row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {[
                  { id: "firstName", placeholder: "First name" },
                  { id: "lastName",  placeholder: "Last name" },
                ].map(({ id, placeholder }) => (
                  <div key={id} className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                    <input
                      name={id}
                      type="text"
                      placeholder={placeholder}
                      required
                      className="w-full pl-10 pr-3 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                    />
                  </div>
                ))}
              </div>

              {/* Email */}
              <div className="relative mb-4">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  name="email"
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              {/* Phone */}
              <div className="relative mb-4">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              {/* Password */}
              <div className="relative mb-3">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Create password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
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
                <input
                  name="confirm"
                  type={showCpw ? "text" : "password"}
                  placeholder="Confirm password"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/20 active:translate-y-0"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
