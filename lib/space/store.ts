import { create } from 'zustand';
import type { Satellite } from './satelliteTypes';

interface SpaceState {
  satellites: Satellite[];
  dataSource: 'loading' | 'live';
  selectedId: string | null;
  followId: string | null;
  resetSignal: number;
  showOrbits: boolean;
  nightMode: boolean;
  live: boolean;
  timeScale: number;

  setSatellites: (satellites: Satellite[], source: 'live') => void;
  select: (id: string | null) => void;
  setFollow: (id: string | null) => void;
  triggerReset: () => void;
  toggle: (key: 'showOrbits' | 'nightMode' | 'live') => void;
  setTimeScale: (value: number) => void;
}

export const useSpaceStore = create<SpaceState>((set) => ({
  satellites: [],
  dataSource: 'loading',
  selectedId: null,
  followId: null,
  resetSignal: 0,
  showOrbits: true,
  nightMode: false,
  live: true,
  timeScale: 1,

  setSatellites: (satellites, dataSource) => set({ satellites, dataSource }),
  select: (selectedId) => set({ selectedId }),
  setFollow: (followId) => set({ followId }),
  triggerReset: () => set((s) => ({
    selectedId: null,
    followId: null,
    resetSignal: s.resetSignal + 1,
  })),
  toggle: (key) => set((state) => ({ [key]: !state[key] })),
  setTimeScale: (timeScale) => set({ timeScale }),
}));
