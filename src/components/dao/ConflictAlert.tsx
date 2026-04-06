"use client";

import { AlertTriangle, AlertCircle } from "lucide-react";
import type { ProposalConflict } from "@/types";

interface ConflictAlertProps {
  conflict: ProposalConflict;
}

export function ConflictAlert({ conflict }: ConflictAlertProps) {
  const isHigh = conflict.severity === "high";

  return (
    <div
      className="px-4 py-3 border-b flex items-start gap-3"
      style={{
        background: isHigh ? "var(--status-error-bg)" : "var(--status-warning-bg)",
        borderColor: isHigh ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)",
      }}
      role="alert"
      aria-live="polite"
    >
      {isHigh
        ? <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--status-error)]" />
        : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-[var(--status-warning)]" />
      }
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold font-mono mb-0.5"
          style={{ color: isHigh ? "var(--status-error)" : "var(--status-warning)" }}>
          {isHigh ? "Conflict Detected" : "Potential Conflict"}
        </p>
        <p className="text-xs leading-relaxed text-[var(--text-secondary)]">
          {conflict.description}
        </p>
        <p className="text-xs mt-1 text-[var(--text-tertiary)] font-mono">
          Ref: {conflict.relatedDecisionTitle} ·{" "}
          {new Date(conflict.relatedDecisionDate * 1000).toLocaleDateString("en", { month: "short", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
