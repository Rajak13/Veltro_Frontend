"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, AnimatePresence } from "framer-motion";
import {
  UserCheck, Car, Zap, CalendarCheck, Gift,
  ArrowRight, ShieldCheck, CheckCircle2, Disc, Clock, MapPin, Sparkles, Receipt, Droplets
} from "lucide-react";
import Link from "next/link";
import WorkflowCircuitBackground from "./WorkflowCircuitBackground";

interface WorkflowStep {
  id: number;
  num: string;
  shortTitle: string;
  tag: string;
  headline: string;
  description: string;
  Icon: any;
  metric: string;
  metricLabel: string;
  badge: string;
  previewData: {
    title: string;
    subtitle: string;
    details: { label: string; val: string }[];
  };
}

const STEPS: WorkflowStep[] = [
  {
    id: 1,
    num: "1",
    shortTitle: "Account",
    tag: "STEP 01 // ONBOARDING",
    headline: "Create Your Account & Garage Passport",
    description: "Sign up in under 60 seconds to unlock a unified digital vehicle vault for all your cars, service records, and warranty certificates.",
    Icon: UserCheck,
    metric: "< 60s",
    metricLabel: "Setup Time",
    badge: "Instant",
    previewData: {
      title: "Digital Vehicle Passport #VLT-8819",
      subtitle: "Unified Owner Account · Multi-Vehicle Vault",
      details: [
        { label: "Account Status", val: "Verified & Active" },
        { label: "Digital Garage", val: "Multi-Car Ready" },
        { label: "Service Passport", val: "Auto-Created" },
      ],
    },
  },
  {
    id: 2,
    num: "2",
    shortTitle: "Vehicle",
    tag: "STEP 02 // VIN DIGITAL TWIN",
    headline: "Add Your Vehicle & Map Factory Specs",
    description: "Enter your model, year, and registration plate. Veltro immediately builds your vehicle's digital twin and maps 1,200+ compatible OEM parts.",
    Icon: Car,
    metric: "100%",
    metricLabel: "Fitment Guarantee",
    badge: "BA 123 PA",
    previewData: {
      title: "2022 Honda Civic 1.5L Turbo",
      subtitle: "Plate: BA 123 PA · 34,500 KM · Owner: Rajesh Kumar",
      details: [
        { label: "ECU Protocol", val: "ISO-15765 CAN Bus" },
        { label: "Catalog Filter", val: "1,247 OEM Parts" },
        { label: "Factory Specs", val: "Verified" },
      ],
    },
  },
  {
    id: 3,
    num: "3",
    shortTitle: "AI Scan",
    tag: "STEP 03 // TELEMETRY",
    headline: "Receive Continuous AI Diagnostic Insights",
    description: "Our neural health engine continuously monitors component wear on brake pads, engine oil, and electrical systems before failure occurs.",
    Icon: Zap,
    metric: "87/100",
    metricLabel: "Health Score",
    badge: "1 Action",
    previewData: {
      title: "Front Brake Friction: 15% Left",
      subtitle: "AI Warning: Replace in ~3,000 km",
      details: [
        { label: "Powertrain / Oil", val: "98% (6,500 km)" },
        { label: "Front Brake Pads", val: "15% (Critical)" },
        { label: "12V Battery", val: "92% (12.8V)" },
      ],
    },
  },
  {
    id: 4,
    num: "4",
    shortTitle: "Order & Book",
    tag: "STEP 04 // DISPATCH",
    headline: "Order Guaranteed Parts & Book Workshop",
    description: "Order OEM parts with 1-click and pick a service slot at an authorized garage. Hardware is pre-dispatched prior to your arrival.",
    Icon: CalendarCheck,
    metric: "Oct 20",
    metricLabel: "Slot: Tue @ 10 AM",
    badge: "Pre-Dispatched",
    previewData: {
      title: "Miteri Auto Care — Central Garage Hub",
      subtitle: "OEM Front Brake Pad Kit + Certified Installation",
      details: [
        { label: "Selected Garage", val: "Miteri Auto Care (⭐ 4.9)" },
        { label: "Technician Labor", val: "Rs. 1,000" },
        { label: "Post-Warranty", val: "30-Day Included" },
      ],
    },
  },
  {
    id: "5" as any,
    id_num: 5,
    num: "5",
    shortTitle: "Save 10%",
    tag: "STEP 05 // REWARDS",
    headline: "Automatic 10% Loyalty Savings & History",
    description: "Orders exceeding Rs. 5,000 automatically receive 10% instant rebate at checkout, and the completed invoice is logged to your service history.",
    Icon: Gift,
    metric: "Rs. 550",
    metricLabel: "Loyalty Savings",
    badge: "10% Off",
    previewData: {
      title: "Official Tax Invoice #VLT-2026-8819",
      subtitle: "Rs. 5,500 - Rs. 550 Loyalty Credit = Rs. 4,950 Total",
      details: [
        { label: "Hardware Subtotal", val: "Rs. 4,500" },
        { label: "10% Loyalty Rebate", val: "- Rs. 550" },
        { label: "Net Amount Paid", val: "Rs. 4,950" },
      ],
    },
  } as any,
];

export default function HorizontalWorkflowJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track active step according to scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress < 0.20) {
        if (activeStep !== 1) setActiveStep(1);
      } else if (progress >= 0.20 && progress < 0.40) {
        if (activeStep !== 2) setActiveStep(2);
      } else if (progress >= 0.40 && progress < 0.60) {
        if (activeStep !== 3) setActiveStep(3);
      } else if (progress >= 0.60 && progress < 0.80) {
        if (activeStep !== 4) setActiveStep(4);
      } else if (progress >= 0.80) {
        if (activeStep !== 5) setActiveStep(5);
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, activeStep]);

  const currentStep = STEPS.find((s) => s.id === activeStep || (s as any).id_num === activeStep) || STEPS[0];
  const StepIcon = currentStep.Icon;

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] sm:h-[320vh] bg-[#fafafa] text-[#18181b]"
    >
      {/* ── Sticky Viewport ── */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center items-center py-6 sm:py-12 px-3 sm:px-6 md:px-12 overflow-hidden z-10">
        {/* Technical Blueprint & Telemetry Background */}
        <WorkflowCircuitBackground />

        {/* ── Header ── */}
        <div className="max-w-4xl mx-auto text-center mb-4 sm:mb-8 flex-shrink-0">
          <div className="text-[10px] sm:text-[11px] font-bold text-orange-600 uppercase tracking-[0.25em] mb-1 sm:mb-2 font-mono">
            Simple Workflow
          </div>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900">
            Five steps from diagnosis to delivery.
          </h2>
        </div>

        {/* ── Minimalist 5-Step Numbered Line Track ── */}
        <div className="max-w-4xl mx-auto w-full mb-4 sm:mb-8 relative z-20">
          {/* Connector Line */}
          <div className="absolute top-4 sm:top-5 left-[6%] right-[6%] h-[2px] bg-zinc-200" />

          {/* Active Glowing Progress Segment */}
          <div
            className="absolute top-4 sm:top-5 left-[6%] h-[2px] bg-orange-500 transition-all duration-500 shadow-[0_0_8px_#f97316]"
            style={{ width: `${((activeStep - 1) / 4) * 88}%` }}
          />

          {/* 5 Minimalist Number Circles & Titles */}
          <div className="grid grid-cols-5 gap-1 sm:gap-2 relative z-10">
            {STEPS.map((s) => {
              const stepId = (s as any).id_num || s.id;
              const isActive = activeStep === stepId;
              const isPast = activeStep > stepId;

              return (
                <button
                  key={s.num}
                  onClick={() => setActiveStep(stepId)}
                  className="step-item text-center cursor-pointer group focus:outline-none"
                >
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 mx-auto mb-1 sm:mb-2 flex items-center justify-center text-xs sm:text-sm font-bold transition-all duration-300 ${
                      isActive
                        ? "border-orange-500 bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105 sm:scale-110"
                        : isPast
                        ? "border-orange-500 bg-white text-orange-600 font-bold"
                        : "border-zinc-200 bg-white text-zinc-400 group-hover:border-zinc-300"
                    }`}
                  >
                    {s.num}
                  </div>
                  <h4
                    className={`text-[10px] sm:text-sm font-bold transition-colors truncate px-0.5 ${
                      isActive
                        ? "text-zinc-900"
                        : isPast
                        ? "text-zinc-700"
                        : "text-zinc-400"
                    }`}
                  >
                    {s.shortTitle}
                  </h4>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Transformed Dynamic Stage Showcase Container ── */}
        <div className="max-w-4xl mx-auto w-full relative z-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.98 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-white border border-zinc-200/90 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-[0_15px_40px_rgba(0,0,0,0.06)] grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 items-center select-none"
            >
              {/* Left Column: Stage Copy & Live Metric */}
              <div className="md:col-span-7 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2 sm:mb-3">
                    <span className="text-[9px] sm:text-[10px] font-bold font-mono text-orange-600 uppercase tracking-wider bg-orange-50 px-2 sm:px-2.5 py-0.5 rounded-md border border-orange-100">
                      {currentStep.tag}
                    </span>
                    <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60 font-mono">
                      {currentStep.badge}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-2xl font-bold text-zinc-900 tracking-tight mb-1 sm:mb-2">
                    {currentStep.headline}
                  </h3>
                  <p className="text-xs sm:text-sm font-light text-zinc-500 leading-relaxed mb-3 sm:mb-5">
                    {currentStep.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-zinc-100">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-xs shadow-orange-500/20 flex-shrink-0">
                    <StepIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-zinc-400 font-medium block uppercase tracking-wider">
                      {currentStep.metricLabel}
                    </span>
                    <span className="text-sm sm:text-lg font-black text-zinc-900 font-mono">
                      {currentStep.metric}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Live Mockup Widget */}
              <div className="md:col-span-5 bg-gradient-to-b from-zinc-50 to-zinc-100/60 border border-zinc-200/80 rounded-xl sm:rounded-2xl p-3.5 sm:p-5 shadow-2xs">
                <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-zinc-200/60">
                  <div className="text-xs font-bold text-zinc-900 truncate">
                    {currentStep.previewData.title}
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
                </div>

                <p className="text-[10px] sm:text-[11px] text-zinc-500 mb-2 sm:mb-3">
                  {currentStep.previewData.subtitle}
                </p>

                <div className="space-y-1.5">
                  {currentStep.previewData.details.map((d) => (
                    <div
                      key={d.label}
                      className="p-1.5 sm:p-2 bg-white rounded-lg sm:rounded-xl border border-zinc-200/60 flex items-center justify-between text-xs shadow-2xs"
                    >
                      <span className="text-zinc-500 text-[10px] sm:text-[11px]">{d.label}</span>
                      <span className="font-bold text-zinc-900 font-mono text-[10px] sm:text-[11px]">
                        {d.val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3 pt-2 border-t border-zinc-200/60 flex justify-end">
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    <span>Try Step</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── Bottom Step Status Hint ── */}
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs text-zinc-400 pt-3 sm:pt-6 font-mono z-20">
          <span>STEP {activeStep} OF 5</span>
          <span className="text-orange-600 font-semibold">
            {activeStep === 5 ? "COMPLETE ✓" : "SCROLL ↓"}
          </span>
        </div>

      </div>
    </div>
  );
}
