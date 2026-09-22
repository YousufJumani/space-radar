'use client';

import { Radio, Route, Moon, Crosshair, RotateCcw, Shuffle } from 'lucide-react';
import { useSpaceStore } from '@/lib/space/store';

const SPEEDS = [0.5, 1, 2, 5, 10];

export default function Controls() {
  const live = useSpaceStore((s) => s.live);
  const showOrbits = useSpaceStore((s) => s.showOrbits);
  const nightMode = useSpaceStore((s) => s.nightMode);
  const followId = useSpaceStore((s) => s.followId);
  const selectedId = useSpaceStore((s) => s.selectedId);
  const timeScale = useSpaceStore((s) => s.timeScale);
  const satellites = useSpaceStore((s) => s.satellites);

  const toggle = useSpaceStore((s) => s.toggle);
  const setFollow = useSpaceStore((s) => s.setFollow);
  const setTimeScale = useSpaceStore((s) => s.setTimeScale);
  const select = useSpaceStore((s) => s.select);
  const triggerReset = useSpaceStore((s) => s.triggerReset);

  const surprise = () => {
    if (satellites.length === 0) return;
    const pick = satellites[Math.floor(Math.random() * satellites.length)];
    select(pick.id);
    setFollow(pick.id);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-cyan-500/15 bg-black/60 backdrop-blur-md">
      <div className="flex flex-wrap items-center gap-1.5 px-3 py-2.5">
        <ControlButton active={live} onClick={() => toggle('live')} title="Live time">
          <Radio size={11} /> LIVE
        </ControlButton>
        <ControlButton active={showOrbits} onClick={() => toggle('showOrbits')} title="Show orbital path">
          <Route size={11} /> ORBITS
        </ControlButton>
        <ControlButton active={nightMode} onClick={() => toggle('nightMode')} title="Night side">
          <Moon size={11} /> NIGHT
        </ControlButton>
        <ControlButton
          active={!!followId}
          onClick={() => {
            if (followId) setFollow(null);
            else if (selectedId) setFollow(selectedId);
          }}
          title="Follow selected"
        >
          <Crosshair size={11} /> FOLLOW
        </ControlButton>
        <ControlButton onClick={triggerReset} title="Reset view">
          <RotateCcw size={11} /> RESET
        </ControlButton>
        <ControlButton onClick={surprise} title="Random satellite">
          <Shuffle size={11} /> SURPRISE
        </ControlButton>

        <div className="ml-auto flex items-center gap-4 pl-3">
          <div className="hidden text-[10px] tracking-widest text-white/50 sm:block">
            OBJECTS <span className="font-mono text-cyan-300">{satellites.length.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-0.5">
            <span className="mr-1 hidden text-[10px] tracking-widest text-white/50 md:inline">SPEED</span>
            {SPEEDS.map((speed) => (
              <button
                key={speed}
                onClick={() => setTimeScale(speed)}
                className={`rounded-sm px-2 py-1 text-[10px] font-mono transition ${
                  timeScale === speed ? 'bg-cyan-500/25 text-cyan-200' : 'text-white/50 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[10px] tracking-widest transition ${
        active
          ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,200,255,0.25)]'
          : 'border-white/10 text-white/60 hover:border-cyan-500/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
