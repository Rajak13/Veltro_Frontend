"use client";

import { motion } from "framer-motion";

export default function RoadTracksBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Soft Ambient Glows Along the Highway Route ── */}
      <div
        className="absolute top-1/4 -right-10 w-[550px] h-[550px] rounded-full pointer-events-none opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.10) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-1/4 -left-20 w-[650px] h-[650px] rounded-full pointer-events-none opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Precision Automotive Highway SVG Lines ── */}
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 1440 960"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Asphalt gradient */}
          <linearGradient id="road-asphalt-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#e4e4e7" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#f4f4f5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e4e4e7" stopOpacity="0.5" />
          </linearGradient>

          {/* Orange Glowing Center Line */}
          <linearGradient id="road-glow-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
            <stop offset="25%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.8" />
            <stop offset="75%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
          </linearGradient>

          {/* Topography Elevation Lines */}
          <linearGradient id="topo-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#d4d4d8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e4e4e7" stopOpacity="0.1" />
          </linearGradient>

          {/* Highway Glow Filter */}
          <filter id="orange-neon-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* ── Topography Contour Lines ── */}
        <path
          d="M -100,140 C 320,80 520,380 960,180 C 1220,70 1380,240 1600,160"
          stroke="url(#topo-line-grad)"
          strokeWidth="1.5"
          fill="none"
        />
        <path
          d="M -100,240 C 380,180 580,480 1020,280 C 1280,170 1440,340 1600,260"
          stroke="url(#topo-line-grad)"
          strokeWidth="1"
          strokeDasharray="6 8"
          fill="none"
        />
        <path
          d="M -100,720 C 260,560 620,860 1080,600 C 1320,460 1460,660 1600,580"
          stroke="url(#topo-line-grad)"
          strokeWidth="1.5"
          fill="none"
        />

        {/* ── Primary Highway Track 1: Wide Asphalt Base ── */}
        <path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="url(#road-asphalt-1)"
          strokeWidth="68"
          strokeLinecap="round"
          fill="none"
        />

        {/* Outer White Edge Lines (Left & Right Curbs) */}
        <path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="#d4d4d8"
          strokeWidth="66"
          strokeDasharray="0 0"
          strokeOpacity="0.25"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="#fafafa"
          strokeWidth="56"
          strokeLinecap="round"
          fill="none"
        />

        {/* Highway Edge Markings */}
        <path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="#e4e4e7"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Center Illuminated Dashed Lane (Animated) */}
        <motion.path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="url(#road-glow-orange)"
          strokeWidth="3"
          strokeDasharray="16 20"
          filter="url(#orange-neon-glow)"
          fill="none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: -72 }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        />

        {/* ── Highway Junction Mileage Markers / Data Nodes ── */}
        <g opacity="0.85">
          {/* Node 1 */}
          <circle cx="360" cy="180" r="4" fill="#f97316" />
          <circle cx="360" cy="180" r="10" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />
          <text x="375" y="184" fill="#a1a1aa" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.1em">
            MILESTONE 01 // KATHMANDU HUB
          </text>

          {/* Node 2 */}
          <circle cx="860" cy="370" r="4" fill="#f97316" />
          <circle cx="860" cy="370" r="10" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />
          <text x="875" y="374" fill="#a1a1aa" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.1em">
            NODE 02 // RING ROAD WORKSHOP
          </text>

          {/* Node 3 */}
          <circle cx="1280" cy="520" r="4" fill="#10b981" />
          <circle cx="1280" cy="520" r="10" stroke="#10b981" strokeWidth="1" strokeOpacity="0.4" />
          <text x="1120" y="524" fill="#a1a1aa" fontSize="9" fontFamily="monospace" fontWeight="600" letterSpacing="0.1em">
            DISPATCH 03 // SERVICE COMPLETED
          </text>
        </g>

        {/* ── Secondary Counter-Curve Track 2 ── */}
        <path
          d="M -80,820 C 340,680 580,260 1020,480 C 1280,610 1420,400 1560,340"
          stroke="url(#road-asphalt-1)"
          strokeWidth="48"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -80,820 C 340,680 580,260 1020,480 C 1280,610 1420,400 1560,340"
          stroke="#fafafa"
          strokeWidth="40"
          strokeLinecap="round"
          fill="none"
        />
        <motion.path
          d="M -80,820 C 340,680 580,260 1020,480 C 1280,610 1420,400 1560,340"
          stroke="#a1a1aa"
          strokeWidth="2"
          strokeOpacity="0.4"
          strokeDasharray="14 18"
          fill="none"
          initial={{ strokeDashoffset: 0 }}
          animate={{ strokeDashoffset: 64 }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear" }}
        />
      </svg>
    </div>
  );
}
