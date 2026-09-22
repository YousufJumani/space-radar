'use client';

import { useEffect, useState } from 'react';

const STEPS = [
  'INITIALIZING ORBITAL SYSTEM',
  'CONNECTING TO SATELLITE DATA',
  'TRACKING OBJECTS',
];

export default function LoadingScreen({ done }: { done: boolean }) {
  const [step, setStep] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const id = setInterval(() => setStep((current) => Math.min(current + 1, STEPS.length - 1)), 600);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (done && step >= STEPS.length - 1) {
      const t1 = setTimeout(() => setFadeOut(true), 400);
      const t2 = setTimeout(() => setHidden(true), 1300);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [done, step]);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#000308] transition-opacity duration-700 ${
        fadeOut ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-3xl font-light tracking-[0.4em] text-cyan-300 md:text-5xl">
          SPACERADAR
        </h1>
        <p className="text-xs tracking-[0.35em] text-cyan-500/70">LIVE ORBITAL TRACKING</p>
      </div>
      <div className="mb-4 h-[2px] w-64 overflow-hidden bg-cyan-500/15">
        <div
          className="h-full bg-cyan-400 transition-all duration-500"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>
      <div className="font-mono text-[10px] tracking-widest text-cyan-500/70">
        {STEPS[step]}
        <span className="animate-pulse">_</span>
      </div>
    </div>
  );
}
