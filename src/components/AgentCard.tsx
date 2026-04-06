"use client";

import { useState, useCallback } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { truncateAddress } from "@/lib/utils";
import { AGENT_REGISTRY_ABI } from "@/lib/abis";
import { getAgentRegistryAddress, getExplorerTokenUrl } from "@/lib/contracts";
import { useAgent } from "@/hooks/useAgent";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AgentCardSkeleton } from "@/components/ui/Skeleton";
import { ExternalLink, Cpu, Star, Calendar, Hash, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { cn } from "@/lib/utils";

function agentGradient(address: string): string {
  let hash = 0;
  for (let i = 0; i < address.length; i++) {
    hash = address.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 120) % 360;
  return `linear-gradient(135deg, hsl(${h1},70%,40%) 0%, hsl(${h2},70%,30%) 100%)`;
}

const DEFAULT_METADATA_URI = "qai://agent/v1/default";

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-[var(--radius)] p-2.5 text-center bg-[var(--bg-elevated)]">
      <div className="flex items-center justify-center gap-1 mb-1 text-[var(--text-tertiary)]">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="text-sm font-semibold font-mono text-[var(--text-primary)]">{value}</p>
    </div>
  );
}

export function AgentCard() {
  const { address, isConnected } = useAccount();
  const { agent, refetch, isLoading } = useAgent();
  const { success: toastSuccess, error: toastError, pending: toastPending, dismiss } = useToast();
  const [mintError, setMintError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const { writeContract, data: mintTxHash, isPending: isMinting } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isMinted } = useWaitForTransactionReceipt({ hash: mintTxHash });

  const handleMint = useCallback(() => {
    if (!address) return;
    setMintError(null);
    try {
      const id = toastPending("Minting Agent ID…", "Waiting for wallet signature");
      setPendingId(id);
      writeContract({
        address: getAgentRegistryAddress(),
        abi: AGENT_REGISTRY_ABI,
        functionName: "mint",
        args: [DEFAULT_METADATA_URI],
      });
    } catch {
      setMintError("Failed to initiate mint. Please try again.");
      toastError("Mint failed");
    }
  }, [address, writeContract, toastPending, toastError]);

  if (isMinted && agent === null) {
    if (pendingId) { dismiss(pendingId); setPendingId(null); }
    toastSuccess("Agent minted!", "Your Agent ID is now on-chain");
    void refetch();
  }

  if (!isConnected || !address) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-center">
        <div className="w-10 h-10 rounded-[var(--radius)] bg-[var(--bg-elevated)] flex items-center justify-center mx-auto mb-3">
          <Cpu className="w-5 h-5 text-[var(--text-tertiary)]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Connect your wallet</p>
        <p className="text-xs text-[var(--text-tertiary)]">Your agent identity is tied to your wallet address</p>
      </div>
    );
  }

  if (isLoading) return <AgentCardSkeleton />;

  if (!agent) {
    return (
      <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 text-center">
        <div className="w-12 h-12 rounded-[var(--radius-lg)] flex items-center justify-center mx-auto mb-4 bg-[var(--accent-muted)]">
          <Cpu className="w-6 h-6" style={{ color: "var(--accent)" }} />
        </div>
        <h3 className="text-sm font-semibold font-mono text-[var(--text-primary)] mb-1">No Agent Found</h3>
        <p className="text-xs text-[var(--text-tertiary)] mb-5 leading-relaxed">
          Mint your QAI Agent ID to start building persistent on-chain memory
        </p>
        {mintError && (
          <div className="flex items-center gap-2 p-2.5 rounded-[var(--radius-sm)] bg-[var(--status-error-bg)] border border-[rgba(239,68,68,0.2)] mb-3 text-left">
            <AlertCircle className="w-3.5 h-3.5 text-[var(--status-error)] shrink-0" />
            <p className="text-xs text-[var(--status-error)]">{mintError}</p>
          </div>
        )}
        <Button onClick={handleMint} isLoading={isMinting || isConfirming} variant="accent" className="w-full">
          {isConfirming ? "Confirming on-chain…" : "Mint Agent ID"}
        </Button>
        {mintTxHash && (
          <a href={`https://chainscan-galileo.0g.ai/tx/${mintTxHash}`} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mt-2.5 text-xs text-[var(--text-tertiary)] hover:text-[var(--accent)] transition-colors">
            Tx: {mintTxHash.slice(0, 10)}… <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
    );
  }

  const registryAddress = (() => { try { return getAgentRegistryAddress(); } catch { return ""; } })();

  return (
    <div className={cn("rounded-[var(--radius-lg)] border bg-[var(--bg-surface)] p-5 transition-all duration-200 border-[var(--accent-border)]", "shadow-[0_0_20px_var(--accent-glow)]")}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[var(--radius)] flex items-center justify-center text-white font-bold font-mono text-sm shrink-0"
            style={{ background: agentGradient(address) }}
          >
            #{agent.tokenId.toString()}
          </div>
          <div>
            <p className="text-sm font-semibold font-mono text-[var(--text-primary)]">QAI Agent</p>
            <p className="text-xs text-[var(--text-tertiary)] font-mono">{truncateAddress(agent.owner)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={agent.active ? "success" : "destructive"} dot>{agent.active ? "Active" : "Inactive"}</Badge>
          {registryAddress && (
            <a href={getExplorerTokenUrl(registryAddress, agent.tokenId.toString())} target="_blank" rel="noopener noreferrer"
              aria-label="View on 0G Explorer"
              className="p-1 rounded hover:bg-[var(--bg-hover)] transition-colors text-[var(--text-tertiary)] hover:text-[var(--accent)]">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <StatItem icon={<Hash className="w-3 h-3" />} label="Sessions" value={agent.sessionCount.toString()} />
        <StatItem icon={<Star className="w-3 h-3" />} label="Rep" value={`${((Number(agent.reputationScore) / 10000) * 100).toFixed(0)}%`} />
        <StatItem icon={<Calendar className="w-3 h-3" />} label="Created" value={new Date(agent.createdAt * 1000).toLocaleDateString("en", { month: "short", day: "numeric" })} />
      </div>
    </div>
  );
}
