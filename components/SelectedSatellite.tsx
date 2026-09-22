'use client';

import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useSpaceStore } from '@/lib/space/store';
import { propagate } from '@/lib/space/satelliteMath';
import { simClock } from '@/lib/space/simTime';

export default function SelectedSatellite() {
  const selectedId = useSpaceStore((s) => s.selectedId);
  const satellites = useSpaceStore((s) => s.satellites);
  const group = useRef<THREE.Group>(null!);
  const ringA = useRef<THREE.Mesh>(null!);
  const ringB = useRef<THREE.Mesh>(null!);
  const sat = satellites.find((s) => s.id === selectedId);

  useFrame((state) => {
    if (!sat || !group.current) return;
    group.current.position.copy(propagate(sat, simClock.timeMs));

    const t = state.clock.elapsedTime;
    [ringA.current, ringB.current].forEach((r, i) => {
      if (!r) return;
      const phase = (t * 0.7 + i * 0.5) % 1;
      const scale = 0.06 + phase * 0.14;
      r.scale.setScalar(scale);
      (r.material as THREE.Material).opacity = 1 - phase;
      r.lookAt(state.camera.position);
    });
  });

  if (!sat) return null;

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[0.022, 12, 12]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh ref={ringA}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial color="#00ffff" transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
      <mesh ref={ringB}>
        <ringGeometry args={[0.9, 1, 48]} />
        <meshBasicMaterial color="#00ffff" transparent side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}
