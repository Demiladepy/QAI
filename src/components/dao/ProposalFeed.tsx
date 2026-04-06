"use client";

import { useState } from "react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ConflictAlert } from "./ConflictAlert";
import { Scale, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp } from "lucide-react";
import type { Proposal, ProposalStatus } from "@/types";

// ── Demo data: seeded from the agent's governance memory.
// These proposals are shown when a DAO is selected to demonstrate
// conflict detection. They are NOT editable mock data — they mirror
// the exact history the agent reasons over in /api/infer.
// Once a governance contract is deployed, replace with on-chain reads.
const DEMO_PROPOSALS: Record<string, Proposal[]> = {
  builderDAO: [
    {
      id: "prop-51",
      daoId: "builderDAO",
      title: "Allocate 100,000 USDC to New Liquidity Pool",
      description: "Proposal to deploy 100K USDC from treasury reserves to a new 0G/USDC liquidity pool ahead of mainnet launch.",
      status: "active",
      votesFor: 312, votesAgainst: 87, votesAbstain: 24,
      createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
      endsAt: Math.floor(Date.now() / 1000) + 86400 * 5,
      proposer: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
      conflict: {
        detected: true,
        description: "This proposal conflicts with Decision #47 (March 2024). The DAO previously voted to freeze all treasury allocations above 50K USDC, requiring a two-thirds supermajority. A standard vote is insufficient.",
        relatedDecisionId: "decision-47",
        relatedDecisionTitle: "Emergency Treasury Freeze — Allocations > 50K USDC",
        relatedDecisionDate: Math.floor(Date.now() / 1000) - 86400 * 120,
        severity: "high",
      },
    },
    {
      id: "prop-52",
      daoId: "builderDAO",
      title: "Extend Developer Grant Programme — Q3 2024",
      description: "Continue the developer grant programme for Q3 2024 with a 30K USDC budget.",
      status: "passed",
      votesFor: 521, votesAgainst: 23, votesAbstain: 41,
      createdAt: Math.floor(Date.now() / 1000) - 86400 * 14,
      endsAt: Math.floor(Date.now() / 1000) - 86400 * 7,
      proposer: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    },
  ],
  defiDAO: [
    {
      id: "prop-defi-1",
      daoId: "defiDAO",
      title: "Increase Protocol Fee to 0.35%",
      description: "Gradual fee increase from 0.3% to 0.35% to fund protocol security audits.",
      status: "active",
      votesFor: 180, votesAgainst: 140, votesAbstain: 30,
      createdAt: Math.floor(Date.now() / 1000) - 86400,
      endsAt: Math.floor(Date.now() / 1000) + 86400 * 6,
      proposer: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    },
  ],
  protocolDAO: [],
};

const STATUS_CFG: Record<ProposalStatus, { label: string; variant: "success" | "destructive" | "warning" | "default" | "outline"; icon: React.ReactNode }> = {
  active: { label: "Active", variant: "warning", icon: <Clock className="w-3 h-3" /> },
  passed: { label: "Passed", variant: "success", icon: <CheckCircle className="w-3 h-3" /> },
  rejected: { label: "Rejected", variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
  pending: { label: "Pending", variant: "default", icon: <Clock className="w-3 h-3" /> },
  executed: { label: "Executed", variant: "outline", icon: <CheckCircle className="w-3 h-3" /> },
};

export function ProposalFeed() {
  const { selectedDAO } = useStore();

  if (!selectedDAO) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-10 text-center">
        <Scale className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Select a DAO</p>
        <p className="text-xs text-[var(--text-tertiary)]">Choose a DAO from the sidebar to view proposals</p>
      </div>
    );
  }

  const proposals = DEMO_PROPOSALS[selectedDAO.id] ?? [];

  if (proposals.length === 0) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-10 text-center">
        <Scale className="w-8 h-8 text-[var(--text-tertiary)] mx-auto mb-3" />
        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">No proposals yet</p>
        <p className="text-xs text-[var(--text-tertiary)]">
          {selectedDAO.name} has no active proposals. Use the chat to ask about governance history.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold font-mono text-[var(--text-primary)]">
          Proposals — {selectedDAO.name}
        </h2>
        <span className="text-xs text-[var(--text-tertiary)] font-mono">{proposals.length} total</span>
      </div>

      {proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  );
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CFG[proposal.status];
  const total = proposal.votesFor + proposal.votesAgainst + proposal.votesAbstain;
  const pct = total === 0 ? 0 : Math.round((proposal.votesFor / total) * 100);

  return (
    <div
      className={cn(
        "rounded-[var(--radius-lg)] border bg-[var(--bg-surface)] overflow-hidden transition-all duration-200",
        proposal.conflict?.detected
          ? "border-[rgba(239,68,68,0.3)] shadow-[0_0_16px_rgba(239,68,68,0.08)]"
          : "border-[var(--border-subtle)]"
      )}
    >
      {proposal.conflict?.detected && (
        <ConflictAlert conflict={proposal.conflict} />
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <button
            className="text-sm font-semibold text-left text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors leading-snug"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
          >
            {proposal.title}
          </button>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant={cfg.variant}>{cfg.icon}{cfg.label}</Badge>
            <button
              onClick={() => setExpanded((v) => !v)}
              className="p-1 rounded hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-tertiary)]"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {expanded && (
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-3 animate-fade-in">
            {proposal.description}
          </p>
        )}

        {/* Vote bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1.5 font-mono">
            <span className="text-[var(--status-live)]">{proposal.votesFor.toLocaleString()} For ({pct}%)</span>
            <span className="text-[var(--status-error)]">{proposal.votesAgainst.toLocaleString()} Against</span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--bg-elevated)] overflow-hidden" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${pct}%`, background: pct >= 67 ? "var(--status-live)" : pct >= 50 ? "var(--accent)" : "var(--status-warning)" }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] font-mono">
          <span>{proposal.status === "active" ? `Ends ${new Date(proposal.endsAt * 1000).toLocaleDateString("en", { month: "short", day: "numeric" })}` : `Ended ${new Date(proposal.endsAt * 1000).toLocaleDateString("en", { month: "short", day: "numeric" })}`}</span>
          <span>{total.toLocaleString()} votes cast</span>
        </div>
      </div>
    </div>
  );
}
