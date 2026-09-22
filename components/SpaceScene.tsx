'use client';

import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense } from 'react';
import Earth from './Earth';
import SatelliteLayer from './SatelliteLayer';
import CameraRig from './CameraRig';

export default function SpaceScene() {
  return (
    <Canvas
      camera={{ position: [0, 1.2, 3.2], fov: 42, near: 0.01, far: 3000 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <color attach="background" args={['#000308']} />

      <ambientLight intensity={0.06} />
      <directionalLight position={[5, 2, 3]} intensity={2.4} color="#fff5e0" />

      <Stars radius={300} depth={80} count={5000} factor={5} saturation={0} fade speed={0.3} />

      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <SatelliteLayer />
      <CameraRig />

      <EffectComposer>
        <Bloom intensity={0.45} luminanceThreshold={0.85} luminanceSmoothing={0.2} mipmapBlur />
      </EffectComposer>
    </Canvas>
  );
}
