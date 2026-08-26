"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ShieldCheck, Check, Sparkles } from "lucide-react";

const SYSTEM_CHECKS = [
  "INITIALIZING ECU PROTOCOL ISO-15765",
  "PRE-CACHING VEHICLE TELEMETRY ASSETS",
  "MAPPING KATHMANDU WORKSHOP NETWORK",
  "SYS_OK // COCKPIT READY",
];

interface AutomotivePreloaderProps {
  onComplete?: () => void;
}

export default function AutomotivePreloader({ onComplete }: AutomotivePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentCheckIndex, setCurrentCheckIndex] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Preload key car graphic assets into browser memory cache
    const asset1 = new Image();
    asset1.src = "/cars/1-cropped.svg";
    const asset2 = new Image();
    asset2.src = "/cars/2-cropped.svg";

    // 2. High-speed smooth progress tick engine
    const startTime = performance.now();
    const duration = 1400; // 1.4s smooth initialization sequence

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      const currentPct = Math.round(eased * 100);

      setProgress(currentPct);

      if (currentPct > 25 && currentPct <= 55) {
        setCurrentCheckIndex(1);
      } else if (currentPct > 55 && currentPct <= 85) {
        setCurrentCheckIndex(2);
      } else if (currentPct > 85) {
        setCurrentCheckIndex(3);
      }

      if (rawProgress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsLoaded(true);
          onComplete?.();
        }, 200);
      }
    };

    requestAnimationFrame(tick);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isLoaded && (
        <motion.div
          key="automotive-preloader"
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            opacity: 0.95,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
          }}
          className="fixed inset-0 z-[9999] bg-[#0d0e12] text-white flex flex-col justify-between p-6 sm:p-12 overflow-hidden select-none font-mono"
        >
          {/* Subtle Ambient Tachometer Background Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-orange-500/10 blur-[100px] pointer-events-none" />

          {/* Top Brand & Status */}
          <div className="flex items-center justify-between text-xs text-zinc-500 z-10">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight text-base font-sans">
              <span className="text-xl font-extrabold tracking-tight">veltro</span>
              <span className="text-[10px] font-mono font-normal text-orange-500 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                DIAGNOSTICS v2.4
              </span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ONLINE</span>
            </div>
          </div>

          {/* Center: Tachometer Rev Counter & Progress Meter */}
          <div className="flex flex-col items-center justify-center text-center my-auto z-10">
            {/* RPM Speedometer SVG Gauge Arc */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 flex items-center justify-center mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                {/* Background Ring Track */}
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="#1f242d"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="260"
                  strokeDashoffset="65"
                />
                {/* Active Orange Glowing Arc */}
                <motion.circle
                  cx="60"
                  cy="60"
                  r="52"
                  stroke="url(#preloader-orange)"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="260"
                  style={{
                    strokeDashoffset: 260 - (progress / 100) * 195,
                  }}
                  className="transition-all duration-75"
                />
                <defs>
                  <linearGradient id="preloader-orange" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Digital Percentage */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-white">
                  {progress}
                  <span className="text-xl text-orange-500 font-bold">%</span>
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold tracking-wider mt-1 uppercase">
                  TELEMETRY SYNC
                </span>
              </div>
            </div>

            {/* Live System Check Log */}
            <div className="h-6 flex items-center justify-center text-xs text-orange-400 font-mono tracking-wider">
              <span className="inline-block animate-pulse mr-2">›</span>
              <span>{SYSTEM_CHECKS[currentCheckIndex]}</span>
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="max-w-md mx-auto w-full z-10">
            <div className="w-full h-1.5 rounded-full bg-zinc-800/90 overflow-hidden relative mb-3">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 rounded-full shadow-[0_0_12px_#f97316]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
              <span>PRE-WARMING GRAPHICS</span>
              <span>STANDBY</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
