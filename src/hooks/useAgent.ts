// ============================================================
// QAI — useAgent hook
// Loads agent metadata from chain for the connected wallet.
// ============================================================
"use client";

import { useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { getAgentByOwner, getAgentMetadata } from "@/lib/contracts";
import { useStore } from "@/store";

export function useAgent() {
  const { address, isConnected } = useAccount();
  const { agent, setAgent, clearAgent } = useStore();

  const loadAgent = useCallback(async () => {
    if (!address || !isConnected) {
      clearAgent();
      return;
    }

    try {
      const tokenId = await getAgentByOwner(address);
      if (tokenId === 0n) {
        clearAgent();
        return;
      }
      const metadata = await getAgentMetadata(tokenId);
      if (metadata) setAgent(metadata);
    } catch (err) {
      console.error("[useAgent] Failed to load agent:", err);
      clearAgent();
    }
  }, [address, isConnected, setAgent, clearAgent]);

  // Load on mount and when wallet changes
  useEffect(() => {
    void loadAgent();
  }, [loadAgent]);

  return { agent, refetch: loadAgent };
}
