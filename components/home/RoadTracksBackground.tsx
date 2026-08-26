"use client";

export default function RoadTracksBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Soft Ambient Glows ── */}
      <div
        className="absolute top-1/4 -right-10 w-[550px] h-[550px] rounded-full pointer-events-none opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute bottom-1/4 -left-20 w-[650px] h-[650px] rounded-full pointer-events-none opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      {/* ── Precision Highway SVG Lines (GPU Composited) ── */}
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 1440 960"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="road-asphalt-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f4f4f5" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#e4e4e7" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#f4f4f5" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#e4e4e7" stopOpacity="0.5" />
          </linearGradient>

          <linearGradient id="road-glow-orange" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.1" />
            <stop offset="35%" stopColor="#f97316" stopOpacity="0.6" />
            <stop offset="65%" stopColor="#ea580c" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="topo-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#d4d4d8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#e4e4e7" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* ── Topography Contour Lines ── */}
        <path
          d="M -100,140 C 320,80 520,380 960,180 C 1220,70 1380,240 1600,160"
          stroke="url(#topo-line-grad)"
          strokeWidth="1.5"
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
        <path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="#fafafa"
          strokeWidth="56"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="#e4e4e7"
          strokeWidth="1.5"
          fill="none"
        />

        {/* Center Glowing Dashed Line */}
        <path
          d="M -140,80 C 320,30 480,540 880,360 C 1200,210 1340,700 1620,640"
          stroke="url(#road-glow-orange)"
          strokeWidth="2.5"
          strokeDasharray="16 20"
          fill="none"
        />

        {/* ── Highway Junction Mileage Markers ── */}
        <g opacity="0.85">
          <circle cx="360" cy="180" r="4" fill="#f97316" />
          <circle cx="360" cy="180" r="10" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />
          <text x="375" y="184" fill="#a1a1aa" fontSize="9" fontFamily="monospace" fontWeight="600">
            MILESTONE 01 // KATHMANDU HUB
          </text>

          <circle cx="860" cy="370" r="4" fill="#f97316" />
          <circle cx="860" cy="370" r="10" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />
          <text x="875" y="374" fill="#a1a1aa" fontSize="9" fontFamily="monospace" fontWeight="600">
            NODE 02 // RING ROAD WORKSHOP
          </text>
        </g>
      </svg>
    </div>
  );
}
