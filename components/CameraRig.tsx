'use client';

import { OrbitControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useSpaceStore } from '@/lib/space/store';
import { propagate } from '@/lib/space/satelliteMath';
import { simClock } from '@/lib/space/simTime';

const DEFAULT_CAM = new THREE.Vector3(0, 1.2, 3.2);
const DEFAULT_TARGET = new THREE.Vector3(0, 0, 0);

export default function CameraRig() {
  const controlsRef = useRef<any>(null);
  const { camera } = useThree();
  const followId = useSpaceStore((s) => s.followId);
  const selectedId = useSpaceStore((s) => s.selectedId);
  const satellites = useSpaceStore((s) => s.satellites);
  const resetSignal = useSpaceStore((s) => s.resetSignal);

  const targetCamPos = useRef(DEFAULT_CAM.clone());
  const targetLookAt = useRef(DEFAULT_TARGET.clone());
  const flying = useRef(false);

  useEffect(() => {
    if (followId) return;
    if (!selectedId) return;
    const sat = satellites.find((s) => s.id === selectedId);
    if (!sat) return;

    const pos = propagate(sat, simClock.timeMs);
    const offset = pos.clone().normalize().multiplyScalar(0.9);
    offset.y += 0.15;
    targetCamPos.current.copy(pos).add(offset);
    targetLookAt.current.copy(pos);
    flying.current = true;
  }, [selectedId, followId, satellites]);

  useEffect(() => {
    if (resetSignal === 0) return;
    targetCamPos.current.copy(DEFAULT_CAM);
    targetLookAt.current.copy(DEFAULT_TARGET);
    flying.current = true;
  }, [resetSignal]);

  const followedSat = followId ? satellites.find((s) => s.id === followId) : null;

  useFrame(() => {
    if (!controlsRef.current) return;

    if (followedSat) {
      const pos = propagate(followedSat, simClock.timeMs);
      const offset = pos.clone().normalize().multiplyScalar(1.6);
      offset.y += 0.2;
      camera.position.lerp(pos.clone().add(offset), 0.06);
      controlsRef.current.target.lerp(pos, 0.1);
      controlsRef.current.update();
      return;
    }

    if (flying.current) {
      camera.position.lerp(targetCamPos.current, 0.08);
      controlsRef.current.target.lerp(targetLookAt.current, 0.1);
      controlsRef.current.update();

      const camClose = camera.position.distanceTo(targetCamPos.current) < 0.03;
      const targetClose = controlsRef.current.target.distanceTo(targetLookAt.current) < 0.03;
      if (camClose && targetClose) {
        flying.current = false;
        camera.position.copy(targetCamPos.current);
        controlsRef.current.target.copy(targetLookAt.current);
        controlsRef.current.update();
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enablePan
      panSpeed={0.5}
      enableDamping
      dampingFactor={0.08}
      rotateSpeed={0.6}
      zoomSpeed={0.9}
      minDistance={0.3}
      maxDistance={40}
    />
  );
}
