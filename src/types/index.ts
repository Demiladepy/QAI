// ============================================================
// QAI — Shared Types
// ============================================================

// ── Agent ────────────────────────────────────────────────────

export interface AgentMetadata {
  tokenId: bigint;
  owner: string;
  createdAt: number; // unix timestamp
  sessionCount: bigint;
  reputationScore: bigint;
  active: boolean;
  metadataURI: string;
}

export interface AgentConfig {
  name: string;
  description?: string;
  mode: AgentMode;
  /** 0G Storage KV key for this agent's config */
  storageKey?: string;
}

export type AgentMode = "consumer" | "dao";

// ── Session / Memory ──────────────────────────────────────────

export interface SessionData {
  sessionId: string;
  agentId: string; // tokenId as string
  userAddress: string;
  timestamp: number;
  summary: string;
  entities: string[];
  decisions: string[];
  /** Full transcript — stored on 0G Log layer */
  transcript?: Message[];
}

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
  /** True once the memory write to 0G KV has confirmed */
  memoryAnchored?: boolean;
}

// ── Inference ─────────────────────────────────────────────────

export interface InferRequest {
  agentId: string;
  userMessage: string;
  walletAddress: string;
  /** SIWE signature proving wallet ownership */
  signature: string;
  mode: AgentMode;
  daoId?: string;
}

export interface InferResponse {
  content: string;
  sessionId: string;
  memoryWritten: boolean;
  anchorTxHash?: string;
  error?: string;
}

// ── DAO ───────────────────────────────────────────────────────

export interface DAO {
  id: string;
  name: string;
  description: string;
  logoUrl?: string;
  memberCount: number;
  treasuryUSD: number;
}

export interface Proposal {
  id: string;
  daoId: string;
  title: string;
  description: string;
  status: ProposalStatus;
  votesFor: number;
  votesAgainst: number;
  votesAbstain: number;
  createdAt: number;
  endsAt: number;
  proposer: string;
  /** Conflict detected by QAI agent */
  conflict?: ProposalConflict;
}

export type ProposalStatus =
  | "active"
  | "passed"
  | "rejected"
  | "pending"
  | "executed";

export interface ProposalConflict {
  detected: boolean;
  description: string;
  relatedDecisionId: string;
  relatedDecisionTitle: string;
  relatedDecisionDate: number;
  severity: "low" | "medium" | "high";
}

export interface GovernanceDecision {
  id: string;
  daoId: string;
  title: string;
  summary: string;
  timestamp: number;
  proposalId: string;
  outcome: "passed" | "rejected";
  tags: string[];
}

// ── API responses ──────────────────────────────────────────────

export interface ApiError {
  error: string;
  code?: string;
}

// ── Storage ───────────────────────────────────────────────────

export interface KVWriteResult {
  key: string;
  success: boolean;
  txHash?: string;
}

export interface MemoryContext {
  recentSessions: SessionData[];
  formattedPrompt: string;
}
