"use client";

import { useStore } from "@/store";
import { MOCK_DECISIONS } from "@/lib/mockData";
import { Badge } from "@/components/ui/Badge";
import { CheckCircle, XCircle } from "lucide-react";

export function GovernanceTimeline() {
  const { selectedDAO } = useStore();

  const decisions = selectedDAO
    ? (MOCK_DECISIONS[selectedDAO.id] ?? [])
    : [];

  if (!selectedDAO) return null;

  if (decisions.length === 0) {
    return (
      <div className="py-4 text-center">
        <p className="text-xs" style={{ color: "var(--text-tertiary)" }}>
          No governance history found
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border-subtle)]">
        <p className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest">
          Decision History
        </p>
      </div>
      <div className="p-4 relative">
        <div className="absolute left-7 top-4 bottom-4 w-px bg-[var(--border-subtle)]" aria-hidden="true" />
        <div className="space-y-4">
          {decisions.map((decision) => (
            <div key={decision.id} className="flex gap-3 relative">
              <div
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10 border"
                style={decision.outcome === "passed"
                  ? { background: "var(--status-live-bg)", borderColor: "rgba(34,197,94,0.3)" }
                  : { background: "var(--status-error-bg)", borderColor: "rgba(239,68,68,0.3)" }
                }
              >
                {decision.outcome === "passed"
                  ? <CheckCircle className="w-3 h-3 text-[var(--status-live)]" />
                  : <XCircle className="w-3 h-3 text-[var(--status-error)]" />
                }
              </div>
              <div className="flex-1 pb-1">
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <p className="text-xs font-medium text-[var(--text-primary)] leading-snug">{decision.title}</p>
                  <span className="text-xs text-[var(--text-tertiary)] shrink-0 font-mono">
                    {new Date(decision.timestamp * 1000).toLocaleDateString("en", { month: "short", day: "numeric" })}
                  </span>
                </div>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{decision.summary}</p>
                {decision.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {decision.tags.map((tag) => (
                      <Badge key={tag} variant="default">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
