import { Navbar } from "@/components/Navbar";
import { AgentCard } from "@/components/AgentCard";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { MemoryPanel } from "@/components/chat/MemoryPanel";

export const metadata = {
  title: "My Agent — QAI",
  description: "Chat with your persistent AI agent",
};

export default function AgentPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "var(--color-background)" }}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
          {/* Sidebar */}
          <aside className="space-y-4">
            <AgentCard />
            <MemoryPanel />
          </aside>

          {/* Chat */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                Agent Chat
              </h1>
              <span
                className="text-xs px-2 py-1 rounded-full"
                style={{
                  background: "var(--color-primary-muted)",
                  color: "var(--color-primary)",
                }}
              >
                Consumer Mode
              </span>
            </div>
            <ChatInterface />
          </section>
        </div>
      </main>
    </div>
  );
}
