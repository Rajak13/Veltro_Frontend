"use client";

import { motion } from "framer-motion";

export default function ReviewsGaugeBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Mechanical Cockpit Gauge Rings & Tachometer Arcs ── */}
      <svg
        className="w-full h-full absolute inset-0 opacity-35"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="60%" stopColor="#d4d4d8" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* ── Left Large Speedometer Arc (Centered at 180, 400) ── */}
        <g transform="translate(140, 400)">
          {/* Concentric circles */}
          <circle cx="0" cy="0" r="320" stroke="url(#gauge-grad)" strokeWidth="1" />
          <circle cx="0" cy="0" r="260" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="0" cy="0" r="200" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.25" />
          <circle cx="0" cy="0" r="140" stroke="#e4e4e7" strokeWidth="1" />

          {/* Radial Tick Marks */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15) * (Math.PI / 180);
            const x1 = Math.cos(angle) * 290;
            const y1 = Math.sin(angle) * 290;
            const x2 = Math.cos(angle) * 315;
            const y2 = Math.sin(angle) * 315;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 4 === 0 ? "#f97316" : "#d4d4d8"}
                strokeWidth={i % 4 === 0 ? 2 : 1}
                strokeOpacity={i % 4 === 0 ? 0.4 : 0.25}
              />
            );
          })}

          <text x="-45" y="10" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="600">
            RPM x 1000
          </text>
        </g>

        {/* ── Right Large Tachometer Arc (Centered at 1300, 400) ── */}
        <g transform="translate(1300, 400)">
          <circle cx="0" cy="0" r="340" stroke="url(#gauge-grad)" strokeWidth="1" />
          <circle cx="0" cy="0" r="280" stroke="#e4e4e7" strokeWidth="1" strokeDasharray="6 8" />
          <circle cx="0" cy="0" r="220" stroke="#f97316" strokeWidth="1.5" strokeOpacity="0.25" />

          {/* Radial Tick Marks */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15) * (Math.PI / 180);
            const x1 = Math.cos(angle) * 310;
            const y1 = Math.sin(angle) * 310;
            const x2 = Math.cos(angle) * 335;
            const y2 = Math.sin(angle) * 335;
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 4 === 0 ? "#ea580c" : "#d4d4d8"}
                strokeWidth={i % 4 === 0 ? 2 : 1}
                strokeOpacity={i % 4 === 0 ? 0.35 : 0.2}
              />
            );
          })}

          <text x="-35" y="10" fill="#a1a1aa" fontSize="10" fontFamily="monospace" fontWeight="600">
            SPEED KM/H
          </text>
        </g>
      </svg>
    </div>
  );
}
