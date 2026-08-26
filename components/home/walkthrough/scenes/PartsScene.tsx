"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Check, Star, ShieldCheck, ArrowRight, Disc, Filter, Package, Clock } from "lucide-react";
import { DEMO_DATA } from "../walkthrough.config";

interface PartsSceneProps {
  onActionClick: () => void;
  isPartAdded?: boolean;
}

export default function PartsScene({ onActionClick, isPartAdded = true }: PartsSceneProps) {
  const { parts, vehicle } = DEMO_DATA;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col justify-between py-1 text-zinc-900"
    >
      {/* ── Real Veltro Parts Search Header ── */}
      <div>
        <div className="flex items-center justify-between gap-4 pb-3 border-b border-zinc-100">
          <div className="flex items-center gap-2.5 flex-1 max-w-xl bg-zinc-50 border border-zinc-200 rounded-xl px-3.5 py-2">
            <Search className="w-4 h-4 text-zinc-400" />
            <span className="text-xs text-zinc-800 font-medium truncate">
              Filtered for {vehicle.name} ({vehicle.vin})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1.5 rounded-xl items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              100% VIN Matched
            </span>
            <div className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-xs">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Cart ({isPartAdded ? "1" : "0"})</span>
            </div>
          </div>
        </div>

        {/* Real Part Category Filter Tabs */}
        <div className="flex items-center gap-2 pt-3 pb-1 overflow-x-auto">
          {["All Parts", "Brakes (AI Recommended)", "Engine & Filters", "Suspension", "Electrical"].map((c, i) => (
            <span
              key={c}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 transition-colors ${
                i === 1
                  ? "bg-orange-500 text-white shadow-xs"
                  : "bg-zinc-100 text-zinc-600 border border-zinc-200/60"
              }`}
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ── Real Veltro Part Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-auto py-2">
        {/* Recommended Part Card (Highlighted) */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-white border-2 border-orange-500 shadow-md relative">
          <div className="absolute -top-2.5 right-5 bg-orange-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
            AI Matched OEM Part
          </div>

          <div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 shadow-2xs">
                <Disc className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] text-zinc-400 font-medium">(4.9 · 128 reviews)</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 mt-1">{parts.selected.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">{parts.selected.brand} · Part #{parts.selected.partNumber}</p>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between bg-zinc-50 p-3 rounded-xl border border-zinc-100">
              <div>
                <span className="text-lg font-black text-zinc-900 font-mono">Rs. {parts.selected.price.toLocaleString()}</span>
                <span className="text-xs text-emerald-600 font-semibold block mt-0.5">✓ In Stock (Kathmandu Hub)</span>
              </div>
              <span className="text-xs text-zinc-400 font-medium">OEM Guaranteed</span>
            </div>
          </div>

          <div className="pt-3.5 mt-3.5 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              <Check className="w-3.5 h-3.5 text-emerald-600" /> Compatible with {vehicle.vin}
            </span>

            <button
              onClick={onActionClick}
              id="btn-parts-action"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105"
            >
              {isPartAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <span>+ Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alternative Part Card */}
        <div className="flex flex-col justify-between p-5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 opacity-90">
          <div>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 text-zinc-500">
                <Filter className="w-7 h-7" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider">Routine Maintenance</span>
                <h3 className="text-sm font-bold text-zinc-800 mt-0.5">{parts.alternative.name}</h3>
                <p className="text-xs text-zinc-400 mt-0.5 font-mono">Part #{parts.alternative.partNumber}</p>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between bg-white p-3 rounded-xl border border-zinc-100">
              <div>
                <span className="text-base font-bold text-zinc-800 font-mono">Rs. {parts.alternative.price.toLocaleString()}</span>
                <span className="text-xs text-zinc-500 block mt-0.5">{parts.alternative.stockText}</span>
              </div>
              <span className="text-xs text-zinc-400">Scheduled Service</span>
            </div>
          </div>

          <div className="pt-3.5 mt-3.5 border-t border-zinc-200/60 flex items-center justify-between">
            <span className="text-xs text-zinc-400">Regular replacement item</span>
            <span className="text-xs text-zinc-500 font-medium">In Catalog</span>
          </div>
        </div>
      </div>

      {/* ── Real Veltro Bottom Cart Drawer ── */}
      <div className="bg-zinc-900 text-white rounded-2xl p-3.5 px-5 flex items-center justify-between shadow-xl shadow-zinc-900/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">1 Part in Cart: {parts.selected.name}</div>
            <div className="text-[11px] text-zinc-400">Auto-forwarded to chosen garage for fitting</div>
          </div>
        </div>

        <button
          onClick={onActionClick}
          className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs hover:scale-105"
        >
          <span>Rs. {parts.selected.price.toLocaleString()} → Book Garage Installation</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
