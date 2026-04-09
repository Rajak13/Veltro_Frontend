"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Cog, Mail, Lock, Eye, EyeOff,
  Brain, CalendarCheck, History, Gift, ShieldCheck, Bell, Percent,
} from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    showToast("Welcome back! Redirecting to your dashboard…");
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

      {/* ════ LEFT — form ════ */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-[26rem]">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2.5 mb-10">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <Cog className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-semibold text-zinc-900">Veltro</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900 mb-1.5">Welcome back</h1>
            <p className="text-sm text-zinc-500">Sign in to your Veltro account</p>
          </div>

          {/* Card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-7 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-6 right-6 h-[3px] bg-orange-500 rounded-b-full" />

            <form onSubmit={handleSubmit} className="mt-2">
              {/* Email */}
              <div className="relative mb-4">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
              </div>

              {/* Password */}
              <div className="relative mb-5">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  required
                  className="w-full pl-10 pr-11 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-500/10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors p-0.5">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-zinc-300 accent-orange-500 cursor-pointer" />
                  <span className="text-xs text-zinc-500">Remember me</span>
                </label>
                <a href="#" className="text-xs text-orange-600 hover:text-orange-700 font-medium transition-colors">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-all hover:-translate-y-px hover:shadow-lg hover:shadow-orange-500/20 active:translate-y-0"
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-zinc-500 mt-6">
            New to Veltro?{" "}
            <Link href="/register" className="text-orange-600 hover:text-orange-700 font-semibold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>

      {/* ════ RIGHT — brand panel ════ */}
      <div className="hidden lg:flex lg:w-[55%] bg-zinc-900 flex-col justify-between p-10 relative overflow-hidden">

        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Orange glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #f97316 0%, transparent 70%)" }} />

        {/* Car illustration */}
        <div className="absolute bottom-0 left-0 opacity-[0.05] pointer-events-none">
          <svg width="520" height="340" viewBox="0 0 520 340" fill="none">
            <path d="M60 230 Q130 165 220 158 L340 152 Q410 152 445 185 L490 230 L490 275 L60 275 Z" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="155" cy="277" r="42" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="155" cy="277" r="22" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="155" cy="277" r="6"  stroke="white" strokeWidth="1"   fill="none"/>
            <circle cx="375" cy="277" r="42" stroke="white" strokeWidth="2" fill="none"/>
            <circle cx="375" cy="277" r="22" stroke="white" strokeWidth="1.5" fill="none"/>
            <circle cx="375" cy="277" r="6"  stroke="white" strokeWidth="1"   fill="none"/>
            <path d="M215 158 L238 95 L345 95 L378 158" stroke="white" strokeWidth="1.5" fill="none"/>
            <path d="M238 95 L248 158" stroke="white" strokeWidth="1" strokeDasharray="3 3"/>
            <path d="M345 95 L335 158" stroke="white" strokeWidth="1" strokeDasharray="3 3"/>
            <path d="M60 230 L490 230" stroke="white" strokeWidth="1" strokeDasharray="5 5"/>
            <rect x="430" y="192" width="36" height="22" rx="4" stroke="white" strokeWidth="1.2" fill="none"/>
            <path d="M445 192 L445 185" stroke="white" strokeWidth="1"/>
            <path d="M455 192 L455 185" stroke="white" strokeWidth="1"/>
            <rect x="62" y="200" width="18" height="14" rx="3" stroke="white" strokeWidth="1" fill="none"/>
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
            <span className="text-xs text-orange-400 font-medium">Vehicle Management Platform</span>
          </div>

          <h2 className="text-3xl font-semibold text-white leading-tight mb-4">
            Your vehicle parts,<br />one dashboard away.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed mb-10">
            Track purchases, book service appointments, get AI-powered part failure predictions, and earn loyalty rewards — all in one place.
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap gap-2 mb-10">
            {[
              { icon: Brain,         label: "AI Predictions" },
              { icon: CalendarCheck, label: "Book Service" },
              { icon: History,       label: "Full History" },
              { icon: Gift,          label: "Loyalty Rewards" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-xs text-zinc-300">
                <Icon className="w-3 h-3 text-zinc-400" />
                {label}
              </span>
            ))}
          </div>

          {/* Benefit rows */}
          <div className="space-y-3">
            {[
              { icon: ShieldCheck, title: "Complete Purchase History",  sub: "Every transaction, always accessible" },
              { icon: Bell,        title: "Smart Notifications",         sub: "AI alerts before parts fail, service reminders" },
              { icon: Percent,     title: "10% Auto-Discount",           sub: "Applied instantly on orders over Rs. 5,000" },
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
    </div>
  );
}
