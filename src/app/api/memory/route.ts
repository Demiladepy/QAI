// ============================================================
// QAI — Memory read API  GET /api/memory?agentId=X&limit=N
// Returns recent session summaries from 0G Storage KV.
// Public endpoint — session summaries are not sensitive.
// ============================================================
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getRecentContext } from "@/lib/memory";
import type { SessionData } from "@/types";

const QuerySchema = z.object({
  agentId: z
    .string()
    .min(1)
    .max(20)
    .regex(/^\d+$/, "agentId must be numeric"),
  limit: z
    .string()
    .optional()
    .transform((v) => Math.min(parseInt(v ?? "5", 10), 20))
    .pipe(z.number().min(1).max(20)),
});

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(req.url);

  const parsed = QuerySchema.safeParse({
    agentId: searchParams.get("agentId"),
    limit: searchParams.get("limit") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors.map((e) => e.message).join("; ") },
      { status: 400 }
    );
  }

  const { agentId, limit } = parsed.data;

  try {
    const sessions = await getRecentContext(agentId, limit);

    // If 0G KV not yet live, return mock sessions for demo
    const result: SessionData[] = sessions.length > 0 ? sessions : getMockSessions(agentId);

    return NextResponse.json(
      { sessions: result },
      {
        headers: {
          "Cache-Control": "no-store", // Always fetch fresh memory
        },
      }
    );
  } catch (err) {
    console.error("[/api/memory] Error:", err);
    return NextResponse.json(
      { sessions: [], error: "Memory service unavailable" },
      { status: 503 }
    );
  }
}

// ── Demo mock sessions ────────────────────────────────────────

function getMockSessions(agentId: string): SessionData[] {
  const now = Math.floor(Date.now() / 1000);
  return [
    {
      sessionId: `mock-${agentId}-1`,
      agentId,
      userAddress: "0x0000000000000000000000000000000000000000",
      timestamp: now - 86400 * 2,
      summary: "User introduced themselves as Alex, building a DeFi startup on 0G.",
      entities: ["Alex", "DeFi", "0G"],
      decisions: ["Remember: user is building a DeFi startup"],
    },
    {
      sessionId: `mock-${agentId}-2`,
      agentId,
      userAddress: "0x0000000000000000000000000000000000000000",
      timestamp: now - 86400,
      summary: "Discussed smart contract architecture for on-chain agent identity.",
      entities: ["Smart Contract", "ERC-721", "AgentRegistry"],
      decisions: ["User prefers TypeScript over Solidity for tooling"],
    },
    {
      sessionId: `mock-${agentId}-3`,
      agentId,
      userAddress: "0x0000000000000000000000000000000000000000",
      timestamp: now - 3600,
      summary: "Explored 0G Storage KV API for persistent agent memory.",
      entities: ["0G Storage", "KV", "Memory"],
      decisions: ["Will use KV layer for fast reads, Log layer for archival"],
    },
  ];
}
