"use client";

export default function CtaHorizonBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* ── Soft Ambient Glow at the Horizon ── */}
      <div
        className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse, rgba(249,115,22,0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      {/* ── Perspective Highway Lines ── */}
      <svg
        className="w-full h-full absolute inset-0 opacity-40"
        viewBox="0 0 1440 600"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="horizon-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0" />
            <stop offset="30%" stopColor="#f97316" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#ea580c" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="grid-fade" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e4e4e7" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#d4d4d8" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <line x1="720" y1="40" x2="-200" y2="650" stroke="url(#grid-fade)" strokeWidth="1" />
        <line x1="720" y1="40" x2="100" y2="650" stroke="url(#grid-fade)" strokeWidth="1" />
        <line x1="720" y1="40" x2="350" y2="650" stroke="url(#grid-fade)" strokeWidth="1.5" />
        <line x1="720" y1="40" x2="550" y2="650" stroke="url(#horizon-fade)" strokeWidth="2" />

        {/* Center Guideline */}
        <line
          x1="720"
          y1="40"
          x2="720"
          y2="650"
          stroke="url(#horizon-fade)"
          strokeWidth="2.5"
          strokeDasharray="16 20"
        />

        <line x1="720" y1="40" x2="890" y2="650" stroke="url(#horizon-fade)" strokeWidth="2" />
        <line x1="720" y1="40" x2="1090" y2="650" stroke="url(#grid-fade)" strokeWidth="1.5" />
        <line x1="720" y1="40" x2="1340" y2="650" stroke="url(#grid-fade)" strokeWidth="1" />
        <line x1="720" y1="40" x2="1640" y2="650" stroke="url(#grid-fade)" strokeWidth="1" />

        {/* Horizontal Perspective Latitude Rings */}
        <line x1="600" y1="120" x2="840" y2="120" stroke="#e4e4e7" strokeWidth="1" strokeOpacity="0.3" />
        <line x1="480" y1="220" x2="960" y2="220" stroke="#e4e4e7" strokeWidth="1" strokeOpacity="0.4" />
        <line x1="320" y1="360" x2="1120" y2="360" stroke="#e4e4e7" strokeWidth="1" strokeOpacity="0.5" />
        <line x1="100" y1="520" x2="1340" y2="520" stroke="#e4e4e7" strokeWidth="1.5" strokeOpacity="0.6" />
      </svg>
    </div>
  );
}
