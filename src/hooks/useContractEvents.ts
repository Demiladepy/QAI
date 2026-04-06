// ============================================================
// QAI — useContractEvents
// Real-time event-driven cache invalidation via wagmi.
// ============================================================
"use client";

import { useEffect } from "react";
import { useWatchContractEvent, usePublicClient } from "wagmi";
import { useQueryClient } from "@tanstack/react-query";
import { AGENT_REGISTRY_ABI, MEMORY_ANCHOR_ABI } from "@/lib/abis";
import { useToast } from "@/components/ui/Toast";
import { useStore } from "@/store";
import { getEnvConfig } from "@/lib/env";

export function useContractEvents() {
  const queryClient = useQueryClient();
  const { success: toastSuccess } = useToast();
  const { updateConnectionStatus } = useStore();
  const publicClient = usePublicClient();
  const env = getEnvConfig();

  // ── Verify contract liveness on mount ────────────────────────
  useEffect(() => {
    if (!env.hasContracts || !publicClient) {
      updateConnectionStatus({ contracts: "not_deployed" });
      return;
    }

    publicClient
      .getBlockNumber()
      .then(() => updateConnectionStatus({ contracts: "live" }))
      .catch(() => updateConnectionStatus({ contracts: "wrong_network" }));
  }, [env.hasContracts, publicClient, updateConnectionStatus]);

  // ── AgentMinted events ────────────────────────────────────────
  useWatchContractEvent(
    env.hasContracts
      ? {
          address: env.agentRegistryAddress as `0x${string}`,
          abi: AGENT_REGISTRY_ABI,
          eventName: "AgentMinted",
          onLogs(logs) {
            // Invalidate all agent-related queries
            void queryClient.invalidateQueries({ queryKey: ["agents"] });
            void queryClient.invalidateQueries({ queryKey: ["agentByOwner"] });

            const tokenId = (logs[0]?.args as Record<string, unknown>)?.tokenId;
            if (tokenId != null) {
              toastSuccess(
                `Agent #${String(tokenId)} registered`,
                "Identity NFT minted on 0G Testnet"
              );
            }
          },
        }
      : undefined
  );

  // ── SessionAnchored events ────────────────────────────────────
  useWatchContractEvent(
    env.hasContracts
      ? {
          address: env.memoryAnchorAddress as `0x${string}`,
          abi: MEMORY_ANCHOR_ABI,
          eventName: "SessionAnchored",
          onLogs() {
            void queryClient.invalidateQueries({ queryKey: ["sessions"] });
            void queryClient.invalidateQueries({ queryKey: ["memoryAnchor"] });
          },
        }
      : undefined
  );
}

// ── Standalone hook: watch a specific agent's sessions ────────

export function useAgentSessionEvents(agentId: bigint | null) {
  const queryClient = useQueryClient();
  const env = getEnvConfig();

  useWatchContractEvent(
    env.hasContracts && agentId !== null
      ? {
          address: env.memoryAnchorAddress as `0x${string}`,
          abi: MEMORY_ANCHOR_ABI,
          eventName: "SessionAnchored",
          args: { tokenId: agentId },
          onLogs() {
            void queryClient.invalidateQueries({
              queryKey: ["agentSessions", agentId.toString()],
            });
          },
        }
      : undefined
  );
}
