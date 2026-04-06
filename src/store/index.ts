// ============================================================
// QAI — Global client state (Zustand)
// No mock data — all state fetched from chain or API.
// ============================================================
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  AgentMetadata,
  Message,
  SessionData,
  AgentMode,
  DAO,
} from "@/types";

// ── Connection status ─────────────────────────────────────────

export type ServiceStatus = "connected" | "not_configured" | "error" | "checking";

export interface ConnectionStatus {
  wallet: "connected" | "disconnected";
  contracts: "live" | "not_deployed" | "wrong_network" | "checking";
  inference: ServiceStatus;
  kvStore: ServiceStatus;
}

// ── Slice interfaces ──────────────────────────────────────────

interface AgentSlice {
  agent: AgentMetadata | null;
  setAgent: (agent: AgentMetadata | null) => void;
  clearAgent: () => void;
}

interface ChatSlice {
  messages: Message[];
  isLoading: boolean;
  streamingContent: string;
  mode: AgentMode;
  activeSessionId: string | null;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setLoading: (loading: boolean) => void;
  setStreamingContent: (text: string) => void;
  setMode: (mode: AgentMode) => void;
  clearMessages: () => void;
  updateMessageAnchorStatus: (id: string, anchored: boolean) => void;
  setActiveSessionId: (id: string | null) => void;
}

interface MemorySlice {
  recentSessions: SessionData[];
  isPanelOpen: boolean;
  setRecentSessions: (sessions: SessionData[]) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
}

interface DAOSlice {
  selectedDAO: DAO | null;
  setSelectedDAO: (dao: DAO | null) => void;
}

interface ConnectionSlice {
  connectionStatus: ConnectionStatus;
  updateConnectionStatus: (update: Partial<ConnectionStatus>) => void;
}

interface UISlice {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;
}

// ── Combined ──────────────────────────────────────────────────

type QAIStore = AgentSlice & ChatSlice & MemorySlice & DAOSlice & ConnectionSlice & UISlice;

export const useStore = create<QAIStore>()(
  persist(
    (set) => ({
      // ── Agent
      agent: null,
      setAgent: (agent) => set({ agent }),
      clearAgent: () => set({ agent: null }),

      // ── Chat
      messages: [],
      isLoading: false,
      streamingContent: "",
      mode: "consumer",
      activeSessionId: null,
      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
      setMessages: (messages) => set({ messages }),
      setLoading: (isLoading) => set({ isLoading }),
      setStreamingContent: (streamingContent) => set({ streamingContent }),
      setMode: (mode) => set({ mode }),
      clearMessages: () => set({ messages: [] }),
      updateMessageAnchorStatus: (id, anchored) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, memoryAnchored: anchored } : m
          ),
        })),
      setActiveSessionId: (activeSessionId) => set({ activeSessionId }),

      // ── Memory
      recentSessions: [],
      isPanelOpen: false,
      setRecentSessions: (recentSessions) => set({ recentSessions }),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),

      // ── DAO
      selectedDAO: null,
      setSelectedDAO: (selectedDAO) => set({ selectedDAO }),

      // ── Connection
      connectionStatus: {
        wallet: "disconnected",
        contracts: "checking",
        inference: "checking",
        kvStore: "checking",
      },
      updateConnectionStatus: (update) =>
        set((state) => ({
          connectionStatus: { ...state.connectionStatus, ...update },
        })),

      // ── UI
      sidebarOpen: true,
      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
      toggleSidebar: () =>
        set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "qai-store-v2",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        mode: state.mode,
        isPanelOpen: state.isPanelOpen,
        sidebarOpen: state.sidebarOpen,
      }),
    }
  )
);
