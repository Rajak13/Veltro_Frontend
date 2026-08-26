"use client";

import { ReactNode } from "react";
import { Lock, Activity, Package, Wrench, Gift, ShieldCheck } from "lucide-react";
import WalkthroughToolbar from "./WalkthroughToolbar";
import PlaybackControls from "./PlaybackControls";
import SimulatedCursor from "./SimulatedCursor";
import { SCENES_META } from "./walkthrough.config";

interface MacOSWindowProps {
  activeScene: 1 | 2 | 3 | 4;
  isPlaying: boolean;
  onSelectScene: (sceneId: 1 | 2 | 3 | 4) => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
  children: ReactNode;
}

export default function MacOSWindow({
  activeScene,
  isPlaying,
  onSelectScene,
  onTogglePlay,
  onNext,
  onPrev,
  onReset,
  children,
}: MacOSWindowProps) {
  const currentMeta = SCENES_META.find((s) => s.id === activeScene) || SCENES_META[0];

  return (
    <div className="w-full h-full bg-white rounded-2xl md:rounded-3xl border border-zinc-200/90 shadow-[0_25px_80px_rgba(0,0,0,0.12)] flex flex-col relative overflow-hidden text-left select-none ring-1 ring-zinc-900/5 text-zinc-900">
      {/* ── macOS Title Chrome ── */}
      <div className="h-12 md:h-13 bg-[#f6f7f9] border-b border-zinc-200/80 px-4 md:px-6 flex items-center justify-between gap-3 z-30 flex-shrink-0">
        {/* Left: Window Controls (Traffic Lights) */}
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-80 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:opacity-80 transition-opacity" />
          <div className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:opacity-80 transition-opacity" />
        </div>

        {/* Center: Dynamic URL Bar */}
        <div className="flex-1 max-w-sm sm:max-w-md bg-white border border-zinc-200 rounded-xl px-3.5 py-1.5 flex items-center justify-between text-xs text-zinc-500 font-mono shadow-2xs">
          <div className="flex items-center gap-2 truncate">
            <Lock className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span className="text-zinc-800 font-medium truncate">veltro.app/{currentMeta.subsystem.toLowerCase()}</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
        </div>

        {/* Right: Step Switcher Toolbar */}
        <div className="hidden sm:block">
          <WalkthroughToolbar activeScene={activeScene} onSelectScene={onSelectScene} />
        </div>
      </div>

      {/* ── Mobile Step Pills (Visible on small screens) ── */}
      <div className="sm:hidden px-3 py-2 bg-zinc-50 border-b border-zinc-200 flex justify-center">
        <WalkthroughToolbar activeScene={activeScene} onSelectScene={onSelectScene} />
      </div>

      {/* ── Main App Body (Synex-Style Dark Glass Left Sidebar + Clean White Content) ── */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Synex-Style Left Dark Sidebar */}
        <aside className="w-14 md:w-16 bg-[#181920] border-r border-zinc-800 hidden sm:flex flex-col items-center justify-between py-5 z-20 flex-shrink-0 text-white shadow-inner">
          <div className="flex flex-col items-center gap-3.5">
            {[
              { id: 1, Icon: Activity, label: "Diagnostics" },
              { id: 2, Icon: Package, label: "OEM Parts" },
              { id: 3, Icon: Wrench, label: "Garages" },
              { id: 4, Icon: Gift, label: "Loyalty" },
            ].map(({ id, Icon, label }) => {
              const isActive = activeScene === id;
              return (
                <button
                  key={id}
                  onClick={() => onSelectScene(id as 1 | 2 | 3 | 4)}
                  title={label}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/30"
                      : "text-zinc-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>

          <div className="flex flex-col items-center gap-2 text-zinc-400">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/10">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </aside>

        {/* ── App Canvas / Active Scene Viewport ── */}
        <div className="flex-1 p-5 md:p-8 bg-white relative overflow-y-auto flex flex-col justify-between">
          {/* Simulated Cursor Overlay */}
          <SimulatedCursor sceneId={activeScene} />

          {/* Active Scene Container */}
          <div className="flex-1 relative flex flex-col justify-between">
            {children}
          </div>

          {/* Bottom Floating Playback Controller */}
          <div className="pt-3 flex justify-center z-30 flex-shrink-0">
            <PlaybackControls
              activeScene={activeScene}
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
              onNext={onNext}
              onPrev={onPrev}
              onReset={onReset}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
