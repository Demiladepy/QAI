"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { formatReputation, truncateAddress } from "@/lib/utils";
import { AGENT_REGISTRY_ABI } from "@/lib/abis";
import { getAgentRegistryAddress, getExplorerTokenUrl } from "@/lib/contracts";
import { useAgent } from "@/hooks/useAgent";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ExternalLink, Cpu, Star, Calendar, Hash } from "lucide-react";

const DEFAULT_METADATA_URI = "qai://agent/v1/default";

export function AgentCard() {
  const { address, isConnected } = useAccount();
  const { agent, refetch } = useAgent();
  const [mintError, setMintError] = useState<string | null>(null);

  const { writeContract, data: mintTxHash, isPending: isMinting } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isMinted } = useWaitForTransactionReceipt({
    hash: mintTxHash,
  });

  // Refetch agent data after mint confirms
  const handleMintSuccess = useCallback(async () => {
    if (isMinted) {
      await refetch();
    }
  }, [isMinted, refetch]);

  // Trigger refetch when tx confirms
  if (isMinted && !agent) {
    void handleMintSuccess();
  }

  const handleMint = useCallback(() => {
    if (!address) return;
    setMintError(null);
    try {
      writeContract({
        address: getAgentRegistryAddress(),
        abi: AGENT_REGISTRY_ABI,
        functionName: "mint",
        args: [DEFAULT_METADATA_URI],
      });
    } catch (err) {
      setMintError("Failed to initiate mint. Please try again.");
      console.error("[AgentCard] mint error:", err);
    }
  }, [address, writeContract]);

  if (!isConnected || !address) {
    return (
      <Card className="text-center py-8">
        <div className="text-4xl mb-3">🔗</div>
        <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
          Connect your wallet to get started
        </p>
        <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
          Your agent identity is tied to your wallet address
        </p>
      </Card>
    );
  }

  // No agent yet — show mint CTA
  if (!agent) {
    return (
      <Card className="text-center py-8">
        <div
          className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 mx-auto"
          style={{ background: "var(--color-primary-muted)" }}
        >
          <Cpu className="w-7 h-7" style={{ color: "var(--color-primary)" }} />
        </div>
        <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
          No Agent Found
        </h3>
        <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>
          Mint your QAI Agent ID to start building persistent memory
        </p>

        {mintError && (
          <p className="text-xs text-[var(--color-destructive)] mb-3">{mintError}</p>
        )}

        <Button
          onClick={handleMint}
          isLoading={isMinting || isConfirming}
          className="w-full sm:w-auto"
        >
          {isConfirming ? "Confirming..." : "Mint Your Agent"}
        </Button>

        {mintTxHash && (
          <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
            Tx: {truncateAddress(mintTxHash)}
          </p>
        )}
      </Card>
    );
  }

  // Agent exists — show stats
  const registryAddress = (() => {
    try { return getAgentRegistryAddress(); } catch { return ""; }
  })();

  return (
    <Card>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl text-white font-bold text-sm"
            style={{ background: "var(--color-primary)" }}
          >
            #{agent.tokenId.toString()}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
              QAI Agent
            </p>
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {truncateAddress(agent.owner)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant={agent.active ? "success" : "destructive"}>
            {agent.active ? "Active" : "Inactive"}
          </Badge>
          {registryAddress && (
            <a
              href={getExplorerTokenUrl(registryAddress, agent.tokenId.toString())}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on explorer"
              className="p-1 rounded hover:bg-[var(--color-muted)] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)" }} />
            </a>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2">
        <StatItem
          icon={<Hash className="w-3.5 h-3.5" />}
          label="Sessions"
          value={agent.sessionCount.toString()}
        />
        <StatItem
          icon={<Star className="w-3.5 h-3.5" />}
          label="Reputation"
          value={formatReputation(agent.reputationScore)}
        />
        <StatItem
          icon={<Calendar className="w-3.5 h-3.5" />}
          label="Created"
          value={new Date(agent.createdAt * 1000).toLocaleDateString()}
        />
      </div>
    </Card>
  );
}

function StatItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div
      className="rounded-lg p-2.5 text-center"
      style={{ background: "var(--color-muted)" }}
    >
      <div className="flex items-center justify-center gap-1 mb-1"
        style={{ color: "var(--color-text-muted)" }}>
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
        {value}
      </p>
    </div>
  );
}
