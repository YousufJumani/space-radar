import * as THREE from 'three';
import type { Satellite } from './satelliteTypes';

const MU = 398600.4418;
const EARTH_RADIUS_KM = 6371;

function solveKepler(M: number, e: number): number {
  let E = M;
  for (let i = 0; i < 6; i++) {
    E = E - (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  }
  return E;
}

export function propagate(sat: Satellite, timeMs: number): THREE.Vector3 {
  const dt = (timeMs - sat.epoch) / 1000;
  const n = (sat.meanMotion * 2 * Math.PI) / 86400;
  const a = Math.cbrt(MU / (n * n));
  const e = sat.eccentricity;
  const i = (sat.inclination * Math.PI) / 180;
  const raan = (sat.raan * Math.PI) / 180;
  const argp = (sat.argPerigee * Math.PI) / 180;
  const M0 = (sat.meanAnomaly * Math.PI) / 180;
  const M = M0 + n * dt;
  const E = solveKepler(M, e);

  const xOrb = a * (Math.cos(E) - e);
  const yOrb = a * Math.sqrt(1 - e * e) * Math.sin(E);

  const x1 = xOrb * Math.cos(argp) - yOrb * Math.sin(argp);
  const y1 = xOrb * Math.sin(argp) + yOrb * Math.cos(argp);

  const x2 = x1;
  const y2 = y1 * Math.cos(i);
  const z2 = y1 * Math.sin(i);

  const x3 = x2 * Math.cos(raan) - y2 * Math.sin(raan);
  const y3 = x2 * Math.sin(raan) + y2 * Math.cos(raan);
  const z3 = z2;

  const scale = 1 / EARTH_RADIUS_KM;

  return new THREE.Vector3(x3 * scale, z3 * scale, -y3 * scale);
}

export function computeAltitudeVelocity(sat: Satellite) {
  const n = (sat.meanMotion * 2 * Math.PI) / 86400;
  const a = Math.cbrt(MU / (n * n));
  const altitude = a - EARTH_RADIUS_KM;
  const period = (2 * Math.PI) / n / 60;
  const velocity = Math.sqrt(MU / a) * 3600;
  return { altitude, velocity, period };
}

export function getLatLon(pos: THREE.Vector3, timeMs: number) {
  const r = pos.length();
  const lat = (Math.asin(pos.y / r) * 180) / Math.PI;
  let lon = (Math.atan2(pos.z, pos.x) * 180) / Math.PI;
  const gmst = ((timeMs / 1000 / 86400) * 2 * Math.PI) % (2 * Math.PI);
  lon -= (gmst * 180) / Math.PI;
  while (lon > 180) lon -= 360;
  while (lon < -180) lon += 360;
  return { lat, lon };
}
