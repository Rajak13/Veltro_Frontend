"use client";

import { Play, Pause, SkipForward, SkipBack, RotateCcw } from "lucide-react";
import { SCENES_META } from "./walkthrough.config";

interface PlaybackControlsProps {
  activeScene: 1 | 2 | 3 | 4;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export default function PlaybackControls({
  activeScene,
  isPlaying,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
}: PlaybackControlsProps) {
  const currentMeta = SCENES_META.find((s) => s.id === activeScene) || SCENES_META[0];

  return (
    <div className="bg-white/95 backdrop-blur-md border border-zinc-200/90 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] font-sans">
      {/* ── Play / Pause & Skip Buttons ── */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onTogglePlay}
          className="w-8 h-8 rounded-xl bg-orange-500 hover:bg-orange-600 text-white flex items-center justify-center transition-all cursor-pointer shadow-xs shadow-orange-500/20 hover:scale-105"
          title={isPlaying ? "Pause Demo" : "Play Demo"}
        >
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        <button
          onClick={onPrev}
          disabled={activeScene === 1}
          className="w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Previous Stage"
        >
          <SkipBack className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onNext}
          disabled={activeScene === 4}
          className="w-7 h-7 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          title="Next Stage"
        >
          <SkipForward className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ── Center Segment Track ── */}
      <div className="hidden sm:flex flex-col min-w-[200px] md:min-w-[240px] px-2">
        <div className="flex items-center justify-between text-[10px] text-zinc-500 mb-1">
          <span className="font-semibold text-zinc-800">{currentMeta.label}</span>
          <span className="text-orange-600 font-bold">{activeScene}/4</span>
        </div>

        {/* 4 Multi-segment Progress Bars */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          {[1, 2, 3, 4].map((id) => {
            const isCompleted = activeScene > id;
            const isCurrent = activeScene === id;
            return (
              <div
                key={id}
                className="h-full rounded-full bg-zinc-100 overflow-hidden relative border border-zinc-200/50"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    isCompleted
                      ? "w-full bg-emerald-500"
                      : isCurrent
                      ? "w-full bg-orange-500"
                      : "w-0"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Reset Button ── */}
      <button
        onClick={onReset}
        className="text-[11px] font-medium text-zinc-500 hover:text-zinc-900 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
        title="Reset Demo"
      >
        <RotateCcw className="w-3 h-3" />
        <span className="hidden md:inline">Reset</span>
      </button>
    </div>
  );
}
