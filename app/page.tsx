'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import StatusBar from '@/components/StatusBar';
import Sidebar from '@/components/Sidebar';
import Controls from '@/components/Controls';
import SatellitePanel from '@/components/SatellitePanel';
import LoadingScreen from '@/components/LoadingScreen';
import { useSpaceStore } from '@/lib/space/store';
import { fetchSatellites } from '@/lib/space/satelliteApi';
import { simClock } from '@/lib/space/simTime';

const SpaceScene = dynamic(() => import('@/components/SpaceScene'), { ssr: false });

export default function Page() {
  const setSatellites = useSpaceStore((s) => s.setSatellites);
  const [ready, setReady] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { satellites, source } = await fetchSatellites();
      if (cancelled) return;
      simClock.timeMs = Date.now();
      setSatellites(satellites, source);
      setReady(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [setSatellites]);

  return (
    <main className="relative h-dvh min-h-dvh w-full overflow-hidden select-none bg-[#000308]">
      <SpaceScene />
      <StatusBar />
      <Sidebar />
      <SatellitePanel />
      <Controls />
      <LoadingScreen done={ready} />
    </main>
  );
}
