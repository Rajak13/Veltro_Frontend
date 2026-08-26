"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Gift, Sparkles, ArrowRight, Receipt, RefreshCw, Zap } from "lucide-react";
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
      className="h-full flex flex-col justify-between py-1 text-zinc-900 overflow-y-auto"
    >
      {/* ── Top Header ── */}
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 flex-shrink-0">
        <div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200/60">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Order Confirmed
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-orange-200/60">
              <Gift className="w-3 h-3 text-orange-500" />
              10% Loyalty
            </span>
          </div>
          <h2 className="text-xs sm:text-base font-bold text-zinc-900 mt-0.5 truncate">Tax Invoice &amp; Digital Log</h2>
        </div>

        <button
          onClick={onResetDemo}
          className="text-[11px] sm:text-xs text-zinc-500 hover:text-zinc-800 flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-zinc-200 bg-white cursor-pointer transition-colors shadow-2xs hover:bg-zinc-50"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Replay</span>
        </button>
      </div>

      {/* ── Real Veltro Tax Invoice Breakdown ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 my-auto py-1 sm:py-2">
        {/* Left: Itemized Bill */}
        <div className="md:col-span-7 bg-white border border-zinc-200/90 rounded-2xl p-3.5 sm:p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[10px] sm:text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 sm:mb-3">
              <div className="flex items-center gap-1.5">
                <Receipt className="w-3.5 h-3.5 text-zinc-400" />
                <span>INVOICE #VLT-2026-8819</span>
              </div>
              <span className="text-zinc-500 font-mono">Paid (Khalti)</span>
            </div>

            <div className="space-y-2">
              {/* Part Item */}
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-100">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-zinc-900 text-xs sm:text-sm truncate">{parts.selected.name}</div>
                  <div className="text-[10px] text-zinc-400 font-mono">1× OEM Honda Genuine Part</div>
                </div>
                <div className="font-bold text-zinc-900 font-mono text-xs sm:text-sm ml-2">Rs. {parts.selected.price.toLocaleString()}</div>
              </div>

              {/* Service Item */}
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-zinc-100">
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-zinc-900 text-xs sm:text-sm truncate">{booking.facility} Fitting</div>
                  <div className="text-[10px] text-zinc-400 font-mono">{booking.displayDate}</div>
                </div>
                <div className="font-bold text-zinc-900 font-mono text-xs sm:text-sm ml-2">Rs. {booking.laborCost.toLocaleString()}</div>
              </div>

              {/* 10% Loyalty Discount Row */}
              <motion.div
                initial={{ scale: 0.98, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.25 }}
                className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-orange-600 bg-orange-50 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-orange-200/80 shadow-2xs"
              >
                <span className="flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-orange-500" />
                  10% Loyalty Auto-Discount
                </span>
                <span className="font-mono text-xs sm:text-sm">- Rs. {checkout.loyaltyDiscount.toLocaleString()}</span>
              </motion.div>
            </div>
          </div>

          {/* Final Total */}
          <div className="pt-2.5 mt-2.5 border-t border-zinc-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 font-medium block">Final Paid</span>
              <span className="text-lg sm:text-2xl font-black text-zinc-900 font-mono">Rs. {checkout.finalTotal.toLocaleString()}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] sm:text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                <Zap className="w-3 h-3 text-emerald-600" />
                Saved Rs. 550
              </span>
            </div>
          </div>
        </div>

        {/* Right: Service Record Card */}
        <div className="md:col-span-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-3.5 sm:p-5 shadow-lg shadow-orange-500/20 flex flex-col justify-between">
          <div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/20 flex items-center justify-center mb-2 sm:mb-3">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <h3 className="text-sm sm:text-base font-bold">Service Record Auto-Saved</h3>
            <p className="text-[11px] sm:text-xs text-orange-100 mt-1 sm:mt-2 leading-relaxed">
              This invoice and warranty certificate are permanently logged in your Veltro History.
            </p>
          </div>

          <div className="pt-3 mt-3 border-t border-white/20">
            <Link
              href="/register"
              id="btn-checkout-action"
              className="w-full bg-white hover:bg-orange-50 text-orange-600 text-xs font-bold py-2.5 sm:py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-zinc-100 font-mono">
        <span>LOGGED TO {vehicle.vin}</span>
        <span>STEP 4 OF 4</span>
      </div>
    </motion.div>
  );
}
