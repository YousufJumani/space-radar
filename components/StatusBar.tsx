'use client';

import { useEffect, useState } from 'react';
import { Satellite as SatIcon, Layers } from 'lucide-react';
import { useSpaceStore } from '@/lib/space/store';
import SearchBar from './SearchBar';

export default function StatusBar() {
  const [utc, setUtc] = useState('');
  const dataSource = useSpaceStore((s) => s.dataSource);
  const toggle = useSpaceStore((s) => s.toggle);

  useEffect(() => {
    const tick = () => {
      setUtc(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="absolute left-0 right-0 top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-cyan-500/15 bg-black/60 px-3 sm:px-4 backdrop-blur-md">
      <div className="flex shrink-0 items-center gap-2">
        <button
          onClick={() => toggle('sidebarOpen')}
          className="flex h-8 w-8 items-center justify-center rounded border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 md:hidden hover:bg-cyan-500/20 active:scale-95 transition"
          aria-label="Toggle Catalog"
          title="Toggle Constellations Catalog"
        >
          <Layers size={14} />
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <SatIcon className="text-cyan-400" size={15} />
          <span className="text-xs sm:text-sm font-light tracking-[0.2em] sm:tracking-[0.35em] text-cyan-300">
            SPACERADAR
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 border-l border-cyan-500/20 pl-4 md:flex">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            dataSource === 'loading'
              ? 'bg-gray-500'
              : 'animate-pulse bg-green-400'
          }`}
        />
        <span className="text-[10px] tracking-widest text-white/60">
          {dataSource === 'loading' ? 'CONNECTING' : 'LIVE DATA'}
        </span>
      </div>

      <div className="mx-1 sm:mx-2 max-w-xs sm:max-w-md flex-1">
        <SearchBar />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <div className="flex items-center gap-1.5 md:hidden">
          <span
            className={`h-2 w-2 rounded-full ${
              dataSource === 'loading' ? 'bg-gray-500' : 'animate-pulse bg-green-400'
            }`}
            title={dataSource === 'loading' ? 'Connecting' : 'Live NORAD Telemetry'}
          />
        </div>

        <div className="hidden font-mono text-[10px] tracking-widest text-cyan-400/70 lg:block">
          {utc}
        </div>
      </div>
    </header>
  );
}
