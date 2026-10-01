'use client';

import { useMemo } from 'react';
import { Layers, ChevronLeft } from 'lucide-react';
import { useSpaceStore } from '@/lib/space/store';
import type { SatelliteCategory } from '@/lib/space/satelliteTypes';

const FILTERS: Array<{ key: string; label: string; cat?: SatelliteCategory }> = [
  { key: 'all', label: 'All Objects' },
  { key: 'ISS', label: 'ISS', cat: 'ISS' },
  { key: 'Starlink', label: 'Starlink', cat: 'Starlink' },
  { key: 'GPS', label: 'GPS', cat: 'GPS' },
  { key: 'Weather', label: 'Weather', cat: 'Weather' },
  { key: 'Communication', label: 'Comm', cat: 'Communication' },
  { key: 'Scientific', label: 'Scientific', cat: 'Scientific' },
];

export default function Sidebar({
  open: propOpen,
  setOpen: propSetOpen,
}: {
  open?: boolean;
  setOpen?: (value: boolean) => void;
} = {}) {
  const storeOpen = useSpaceStore((s) => s.sidebarOpen);
  const storeSetOpen = useSpaceStore((s) => s.setSidebarOpen);
  const open = propOpen !== undefined ? propOpen : storeOpen;
  const setOpen = propSetOpen || storeSetOpen;

  const satellites = useSpaceStore((s) => s.satellites);
  const select = useSpaceStore((s) => s.select);
  const selectedId = useSpaceStore((s) => s.selectedId);
  const activeCategory = useSpaceStore((s) => s.activeCategory);
  const setActiveCategory = useSpaceStore((s) => s.setActiveCategory);
  const viewDensity = useSpaceStore((s) => s.viewDensity);
  const setViewDensity = useSpaceStore((s) => s.setViewDensity);

  const counts = useMemo(() => {
    const countMap: Record<string, number> = { all: satellites.length };
    satellites.forEach((satellite) => {
      countMap[satellite.category] = (countMap[satellite.category] || 0) + 1;
    });
    return countMap;
  }, [satellites]);

  const handleCategoryClick = (key: string, cat?: SatelliteCategory) => {
    if (activeCategory === key) {
      setActiveCategory('all');
    } else {
      setActiveCategory(key);
      if (cat) {
        const first = satellites.find((s) => s.category === cat);
        if (first && !selectedId) select(first.id);
      }
    }
    if (typeof window !== 'undefined' && window.innerWidth < 768) setOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm md:hidden transition-opacity"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Floating trigger on mobile when closed */}
      <button
        onClick={() => setOpen(!open)}
        className={`absolute left-3 top-16 z-20 flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-black/80 px-3 py-1.5 text-cyan-300 shadow-[0_0_12px_rgba(0,200,255,0.2)] backdrop-blur md:hidden active:scale-95 transition ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-label="Open Constellations"
      >
        <Layers size={13} />
        <span className="text-[10px] font-mono tracking-widest">CONSTELLATIONS</span>
      </button>

      <aside
        className={`fixed md:absolute bottom-0 md:bottom-14 left-0 top-14 z-40 md:z-20 w-72 max-w-[85vw] md:w-60 border-r border-cyan-500/15 bg-black/90 md:bg-black/60 backdrop-blur-xl transition-transform duration-300 shadow-2xl ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-12 md:h-10 items-center justify-between border-b border-cyan-500/15 px-4">
          <span className="text-[10px] tracking-[0.3em] font-medium text-cyan-400">ORBITAL CATALOG</span>
          <button
            className="flex h-8 w-8 items-center justify-center rounded text-cyan-400/80 hover:bg-white/10 hover:text-white md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <ChevronLeft size={18} />
          </button>
        </div>

        {/* Density Mode Selector */}
        <div className="border-b border-cyan-500/10 p-3">
          <div className="mb-2 text-[9px] tracking-[0.25em] text-cyan-500/60">DENSITY MODE</div>
          <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
            <button
              onClick={() => setViewDensity('curated')}
              className={`rounded px-2 py-1.5 transition ${
                viewDensity === 'curated'
                  ? 'border border-cyan-400/70 bg-cyan-500/25 text-cyan-200 shadow-[0_0_8px_rgba(0,220,255,0.2)]'
                  : 'border border-transparent text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              ✦ Curated
            </button>
            <button
              onClick={() => setViewDensity('dense')}
              className={`rounded px-2 py-1.5 transition ${
                viewDensity === 'dense'
                  ? 'border border-cyan-400/70 bg-cyan-500/25 text-cyan-200 shadow-[0_0_8px_rgba(0,220,255,0.2)]'
                  : 'border border-transparent text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              ⚡ All 11k
            </button>
          </div>
        </div>

        {/* Categories List */}
        <div className="h-[calc(100%-7.5rem)] overflow-y-auto pb-6">
          <div className="px-4 py-2 text-[9px] tracking-[0.25em] text-cyan-500/50">FILTER BY CONSTELLATION</div>
          {FILTERS.map((filter) => {
            const count = counts[filter.key] ?? 0;
            const isActive = activeCategory === filter.key;
            return (
              <button
                key={filter.key}
                onClick={() => handleCategoryClick(filter.key, filter.cat)}
                className={`group flex w-full items-center justify-between border-l-2 px-4 py-2 text-left transition ${
                  isActive
                    ? 'border-cyan-400 bg-cyan-500/20 text-white shadow-[inset_4px_0_12px_rgba(0,200,255,0.15)]'
                    : 'border-transparent hover:border-cyan-400/50 hover:bg-cyan-500/10'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      isActive ? 'bg-cyan-300' : 'bg-white/20 group-hover:bg-cyan-400/60'
                    }`}
                  />
                  <span
                    className={`text-xs tracking-wide ${
                      isActive ? 'font-medium text-white' : 'text-white/80 group-hover:text-white'
                    }`}
                  >
                    {filter.label}
                  </span>
                </div>
                <span
                  className={`font-mono text-[10px] ${
                    isActive ? 'text-cyan-200' : 'text-cyan-400/60 group-hover:text-cyan-300'
                  }`}
                >
                  {count.toLocaleString()}
                </span>
              </button>
            );
          })}

          {activeCategory !== 'all' && (
            <div className="px-4 pt-3">
              <button
                onClick={() => setActiveCategory('all')}
                className="w-full rounded border border-cyan-500/30 bg-cyan-500/10 py-1.5 text-center font-mono text-[10px] tracking-wider text-cyan-300 hover:bg-cyan-500/20"
              >
                SHOW ALL OBJECTS
              </button>
            </div>
          )}

          {selectedId && (
            <div className="px-4 pt-5">
              <div className="mb-1 text-[9px] tracking-[0.3em] text-cyan-500/50">TRACKING</div>
              <div className="truncate font-mono text-[10px] text-cyan-300">#{selectedId}</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
