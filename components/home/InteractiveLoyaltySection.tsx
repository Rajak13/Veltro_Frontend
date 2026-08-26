"use client";

import { useState } from "react";
import { Gift, ShieldCheck, Percent, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function InteractiveLoyaltySection() {
  const [cartAmount, setCartAmount] = useState<number>(6500);

  const qualifies = cartAmount >= 5000;
  const discount = qualifies ? Math.round(cartAmount * 0.1) : 0;
  const finalAmount = cartAmount - discount;

  return (
    <section className="relative py-24 overflow-hidden z-10">
      <div className="max-w-5xl mx-auto px-6">
        {/* ── Restored Original Vibrant Brand Orange Container ── */}
        <div className="bg-orange-500 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl shadow-orange-500/25">
          {/* Original Geometric Ring Accents */}
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full border-[22px] border-white/10 pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full border-[18px] border-white/10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Loyalty Explanation */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 text-white text-xs font-mono font-semibold mb-4">
                <Gift className="w-3.5 h-3.5" />
                <span>TRANSPARENT LOYALTY REWARDS</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-3">
                Spend Rs. 5,000+, automatically save 10%.
              </h2>

              <p className="text-sm text-white/90 leading-relaxed max-w-lg mb-6 font-light">
                No coupons, no hidden codes, no expiring points. Any part order or service booking crossing Rs. 5,000 automatically applies a 10% instant rebate at checkout.
              </p>

              <div className="flex flex-wrap gap-3 text-xs font-mono">
                <div className="px-3.5 py-2 rounded-xl bg-white/15 border border-white/20">
                  <span className="text-white/80 block text-[10px]">QUALIFYING ORDER</span>
                  <span className="text-white font-bold">&gt; Rs. 5,000</span>
                </div>
                <div className="px-3.5 py-2 rounded-xl bg-white/15 border border-white/20">
                  <span className="text-white/80 block text-[10px]">INSTANT REBATE</span>
                  <span className="text-white font-bold">10% Auto-Applied</span>
                </div>
              </div>
            </div>

            {/* Right Column: Clean White Interactive Savings Card */}
            <div className="lg:col-span-5 bg-white text-zinc-900 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-100 text-xs font-mono">
                <span className="text-zinc-500 font-semibold">SAVINGS CALCULATOR</span>
                <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${qualifies ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-zinc-100 text-zinc-500"}`}>
                  {qualifies ? "10% REBATE ACTIVE" : "UNDER THRESHOLD"}
                </span>
              </div>

              {/* Slider Input */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                  <span className="text-zinc-500">Order Subtotal:</span>
                  <span className="text-base font-bold text-zinc-950 font-mono">Rs. {cartAmount.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={2000}
                  max={25000}
                  step={500}
                  value={cartAmount}
                  onChange={(e) => setCartAmount(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-100 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-zinc-400 mt-1">
                  <span>Rs. 2k</span>
                  <span className="text-orange-600 font-bold">Rs. 5k (Threshold)</span>
                  <span>Rs. 25k</span>
                </div>
              </div>

              {/* Real-Time Breakdown Card */}
              <div className="space-y-1.5 text-xs font-mono bg-zinc-50 p-3.5 rounded-xl border border-zinc-100 mb-4">
                <div className="flex justify-between text-zinc-500">
                  <span>Gross Total:</span>
                  <span>Rs. {cartAmount.toLocaleString()}</span>
                </div>

                <div className={`flex justify-between font-bold ${qualifies ? "text-emerald-600" : "text-zinc-400"}`}>
                  <span className="flex items-center gap-1">
                    <Percent className="w-3 h-3" /> 10% Loyalty Savings:
                  </span>
                  <span>{qualifies ? `- Rs. ${discount.toLocaleString()}` : "Rs. 0"}</span>
                </div>

                <div className="pt-2 border-t border-zinc-200 flex justify-between items-baseline">
                  <span className="text-zinc-800 font-bold">Final Amount:</span>
                  <span className="text-xl font-bold text-orange-600">Rs. {finalAmount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500">
                <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Auto-Applied
                </span>
                <Link href="/register" className="text-orange-600 hover:text-orange-700 font-bold inline-flex items-center gap-1">
                  <span>Order Now →</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
