'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { useSpaceStore } from '@/lib/space/store';
import { propagate } from '@/lib/space/satelliteMath';

export default function OrbitTrail() {
  const selectedId = useSpaceStore((s) => s.selectedId);
  const satellites = useSpaceStore((s) => s.satellites);
  const showOrbits = useSpaceStore((s) => s.showOrbits);

  const sat = satellites.find((s) => s.id === selectedId);

  const { orbitLine, groundLine } = useMemo(() => {
    if (!sat || !showOrbits) return { orbitLine: null, groundLine: null };

    const periodMs = (sat.period ?? 90) * 60 * 1000;
    const N = 220;

    const orbitPts: THREE.Vector3[] = [];
    const groundPts: THREE.Vector3[] = [];

    for (let i = 0; i <= N; i++) {
      const p = propagate(sat, sat.epoch + (periodMs * i) / N);
      orbitPts.push(p);
      groundPts.push(p.clone().normalize().multiplyScalar(1.005));
    }

    const orbitLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(orbitPts),
      new THREE.LineBasicMaterial({ color: 0x00d4ff, transparent: true, opacity: 0.55 }),
    );

    const groundLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(groundPts),
      new THREE.LineBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.85 }),
    );

    return { orbitLine, groundLine };
  }, [sat, showOrbits]);

  if (!sat || !showOrbits) return null;

  return (
    <>
      {orbitLine && <primitive object={orbitLine} />}
      {groundLine && <primitive object={groundLine} />}
    </>
  );
}
