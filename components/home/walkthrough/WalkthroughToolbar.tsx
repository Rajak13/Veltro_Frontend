"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { SCENES_META } from "./walkthrough.config";

interface WalkthroughToolbarProps {
  activeScene: number;
  onSelectScene: (sceneId: 1 | 2 | 3 | 4) => void;
}

export default function WalkthroughToolbar({ activeScene, onSelectScene }: WalkthroughToolbarProps) {
  return (
    <div className="flex items-center gap-1 bg-zinc-100/90 p-1 rounded-xl border border-zinc-200/80">
      {SCENES_META.map((scene) => {
        const isActive = activeScene === scene.id;
        const isCompleted = activeScene > scene.id;

        return (
          <button
            key={scene.id}
            onClick={() => onSelectScene(scene.id)}
            className={`relative px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              isActive
                ? "text-zinc-900"
                : isCompleted
                ? "text-zinc-600 hover:text-zinc-900"
                : "text-zinc-400 hover:text-zinc-600"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeTabBadgeLight"
                className="absolute inset-0 bg-white rounded-lg shadow-xs border border-zinc-200/60"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
              />
            )}

            <span className="relative z-10 flex items-center gap-1.5 text-[11px]">
              {isCompleted ? (
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[9px] font-bold">
                  <Check className="w-2.5 h-2.5" />
                </span>
              ) : (
                <span
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                    isActive ? "bg-orange-500 text-white" : "bg-zinc-200 text-zinc-600"
                  }`}
                >
                  {scene.id}
                </span>
              )}
              <span className="hidden sm:inline font-medium">{scene.shortLabel}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
