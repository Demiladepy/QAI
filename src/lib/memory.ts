// ============================================================
// QAI — MemoryService
// Wraps 0G Storage KV + Log layer for agent session memory.
// This runs server-side only (inside /api/infer route).
// ============================================================
import { ZgFile, Indexer, getFlowContract } from "@0glabs/0g-ts-sdk";
import { ethers } from "ethers";
import type { SessionData, MemoryContext } from "@/types";
import { buildSessionKey, buildLogKey, sanitizeForPrompt } from "./utils";

// ── Config ────────────────────────────────────────────────────

function requireEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function getStorageConfig() {
  return {
    nodeUrl: process.env.ZEROG_STORAGE_NODE_URL ?? "https://storage.0g.ai",
    kvContractAddress: process.env.NEXT_PUBLIC_ZEROG_KV_CONTRACT ?? "",
    rpcUrl:
      process.env.NEXT_PUBLIC_ZEROG_RPC_URL ?? "https://evmrpc-testnet.0g.ai",
    privateKey: requireEnv("INFERENCE_GATEWAY_PRIVATE_KEY"),
  };
}

// ── KV helpers ────────────────────────────────────────────────

/**
 * Write a session summary to 0G Storage KV.
 * Key: agent:{tokenId}:session:{n}
 */
export async function writeSessionToKV(
  tokenId: string,
  sessionIndex: number,
  sessionData: SessionData
): Promise<void> {
  const { nodeUrl, kvContractAddress, rpcUrl, privateKey } = getStorageConfig();
  if (!kvContractAddress) {
    console.warn("QAI MemoryService: KV contract not configured — skipping KV write");
    return;
  }

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    const key = buildSessionKey(tokenId, sessionIndex);
    const value = JSON.stringify({
      sessionId: sessionData.sessionId,
      timestamp: sessionData.timestamp,
      summary: sessionData.summary,
      entities: sessionData.entities,
      decisions: sessionData.decisions,
    });

    // 0G KV write — using SDK's setValueWithKey
    // Note: actual SDK method depends on 0glabs/0g-ts-sdk version
    const indexer = new Indexer(nodeUrl);
    // Encode key/value as bytes
    const keyBytes = new TextEncoder().encode(key);
    const valueBytes = new TextEncoder().encode(value);

    // Placeholder for actual 0G KV write — SDK integration point
    // The real call is: await kvClient.set(keyBytes, valueBytes)
    // Kept as structured stub until 0G KV SDK API is finalised
    console.log(`[MemoryService] KV write: ${key} (${value.length} bytes)`);
    void indexer; // referenced to avoid unused import warning
    void signer;
    void keyBytes;
    void valueBytes;
  } catch (err) {
    // Memory write failure should not crash the inference response
    console.error("[MemoryService] KV write failed:", err);
  }
}

/**
 * Read the last N sessions from 0G Storage KV for a given agent.
 * Returns an empty array on failure — inference continues without context.
 */
export async function getRecentContext(
  tokenId: string,
  limit = 5
): Promise<SessionData[]> {
  const { nodeUrl, kvContractAddress } = getStorageConfig();
  if (!kvContractAddress) {
    return [];
  }

  try {
    const sessions: SessionData[] = [];

    // Fetch keys in reverse order (most recent first)
    // Real implementation would use the 0G KV range query API
    // Placeholder: iterate from index 0..limit and collect
    for (let i = 0; i < limit; i++) {
      const key = buildSessionKey(tokenId, i);
      const keyBytes = new TextEncoder().encode(key);
      void nodeUrl;
      void keyBytes;
      // const raw = await kvClient.get(keyBytes);
      // if (!raw) break;
      // sessions.push(JSON.parse(new TextDecoder().decode(raw)));
    }

    return sessions;
  } catch (err) {
    console.error("[MemoryService] KV read failed:", err);
    return [];
  }
}

/**
 * Append a full session transcript to the 0G Storage Log layer.
 * This is fire-and-forget — used for audit trail and reputation calculation.
 */
export async function appendSessionLog(
  tokenId: string,
  sessionData: SessionData
): Promise<void> {
  const { nodeUrl, rpcUrl, privateKey } = getStorageConfig();

  try {
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(privateKey, provider);

    const key = buildLogKey(tokenId, sessionData.timestamp);
    const payload = JSON.stringify({
      ...sessionData,
      // Omit raw transcript from KV — too large; keep only in Log
      transcript: sessionData.transcript ?? [],
    });

    // 0G Log layer upload via ZgFile + Indexer
    // Real upload: await indexer.upload(zgFile, 0, signer)
    const indexer = new Indexer(nodeUrl);
    const blob = new Blob([payload], { type: "application/json" });

    // ZgFile.fromBlob is available in newer SDK versions
    // Fallback: use fromBuffer
    void ZgFile;
    void getFlowContract;
    void indexer;
    void signer;
    void key;

    console.log(`[MemoryService] Log append: ${key} (${payload.length} bytes)`);
  } catch (err) {
    console.error("[MemoryService] Log append failed:", err);
  }
}

// ── Memory injection ──────────────────────────────────────────

/**
 * Build memory context string to inject into system prompt.
 * Fetches recent KV sessions and formats them for the LLM.
 */
export async function buildMemoryContext(
  tokenId: string,
  limit = 5
): Promise<MemoryContext> {
  const recentSessions = await getRecentContext(tokenId, limit);

  if (recentSessions.length === 0) {
    return {
      recentSessions: [],
      formattedPrompt: "",
    };
  }

  const lines: string[] = ["[Memory from previous sessions:]"];
  for (const session of recentSessions) {
    const date = new Date(session.timestamp * 1000).toLocaleDateString();
    lines.push(`- ${date}: ${sanitizeForPrompt(session.summary)}`);
    if (session.entities.length > 0) {
      lines.push(`  Key entities: ${session.entities.slice(0, 5).join(", ")}`);
    }
    if (session.decisions.length > 0) {
      lines.push(`  Decisions: ${session.decisions.slice(0, 3).join("; ")}`);
    }
  }

  return {
    recentSessions,
    formattedPrompt: lines.join("\n"),
  };
}

// ── DAO history helpers ───────────────────────────────────────

/**
 * Fetch all governance decisions for a DAO from 0G Storage.
 * Key pattern: dao:{daoId}:decision:{n}
 */
export async function getDAOHistory(daoId: string): Promise<string> {
  // TODO: implement real 0G KV range read for dao decisions
  // For hackathon: returns pre-seeded mock data if real data unavailable
  return getMockDAOHistory(daoId);
}

/**
 * Write a DAO governance decision to 0G Storage KV.
 */
export async function writeDAODecision(
  daoId: string,
  decisionIndex: number,
  decision: object
): Promise<void> {
  const key = `dao:${daoId}:decision:${decisionIndex}`;
  const value = JSON.stringify(decision);
  console.log(`[MemoryService] DAO decision write: ${key} (${value.length} bytes)`);
  // TODO: real KV write
}

// ── Mock data for demo/testing ────────────────────────────────

function getMockDAOHistory(daoId: string): string {
  const histories: Record<string, string> = {
    "builderDAO": `
[DAO Governance History — BuilderDAO]

Decision #45 (Jan 2024): Passed budget of 200K USDC for Q1 developer grants.
Decision #46 (Feb 2024): Rejected proposal to change voting quorum from 10% to 5%.
  Reason: security concern about low-participation attacks.
Decision #47 (Mar 2024): Passed emergency treasury freeze — all allocations above 50K USDC
  require two-thirds supermajority due to market volatility. This policy is currently active.
Decision #48 (Mar 2024): Approved 30K USDC for hackathon sponsorships (under 50K threshold).
Decision #49 (Apr 2024): Rejected expansion to Arbitrum — community preferred staying on 0G.
Decision #50 (May 2024): Passed governance upgrade to on-chain voting via 0G contracts.
    `.trim(),

    "defiDAO": `
[DAO Governance History — DefiDAO]

Decision #12 (Nov 2023): Set protocol fee at 0.3%.
Decision #13 (Jan 2024): Rejected fee increase to 0.5% — too aggressive.
Decision #14 (Feb 2024): Approved 100K USDC liquidity incentive programme for Q1.
Decision #15 (Mar 2024): Passed security audit requirement for all new pools above 500K TVL.
Decision #16 (Apr 2024): Rejected partnership with external bridge provider — security concerns.
    `.trim(),

    "protocolDAO": `
[DAO Governance History — ProtocolDAO]

Decision #7 (Dec 2023): Established core contributor compensation framework.
Decision #8 (Jan 2024): Approved 50K USDC for documentation and tooling.
Decision #9 (Feb 2024): Rejected token buyback proposal — insufficient treasury reserves.
Decision #10 (Mar 2024): Passed formal partnership with 0G Labs for storage integration.
    `.trim(),
  };

  return histories[daoId] ?? "[No governance history found for this DAO]";
}
