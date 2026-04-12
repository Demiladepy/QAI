"use client";

import dynamic from "next/dynamic";

const OgSolarSystemCanvas = dynamic(() => import("./OgSolarSystemCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[min(620px,78vh)] w-full items-center justify-center rounded-[20px] border border-white/[0.08] bg-[#0a0a0a] font-mono text-xs text-zinc-500">
      Initializing orbital system…
    </div>
  ),
});

export function OgSolarSystem() {
  return (
    <div className="relative h-[min(620px,78vh)] w-full overflow-hidden rounded-[20px] border border-white/[0.1] bg-[#0a0a0a] shadow-[0_0_60px_rgba(131,81,255,0.08)]">
      <OgSolarSystemCanvas />
      <p className="pointer-events-none absolute bottom-3 left-0 right-0 text-center font-mono text-[10px] uppercase tracking-widest text-zinc-600">
        WebGL · high-performance · neon data arcs
      </p>
    </div>
  );
}
