import { Navbar } from "@/components/Navbar";
import { DAOSelector } from "@/components/dao/DAOSelector";
import { ProposalFeed } from "@/components/dao/ProposalFeed";
import { GovernanceTimeline } from "@/components/dao/GovernanceTimeline";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { AgentCard } from "@/components/AgentCard";
import { DAOChatWrapper } from "@/components/dao/DAOChatWrapper";

export const metadata = {
  title: "DAO Governance — QAI",
  description: "Governance agent with institutional memory for your DAO",
};

export default function DAOPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Page header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
              DAO Governance
            </h1>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "var(--color-success-bg)",
                color: "var(--color-success-foreground)",
              }}
            >
              DAO Mode
            </span>
          </div>
          <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Your agent has read access to all governance history. Ask it anything about past decisions.
          </p>
        </div>

        {/* Layout: left sidebar, center proposals, right agent */}
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-6">
          {/* Left: DAO selector + timeline */}
          <aside className="space-y-5">
            <DAOSelector />
            <GovernanceTimeline />
          </aside>

          {/* Center: Proposal feed */}
          <section>
            <ProposalFeed />
          </section>

          {/* Right: Agent card + DAO chat */}
          <aside className="space-y-4">
            <AgentCard />
            <DAOChatWrapper />
          </aside>
        </div>
      </main>
    </div>
  );
}
