// ============================================================
// QAI — useAgent hook
// Loads agent metadata from chain for the connected wallet.
// ============================================================
"use client";

import { useEffect, useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { getAgentByOwner, getAgentMetadata } from "@/lib/contracts";
import { useStore } from "@/store";

export function useAgent() {
  const { address, isConnected } = useAccount();
  const { agent, setAgent, clearAgent } = useStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const loadAgent = useCallback(async () => {
    if (!address || !isConnected) {
      clearAgent();
      return;
    }

    setIsLoading(true);
    setIsError(false);
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
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected, setAgent, clearAgent]);

  useEffect(() => {
    void loadAgent();
  }, [loadAgent]);

  return { agent, refetch: loadAgent, isLoading, isError };
}
