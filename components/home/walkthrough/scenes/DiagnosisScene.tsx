"use client";

import { motion } from "framer-motion";
import {
  Car, ShieldCheck, Disc, Droplets, Wind, BatteryMedium,
  ArrowRight, Sparkles, ChevronDown, Bell, CheckCircle2
} from "lucide-react";
import { DEMO_DATA } from "../walkthrough.config";

interface DiagnosisSceneProps {
  onActionClick: () => void;
}

export default function DiagnosisScene({ onActionClick }: DiagnosisSceneProps) {
  const { vehicle } = DEMO_DATA;

  // Real component health data matching useVehicleHealth in Veltro app
  const components = [
    {
      icon: Disc,
      name: "Front Ceramic Brake Pads",
      percent: 15,
      note: "Critical — Replacement recommended within ~3,000 km",
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
      className="h-full flex flex-col justify-between text-zinc-900"
    >
      {/* ── Real Veltro Greeting & Header ── */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
            <Car className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-zinc-900">{vehicle.name}</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Sync
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">Plate: {vehicle.vin} · {vehicle.mileage} · Owner: Rajesh Kumar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 px-3 py-1.5 rounded-xl font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>ECU Connected</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-xs font-bold">
            RK
          </div>
        </div>
      </div>

      {/* ── Real Veltro AI Health Card & Subsystem Breakdown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 my-auto py-2">
        {/* Left: Overall Health Score Card (matching scoreStyles in Veltro) */}
        <div className="lg:col-span-5 bg-zinc-50 border border-zinc-200/80 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-zinc-900">AI Vehicle Health</h3>
                  <p className="text-[10px] text-zinc-400">Continuous telemetry telemetry</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-zinc-400">Updated today</span>
            </div>

            {/* Score Banner */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/70 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-700 font-black text-base font-mono">
                {vehicle.healthScore}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                  <span>Overall Health Score</span>
                  <span>{vehicle.healthScore}/100</span>
                </div>
                <div className="h-1.5 rounded-full bg-emerald-200/60 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500 w-[87%]" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-2 rounded-xl bg-white border border-zinc-200/60">
                <span className="text-zinc-400 text-[10px] block">Services Done</span>
                <span className="font-bold text-zinc-900">2 Logged</span>
              </div>
              <div className="p-2 rounded-xl bg-orange-50/60 border border-orange-100">
                <span className="text-orange-500 text-[10px] block">Loyalty Saved</span>
                <span className="font-bold text-orange-600 font-mono">Rs. 420</span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-zinc-400 pt-2 border-t border-zinc-200/60 flex items-center justify-between mt-2">
            <span>Diagnostic Status</span>
            <span className="text-orange-600 font-semibold">1 Action Recommended</span>
          </div>
        </div>

        {/* Right: Real Veltro Component Health Breakdown */}
        <div className="lg:col-span-7 bg-white border border-zinc-200 rounded-2xl p-4 flex flex-col justify-between shadow-2xs relative">
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-zinc-800">Monitored Vehicle Components</span>
              <span className="text-[10px] text-zinc-400 font-mono">4 Subsystems Active</span>
            </div>

            <div className="space-y-2.5">
              {components.map((c) => {
                const isCritical = c.urgency === "critical";
                const Icon = c.icon;
                return (
                  <div
                    key={c.name}
                    className={`p-2.5 rounded-xl border flex items-center gap-3 transition-all ${
                      isCritical
                        ? "bg-rose-50/60 border-rose-200 shadow-2xs"
                        : "bg-zinc-50/60 border-zinc-200/60"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isCritical ? "bg-rose-100 text-rose-600" : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className={`font-bold ${isCritical ? "text-rose-900" : "text-zinc-800"}`}>
                          {c.name}
                        </span>
                        <span className={`font-mono font-bold ${isCritical ? "text-rose-600" : "text-zinc-600"}`}>
                          {c.percent}%
                        </span>
                      </div>

                      <div className="h-1.5 rounded-full bg-zinc-200/70 overflow-hidden mb-1">
                        <div
                          className={`h-full rounded-full ${
                            isCritical ? "bg-rose-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${c.percent}%` }}
                        />
                      </div>

                      <p className={`text-[10px] truncate ${isCritical ? "text-rose-700 font-medium" : "text-zinc-400"}`}>
                        {c.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between pt-3 mt-2 border-t border-zinc-100">
            <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>OEM Honda Replacement in stock</span>
            </div>

            <button
              onClick={onActionClick}
              id="btn-diagnosis-action"
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-bold rounded-xl shadow-xs shadow-orange-500/20 transition-all cursor-pointer hover:scale-105"
            >
              <span>Order Compatible Parts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-100">
        <span>Veltro Predictive Diagnostics Engine · Stage 1: Health Scan</span>
        <span>Step 1 of 4</span>
      </div>
    </motion.div>
  );
}
