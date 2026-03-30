"use client";

import { useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useStore } from "@/store";
import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { Brain, ChevronRight, X } from "lucide-react";

export function MemoryPanel() {
  const { address } = useAccount();
  const { agent, recentSessions, setRecentSessions, isPanelOpen, togglePanel } = useStore();

  const loadSessions = useCallback(async () => {
    if (!agent || !address) return;

    try {
      // Fetch recent sessions from /api/memory endpoint
      // In the hackathon build this returns mock data if 0G KV is not yet live
      const res = await fetch(
        `/api/memory?agentId=${agent.tokenId.toString()}&limit=5`
      );
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.sessions)) {
        setRecentSessions(data.sessions);
      }
    } catch {
      // Non-fatal — memory panel can be empty
    }
  }, [agent, address, setRecentSessions]);

  useEffect(() => {
    if (isPanelOpen) void loadSessions();
  }, [isPanelOpen, loadSessions]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={togglePanel}
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
          "border hover:bg-[var(--color-muted)]"
        )}
        style={{
          borderColor: "var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        aria-expanded={isPanelOpen}
        aria-label="Toggle memory panel"
      >
        <Brain className="w-3.5 h-3.5" style={{ color: "var(--color-primary)" }} />
        Memory
        <ChevronRight
          className={cn("w-3 h-3 transition-transform", isPanelOpen && "rotate-90")}
        />
      </button>

      {/* Panel */}
      {isPanelOpen && (
        <div
          className="rounded-xl border p-4 mt-2 animate-slide-up"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
              <span className="text-xs font-semibold" style={{ color: "var(--color-text)" }}>
                Your agent remembers these sessions
              </span>
            </div>
            <button
              onClick={togglePanel}
              className="p-1 rounded hover:bg-[var(--color-muted)] transition-colors"
              aria-label="Close memory panel"
            >
              <X className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)" }} />
            </button>
          </div>

          {recentSessions.length === 0 ? (
            <div className="py-4 text-center">
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                No sessions recorded yet. Start chatting to build memory.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="rounded-lg p-3"
                  style={{ background: "var(--color-muted)" }}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-xs font-medium line-clamp-2"
                      style={{ color: "var(--color-text)" }}>
                      {session.summary}
                    </p>
                    <span className="text-xs flex-shrink-0"
                      style={{ color: "var(--color-text-muted)" }}>
                      {formatTimestamp(session.timestamp).split(",")[0]}
                    </span>
                  </div>

                  {session.entities.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {session.entities.slice(0, 4).map((entity) => (
                        <span
                          key={entity}
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{
                            background: "var(--color-primary-muted)",
                            color: "var(--color-primary)",
                          }}
                        >
                          {entity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <p className="text-xs mt-3 pt-3 border-t"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}>
            Stored on 0G Storage KV · Anchored on-chain
          </p>
        </div>
      )}
    </>
  );
}
