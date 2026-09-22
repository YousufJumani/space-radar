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
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const satellites = useSpaceStore((s) => s.satellites);
  const select = useSpaceStore((s) => s.select);
  const selectedId = useSpaceStore((s) => s.selectedId);

  const counts = useMemo(() => {
    const countMap: Record<string, number> = { all: satellites.length };
    satellites.forEach((satellite) => {
      countMap[satellite.category] = (countMap[satellite.category] || 0) + 1;
    });
    return countMap;
  }, [satellites]);

  const jumpTo = (category?: SatelliteCategory) => {
    if (!category) return;
    const first = satellites.find((satellite) => satellite.category === category);
    if (first) select(first.id);
    if (typeof window !== 'undefined' && window.innerWidth < 768) setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className={`absolute left-4 top-[4.5rem] z-30 rounded-sm border border-cyan-500/30 bg-black/60 p-2 text-cyan-400 transition-opacity md:hidden ${
          open ? 'pointer-events-none opacity-0' : 'opacity-100'
        }`}
        aria-label="Open objects"
      >
        <Layers size={14} />
      </button>

      <aside
        className={`absolute bottom-14 left-0 top-14 z-20 w-56 border-r border-cyan-500/15 bg-black/55 backdrop-blur-md transition-transform duration-300 ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="flex h-10 items-center justify-between border-b border-cyan-500/10 px-4">
          <span className="text-[10px] tracking-[0.3em] text-cyan-500/70">OBJECTS</span>
          <button
            className="text-cyan-500/60 hover:text-cyan-300 md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <ChevronLeft size={14} />
          </button>
        </div>

        <div className="h-[calc(100%-2.5rem)] overflow-y-auto pb-6">
          {FILTERS.map((filter) => {
            const count = counts[filter.key] ?? 0;
            return (
              <button
                key={filter.key}
                onClick={() => jumpTo(filter.cat)}
                className="group flex w-full items-center justify-between border-l-2 border-transparent px-4 py-2.5 text-left transition hover:border-cyan-400/60 hover:bg-cyan-500/10"
              >
                <span className="text-xs tracking-wide text-white/80 group-hover:text-white">{filter.label}</span>
                <span className="font-mono text-[10px] text-cyan-400/70 group-hover:text-cyan-300">
                  {count.toLocaleString()}
                </span>
              </button>
            );
          })}

          {selectedId && (
            <div className="px-4 pt-6">
              <div className="mb-1 text-[9px] tracking-[0.3em] text-cyan-500/50">TRACKING</div>
              <div className="truncate font-mono text-[10px] text-cyan-300">#{selectedId}</div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
