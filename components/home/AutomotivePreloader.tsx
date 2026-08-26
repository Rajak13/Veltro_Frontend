"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Car } from "lucide-react";

interface AutomotivePreloaderProps {
  onComplete?: () => void;
}

export default function AutomotivePreloader({ onComplete }: AutomotivePreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // 1. Preload key car graphic assets into browser memory cache
    const asset1 = new Image();
    asset1.src = "/cars/1-cropped.svg";
    const asset2 = new Image();
    asset2.src = "/cars/2-cropped.svg";

    // 2. High-speed smooth progress tick engine (750ms clean entrance)
    const startTime = performance.now();
    const duration = 750;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const rawProgress = Math.min(1, elapsed / duration);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - rawProgress, 3);
      setProgress(eased * 100);

      if (rawProgress < 1) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsLoaded(true);
          onComplete?.();
        }, 150);
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
            opacity: 0,
            transition: { duration: 0.45, ease: "easeOut" },
          }}
          className="fixed inset-0 z-[9999] bg-[#fafafa] flex flex-col items-center justify-center p-6 select-none font-mono"
        >
          {/* Brand Logo */}
          <div className="flex items-center gap-2 mb-10">
            <span className="text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
              veltro
            </span>
          </div>

          {/* Minimalist Road Track with Traveling Car Icon */}
          <div className="w-full max-w-xs sm:max-w-sm relative">
            {/* Road Track Line */}
            <div className="w-full h-1 bg-zinc-200 rounded-full overflow-hidden relative">
              <motion.div
                className="h-full bg-orange-500 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Traveling Car Beacon */}
            <div
              className="absolute -top-3.5 transition-all duration-75"
              style={{
                left: `calc(${progress}% - 14px)`,
              }}
            >
              <div className="w-7 h-7 rounded-full bg-white border border-zinc-200 shadow-md flex items-center justify-center text-orange-500">
                <Car className="w-4 h-4 fill-orange-500/20" />
              </div>
            </div>
          </div>

          {/* Subtle Status Label */}
          <div className="text-[11px] font-medium text-zinc-400 mt-6 tracking-wider">
            INITIALIZING
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
