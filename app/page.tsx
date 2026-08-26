"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Cog, Search, CalendarCheck, History, Gift, PackagePlus,
  ArrowRight, Check, Star, ShieldCheck, Zap,
} from "lucide-react";
import PublicReviewsSection from "@/components/home/PublicReviewsSection";
import MacOSInteractiveWalkthrough from "@/components/home/walkthrough/MacOSInteractiveWalkthrough";
import InteractiveFeaturesGrid from "@/components/home/InteractiveFeaturesGrid";
import RoadTracksBackground from "@/components/home/RoadTracksBackground";
import HorizontalWorkflowJourney from "@/components/home/HorizontalWorkflowJourney";
import InteractiveLoyaltySection from "@/components/home/InteractiveLoyaltySection";
import CtaHorizonBackground from "@/components/home/CtaHorizonBackground";
import AutomotivePreloader from "@/components/home/AutomotivePreloader";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.5, delay },
});

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#18181b] font-mono">
      {/* Automotive Telemetry Ignition Preloader */}
      <AutomotivePreloader />

      {/* Dot grid background */}
      <div className="fixed inset-0 pointer-events-none dot-grid" style={{ zIndex: -10 }} />
      
      {/* Subtle Orange Glow Ambient */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          zIndex: -5,
          background: "radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 65%)",
          filter: "blur(50px)",
        }}
      />

      {/* ════════════════════════════════════════
          STICKY SCROLL MACOS WALKTHROUGH & HERO
      ════════════════════════════════════════ */}
      <section id="demo" className="relative">
        <MacOSInteractiveWalkthrough />
      </section>

      {/* ════════════════════════════════════════
          CORE PLATFORM CAPABILITIES / FEATURES
      ════════════════════════════════════════ */}
      <section id="features" className="relative py-32 border-t border-zinc-200/60 overflow-hidden" style={{ zIndex: 10 }}>
        {/* Winding Curvy Road Lines Background */}
        <RoadTracksBackground />

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <motion.div {...fadeUp()} className="max-w-xl mb-16">
            <div className="text-[11px] font-bold text-orange-600 uppercase tracking-[0.25em] mb-3">
              Platform Features
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Everything for your vehicle, in one place.
            </h2>
            <p className="text-sm sm:text-base font-light text-zinc-500 leading-relaxed">
              No more juggling between roadside garages, unverified parts shops, and lost paper service records.
            </p>
          </motion.div>

          <InteractiveFeaturesGrid />
        </div>
      </section>

      {/* ════════════════════════════════════════
          HOW IT WORKS (HORIZONTAL SCROLL JOURNEY)
      ════════════════════════════════════════ */}
      <section id="how" className="relative border-t border-zinc-200/60" style={{ zIndex: 10 }}>
        <HorizontalWorkflowJourney />
      </section>

      {/* ════════════════════════════════════════
          INTERACTIVE LOYALTY PROGRAM CALCULATOR
      ════════════════════════════════════════ */}
      <InteractiveLoyaltySection />

      {/* ════════════════════════════════════════
          PUBLIC REVIEWS SECTION
      ════════════════════════════════════════ */}
      <div id="reviews">
        <PublicReviewsSection />
      </div>

      {/* ════════════════════════════════════════
          FINAL CTA SECTION
      ════════════════════════════════════════ */}
      <section className="relative py-32 border-t border-zinc-200/60 overflow-hidden bg-gradient-to-b from-[#fafafa] to-zinc-100/50" style={{ zIndex: 10 }}>
        {/* Perspective Runway Horizon Background */}
        <CtaHorizonBackground />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div {...fadeUp()}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4 font-mono">
              Your vehicle deserves precision, not guesswork.
            </h2>

            <p className="text-sm sm:text-base font-light text-zinc-500 leading-relaxed max-w-xl mx-auto mb-8">
              Join vehicle owners who manage OEM parts, certified services, and predictive health records from one intuitive platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 font-mono">
              <Link
                href="/register"
                className="btn-shine bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold px-8 py-3.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-md inline-flex items-center gap-2"
              >
                <span>Get Started Free</span>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
              </Link>
              <Link
                href="/login"
                className="bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-bold px-8 py-3.5 rounded-full border border-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-2xs"
              >
                <span>Sign In</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          MODERN FOOTER
      ════════════════════════════════════════ */}
      <footer className="relative py-14 border-t border-zinc-200 bg-white" style={{ zIndex: 10 }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-zinc-100">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-extrabold text-zinc-950 tracking-tight font-sans">veltro</span>
              <span className="text-xs text-zinc-400 font-mono">Automotive Intelligence &amp; Workshop Network</span>
            </div>

            <div className="flex items-center gap-6 font-mono text-xs font-semibold text-zinc-500">
              <a href="#demo" className="hover:text-zinc-950 transition-colors">Demo</a>
              <a href="#features" className="hover:text-zinc-950 transition-colors">Features</a>
              <a href="#how" className="hover:text-zinc-950 transition-colors">How It Works</a>
              <a href="#reviews" className="hover:text-zinc-950 transition-colors">Reviews</a>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-400 font-mono gap-4">
            <div>© 2026 Veltro Systems. Kathmandu Central Hub. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>ECU Telemetry v2.4</span>
              <span>•</span>
              <span className="text-emerald-600 font-bold">● Systems Operational</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
