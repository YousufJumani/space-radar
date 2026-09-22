'use client';

import { useEffect, useState } from 'react';
import { Satellite as SatIcon } from 'lucide-react';
import { useSpaceStore } from '@/lib/space/store';
import SearchBar from './SearchBar';

export default function StatusBar() {
  const [utc, setUtc] = useState('');
  const dataSource = useSpaceStore((s) => s.dataSource);

  useEffect(() => {
    const tick = () => {
      setUtc(new Date().toISOString().replace('T', ' ').substring(0, 19) + ' UTC');
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="absolute left-0 right-0 top-0 z-30 flex h-14 items-center gap-4 border-b border-cyan-500/15 bg-black/55 px-4 backdrop-blur-md">
      <div className="flex shrink-0 items-center gap-2">
        <SatIcon className="text-cyan-400" size={16} />
        <span className="text-sm font-light tracking-[0.35em] text-cyan-300">SPACERADAR</span>
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

      <div className="mx-auto w-full max-w-md flex-1">
        <SearchBar />
      </div>

      <div className="hidden shrink-0 font-mono text-[10px] tracking-widest text-cyan-400/70 md:block">
        {utc}
      </div>
    </header>
  );
}
