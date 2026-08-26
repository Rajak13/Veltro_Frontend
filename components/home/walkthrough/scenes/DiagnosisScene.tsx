"use client";

import { motion } from "framer-motion";
import {
  Car, ShieldCheck, Disc, Droplets, Wind, BatteryMedium,
  ArrowRight, CheckCircle2
} from "lucide-react";
import { DEMO_DATA } from "../walkthrough.config";

interface DiagnosisSceneProps {
  onActionClick: () => void;
}

export default function DiagnosisScene({ onActionClick }: DiagnosisSceneProps) {
  const { vehicle } = DEMO_DATA;

  const components = [
    {
      icon: Disc,
      name: "Front Ceramic Brake Pads",
      percent: 15,
      note: "Critical — Replace in ~3,000 km",
      urgency: "critical",
    },
    {
      icon: Droplets,
      name: "Engine Synthetic Oil",
      percent: 85,
      note: "Good — 6,500 km remaining",
      urgency: "good",
    },
    {
      icon: Wind,
      name: "Cabin & Engine Air Filter",
      percent: 70,
      note: "Good — Clean flow",
      urgency: "good",
    },
    {
      icon: BatteryMedium,
      name: "12V AGM Starter Battery",
      percent: 92,
      note: "Optimal — 12.8V nominal",
      urgency: "good",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="h-full flex flex-col justify-between text-zinc-900 overflow-y-auto"
    >
      {/* ── Real Veltro Greeting & Header ── */}
      <div className="flex items-center justify-between pb-2.5 border-b border-zinc-100 flex-shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 flex-shrink-0">
            <Car className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h2 className="text-xs sm:text-base font-bold text-zinc-900 truncate">{vehicle.name}</h2>
              <span className="inline-flex items-center gap-1 text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-1.5 sm:px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-zinc-400 font-mono mt-0.5">Plate: {vehicle.vin} · {vehicle.mileage}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-[10px] sm:text-xs font-bold">
            RK
          </div>
        </div>
      </div>

      {/* ── Health Score Card & Subsystem Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 my-auto py-1 sm:py-2">
        {/* Left: Overall Health Score Card */}
        <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-[11px] sm:text-xs font-bold text-zinc-900">AI Vehicle Health</h3>
                </div>
              </div>
              <span className="text-[9px] sm:text-[10px] font-mono text-zinc-400">Updated today</span>
            </div>

            {/* Score Banner */}
            <div className="flex items-center gap-3 p-2.5 sm:p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 mb-2 sm:mb-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700 font-black text-sm sm:text-base font-mono">
                {vehicle.healthScore}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-emerald-900 mb-1">
                  <span>Overall Health</span>
                  <span>{vehicle.healthScore}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-emerald-200/60 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-[87%]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-1.5 sm:p-2 rounded-xl bg-white border border-zinc-200/60">
                <span className="text-zinc-400 text-[9px] block">Services Logged</span>
                <span className="font-bold text-zinc-900 text-xs">2 Visits</span>
              </div>
              <div className="p-1.5 sm:p-2 rounded-xl bg-orange-50/60 border border-orange-100">
                <span className="text-orange-500 text-[9px] block">Loyalty Saved</span>
                <span className="font-bold text-orange-600 font-mono text-xs">Rs. 420</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] sm:text-[11px] text-zinc-400 pt-2 border-t border-zinc-200/60 flex items-center justify-between mt-2">
            <span>Diagnostic Status</span>
            <span className="text-orange-600 font-semibold">1 Action Needed</span>
          </div>
        </div>

        {/* Right: Component Health Breakdown */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-3 sm:p-4 flex flex-col justify-between shadow-2xs relative">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] sm:text-xs font-bold text-zinc-800">Monitored Components</span>
              <span className="text-[9px] sm:text-[10px] text-zinc-400 font-mono">4 Subsystems</span>
            </div>

            <div className="space-y-2">
              {components.map((c) => {
                const isCritical = c.urgency === "critical";
                const Icon = c.icon;
                return (
                  <div
                    key={c.name}
                    className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all ${
                      isCritical
                        ? "bg-rose-50/70 border-rose-200"
                        : "bg-zinc-50/60 border-zinc-200/60"
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isCritical ? "bg-rose-100 text-rose-600" : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-[11px] sm:text-xs mb-0.5">
                        <span className={`font-bold truncate ${isCritical ? "text-rose-900" : "text-zinc-800"}`}>
                          {c.name}
                        </span>
                        <span className={`font-mono font-bold ml-1 ${isCritical ? "text-rose-600" : "text-zinc-600"}`}>
                          {c.percent}%
                        </span>
                      </div>

                      <div className="h-1 rounded-full bg-zinc-200/70 overflow-hidden mb-0.5">
                        <div
                          className={`h-full rounded-full ${
                            isCritical ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${c.percent}%` }}
                        />
                      </div>

                      <p className={`text-[9px] sm:text-[10px] truncate ${isCritical ? "text-rose-700 font-medium" : "text-zinc-400"}`}>
                        {c.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2.5 mt-2 border-t border-zinc-100">
            <div className="text-[10px] sm:text-[11px] text-zinc-500 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
              <span className="truncate">OEM Replacement in stock</span>
            </div>

            <button
              onClick={onActionClick}
              id="btn-diagnosis-action"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer hover:scale-105 w-full sm:w-auto"
            >
              <span>Order Compatible Parts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1 border-t border-zinc-100">
        <span>Stage 1: Health Scan</span>
        <span>Step 1 of 4</span>
      </div>
    </motion.div>
  );
}
