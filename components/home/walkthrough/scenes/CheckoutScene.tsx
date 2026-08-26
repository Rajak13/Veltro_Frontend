"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Gift, Sparkles, ArrowRight, ShieldCheck, Receipt, RefreshCw, Zap, Download } from "lucide-react";
import { DEMO_DATA } from "../walkthrough.config";
import Link from "next/link";

interface CheckoutSceneProps {
  onActionClick: () => void;
  onResetDemo: () => void;
}

export default function CheckoutScene({ onActionClick, onResetDemo }: CheckoutSceneProps) {
  const { parts, booking, checkout, vehicle } = DEMO_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col justify-between py-1 text-zinc-900"
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-3.5 border-b border-zinc-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border border-emerald-200/60">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Order &amp; Booking Confirmed
            </span>
            <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 border border-orange-200/60">
              <Gift className="w-3.5 h-3.5 text-orange-500" />
              10% Loyalty Reward Applied
            </span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-zinc-900 mt-1">Official Sales Invoice &amp; Digital Log</h2>
        </div>

        <button
          onClick={onResetDemo}
          className="text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-200 bg-white cursor-pointer transition-colors shadow-2xs hover:bg-zinc-50"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Replay Demo</span>
        </button>
      </div>

      {/* ── Real Veltro Tax Invoice Breakdown ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 my-auto py-2">
        {/* Left: Itemized Bill (CustomerInvoiceViewModal structure) */}
        <div className="md:col-span-7 bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-zinc-400" />
                <span>TAX INVOICE #VLT-2026-8819</span>
              </div>
              <span className="text-zinc-500 font-mono">Status: Paid (Khalti)</span>
            </div>

            <div className="space-y-2.5">
              {/* Part Item */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                <div>
                  <div className="font-bold text-zinc-900 text-sm">{parts.selected.name}</div>
                  <div className="text-[11px] text-zinc-400 font-mono">1× OEM Honda Genuine Part · In Stock</div>
                </div>
                <div className="font-bold text-zinc-900 font-mono text-sm">Rs. {parts.selected.price.toLocaleString()}</div>
              </div>

              {/* Service Item */}
              <div className="flex items-center justify-between text-xs pb-2 border-b border-zinc-100">
                <div>
                  <div className="font-bold text-zinc-900 text-sm">{booking.facility} — Fitting</div>
                  <div className="text-[11px] text-zinc-400 font-mono">{booking.displayDate} @ {booking.time}</div>
                </div>
                <div className="font-bold text-zinc-900 font-mono text-sm">Rs. {booking.laborCost.toLocaleString()}</div>
              </div>

              {/* Subtotal */}
              <div className="flex items-center justify-between text-xs font-medium text-zinc-500 pt-1">
                <span>Subtotal</span>
                <span className="font-mono font-semibold">Rs. {checkout.subtotal.toLocaleString()}</span>
              </div>

              {/* 10% Loyalty Discount Row */}
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.25 }}
                className="flex items-center justify-between text-xs font-bold text-orange-600 bg-orange-50 px-3.5 py-2.5 rounded-xl border border-orange-200/80 shadow-2xs"
              >
                <span className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-orange-500" />
                  10% Loyalty Auto-Discount (&gt; Rs. 5,000 Order)
                </span>
                <span className="font-mono text-sm">- Rs. {checkout.loyaltyDiscount.toLocaleString()}</span>
              </motion.div>
            </div>
          </div>

          {/* Final Total */}
          <div className="pt-3 mt-3 border-t border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-xs text-zinc-400 font-medium block">Final Amount Paid</span>
              <span className="text-2xl font-black text-zinc-900 font-mono">Rs. {checkout.finalTotal.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                You Saved Rs. 550
              </span>
            </div>
          </div>
        </div>

        {/* Right: Real Veltro Service Record / Profile Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-5 shadow-lg shadow-orange-500/20 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-base font-bold">Service Record Auto-Saved</h3>
            <p className="text-xs text-orange-100 mt-2 leading-relaxed">
              This invoice, the brake pad replacement record, and warranty certificate are permanently logged in your Veltro Customer History.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-white/20">
            <Link
              href="/register"
              id="btn-checkout-action"
              className="w-full bg-white hover:bg-orange-50 text-orange-600 text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>Get Started Free with Veltro</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2.5 border-t border-zinc-100 font-mono">
        <span>INVOICE LOGGED TO {vehicle.vin} SERVICE PASSPORT</span>
        <span>STEP 4 OF 4 • COMPLETE</span>
      </div>
    </motion.div>
  );
}
