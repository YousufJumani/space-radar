'use client';

import { useEffect, useState } from 'react';
import type { Satellite } from './satelliteTypes';
import { propagate, getLatLon } from './satelliteMath';
import { simClock } from './simTime';

const MU = 398600.4418;
const R = 6371;

export function useTelemetry(sat: Satellite | null, hz = 5) {
  const [data, setData] = useState<{ lat: number; lon: number; alt: number; vel: number } | null>(null);

  useEffect(() => {
    if (!sat) {
      setData(null);
      return;
    }

    const tick = () => {
      const t = simClock.timeMs;
      const pos = propagate(sat, t);
      const { lat, lon } = getLatLon(pos, t);
      const r = pos.length() * R;
      const alt = r - R;
      const n = (sat.meanMotion * 2 * Math.PI) / 86400;
      const a = Math.cbrt(MU / (n * n));
      const v = Math.sqrt(Math.max(MU * (2 / r - 1 / a), 0)) * 3600;
      setData({ lat, lon, alt, vel: v });
    };

    tick();
    const id = setInterval(tick, 1000 / hz);
    return () => clearInterval(id);
  }, [sat, hz]);

  return data;
}
