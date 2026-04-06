import { Navbar } from "@/components/Navbar";
import { AppShell } from "@/components/layout/AppShell";
import { AgentCard } from "@/components/AgentCard";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MemoryPanel } from "@/components/chat/MemoryPanel";
import { ConnectionStatus } from "@/components/dashboard/ConnectionStatus";

export const metadata = {
  title: "My Agent — QAI",
  description: "Chat with your persistent AI agent",
};

export default function AgentPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-root)" }}>
      <Navbar />
      <AppShell
        sidebar={
          <div className="space-y-3">
            <AgentCard />
            <MemoryPanel />
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-3">
                Connection
              </p>
              <ConnectionStatus />
            </div>
          </div>
        }
        main={
          <div className="flex flex-col h-full gap-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-sm font-semibold font-mono text-[var(--text-primary)]">
                  Agent Chat
                </h1>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                  Consumer mode — sessions anchored on-chain
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
                style={{ background: "var(--accent-muted)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
              >
                <span className="status-dot live" />
                Consumer Mode
              </div>
            </div>
            <div className="flex-1 min-h-0">
              <ChatInterface />
            </div>
          </div>
        }
      />
    </div>
  );
}
