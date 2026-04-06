"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Cpu, Database, Link as LinkIcon, Shield, Zap, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Animated count-up ─────────────────────────────────────────

function CountUp({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    const start = Date.now();
    const duration = 1200;
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(value * eased));
      if (progress < 1) frameRef.current = requestAnimationFrame(step);
    };
    frameRef.current = requestAnimationFrame(step);
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current); };
  }, [value]);

  return <span>{display.toLocaleString()}</span>;
}

// ── How It Works card ─────────────────────────────────────────

function HowCard({
  step, title, description, icon, delay,
}: {
  step: string; title: string; description: string; icon: React.ReactNode; delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver((entries) => { if (entries[0]?.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("bento-card p-6 transition-all duration-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-[var(--radius)] flex items-center justify-center bg-[var(--accent-muted)]">
          <div style={{ color: "var(--accent)" }}>{icon}</div>
        </div>
        <span className="text-xs font-mono text-[var(--text-tertiary)] tracking-widest uppercase">{step}</span>
      </div>
      <h3 className="text-base font-semibold font-mono text-[var(--text-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{description}</p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────

export default function HomePage() {
  const heroWords = ["Autonomous", "AI", "Agents", "on", "Decentralized", "Infrastructure"];
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-root)" }}>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-4 text-center overflow-hidden">
        <div className="node-mesh" aria-hidden />
        <div className="absolute inset-0 pointer-events-none" style={{ background: "var(--gradient-glow)" }} aria-hidden />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-[#09090b] text-2xl font-bold font-mono"
              style={{ background: "var(--accent)", boxShadow: "0 0 48px var(--accent-glow)" }}
            >
              Q
            </div>
          </div>

          {/* Headline — staggered */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold font-mono tracking-tight mb-5 leading-tight">
            {heroWords.map((word, i) => (
              <span
                key={i}
                className={cn("inline-block mr-[0.25em] transition-all duration-500", visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                {i < 3 ? <span className="text-gradient">{word}</span> : <span className="text-[var(--text-primary)]">{word}</span>}
              </span>
            ))}
          </h1>

          <p
            className="text-base sm:text-lg text-[var(--text-secondary)] mb-10 max-w-xl mx-auto transition-all duration-500"
            style={{ opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(8px)", transitionDelay: "400ms" }}
          >
            Every AI agent deserves a persistent on-chain identity, cross-session memory,
            and cloudless inference — all powered by 0G infrastructure.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center mb-14 transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0, transitionDelay: "550ms" }}
          >
            <Link
              href="/app"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius)] text-sm font-bold font-mono text-[#09090b] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--accent)", boxShadow: "0 0 30px var(--accent-glow)" }}
            >
              Launch Your Agent <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dao"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius)] text-sm font-semibold border border-[var(--border-default)] text-[var(--text-secondary)] transition-all duration-150 hover:border-[var(--accent-border)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
            >
              DAO Governance
            </Link>
          </div>

          {/* Live stat pills */}
          <div
            className="flex flex-wrap justify-center gap-3 transition-opacity duration-500"
            style={{ opacity: visible ? 1 : 0, transitionDelay: "700ms" }}
          >
            {[
              { label: "On-Chain Identity", icon: "🔗" },
              { label: "0G Storage Memory", icon: "🧠" },
              { label: "0G Compute Inference", icon: "⚡" },
              { label: "TEE Privacy", icon: "🔒" },
            ].map((pill) => (
              <div key={pill.label} className="glass rounded-full px-4 py-1.5 flex items-center gap-2">
                <span className="text-xs">{pill.icon}</span>
                <span className="text-xs font-mono text-[var(--text-secondary)]">{pill.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-30 animate-breathe">
          <div className="w-5 h-8 rounded-full border border-[var(--border-default)] flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 rounded-full bg-[var(--text-tertiary)] animate-float" />
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-24 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-xs font-mono text-[var(--accent)] tracking-widest uppercase mb-3">Protocol</p>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <HowCard step="01 / Register" title="On-Chain Identity" description="Mint your ERC-721 Agent ID NFT on 0G Testnet. One per wallet. Owned forever. No server can revoke it." icon={<Cpu className="w-4 h-4" />} delay={0} />
          <HowCard step="02 / Infer" title="Cloudless Inference" description="Every prompt routes through 0G Compute — a decentralized inference network with TEE privacy guarantees. No data leaks." icon={<Zap className="w-4 h-4" />} delay={100} />
          <HowCard step="03 / Anchor" title="Persistent Memory" description="Sessions are written to 0G Storage KV and anchored on-chain via MemoryAnchor. Your agent remembers across every session." icon={<Database className="w-4 h-4" />} delay={200} />
        </div>
      </section>

      {/* ── Architecture ── */}
      <section className="py-16 px-4 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-mono text-[var(--accent)] tracking-widest uppercase mb-3">Architecture</p>
          <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)]">Built on 0G Infrastructure</h2>
        </div>
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[var(--radius-xl)] p-8">
          {/* Flow diagram */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {[
              { label: "Wallet", sub: "wagmi", accent: true },
              { label: "AgentRegistry", sub: "ERC-721", accent: false },
              { label: "0G Compute", sub: "Inference", accent: true },
              { label: "0G Storage", sub: "KV + Log", accent: false },
              { label: "MemoryAnchor", sub: "On-chain", accent: false },
            ].map((node, i, arr) => (
              <div key={node.label} className="flex items-center gap-2">
                <div className={cn("rounded-[var(--radius-lg)] px-4 py-3 border text-center", node.accent ? "bg-[var(--accent-muted)] border-[var(--accent-border)]" : "bg-[var(--bg-elevated)] border-[var(--border-default)]")}>
                  <div className={cn("text-xs font-mono font-semibold", node.accent ? "text-[var(--accent)]" : "text-[var(--text-primary)]")}>{node.label}</div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{node.sub}</div>
                </div>
                {i < arr.length - 1 && <ArrowRight className="w-3.5 h-3.5 text-[var(--text-tertiary)] shrink-0" />}
              </div>
            ))}
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-6 border-t border-[var(--border-subtle)]">
            {[
              { label: "0G Testnet EVM", desc: "Deploy + anchor contracts", icon: <LinkIcon className="w-3.5 h-3.5" /> },
              { label: "0G Storage KV", desc: "Fast session memory reads", icon: <Database className="w-3.5 h-3.5" /> },
              { label: "0G Compute", desc: "Cloudless LLM inference", icon: <Zap className="w-3.5 h-3.5" /> },
              { label: "0G Storage Log", desc: "Append-only transcript archive", icon: <Database className="w-3.5 h-3.5" /> },
              { label: "TEE Nodes", desc: "Private ZK inference (Phase 2)", icon: <Shield className="w-3.5 h-3.5" /> },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 p-3 rounded-[var(--radius)] bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <div className="mt-0.5 text-[var(--accent)]">{item.icon}</div>
                <div>
                  <div className="text-xs font-mono font-semibold text-[var(--text-primary)]">{item.label}</div>
                  <div className="text-xs text-[var(--text-tertiary)] mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="rounded-[var(--radius-xl)] px-8 py-12 border" style={{ background: "linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)", borderColor: "var(--accent-border)", boxShadow: "0 0 60px var(--accent-glow)" }}>
            <h2 className="text-2xl sm:text-3xl font-bold font-mono text-[var(--text-primary)] mb-3">
              Ready to give your agent<br />
              <span className="text-gradient">a permanent identity?</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mb-8">
              Connect your wallet, mint an Agent ID, and start building memory that outlasts any session.
            </p>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-[var(--radius)] text-sm font-bold font-mono text-[#09090b] transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: "var(--accent)", boxShadow: "0 0 24px var(--accent-glow)" }}
            >
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--border-subtle)] py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-[#09090b] text-xs font-bold font-mono" style={{ background: "var(--accent)" }}>Q</div>
            <span className="text-xs font-mono text-[var(--text-tertiary)]">QAI — Built for the 0G Hackathon</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://chainscan-galileo.0g.ai" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
              0G Explorer <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://0g.ai" target="_blank" rel="noopener noreferrer" className="text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors flex items-center gap-1">
              0G.ai <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
