"use client";

import { useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { Brain, ChevronDown, ChevronUp, Database } from "lucide-react";

export function MemoryPanel() {
  const { address } = useAccount();
  const { agent, recentSessions, setRecentSessions, isPanelOpen, togglePanel } = useStore();

  const loadSessions = useCallback(async () => {
    if (!agent || !address) return;
    try {
      const res = await fetch(`/api/memory?agentId=${agent.tokenId.toString()}&limit=5`);
      if (!res.ok) return;
      const data = await res.json() as { sessions?: unknown[] };
      if (Array.isArray(data.sessions)) {
        setRecentSessions(data.sessions as never);
      }
    } catch {
      // Non-fatal — panel can be empty
    }
  }, [agent, address, setRecentSessions]);

  useEffect(() => {
    if (isPanelOpen) void loadSessions();
  }, [isPanelOpen, loadSessions]);

  if (!agent) return null;

  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden">
      {/* Toggle header */}
      <button
        onClick={togglePanel}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors"
        aria-expanded={isPanelOpen}
        aria-label="Toggle memory panel"
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3.5 h-3.5" style={{ color: "var(--accent)" }} />
          <span className="text-xs font-medium font-mono text-[var(--text-secondary)]">Memory</span>
          {recentSessions.length > 0 && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-[var(--accent-muted)] text-[var(--accent)] font-mono">
              {recentSessions.length}
            </span>
          )}
        </div>
        {isPanelOpen
          ? <ChevronUp className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
          : <ChevronDown className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
        }
      </button>

      {/* Expanded panel */}
      {isPanelOpen && (
        <div className="border-t border-[var(--border-subtle)] p-4 animate-slide-down">
          {recentSessions.length === 0 ? (
            <div className="py-4 text-center">
              <Database className="w-6 h-6 text-[var(--text-tertiary)] mx-auto mb-2" />
              <p className="text-xs text-[var(--text-tertiary)]">
                No sessions yet. Start chatting to build memory.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentSessions.map((session) => (
                <div
                  key={session.sessionId}
                  className="rounded-[var(--radius-sm)] p-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]"
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <p className="text-xs font-medium text-[var(--text-primary)] line-clamp-2">
                      {session.summary}
                    </p>
                    <span className="text-xs text-[var(--text-tertiary)] shrink-0 font-mono">
                      {new Date(session.timestamp * 1000).toLocaleDateString("en", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                  {session.entities.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {session.entities.slice(0, 4).map((entity) => (
                        <span
                          key={entity}
                          className="px-1.5 py-0.5 rounded text-xs font-mono bg-[var(--accent-muted)] text-[var(--accent)]"
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

          <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
            <span className="status-dot live" />
            <p className="text-xs text-[var(--text-tertiary)]">
              0G Storage KV · anchored on-chain
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
