'use client';

import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSpaceStore } from '@/lib/space/store';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const satellites = useSpaceStore((s) => s.satellites);
  const select = useSpaceStore((s) => s.select);
  const setFollow = useSpaceStore((s) => s.setFollow);
  const selectedId = useSpaceStore((s) => s.selectedId);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const normalized = query.toLowerCase();
    return satellites
      .filter((satellite) => satellite.name.toLowerCase().includes(normalized) || satellite.id.includes(normalized))
      .slice(0, 8);
  }, [query, satellites]);

  useEffect(() => {
    const onDocumentPointerDown = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', onDocumentPointerDown);
    return () => document.removeEventListener('mousedown', onDocumentPointerDown);
  }, []);

  const pick = (id: string, follow = false) => {
    select(id);
    if (follow) setFollow(id);
    setOpen(false);
    setQuery('');
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70" size={14} />
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search satellites..."
          className="w-full rounded-sm border border-cyan-500/25 bg-black/60 py-2 pl-9 pr-8 text-xs tracking-wider text-white placeholder:text-cyan-500/50 transition focus:border-cyan-400/70 focus:outline-none"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setOpen(false);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-cyan-500/60 hover:text-cyan-300"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {open && query && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-80 overflow-auto rounded-sm border border-cyan-500/25 bg-black/90 backdrop-blur slide-in">
          {results.length === 0 && (
            <div className="px-3 py-3 text-[11px] tracking-wider text-white/40">NO MATCHES</div>
          )}
          {results.map((satellite) => (
            <button
              key={satellite.id}
              onClick={() => pick(satellite.id)}
              className={`flex w-full items-center justify-between px-3 py-2 text-left text-xs transition hover:bg-cyan-500/15 ${
                satellite.id === selectedId ? 'bg-cyan-500/10' : ''
              }`}
            >
              <span className="truncate text-white">{satellite.name}</span>
              <span className="ml-2 font-mono text-[10px] text-cyan-400/70">{satellite.category}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
