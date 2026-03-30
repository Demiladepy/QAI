// ============================================================
// QAI — Health check  GET /api/health
// Used by deployment infrastructure and uptime monitors.
// Returns only safe, non-sensitive status information.
// ============================================================
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      contracts: !!process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS,
      storage: !!process.env.ZEROG_STORAGE_NODE_URL,
      compute: !!process.env.ZEROG_COMPUTE_ENDPOINT,
    },
  };

  return NextResponse.json(status, {
    headers: { "Cache-Control": "no-store" },
  });
}
