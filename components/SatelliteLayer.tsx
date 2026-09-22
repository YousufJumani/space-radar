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
  ISS: '#9dffff',
  Starlink: '#d6f6ff',
  GPS: '#ffd479',
  Weather: '#b4f5b4',
  Communication: '#ff9dd6',
  Scientific: '#c0a8ff',
  Other: '#b8c4d0',
};

const SIZES: Record<Cat, number> = {
  ISS: 0.032,
  Starlink: 0.013,
  GPS: 0.020,
  Weather: 0.018,
  Communication: 0.018,
  Scientific: 0.018,
  Other: 0.011,
};

export default function SatelliteLayer() {
  const satellites = useSpaceStore((s) => s.satellites);
  const selectedId = useSpaceStore((s) => s.selectedId);
  const select = useSpaceStore((s) => s.select);
  const live = useSpaceStore((s) => s.live);
  const timeScale = useSpaceStore((s) => s.timeScale);

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

    for (const satellite of satellites) {
      const category = (CATEGORIES as readonly string[]).includes(satellite.category)
        ? (satellite.category as Cat)
        : 'Other';
      groups[category].push(satellite);
    }

    return groups;
  }, [satellites]);

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

      const base = SIZES[category];
      for (let i = 0; i < list.length; i++) {
        const satellite = list[i];
        dummy.position.copy(propagate(satellite, t));
        const isSelected = satellite.id === selectedId;
        dummy.scale.setScalar(isSelected ? base * 2.2 : base);
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
        return (
          <instancedMesh
            key={category}
            ref={(mesh) => {
              refs.current[category] = mesh;
            }}
            args={[undefined, undefined, count]}
            onClick={handleClick(category)}
            onPointerOver={() => (document.body.style.cursor = 'pointer')}
            onPointerOut={() => (document.body.style.cursor = 'auto')}
          >
            <sphereGeometry args={[1, 8, 8]} />
            <meshBasicMaterial color={COLORS[category]} toneMapped={false} />
          </instancedMesh>
        );
      })}

      <SelectedSatellite />
      <OrbitTrail />
    </group>
  );
}
