"use client";

import { type ReactNode } from "react";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { useContractEvents } from "@/hooks/useContractEvents";

interface AppShellProps {
  sidebar: ReactNode;
  main: ReactNode;
}

export function AppShell({ sidebar, main }: AppShellProps) {
  const { sidebarOpen } = useStore();
  // Wire real-time contract event listeners (cache invalidation on AgentMinted / SessionAnchored)
  useContractEvents();

  return (
    <div className="flex flex-1 overflow-hidden" style={{ height: "calc(100vh - 48px)" }}>
      {/* Sidebar */}
      <aside
        className={cn(
          "flex-shrink-0 border-r border-[var(--border-subtle)] overflow-y-auto transition-all duration-200",
          "bg-[var(--bg-root)]",
          sidebarOpen ? "w-72 lg:w-80" : "w-0 overflow-hidden border-0"
        )}
      >
        <div className={cn("p-4 space-y-3 min-w-[272px]", !sidebarOpen && "hidden")}>
          {sidebar}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-6">
        <div className="max-w-4xl mx-auto h-full">
          {main}
        </div>
      </main>
    </div>
  );
}
