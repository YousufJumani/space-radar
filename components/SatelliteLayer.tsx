'use client';

import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useSpaceStore } from '@/lib/space/store';
import { propagate } from '@/lib/space/satelliteMath';
import { simClock } from '@/lib/space/simTime';
import SelectedSatellite from './SelectedSatellite';
import OrbitTrail from './OrbitTrail';

const CATEGORIES = ['ISS', 'Starlink', 'GPS', 'Weather', 'Communication', 'Scientific', 'Other'] as const;
type Cat = typeof CATEGORIES[number];

const COLORS: Record<Cat, string> = {
  ISS: '#00f2fe',
  Starlink: '#8ec5dc',
  GPS: '#ffc837',
  Weather: '#4eed94',
  Communication: '#ff70a6',
  Scientific: '#b983ff',
  Other: '#a0aec0',
};

const SIZES: Record<Cat, { curated: number; dense: number }> = {
  ISS: { curated: 0.038, dense: 0.035 },
  Starlink: { curated: 0.0075, dense: 0.0035 },
  GPS: { curated: 0.022, dense: 0.016 },
  Weather: { curated: 0.020, dense: 0.014 },
  Communication: { curated: 0.018, dense: 0.012 },
  Scientific: { curated: 0.022, dense: 0.016 },
  Other: { curated: 0.010, dense: 0.004 },
};

export default function SatelliteLayer() {
  const satellites = useSpaceStore((s) => s.satellites);
  const selectedId = useSpaceStore((s) => s.selectedId);
  const select = useSpaceStore((s) => s.select);
  const live = useSpaceStore((s) => s.live);
  const timeScale = useSpaceStore((s) => s.timeScale);
  const activeCategory = useSpaceStore((s) => s.activeCategory);
  const viewDensity = useSpaceStore((s) => s.viewDensity);

  const grouped = useMemo(() => {
    const groups: Record<Cat, typeof satellites> = {
      ISS: [],
      Starlink: [],
      GPS: [],
      Weather: [],
      Communication: [],
      Scientific: [],
      Other: [],
    };

    // Filter by active category if not 'all'
    const pool = satellites.filter((sat) => {
      if (activeCategory === 'all') return true;
      return sat.category === activeCategory || sat.id === selectedId;
    });

    if (viewDensity === 'dense') {
      for (const satellite of pool) {
        const cat = (CATEGORIES as readonly string[]).includes(satellite.category)
          ? (satellite.category as Cat)
          : 'Other';
        groups[cat].push(satellite);
      }
      return groups;
    }

    // Curated Live Mode: Intelligently sample mega-constellations so the view is clean and beautiful
    // Retain 100% of Space Stations, GPS, Weather, and Scientific.
    const starlinkPool: typeof satellites = [];
    const commPool: typeof satellites = [];
    const otherPool: typeof satellites = [];

    for (const sat of pool) {
      if (sat.id === selectedId) {
        const cat = (CATEGORIES as readonly string[]).includes(sat.category)
          ? (sat.category as Cat)
          : 'Other';
        groups[cat].push(sat);
        continue;
      }

      if (
        sat.category === 'ISS' ||
        sat.category === 'GPS' ||
        sat.category === 'Weather' ||
        sat.category === 'Scientific'
      ) {
        groups[sat.category as Cat].push(sat);
      } else if (sat.category === 'Starlink') {
        starlinkPool.push(sat);
      } else if (sat.category === 'Communication') {
        commPool.push(sat);
      } else {
        otherPool.push(sat);
      }
    }

    // Sample Starlink evenly: ~70 when in all view, or ~180 when specifically viewing Starlink category
    const targetStarlink = activeCategory === 'Starlink' ? 180 : 70;
    const starlinkStep = Math.max(1, Math.floor(starlinkPool.length / targetStarlink));
    for (let i = 0; i < starlinkPool.length && groups.Starlink.length < targetStarlink; i += starlinkStep) {
      groups.Starlink.push(starlinkPool[i]);
    }

    // Sample Comms: up to 90
    const targetComm = 90;
    const commStep = Math.max(1, Math.floor(commPool.length / targetComm));
    for (let i = 0; i < commPool.length && groups.Communication.length < targetComm; i += commStep) {
      groups.Communication.push(commPool[i]);
    }

    // Sample Other: up to 30
    const targetOther = 30;
    const otherStep = Math.max(1, Math.floor(otherPool.length / targetOther));
    for (let i = 0; i < otherPool.length && groups.Other.length < targetOther; i += otherStep) {
      groups.Other.push(otherPool[i]);
    }

    return groups;
  }, [satellites, activeCategory, viewDensity, selectedId]);

  const refs = useRef<Record<Cat, THREE.InstancedMesh | null>>({
    ISS: null,
    Starlink: null,
    GPS: null,
    Weather: null,
    Communication: null,
    Scientific: null,
    Other: null,
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, dt) => {
    if (live) simClock.timeMs += dt * 1000 * timeScale * 30;
    const t = simClock.timeMs;

    for (const category of CATEGORIES) {
      const mesh = refs.current[category];
      const list = grouped[category];
      if (!mesh || list.length === 0) continue;

      const base = SIZES[category][viewDensity];
      for (let i = 0; i < list.length; i++) {
        const satellite = list[i];
        dummy.position.copy(propagate(satellite, t));
        const isSelected = satellite.id === selectedId;
        dummy.scale.setScalar(isSelected ? base * 2.3 : base);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.count = list.length;
    }
  });

  const handleClick = (category: Cat) => (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    const index = event.instanceId;
    if (index === undefined) return;
    const satellite = grouped[category][index];
    if (satellite) select(satellite.id);
  };

  return (
    <group>
      {CATEGORIES.map((category) => {
        const list = grouped[category];
        const count = Math.max(list.length, 1);
        const isStarlink = category === 'Starlink';
        const isOther = category === 'Other';
        const opacity =
          viewDensity === 'dense' && (isStarlink || isOther)
            ? 0.35
            : isStarlink
              ? 0.75
              : 0.95;

        return (
          <instancedMesh
            key={`${category}-${viewDensity}-${activeCategory}`}
            ref={(mesh) => {
              refs.current[category] = mesh;
            }}
            args={[undefined, undefined, count]}
            onClick={handleClick(category)}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial
              color={COLORS[category]}
              toneMapped={false}
              transparent
              opacity={opacity}
            />
          </instancedMesh>
        );
      })}

      <SelectedSatellite />
      <OrbitTrail />
    </group>
  );
}
