"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/store";
import { MOCK_PROPOSALS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { ConflictAlert } from "./ConflictAlert";
import { AlertTriangle, Clock, CheckCircle, XCircle, Loader } from "lucide-react";
import type { Proposal, ProposalStatus } from "@/types";

function formatDate(ts: number): string {
  return new Date(ts * 1000).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function totalVotes(p: Proposal): number {
  return p.votesFor + p.votesAgainst + p.votesAbstain;
}

function forPct(p: Proposal): number {
  const total = totalVotes(p);
  return total === 0 ? 0 : Math.round((p.votesFor / total) * 100);
}

const STATUS_CONFIG: Record<
  ProposalStatus,
  { label: string; variant: "success" | "destructive" | "warning" | "default" | "outline"; icon: React.ReactNode }
> = {
  active: { label: "Active", variant: "warning", icon: <Clock className="w-3 h-3" /> },
  passed: { label: "Passed", variant: "success", icon: <CheckCircle className="w-3 h-3" /> },
  rejected: { label: "Rejected", variant: "destructive", icon: <XCircle className="w-3 h-3" /> },
  pending: { label: "Pending", variant: "default", icon: <Clock className="w-3 h-3" /> },
  executed: { label: "Executed", variant: "outline", icon: <CheckCircle className="w-3 h-3" /> },
};

export function ProposalFeed() {
  const { selectedDAO } = useStore();
  const [analyzing, setAnalyzing] = useState<string | null>(null);

  const proposals = selectedDAO
    ? (MOCK_PROPOSALS[selectedDAO.id] ?? [])
    : [];

  // Simulate analysis delay for active proposals with conflicts
  useEffect(() => {
    if (!selectedDAO) return;
    const activeWithConflict = proposals.find(
      (p) => p.status === "active" && p.conflict?.detected
    );
    if (activeWithConflict) {
      setAnalyzing(activeWithConflict.id);
      const timer = setTimeout(() => setAnalyzing(null), 1800);
      return () => clearTimeout(timer);
    }
  }, [selectedDAO?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!selectedDAO) {
    return (
      <div
        className="rounded-xl border p-8 text-center"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Select a DAO to view proposals
        </p>
      </div>
    );
  }

  if (proposals.length === 0) {
    return (
      <div
        className="rounded-xl border p-8 text-center"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          No proposals found for {selectedDAO.name}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        Proposals — {selectedDAO.name}
      </h2>

      {proposals.map((proposal) => (
        <ProposalCard
          key={proposal.id}
          proposal={proposal}
          isAnalyzing={analyzing === proposal.id}
        />
      ))}
    </div>
  );
}

function ProposalCard({
  proposal,
  isAnalyzing,
}: {
  proposal: Proposal;
  isAnalyzing: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const statusConfig = STATUS_CONFIG[proposal.status];
  const pct = forPct(proposal);

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        borderColor:
          proposal.conflict?.detected
            ? "var(--color-destructive)"
            : "var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      {/* Conflict alert */}
      {proposal.conflict?.detected && (
        <ConflictAlert conflict={proposal.conflict} isAnalyzing={isAnalyzing} />
      )}

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <button
            className="text-sm font-semibold text-left hover:underline transition-all"
            style={{ color: "var(--color-text)" }}
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
          >
            {proposal.title}
          </button>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {isAnalyzing && (
              <span
                className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-warning)" }}
              >
                <Loader className="w-3 h-3 animate-spin" />
                Analyzing...
              </span>
            )}
            <Badge variant={statusConfig.variant}>
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
          </div>
        </div>

        {/* Description (expanded) */}
        {isExpanded && (
          <p
            className="text-xs mb-3 leading-relaxed animate-fade-in"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {proposal.description}
          </p>
        )}

        {/* Vote bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1"
            style={{ color: "var(--color-text-muted)" }}>
            <span>{proposal.votesFor.toLocaleString()} For ({pct}%)</span>
            <span>{proposal.votesAgainst.toLocaleString()} Against</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--color-muted)" }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${pct}%`,
                background:
                  pct >= 67
                    ? "var(--color-success)"
                    : pct >= 50
                    ? "var(--color-primary)"
                    : "var(--color-warning)",
              }}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs"
          style={{ color: "var(--color-text-muted)" }}>
          <span>
            {proposal.status === "active"
              ? `Ends ${formatDate(proposal.endsAt)}`
              : `Ended ${formatDate(proposal.endsAt)}`}
          </span>
          <span>{totalVotes(proposal).toLocaleString()} votes</span>
        </div>
      </div>
    </div>
  );
}
