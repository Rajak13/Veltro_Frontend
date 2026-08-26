"use client";

import { motion } from "framer-motion";
import { Search, ShoppingCart, Check, Star, ShieldCheck, ArrowRight, Disc, Filter } from "lucide-react";
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
      className="h-full flex flex-col justify-between py-1 text-zinc-900 overflow-y-auto"
    >
      {/* ── Real Veltro Parts Search Header ── */}
      <div>
        <div className="flex items-center justify-between gap-2 sm:gap-4 pb-2.5 border-b border-zinc-100">
          <div className="flex items-center gap-2 flex-1 max-w-xl bg-zinc-50 border border-zinc-200 rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2">
            <Search className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
            <span className="text-[11px] sm:text-xs text-zinc-800 font-medium truncate">
              Filtered for {vehicle.name}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 bg-orange-500 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1.5 rounded-xl shadow-xs">
              <ShoppingCart className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Cart ({isPartAdded ? "1" : "0"})</span>
            </div>
          </div>
        </div>

        {/* Part Category Filter Tabs */}
        <div className="flex items-center gap-1.5 pt-2 pb-1 overflow-x-auto">
          {["All", "Brakes (AI Matched)", "Filters", "Suspension"].map((c, i) => (
            <span
              key={c}
              className={`px-2.5 sm:px-3.5 py-1 rounded-full text-[10px] sm:text-xs font-semibold flex-shrink-0 transition-colors ${
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 my-auto py-1 sm:py-2">
        {/* Recommended Part Card (Highlighted) */}
        <div className="flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl bg-white border-2 border-orange-500 shadow-md relative">
          <div className="absolute -top-2.5 right-4 sm:right-5 bg-orange-500 text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-2xs">
            AI Matched
          </div>

          <div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center flex-shrink-0 text-orange-600 shadow-2xs">
                <Disc className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-medium">(4.9 · 128)</span>
                </div>
                <h3 className="text-xs sm:text-sm font-bold text-zinc-900 mt-0.5 truncate">{parts.selected.name}</h3>
                <p className="text-[10px] text-zinc-400 font-mono">Part #{parts.selected.partNumber}</p>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between bg-zinc-50 p-2.5 rounded-xl border border-zinc-100">
              <div>
                <span className="text-base sm:text-lg font-black text-zinc-900 font-mono">Rs. {parts.selected.price.toLocaleString()}</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">✓ In Stock (Kathmandu)</span>
              </div>
              <span className="text-[10px] text-zinc-400">OEM Fit</span>
            </div>
          </div>

          <div className="pt-2.5 mt-2.5 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-[10px] sm:text-xs text-zinc-500 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-600" /> Compatible
            </span>

            <button
              onClick={onActionClick}
              id="btn-parts-action"
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-[11px] sm:text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105"
            >
              {isPartAdded ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <span>+ Add</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Alternative Part Card */}
        <div className="hidden sm:flex flex-col justify-between p-3.5 sm:p-5 rounded-2xl bg-zinc-50/90 border border-zinc-200/80 opacity-90">
          <div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center flex-shrink-0 text-zinc-500">
                <Filter className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-semibold text-zinc-400 uppercase">Routine Maintenance</span>
                <h3 className="text-xs sm:text-sm font-bold text-zinc-800 mt-0.5 truncate">{parts.alternative.name}</h3>
                <p className="text-[10px] text-zinc-400 font-mono">Part #{parts.alternative.partNumber}</p>
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between bg-white p-2.5 rounded-xl border border-zinc-100">
              <div>
                <span className="text-sm sm:text-base font-bold text-zinc-800 font-mono">Rs. {parts.alternative.price.toLocaleString()}</span>
                <span className="text-[10px] text-zinc-500 block">{parts.alternative.stockText}</span>
              </div>
              <span className="text-[10px] text-zinc-400">Scheduled</span>
            </div>
          </div>

          <div className="pt-2.5 mt-2.5 border-t border-zinc-200/60 flex items-center justify-between">
            <span className="text-[10px] text-zinc-400">Regular replacement</span>
            <span className="text-[10px] text-zinc-500 font-medium">In Catalog</span>
          </div>
        </div>
      </div>

      {/* ── Real Veltro Bottom Cart Drawer ── */}
      <div className="bg-zinc-900 text-white rounded-2xl p-2.5 sm:p-3.5 px-3 sm:px-5 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xl shadow-zinc-900/10">
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-white flex-shrink-0">
            <ShoppingCart className="w-3.5 h-3.5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] sm:text-xs font-bold text-white truncate">1 Part: {parts.selected.name}</div>
            <div className="text-[9px] sm:text-[10px] text-zinc-400">Auto-forwarded to garage</div>
          </div>
        </div>

        <button
          onClick={onActionClick}
          className="inline-flex items-center justify-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold transition-colors cursor-pointer shadow-xs w-full sm:w-auto"
        >
          <span>Rs. {parts.selected.price.toLocaleString()} → Book Installation</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}
