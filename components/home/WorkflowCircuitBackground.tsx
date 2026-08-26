"use client";

export default function WorkflowCircuitBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Technical Engineering Blueprint Grid & Coordinate Crosshairs ── */}
      <svg
        className="w-full h-full absolute inset-0 opacity-40"
        viewBox="0 0 1440 900"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="circuit-grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="#e4e4e7"
              strokeWidth="0.75"
            />
            <circle cx="0" cy="0" r="1.5" fill="#d4d4d8" />
          </pattern>
        </defs>

        {/* Base Grid */}
        <rect width="100%" height="100%" fill="url(#circuit-grid)" />

        {/* Diagonal Telemetry Splines */}
        <path
          d="M 0,200 L 400,200 L 600,450 L 1100,450 L 1300,700 L 1440,700"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeOpacity="0.2"
          strokeDasharray="6 8"
          fill="none"
        />
        <path
          d="M 1440,150 L 1050,150 L 850,380 L 350,380 L 150,600 L 0,600"
          stroke="#a1a1aa"
          strokeWidth="1.5"
          strokeOpacity="0.25"
          strokeDasharray="8 8"
          fill="none"
        />

        {/* Technical Coordinate Crosshairs */}
        <g stroke="#a1a1aa" strokeWidth="1" strokeOpacity="0.4">
          {/* Top Left Marker */}
          <line x1="80" y1="110" x2="100" y2="110" />
          <line x1="90" y1="100" x2="90" y2="120" />
          <text x="110" y="114" fill="#a1a1aa" fontSize="9" fontFamily="monospace">
            LAT 27.7172° N // LONG 85.3240° E
          </text>

          {/* Center Marker */}
          <line x1="720" y1="200" x2="740" y2="200" />
          <line x1="730" y1="190" x2="730" y2="210" />
          <text x="750" y="204" fill="#a1a1aa" fontSize="9" fontFamily="monospace">
            STAGE SCAN // ECU TELEMETRY ACTIVE
          </text>

          {/* Bottom Right Marker */}
          <line x1="1280" y1="780" x2="1300" y2="780" />
          <line x1="1290" y1="770" x2="1290" y2="790" />
          <text x="1150" y="784" fill="#a1a1aa" fontSize="9" fontFamily="monospace">
            DIAGNOSTIC PIPELINE // 5 NODES
          </text>
        </g>
      </svg>
    </div>
  );
}
