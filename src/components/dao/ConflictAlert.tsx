"use client";

import { Loader, AlertTriangle, AlertCircle } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import type { ProposalConflict } from "@/types";

interface ConflictAlertProps {
  conflict: ProposalConflict;
  isAnalyzing?: boolean;
}

export function ConflictAlert({ conflict, isAnalyzing }: ConflictAlertProps) {
  const severityColors = {
    high: {
      bg: "var(--color-destructive-bg)",
      border: "var(--color-destructive)",
      text: "var(--color-destructive-foreground)",
      icon: "var(--color-destructive)",
    },
    medium: {
      bg: "var(--color-warning-bg)",
      border: "var(--color-warning)",
      text: "var(--color-warning-foreground)",
      icon: "var(--color-warning)",
    },
    low: {
      bg: "var(--color-primary-muted)",
      border: "var(--color-primary)",
      text: "var(--color-primary)",
      icon: "var(--color-primary)",
    },
  };

  const colors = severityColors[conflict.severity];

  if (isAnalyzing) {
    return (
      <div
        className="px-4 py-2.5 flex items-center gap-2 border-b text-xs animate-pulse"
        style={{
          background: "var(--color-warning-bg)",
          borderColor: "var(--color-warning)",
          color: "var(--color-warning-foreground)",
        }}
      >
        <Loader className="w-3.5 h-3.5 animate-spin flex-shrink-0" />
        <span>QAI agent is analyzing proposal against governance history...</span>
      </div>
    );
  }

  return (
    <div
      className="px-4 py-3 border-b"
      style={{
        background: colors.bg,
        borderColor: colors.border,
      }}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start gap-2">
        {conflict.severity === "high" ? (
          <AlertTriangle
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: colors.icon }}
          />
        ) : (
          <AlertCircle
            className="w-4 h-4 flex-shrink-0 mt-0.5"
            style={{ color: colors.icon }}
          />
        )}

        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold mb-0.5" style={{ color: colors.text }}>
            {conflict.severity === "high" ? "Conflict Detected" : "Potential Conflict"}
          </p>
          <p className="text-xs leading-relaxed" style={{ color: colors.text }}>
            {conflict.description}
          </p>
          <p className="text-xs mt-1 opacity-75" style={{ color: colors.text }}>
            Ref: {conflict.relatedDecisionTitle} ·{" "}
            {formatTimestamp(conflict.relatedDecisionDate).split(",")[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
