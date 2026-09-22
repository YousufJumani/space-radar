'use client';

import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

const DAY = 'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg';
const NIGHT = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';

export default function Earth() {
  const ref = useRef<THREE.Mesh>(null!);
  const [day, night] = useTexture([DAY, NIGHT]);

  useMemo(() => {
    day.colorSpace = THREE.SRGBColorSpace;
    night.colorSpace = THREE.SRGBColorSpace;
  }, [day, night]);

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.02;
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[1, 96, 96]} />
      <meshStandardMaterial
        map={day}
        emissiveMap={night}
        emissive={new THREE.Color('#ffb570')}
        emissiveIntensity={1.2}
        roughness={1}
        metalness={0}
      />
    </mesh>
  );
}
