"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Cpu, Database, Zap } from "lucide-react";

const ACCENT = "#8351FF";

interface HowCardProps {
  step: string;
  title: string;
  description: string;
  icon: ReactNode;
  index: number;
}

function HowCard({ step, title, description, icon, index }: HowCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className="rounded-[14px] border border-white/[0.08] bg-[#111111] p-6"
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.08 }}
      whileHover={
        reduceMotion
          ? {}
          : {
              scale: 1.015,
              borderColor: "rgba(131, 81, 255, 0.4)",
              boxShadow: "0 0 32px rgba(131, 81, 255, 0.12)",
            }
      }
    >
      <div className="mb-4 flex items-center gap-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-[10px]"
          style={{ background: "rgba(131, 81, 255, 0.12)", color: ACCENT }}
        >
          {icon}
        </div>
        <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">{step}</span>
      </div>
      <h3 className="mb-2 font-mono text-base font-semibold text-zinc-100">{title}</h3>
      <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
    </motion.article>
  );
}

const cards: Omit<HowCardProps, "index">[] = [
  {
    step: "01 / Register",
    title: "On-Chain Identity",
    description:
      "Mint your ERC-721 Agent ID NFT on 0G Testnet. One per wallet. Owned forever. No server can revoke it.",
    icon: <Cpu className="h-4 w-4" />,
  },
  {
    step: "02 / Infer",
    title: "Cloudless Inference",
    description:
      "Every prompt routes through 0G Compute — decentralized inference with TEE privacy guarantees.",
    icon: <Zap className="h-4 w-4" />,
  },
  {
    step: "03 / Anchor",
    title: "Persistent Memory",
    description:
      "Sessions go to 0G Storage KV and anchor on-chain via MemoryAnchor. Your agent remembers every session.",
    icon: <Database className="h-4 w-4" />,
  },
];

export function MonadHowSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-24">
      <div className="mb-14 text-center">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest" style={{ color: ACCENT }}>
          Protocol
        </p>
        <h2 className="font-mono text-2xl font-bold text-zinc-100 sm:text-3xl">How It Works</h2>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((c, i) => (
          <HowCard key={c.step} {...c} index={i} />
        ))}
      </div>
    </section>
  );
}
