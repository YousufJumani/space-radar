'use client';

import { useMemo } from 'react';
import { X, Crosshair, Activity } from 'lucide-react';
import { useSpaceStore } from '@/lib/space/store';
import { useTelemetry } from '@/lib/space/useTelemetry';

export default function SatellitePanel() {
  const selectedId = useSpaceStore((s) => s.selectedId);
  const satellites = useSpaceStore((s) => s.satellites);
  const select = useSpaceStore((s) => s.select);
  const followId = useSpaceStore((s) => s.followId);
  const setFollow = useSpaceStore((s) => s.setFollow);

  const sat = useMemo(
    () => satellites.find((item) => item.id === selectedId) || null,
    [selectedId, satellites],
  );

  const telemetry = useTelemetry(sat, 5);

  if (!sat) return null;

  const isFollowed = followId === sat.id;

  return (
    <div className="slide-in absolute right-4 top-20 z-20 w-80 max-w-[calc(100vw-2rem)] rounded-sm border border-cyan-500/25 bg-black/70 backdrop-blur-md">
      <div className="flex items-start justify-between border-b border-cyan-500/15 p-4">
        <div className="min-w-0">
          <h2 className="truncate text-sm font-medium tracking-wider text-white">{sat.name}</h2>
          <p className="mt-0.5 font-mono text-[10px] text-cyan-400/70">NORAD {sat.id}</p>
        </div>
        <button
          onClick={() => {
            select(null);
            setFollow(null);
          }}
          className="ml-2 shrink-0 text-white/40 hover:text-white"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      <div className="space-y-2.5 px-4 py-3 font-mono text-[11px]">
        <Row label="STATUS">
          <span className="flex items-center gap-1.5 text-green-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
            TRACKING
          </span>
        </Row>
        <Row label="CATEGORY">
          <span className="text-cyan-200">{sat.category}</span>
        </Row>
        <Row label="ALTITUDE">{telemetry ? `${telemetry.alt.toFixed(1)} km` : '—'}</Row>
        <Row label="VELOCITY">
          {telemetry ? `${telemetry.vel.toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h` : '—'}
        </Row>
        <Row label="LATITUDE">{telemetry ? `${telemetry.lat.toFixed(2)}°` : '—'}</Row>
        <Row label="LONGITUDE">{telemetry ? `${telemetry.lon.toFixed(2)}°` : '—'}</Row>
        <Row label="INCLINATION">{sat.inclination.toFixed(2)}°</Row>
        <Row label="PERIOD">{sat.period ? `${sat.period.toFixed(1)} min` : '—'}</Row>
        <Row label="ECCENTRICITY">{sat.eccentricity.toFixed(4)}</Row>
      </div>

      <div className="border-t border-cyan-500/15 p-3">
        <button
          onClick={() => setFollow(isFollowed ? null : sat.id)}
          className={`flex w-full items-center justify-center gap-2 rounded-sm border py-2 text-[10px] tracking-[0.3em] transition ${
            isFollowed
              ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200'
              : 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15'
          }`}
        >
          {isFollowed ? (
            <>
              <Activity size={11} /> FOLLOWING
            </>
          ) : (
            <>
              <Crosshair size={11} /> TRACK {sat.category === 'ISS' ? 'ISS' : 'OBJECT'}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] tracking-widest text-white/40">{label}</span>
      <span className="text-white">{children}</span>
    </div>
  );
}
