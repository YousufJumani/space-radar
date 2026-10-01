'use client';

import { Radio, Route, Moon, Crosshair, RotateCcw, Shuffle, Sparkles, X } from 'lucide-react';
import { useMemo } from 'react';
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
  const activeCategory = useSpaceStore((s) => s.activeCategory);
  const setActiveCategory = useSpaceStore((s) => s.setActiveCategory);
  const viewDensity = useSpaceStore((s) => s.viewDensity);
  const setViewDensity = useSpaceStore((s) => s.setViewDensity);

  const toggle = useSpaceStore((s) => s.toggle);
  const setFollow = useSpaceStore((s) => s.setFollow);
  const setTimeScale = useSpaceStore((s) => s.setTimeScale);
  const select = useSpaceStore((s) => s.select);
  const triggerReset = useSpaceStore((s) => s.triggerReset);

  const visibleCount = useMemo(() => {
    if (activeCategory !== 'all') {
      const catCount = satellites.filter((s) => s.category === activeCategory).length;
      if (viewDensity === 'curated' && activeCategory === 'Starlink') return Math.min(180, catCount);
      return catCount;
    }
    if (viewDensity === 'curated') {
      let nonStarlink = 0;
      for (const s of satellites) {
        if (s.category !== 'Starlink') nonStarlink++;
      }
      return Math.min(satellites.length, nonStarlink + Math.min(70, satellites.filter((s) => s.category === 'Starlink').length));
    }
    return satellites.length;
  }, [satellites, activeCategory, viewDensity]);

  const surprise = () => {
    if (satellites.length === 0) return;
    const pool = activeCategory === 'all' ? satellites : satellites.filter((s) => s.category === activeCategory);
    const pick = pool[Math.floor(Math.random() * pool.length)] || satellites[0];
    select(pick.id);
    setFollow(pick.id);
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-cyan-500/15 bg-black/75 backdrop-blur-md">
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar px-3 py-2 whitespace-nowrap">
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
        <ControlButton
          active={viewDensity === 'curated'}
          onClick={() => setViewDensity(viewDensity === 'curated' ? 'dense' : 'curated')}
          title="Toggle Curated (Clean View) vs All 11k Swarm"
        >
          <Sparkles size={11} /> {viewDensity === 'curated' ? 'CURATED' : '11K SWARM'}
        </ControlButton>
        <ControlButton onClick={triggerReset} title="Reset view">
          <RotateCcw size={11} /> RESET
        </ControlButton>
        <ControlButton onClick={surprise} title="Random satellite">
          <Shuffle size={11} /> SURPRISE
        </ControlButton>

        {activeCategory !== 'all' && (
          <button
            onClick={() => setActiveCategory('all')}
            title="Click to show all constellations"
            className="flex shrink-0 items-center gap-1 rounded-sm border border-cyan-400/60 bg-cyan-500/25 px-2 py-1.5 text-[10px] tracking-widest text-cyan-200 transition hover:bg-cyan-500/40 active:scale-95"
          >
            <span>{activeCategory.toUpperCase()}</span>
            <X size={10} />
          </button>
        )}

        <div className="flex sm:hidden font-mono text-[9px] tracking-wider text-cyan-300 border border-cyan-500/20 px-2 py-1 rounded bg-black/40 shrink-0">
          {visibleCount} SATS
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-3 pl-3">
          <div className="hidden text-[10px] tracking-widest text-white/50 sm:block">
            OBJECTS{' '}
            <span className="font-mono text-cyan-300">{visibleCount.toLocaleString()}</span>
            {visibleCount < satellites.length && (
              <span className="font-mono text-white/30"> / {satellites.length.toLocaleString()}</span>
            )}
          </div>
          <div className="flex items-center gap-0.5">
            <span className="mr-1 hidden text-[10px] tracking-widest text-white/50 md:inline">SPEED</span>
            {SPEEDS.map((speed) => (
              <button
                key={speed}
                onClick={() => setTimeScale(speed)}
                className={`rounded-sm px-2 py-1 text-[10px] font-mono transition shrink-0 ${
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
      className={`flex shrink-0 min-h-[32px] items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-[10px] tracking-widest transition active:scale-95 ${
        active
          ? 'border-cyan-400/70 bg-cyan-500/20 text-cyan-300 shadow-[0_0_10px_rgba(0,200,255,0.25)]'
          : 'border-white/10 text-white/60 hover:border-cyan-500/40 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
