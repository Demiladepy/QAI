"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { BrandLogo } from "@/components/BrandLogo";
import {
  ArrowRight,
  Cpu,
  Database,
  Link as LinkIcon,
  Lock,
  Zap,
} from "lucide-react";

const ACCENT = "#8351FF";
const FG_ON_ACCENT = "#0a0a0a";

const heroWords: { text: string; accent: boolean }[] = [
  { text: "Autonomous", accent: true },
  { text: "AI", accent: true },
  { text: "Agents", accent: true },
  { text: "on", accent: false },
  { text: "Decentralized", accent: false },
  { text: "Infrastructure", accent: false },
];

const pills: { label: string; Icon: typeof Cpu }[] = [
  { label: "On-Chain Identity", Icon: LinkIcon },
  { label: "0G Storage Memory", Icon: Database },
  { label: "0G Compute Inference", Icon: Zap },
  { label: "TEE Privacy", Icon: Lock },
];

export function MonadHero() {
  const reduceMotion = useReducedMotion();
  const stagger = reduceMotion ? 0 : 0.055;
  const dur = reduceMotion ? 0 : 0.45;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 text-center">
      <div className="relative z-10 mx-auto max-w-3xl">
        <motion.div
          className="mb-8 flex items-center justify-center"
          initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: dur, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            className="rounded-2xl px-4 py-2"
            style={{
              boxShadow: `0 0 48px rgba(131, 81, 255, 0.25)`,
              background: "rgba(0,0,0,0.45)",
            }}
          >
            <BrandLogo heightPx={56} priority className="max-w-[min(280px,85vw)]" />
          </div>
        </motion.div>

        <motion.h1
          className="mb-5 font-mono text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: {
              transition: { staggerChildren: stagger, delayChildren: reduceMotion ? 0 : 0.08 },
            },
          }}
        >
          {heroWords.map(({ text, accent }, i) => (
            <motion.span
              key={`${text}-${i}`}
              className="mr-[0.25em] inline-block"
              variants={{
                hidden: { opacity: 0, y: reduceMotion ? 0 : 14 },
                show: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: dur, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              style={
                accent
                  ? {
                      background: `linear-gradient(135deg, ${ACCENT} 0%, #b794f6 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }
                  : { color: "#fafafa" }
              }
            >
              {text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          className="mx-auto mb-10 max-w-xl text-base text-zinc-400 sm:text-lg"
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, delay: reduceMotion ? 0 : 0.35 }}
        >
          Every AI agent deserves a persistent on-chain identity, cross-session memory,
          and cloudless inference — all powered by 0G infrastructure.
        </motion.p>

        <motion.div
          className="mb-14 flex flex-col justify-center gap-3 sm:flex-row"
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: dur, delay: reduceMotion ? 0 : 0.45 }}
        >
          <motion.div whileHover={reduceMotion ? {} : { scale: 1.02 }} whileTap={reduceMotion ? {} : { scale: 0.98 }}>
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] px-6 py-3 font-mono text-sm font-bold transition-shadow"
              style={{
                background: ACCENT,
                color: FG_ON_ACCENT,
                boxShadow: `0 0 28px rgba(131, 81, 255, 0.35)`,
              }}
            >
              Launch Your Agent <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
          <motion.div whileHover={reduceMotion ? {} : { scale: 1.01 }} whileTap={reduceMotion ? {} : { scale: 0.99 }}>
            <Link
              href="/dao"
              className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-white/10 px-6 py-3 font-mono text-sm font-semibold text-zinc-300 transition-colors hover:border-[rgba(131,81,255,0.45)] hover:bg-white/[0.04] hover:text-white"
            >
              DAO Governance
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-3"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: dur, delay: reduceMotion ? 0 : 0.55 }}
        >
          {pills.map(({ label, Icon }) => (
            <motion.div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-4 py-1.5 backdrop-blur-md"
              whileHover={
                reduceMotion
                  ? {}
                  : {
                      borderColor: "rgba(131, 81, 255, 0.35)",
                      boxShadow: "0 0 20px rgba(131, 81, 255, 0.15)",
                    }
              }
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: ACCENT }} aria-hidden />
              <span className="font-mono text-xs text-zinc-400">{label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 animate-breathe opacity-30">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-white/15 pt-1.5">
          <div className="h-2 w-1 animate-float rounded-full bg-zinc-500" />
        </div>
      </div>
    </section>
  );
}
