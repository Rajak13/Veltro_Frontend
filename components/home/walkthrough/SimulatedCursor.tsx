"use client";

import { motion } from "framer-motion";

interface SimulatedCursorProps {
  sceneId: number;
}

const CURSOR_POSITIONS: Record<number, { x: number; y: number; label?: string }> = {
  1: { x: 78, y: 78, label: "Clicking 'Find Compatible Part'..." },
  2: { x: 42, y: 76, label: "Adding OEM Front Brake Kit..." },
  3: { x: 80, y: 78, label: "Confirming 10:00 AM Slot..." },
  4: { x: 82, y: 84, label: "10% Loyalty Payoff Claimed!" },
};

export default function SimulatedCursor({ sceneId }: SimulatedCursorProps) {
  const currentPos = CURSOR_POSITIONS[sceneId] || CURSOR_POSITIONS[1];

  return (
    <motion.div
      initial={false}
      animate={{
        left: `${currentPos.x}%`,
        top: `${currentPos.y}%`,
      }}
      transition={{
        duration: 0.9,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="absolute pointer-events-none z-40 hidden lg:flex items-center gap-2 -translate-x-2 -translate-y-2"
    >
      {/* SVG Mouse Pointer */}
      <div className="relative">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg filter"
        >
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill="#18181b"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>

        {/* Click ripple wave */}
        <motion.span
          key={`ripple-${sceneId}`}
          initial={{ scale: 0.6, opacity: 0.8 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }}
          className="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-orange-500/40 border border-orange-500 pointer-events-none"
        />
      </div>

      {/* Action pill tooltip */}
      {currentPos.label && (
        <motion.div
          key={`label-${sceneId}`}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
          className="bg-zinc-900 text-white text-[10px] font-medium px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap border border-zinc-800"
        >
          {currentPos.label}
        </motion.div>
      )}
    </motion.div>
  );
}
