"use client";

import { useStore } from "@/store";
import { MOCK_DECISIONS } from "@/lib/mockData";
import { formatTimestamp } from "@/lib/utils";
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
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          No governance history found
        </p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xs font-semibold mb-3" style={{ color: "var(--color-text-muted)" }}>
        Governance History
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-3.5 top-0 bottom-0 w-px"
          style={{ background: "var(--color-border)" }}
          aria-hidden="true"
        />

        <div className="space-y-4">
          {decisions.map((decision) => (
            <div key={decision.id} className="flex gap-3 relative">
              {/* Timeline dot */}
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center z-10"
                style={{
                  background:
                    decision.outcome === "passed"
                      ? "var(--color-success-bg)"
                      : "var(--color-destructive-bg)",
                  border: `2px solid ${
                    decision.outcome === "passed"
                      ? "var(--color-success)"
                      : "var(--color-destructive)"
                  }`,
                }}
              >
                {decision.outcome === "passed" ? (
                  <CheckCircle className="w-3 h-3" style={{ color: "var(--color-success-foreground)" }} />
                ) : (
                  <XCircle className="w-3 h-3" style={{ color: "var(--color-destructive-foreground)" }} />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-1">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium leading-snug"
                    style={{ color: "var(--color-text)" }}>
                    {decision.title}
                  </p>
                  <span className="text-xs flex-shrink-0"
                    style={{ color: "var(--color-text-muted)" }}>
                    {formatTimestamp(decision.timestamp).split(",")[0]}
                  </span>
                </div>

                <p className="text-xs mt-0.5 leading-relaxed"
                  style={{ color: "var(--color-text-secondary)" }}>
                  {decision.summary}
                </p>

                {decision.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {decision.tags.map((tag) => (
                      <Badge key={tag} variant="default" className="text-xs">
                        {tag}
                      </Badge>
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
