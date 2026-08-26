"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, CalendarCheck, Zap, History, Gift, PackagePlus,
  ArrowRight, ShieldCheck, Check, Disc, Clock, MapPin, Sparkles, ChevronRight
} from "lucide-react";
import Link from "next/link";

interface FeatureData {
  id: string;
  n: string;
  Icon: any;
  title: string;
  shortDesc: string;
  expandedDetails: {
    tag: string;
    headline: string;
    subtext: string;
    metricLabel: string;
    metricVal: string;
    ctaLabel: string;
    ctaHref: string;
    badgeText: string;
  };
}

const FEATURES: FeatureData[] = [
  {
    id: "parts-catalog",
    n: "01",
    Icon: Search,
    title: "Vehicle-Matched Parts Catalog",
    shortDesc: "Search from 1,200+ parts guaranteed compatible with your exact make, model, and year.",
    expandedDetails: {
      tag: "VIN-ACCURATE FITMENT",
      headline: "100% Guaranteed OEM Compatibility",
      subtext: "Filtered specifically for Honda, Toyota, Hyundai, and Suzuki models registered in Nepal. Zero wrong orders, zero fitment headaches.",
      metricLabel: "Active Catalog",
      metricVal: "1,247+ OEM Parts",
      ctaLabel: "Browse Catalog",
      ctaHref: "/register",
      badgeText: "✓ In Stock in Kathmandu Hub",
    },
  },
  {
    id: "garage-booking",
    n: "02",
    Icon: CalendarCheck,
    title: "Certified Garage Service Booking",
    shortDesc: "Choose a date, time slot, and authorized service center. Parts are pre-dispatched prior to your visit.",
    expandedDetails: {
      tag: "CERTIFIED PARTNER NETWORK",
      headline: "Auto-Forwarded Hardware to Garage",
      subtext: "Book your installation slot at Miteri Auto Care or partner garages. Ordered parts arrive before you do with guaranteed 30-day labor warranty.",
      metricLabel: "Partner Garages",
      metricVal: "18+ Certified Hubs",
      ctaLabel: "View Workshop Network",
      ctaHref: "/register",
      badgeText: "30-Day Labor Warranty",
    },
  },
  {
    id: "ai-maintenance",
    n: "03",
    Icon: Zap,
    title: "AI Predictive Maintenance",
    shortDesc: "Our neural health engine analyzes telemetry and mileage to predict component wear before failure occurs.",
    expandedDetails: {
      tag: "CONTINUOUS TELEMETRY SCAN",
      headline: "Proactive Component Lifecycle Alerts",
      subtext: "Monitors brake friction, engine oil viscosity, air filtration, and battery health in real time so you replace parts before breakdowns.",
      metricLabel: "Failure Prevention",
      metricVal: "94.8% Accuracy",
      ctaLabel: "Try AI Vehicle Scan",
      ctaHref: "/register",
      badgeText: "ECU Telemetry Synced",
    },
  },
  {
    id: "digital-log",
    n: "04",
    Icon: History,
    title: "Digital Maintenance & Warranty Log",
    shortDesc: "Every part purchase and service history is organized in an immutable, verified digital service book.",
    expandedDetails: {
      tag: "DIGITAL VEHICLE PASSPORT",
      headline: "Permanent Service History & Value",
      subtext: "Keep an exportable, tamper-proof record of every oil change, brake replacement, and inspection to boost vehicle resale value.",
      metricLabel: "Service Records",
      metricVal: "Exportable PDF",
      ctaLabel: "View Sample Passport",
      ctaHref: "/register",
      badgeText: "Official Tax Invoices",
    },
  },
  {
    id: "loyalty-rewards",
    n: "05",
    Icon: Gift,
    title: "Automatic 10% Loyalty Rewards",
    shortDesc: "Orders exceeding Rs. 5,000 automatically receive an instant 10% discount at checkout with no codes required.",
    expandedDetails: {
      tag: "TRANSPARENT REWARDS TIER",
      headline: "Instant 10% Cash Rebate at Checkout",
      subtext: "No points conversions or expiring coupons. When your cart crosses Rs. 5,000, 10% is immediately deducted from the final invoice.",
      metricLabel: "Instant Savings",
      metricVal: "10% Auto-Applied",
      ctaLabel: "Claim Loyalty Status",
      ctaHref: "/register",
      badgeText: "Orders > Rs. 5,000",
    },
  },
  {
    id: "part-sourcing",
    n: "06",
    Icon: PackagePlus,
    title: "Specialty Part Sourcing on Request",
    shortDesc: "Looking for a rare or out-of-stock component? Submit a 1-click request and our network will source it.",
    expandedDetails: {
      tag: "GLOBAL SUPPLIER NETWORK",
      headline: "Rare & Custom Part Dispatch in 48h",
      subtext: "Can't find a specialized turbocharger or vintage caliper? Submit a photo or part number and our Kathmandu procurement team handles the rest.",
      metricLabel: "Fulfillment Time",
      metricVal: "24 – 48 Hours",
      ctaLabel: "Submit Sourcing Request",
      ctaHref: "/register",
      badgeText: "Direct OEM Import",
    },
  },
];

export default function InteractiveFeaturesGrid() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 items-start">
      {FEATURES.map((feat) => {
        const isExpanded = hoveredId === feat.id;
        const Icon = feat.Icon;

        return (
          <motion.div
            layout
            key={feat.id}
            onMouseEnter={() => setHoveredId(feat.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => setHoveredId(isExpanded ? null : feat.id)}
            transition={{
              layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
            className={`rounded-2xl md:rounded-3xl border transition-all cursor-pointer select-none overflow-hidden relative self-start ${
              isExpanded
                ? "bg-white border-orange-500 shadow-xl shadow-orange-500/10 ring-1 ring-orange-500/30"
                : "bg-white/80 hover:bg-white border-zinc-200/80 hover:border-zinc-300 shadow-sm hover:shadow-md"
            }`}
          >
            {/* ── Collapsed Header Row ── */}
            <div className="p-6 md:p-7">
              <div className="flex items-center justify-between gap-4 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold font-mono text-zinc-400">{feat.n}</span>
                  <div className="w-4 h-px bg-zinc-200" />
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      isExpanded ? "bg-orange-500 text-white shadow-xs shadow-orange-500/30" : "bg-orange-50 text-orange-500"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-zinc-400 hidden sm:inline">
                    {isExpanded ? "Active" : "Hover to explore"}
                  </span>
                  <motion.div
                    animate={{ rotate: isExpanded ? 90 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isExpanded ? "bg-orange-50 text-orange-600" : "bg-zinc-100 text-zinc-400"
                    }`}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </motion.div>
                </div>
              </div>

              <h3 className="text-lg font-bold text-zinc-900 mb-1.5">{feat.title}</h3>
              <p className="text-sm font-light text-zinc-500 leading-relaxed">{feat.shortDesc}</p>
            </div>

            {/* ── Expandable Interactive Live Preview Drawer ── */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="px-6 md:px-7 pb-6 md:pb-7 pt-2 border-t border-zinc-100 bg-gradient-to-b from-zinc-50/50 to-white"
                >
                  <div className="pt-2">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-bold font-mono text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-0.5 rounded-md border border-orange-100">
                        {feat.expandedDetails.tag}
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                        {feat.expandedDetails.badgeText}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-zinc-900 mt-2">
                      {feat.expandedDetails.headline}
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      {feat.expandedDetails.subtext}
                    </p>

                    {/* Interactive Stat & CTA Row */}
                    <div className="mt-4 p-3 bg-white rounded-xl border border-zinc-200/70 flex items-center justify-between gap-3 shadow-2xs">
                      <div>
                        <span className="text-[10px] text-zinc-400 font-medium block">
                          {feat.expandedDetails.metricLabel}
                        </span>
                        <span className="text-sm font-bold text-zinc-900 font-mono">
                          {feat.expandedDetails.metricVal}
                        </span>
                      </div>

                      <Link
                        href={feat.expandedDetails.ctaHref}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-all hover:scale-105 active:scale-95"
                      >
                        <span>{feat.expandedDetails.ctaLabel}</span>
                        <ArrowRight className="w-3 h-3 text-orange-400" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
