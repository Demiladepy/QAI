"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Database, Link as LinkIcon, Shield, Zap } from "lucide-react";
import { OgSolarSystem } from "@/components/architecture/OgSolarSystem";

const ACCENT = "#8351FF";

const modules: { label: string; desc: string; icon: ReactNode }[] = [
  { label: "0G Testnet EVM", desc: "Deploy + anchor contracts", icon: <LinkIcon className="h-3.5 w-3.5" /> },
  { label: "0G Storage KV", desc: "Fast session memory reads", icon: <Database className="h-3.5 w-3.5" /> },
  { label: "0G Compute", desc: "Cloudless LLM inference", icon: <Zap className="h-3.5 w-3.5" /> },
  { label: "0G Storage Log", desc: "Append-only transcript archive", icon: <Database className="h-3.5 w-3.5" /> },
  { label: "TEE Nodes", desc: "Private ZK inference (Phase 2)", icon: <Shield className="h-3.5 w-3.5" /> },
];

export function MonadArchitectureSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <div className="mb-12 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
          Architecture
        </p>
        <h2 className="font-mono text-2xl font-bold text-zinc-100 sm:text-3xl">Built on 0G Infrastructure</h2>
        <p className="mx-auto mt-3 max-w-xl font-mono text-xs text-zinc-500">
          Live orbital model: binary hub, inner Wallet, chain moons (Compute · Storage · KV · Log), outer MemoryAnchor,
          EVM satellite, and pulsing data arcs.
        </p>
      </div>

      <OgSolarSystem />

      <div className="mx-auto mt-8 max-w-5xl rounded-[20px] border border-white/[0.08] bg-[#111111] p-6 sm:p-8">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-zinc-500">Module reference</p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((item, index) => (
            <motion.div
              key={item.label}
              className="flex items-start gap-3 rounded-[10px] border border-white/[0.06] bg-[#161616] p-3"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: reduceMotion ? 0 : index * 0.05 }}
              whileHover={
                reduceMotion ? {} : { borderColor: "rgba(131, 81, 255, 0.25)", y: -2 }
              }
            >
              <div className="mt-0.5 shrink-0" style={{ color: ACCENT }}>
                {item.icon}
              </div>
              <div>
                <div className="font-mono text-xs font-semibold text-zinc-100">{item.label}</div>
                <div className="mt-0.5 font-mono text-xs text-zinc-500">{item.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
