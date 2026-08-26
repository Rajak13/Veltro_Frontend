"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, ChevronDown, User } from "lucide-react";
import MacOSWindow from "./MacOSWindow";
import DiagnosisScene from "./scenes/DiagnosisScene";
import PartsScene from "./scenes/PartsScene";
import BookingScene from "./scenes/BookingScene";
import CheckoutScene from "./scenes/CheckoutScene";
import { SCENES_META } from "./walkthrough.config";

export default function MacOSInteractiveWalkthrough() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Single source of truth for active scene (1 | 2 | 3 | 4)
  const [activeScene, setActiveScene] = useState<1 | 2 | 3 | 4>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPartAdded, setIsPartAdded] = useState(false);

  // ── Framer Motion Scroll Progress Binding ──
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // 1. Full-Width Edge-to-Edge Navbar:
  const navbarY = useTransform(scrollYProgress, [0, 0.08, 0.90, 0.98], [0, -100, -100, 0]);
  const navbarOpacity = useTransform(scrollYProgress, [0, 0.08, 0.90, 0.98], [1, 0, 0, 1]);

  // 2. Hero Text Animation:
  const heroOpacity = useTransform(scrollYProgress, [0, 0.08], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.08], [0, -30]);
  const heroDisplay = useTransform(scrollYProgress, (val) => (val > 0.1 ? "none" : "block"));

  // 3. Side Cars (Responsive for Mobile & Desktop):
  const leftCarX = useTransform(scrollYProgress, [0, 0.15], [0, -400]);
  const leftCarOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);
  const leftCarScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  const rightCarX = useTransform(scrollYProgress, [0, 0.15], [0, 400]);
  const rightCarOpacity = useTransform(scrollYProgress, [0, 0.10], [1, 0]);
  const rightCarScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.9]);

  // 4. macOS Window Scaling & Y Translation:
  const windowScale = useTransform(
    scrollYProgress,
    [0, 0.16, 0.88, 1.0],
    [0.78, 1.0, 1.0, 0.82]
  );

  const windowY = useTransform(
    scrollYProgress,
    [0, 0.16, 0.88, 1.0],
    [320, 0, 0, -30]
  );

  const windowBorderRadius = useTransform(
    scrollYProgress,
    [0, 0.16, 0.88, 1.0],
    ["24px", "16px", "16px", "24px"]
  );

  const windowOpacity = useTransform(
    scrollYProgress,
    [0, 0.88, 0.98],
    [1, 1, 0]
  );

  const scrollPillOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);

  // ── Scene Actions ──
  const goToScene = useCallback((sceneId: 1 | 2 | 3 | 4) => {
    setActiveScene(sceneId);
    if (sceneId >= 2) setIsPartAdded(true);
  }, []);

  const nextScene = useCallback(() => {
    setActiveScene((prev) => {
      if (prev < 4) {
        const next = (prev + 1) as 1 | 2 | 3 | 4;
        if (next >= 2) setIsPartAdded(true);
        return next;
      }
      return prev;
    });
  }, []);

  const prevScene = useCallback(() => {
    setActiveScene((prev) => {
      if (prev > 1) {
        return (prev - 1) as 1 | 2 | 3 | 4;
      }
      return prev;
    });
  }, []);

  const resetDemo = useCallback(() => {
    setActiveScene(1);
    setIsPartAdded(false);
    setIsPlaying(false);
  }, []);

  // ── User Interaction Handlers ──
  const handleUserSelectScene = (sceneId: 1 | 2 | 3 | 4) => {
    setIsPlaying(false);
    goToScene(sceneId);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // ── Scroll-Linked Scene Scrubbing (0.16 -> 0.88 Full Screen Zone) ──
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (progress) => {
      if (progress < 0.16) {
        if (activeScene !== 1) {
          setActiveScene(1);
          setIsPartAdded(false);
        }
      } else if (progress >= 0.16 && progress < 0.38) {
        if (activeScene !== 1) setActiveScene(1);
      } else if (progress >= 0.38 && progress < 0.58) {
        if (activeScene !== 2) {
          setActiveScene(2);
          setIsPartAdded(true);
        }
      } else if (progress >= 0.58 && progress < 0.78) {
        if (activeScene !== 3) {
          setActiveScene(3);
          setIsPartAdded(true);
        }
      } else if (progress >= 0.78) {
        if (activeScene !== 4) {
          setActiveScene(4);
          setIsPartAdded(true);
        }
      }
    });

    return () => unsubscribe();
  }, [scrollYProgress, activeScene]);

  // ── Autoplay Timer Engine ──
  useEffect(() => {
    if (!isPlaying) return;

    const currentMeta = SCENES_META.find((s) => s.id === activeScene) || SCENES_META[0];
    const timer = setTimeout(() => {
      if (activeScene < 4) {
        nextScene();
      } else {
        setIsPlaying(false);
      }
    }, currentMeta.durationMs);

    return () => clearTimeout(timer);
  }, [isPlaying, activeScene, nextScene]);

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] sm:h-[320vh] bg-[#fafafa] text-[#18181b]"
      style={{ position: "relative" }}
    >
      {/* ── Full-Width Edge-to-Edge Mobile-Friendly Navbar ── */}
      <motion.nav
        style={{ y: navbarY, opacity: navbarOpacity }}
        className="fixed top-0 left-0 right-0 w-full px-4 sm:px-10 md:px-16 py-4 sm:py-6 flex items-center justify-between z-50 pointer-events-auto bg-gradient-to-b from-white/95 via-white/80 to-transparent backdrop-blur-[4px]"
      >
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight font-sans">
            veltro
          </span>
        </Link>

        {/* Center: Section Links (Hidden on small mobile screens for clean UI) */}
        <div className="hidden lg:flex items-center gap-8 font-mono text-[11px] uppercase tracking-[0.2em] font-semibold text-zinc-600">
          <a href="#demo" className="hover:text-zinc-950 transition-colors">
            Demo
          </a>
          <a href="#features" className="hover:text-zinc-950 transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-zinc-950 transition-colors">
            How It Works
          </a>
          <a href="#reviews" className="hover:text-zinc-950 transition-colors">
            Reviews
          </a>
        </div>

        {/* Right: Quick Action Buttons (Optimized for Mobile Touch) */}
        <div className="flex items-center gap-2 sm:gap-4 font-mono text-xs">
          <Link
            href="/login"
            className="text-[11px] sm:text-xs font-semibold text-zinc-700 hover:text-zinc-950 px-2 sm:px-3 py-1.5 transition-colors flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5 text-zinc-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/register"
            className="btn-shine bg-zinc-950 hover:bg-zinc-800 text-white text-[11px] sm:text-xs font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <ArrowRight className="w-3 h-3 text-zinc-300" />
          </Link>
        </div>
      </motion.nav>

      {/* ── Sticky Full-Screen Viewport ── */}
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden px-2 sm:px-4 md:px-6 z-10">

        {/* ── Left Side Car: White Mercedes (Responsive on Mobile & Desktop) ── */}
        <motion.div
          style={{
            x: leftCarX,
            opacity: leftCarOpacity,
            scale: leftCarScale,
          }}
          className="absolute -left-10 sm:left-[-3%] md:left-[0%] lg:left-[1%] bottom-0 w-[180px] xs:w-[220px] sm:w-[420px] md:w-[520px] lg:w-[580px] pointer-events-none z-15"
        >
          <img
            src="/cars/2-cropped.svg"
            alt="Mercedes-AMG White (Left)"
            className="w-full h-auto drop-shadow-[0_15px_35px_rgba(0,0,0,0.30)] filter"
          />
        </motion.div>

        {/* ── Right Side Car: Orange Mustang (Responsive on Mobile & Desktop) ── */}
        <motion.div
          style={{
            x: rightCarX,
            opacity: rightCarOpacity,
            scale: rightCarScale,
          }}
          className="absolute -right-10 sm:right-[-3%] md:right-[0%] lg:right-[1%] bottom-0 w-[180px] xs:w-[220px] sm:w-[420px] md:w-[520px] lg:w-[580px] pointer-events-none z-15"
        >
          <img
            src="/cars/1-cropped.svg"
            alt="Mustang Orange (Right)"
            className="w-full h-auto drop-shadow-[0_15px_35px_rgba(0,0,0,0.30)] filter"
          />
        </motion.div>

        {/* ── Hero Title + Subtitle (Fluid Responsive Sizing) ── */}
        <motion.div
          style={{
            opacity: heroOpacity,
            y: heroY,
            display: heroDisplay as any,
          }}
          className="absolute top-16 xs:top-20 sm:top-24 md:top-28 text-center max-w-3xl px-3 sm:px-4 z-30 pointer-events-auto"
        >
          <div className="text-[10px] sm:text-[11px] font-medium text-zinc-400 uppercase tracking-[0.25em] mb-2 sm:mb-3 font-sans">
            Vehicle Care Reimagined
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl font-light tracking-tight leading-[1.08] font-sans">
            <span className="text-[#9ca3af] font-light">A New Standard</span> <br />
            <span className="text-zinc-950 font-bold">in Vehicle Management</span>
          </h1>

          <p className="text-xs sm:text-base font-light text-zinc-500 max-w-sm sm:max-w-xl mx-auto mt-2.5 sm:mt-4 leading-relaxed font-sans">
            Take complete control of your vehicle with a unified platform for AI health predictions, guaranteed OEM parts, and certified garage bookings.
          </p>
        </motion.div>

        {/* ── Center macOS Dashboard Window ── */}
        <motion.div
          style={{
            scale: windowScale,
            y: windowY,
            opacity: windowOpacity,
            borderRadius: windowBorderRadius,
          }}
          className="w-full max-w-[98vw] sm:max-w-[96vw] xl:max-w-[1400px] h-[84vh] sm:h-[88vh] md:h-[91vh] flex items-center justify-center relative z-20 overflow-hidden shadow-[0_20px_70px_rgba(0,0,0,0.12)] bg-white"
        >
          <MacOSWindow
            activeScene={activeScene}
            isPlaying={isPlaying}
            onSelectScene={handleUserSelectScene}
            onTogglePlay={handleTogglePlay}
            onNext={nextScene}
            onPrev={prevScene}
            onReset={resetDemo}
          >
            <AnimatePresence mode="wait">
              {activeScene === 1 && (
                <DiagnosisScene key="scene-1" onActionClick={() => goToScene(2)} />
              )}
              {activeScene === 2 && (
                <PartsScene
                  key="scene-2"
                  isPartAdded={isPartAdded}
                  onActionClick={() => {
                    setIsPartAdded(true);
                    setTimeout(() => goToScene(3), 350);
                  }}
                />
              )}
              {activeScene === 3 && (
                <BookingScene key="scene-3" onActionClick={() => goToScene(4)} />
              )}
              {activeScene === 4 && (
                <CheckoutScene
                  key="scene-4"
                  onActionClick={resetDemo}
                  onResetDemo={resetDemo}
                />
              )}
            </AnimatePresence>
          </MacOSWindow>
        </motion.div>

        {/* ── Floating "✦ Scroll to explore" Pill ── */}
        <motion.div
          style={{ opacity: scrollPillOpacity }}
          className="absolute bottom-4 sm:bottom-6 z-30 pointer-events-none flex items-center gap-1.5 text-[11px] sm:text-xs font-mono font-medium text-zinc-600 bg-white/95 backdrop-blur-md border border-zinc-200 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-xs"
        >
          <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-500" />
          <span>Scroll to explore</span>
          <ChevronDown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-400 animate-bounce ml-0.5" />
        </motion.div>

      </div>
    </div>
  );
}
