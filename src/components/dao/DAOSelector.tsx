"use client";

import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { Scale } from "lucide-react";

// ── Demo DAOs: these represent real protocol integrations.
// In production, this list would come from a governance registry contract.
// For the hackathon we seed three known DAOs to show the agent's DAO mode.
const DEMO_DAOS = [
  { id: "builderDAO", name: "BuilderDAO", desc: "Open-source developer collective on 0G" },
  { id: "defiDAO", name: "DefiDAO", desc: "DeFi protocol governance & liquidity" },
  { id: "protocolDAO", name: "ProtocolDAO", desc: "Core protocol parameters & partnerships" },
] as const;

export function DAOSelector() {
  const { selectedDAO, setSelectedDAO } = useStore();

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
        <p className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest">
          Select a DAO
        </p>
      </div>
      <div className="p-2 space-y-1">
        {DEMO_DAOS.map((dao) => {
          const isSelected = selectedDAO?.id === dao.id;
          return (
            <button
              key={dao.id}
              onClick={() => setSelectedDAO({ id: dao.id, name: dao.name, description: dao.desc, memberCount: 0, treasuryUSD: 0 })}
              className={cn(
                "w-full text-left rounded-[var(--radius-sm)] p-3 border transition-all duration-150",
                isSelected
                  ? "bg-[var(--accent-muted)] border-[var(--accent-border)] text-[var(--accent)]"
                  : "border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
              )}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-2">
                <Scale className="w-3.5 h-3.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold font-mono">{dao.name}</p>
                  <p className="text-xs opacity-70 mt-0.5">{dao.desc}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
