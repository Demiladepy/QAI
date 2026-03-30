// ============================================================
// QAI — Global client state (Zustand)
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

// ── Agent slice ───────────────────────────────────────────────

interface AgentSlice {
  agent: AgentMetadata | null;
  setAgent: (agent: AgentMetadata | null) => void;
  clearAgent: () => void;
}

// ── Chat slice ────────────────────────────────────────────────

interface ChatSlice {
  messages: Message[];
  isLoading: boolean;
  mode: AgentMode;
  addMessage: (msg: Message) => void;
  setMessages: (msgs: Message[]) => void;
  setLoading: (loading: boolean) => void;
  setMode: (mode: AgentMode) => void;
  clearMessages: () => void;
  updateMessageAnchorStatus: (id: string, anchored: boolean) => void;
}

// ── Memory panel slice ────────────────────────────────────────

interface MemorySlice {
  recentSessions: SessionData[];
  isPanelOpen: boolean;
  setRecentSessions: (sessions: SessionData[]) => void;
  togglePanel: () => void;
  setPanelOpen: (open: boolean) => void;
}

// ── DAO slice ─────────────────────────────────────────────────

interface DAOSlice {
  selectedDAO: DAO | null;
  setSelectedDAO: (dao: DAO | null) => void;
}

// ── Combined store ────────────────────────────────────────────

type QAIStore = AgentSlice & ChatSlice & MemorySlice & DAOSlice;

export const useStore = create<QAIStore>()(
  persist(
    (set) => ({
      // ── Agent ────────────────────────────────────────────────
      agent: null,
      setAgent: (agent) => set({ agent }),
      clearAgent: () => set({ agent: null }),

      // ── Chat ─────────────────────────────────────────────────
      messages: [],
      isLoading: false,
      mode: "consumer",
      addMessage: (msg) =>
        set((state) => ({ messages: [...state.messages, msg] })),
      setMessages: (messages) => set({ messages }),
      setLoading: (isLoading) => set({ isLoading }),
      setMode: (mode) => set({ mode }),
      clearMessages: () => set({ messages: [] }),
      updateMessageAnchorStatus: (id, anchored) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, memoryAnchored: anchored } : m
          ),
        })),

      // ── Memory ───────────────────────────────────────────────
      recentSessions: [],
      isPanelOpen: false,
      setRecentSessions: (recentSessions) => set({ recentSessions }),
      togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
      setPanelOpen: (isPanelOpen) => set({ isPanelOpen }),

      // ── DAO ──────────────────────────────────────────────────
      selectedDAO: null,
      setSelectedDAO: (selectedDAO) => set({ selectedDAO }),
    }),
    {
      name: "qai-store",
      storage: createJSONStorage(() => sessionStorage),
      // Only persist non-sensitive fields
      partialize: (state) => ({
        mode: state.mode,
        isPanelOpen: state.isPanelOpen,
        // Do NOT persist messages or agent data — re-fetch from chain on load
      }),
    }
  )
);
