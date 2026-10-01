'use client';

import { useMemo, useState } from 'react';
import { X, Crosshair, Activity, ChevronDown, ChevronUp } from 'lucide-react';
import { useSpaceStore } from '@/lib/space/store';
import { useTelemetry } from '@/lib/space/useTelemetry';

export default function SatellitePanel() {
  const selectedId = useSpaceStore((s) => s.selectedId);
  const satellites = useSpaceStore((s) => s.satellites);
  const select = useSpaceStore((s) => s.select);
  const followId = useSpaceStore((s) => s.followId);
  const setFollow = useSpaceStore((s) => s.setFollow);
  const [collapsed, setCollapsed] = useState(false);

  const sat = useMemo(
    () => satellites.find((item) => item.id === selectedId) || null,
    [selectedId, satellites],
  );

  const telemetry = useTelemetry(sat, 5);

  if (!sat) return null;

  const isFollowed = followId === sat.id;

  return (
    <div className="slide-in absolute z-20 border border-cyan-500/25 bg-black/85 backdrop-blur-xl shadow-2xl rounded-t-lg md:rounded-sm bottom-12 md:bottom-auto left-2 right-2 md:left-auto md:right-4 md:top-20 md:w-80 transition-all duration-300 max-h-[55dvh] md:max-h-[80vh] flex flex-col">
      <div className="flex items-center justify-between border-b border-cyan-500/15 p-3 md:p-4">
        <div className="min-w-0 flex-1 pr-2">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-xs md:text-sm font-medium tracking-wider text-white">{sat.name}</h2>
            <span className="hidden sm:inline font-mono text-[9px] text-cyan-400/80 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
              #{sat.id}
            </span>
          </div>
          {telemetry && (
            <p className="mt-0.5 font-mono text-[10px] text-cyan-300/80 truncate">
              {telemetry.alt.toFixed(0)} km &bull; {telemetry.vel.toLocaleString(undefined, { maximumFractionDigits: 0 })} km/h
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {/* Mobile Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex h-7 w-7 items-center justify-center rounded text-cyan-400/70 hover:bg-white/10 hover:text-white md:hidden"
            aria-label={collapsed ? 'Expand details' : 'Collapse details'}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          <button
            onClick={() => {
              select(null);
              setFollow(null);
            }}
            className="flex h-7 w-7 items-center justify-center rounded text-white/40 hover:bg-white/10 hover:text-white"
            aria-label="Close"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="space-y-2 px-3 py-2.5 md:space-y-2.5 md:px-4 md:py-3 font-mono text-[10px] md:text-[11px] overflow-y-auto">
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
      )}

      <div className="border-t border-cyan-500/15 p-2.5 md:p-3 bg-black/40">
        <button
          onClick={() => setFollow(isFollowed ? null : sat.id)}
          className={`flex w-full items-center justify-center gap-2 rounded-sm border py-2 text-[10px] tracking-[0.25em] transition active:scale-95 ${
            isFollowed
              ? 'border-cyan-400 bg-cyan-500/25 text-cyan-200 shadow-[0_0_10px_rgba(0,200,255,0.2)]'
              : 'border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/15'
          }`}
        >
          {isFollowed ? (
            <>
              <Activity size={11} /> FOLLOWING
            </>
          ) : (
            <>
              <Crosshair size={11} /> TRACK {sat.category === 'ISS' ? 'ISS' : 'TARGET'}
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
