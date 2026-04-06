import { Navbar } from "@/components/Navbar";
import { AppShell } from "@/components/layout/AppShell";
import { AgentCard } from "@/components/AgentCard";
import { DAOChatWrapper } from "@/components/dao/DAOChatWrapper";
import { DAOSelector } from "@/components/dao/DAOSelector";
import { GovernanceTimeline } from "@/components/dao/GovernanceTimeline";
import { ConnectionStatus } from "@/components/dashboard/ConnectionStatus";
import { ProposalFeed } from "@/components/dao/ProposalFeed";

export const metadata = {
  title: "DAO Governance — QAI",
  description: "Governance agent with institutional memory for your DAO",
};

export default function DAOPage() {
  return (
    <div className="flex flex-col min-h-screen" style={{ background: "var(--bg-root)" }}>
      <Navbar />
      <AppShell
        sidebar={
          <div className="space-y-3">
            <AgentCard />
            <DAOSelector />
            <GovernanceTimeline />
            <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4">
              <p className="text-xs font-mono text-[var(--text-tertiary)] uppercase tracking-widest mb-3">
                Connection
              </p>
              <ConnectionStatus />
            </div>
          </div>
        }
        main={
          <div className="flex flex-col gap-4 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-sm font-semibold font-mono text-[var(--text-primary)]">
                  DAO Governance
                </h1>
                <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                  Institutional memory agent — reads all governance history
                </p>
              </div>
              <div
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono"
                style={{ background: "var(--status-live-bg)", color: "var(--status-live)", border: "1px solid rgba(34,197,94,0.2)" }}
              >
                <span className="status-dot live" />
                DAO Mode
              </div>
            </div>

            {/* Two-column: proposals + chat */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4 flex-1 min-h-0">
              <ProposalFeed />
              <div className="flex flex-col min-h-0">
                <DAOChatWrapper />
              </div>
            </div>
          </div>
        }
      />
    </div>
  );
}
