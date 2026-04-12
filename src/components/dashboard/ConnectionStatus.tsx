"use client";

import { useEffect } from "react";
import { useAccount, useChainId } from "wagmi";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";

function Dot({ status }: { status: "live" | "warning" | "error" | "pending" }) {
  return (
    <span
      className={cn(
        "status-dot",
        status === "live" && "live",
        status === "warning" && "warning",
        status === "error" && "error",
        status === "pending" && "pending"
      )}
    />
  );
}

const ZEROG_CHAIN_ID = 16601;

export function ConnectionStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { connectionStatus, updateConnectionStatus } = useStore();

  // Sync wallet connection
  useEffect(() => {
    updateConnectionStatus({ wallet: isConnected ? "connected" : "disconnected" });
  }, [isConnected, updateConnectionStatus]);

  // Check contracts (env vars set = deployed)
  useEffect(() => {
    const hasRegistry = !!process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS;
    const hasAnchor = !!process.env.NEXT_PUBLIC_MEMORY_ANCHOR_ADDRESS;
    const onRightChain = chainId === ZEROG_CHAIN_ID;

    if (!hasRegistry || !hasAnchor) {
      updateConnectionStatus({ contracts: "not_deployed" });
    } else if (!onRightChain && isConnected) {
      updateConnectionStatus({ contracts: "wrong_network" });
    } else {
      updateConnectionStatus({ contracts: "live" });
    }
  }, [chainId, isConnected, updateConnectionStatus]);

  // Check inference + storage (health ping)
  useEffect(() => {
    let cancelled = false;

    async function checkServices() {
      try {
        const res = await fetch("/api/health", { cache: "no-store" });
        if (res.ok && !cancelled) {
          const data = await res.json() as {
            services: {
              contracts: boolean;
              storage: boolean;
              compute: boolean;
              persistenceReady: boolean;
            };
          };
          updateConnectionStatus({
            inference: data.services.compute ? "connected" : "not_configured",
            kvStore: data.services.persistenceReady ? "connected" : "not_configured",
          });
        }
      } catch {
        if (!cancelled) {
          updateConnectionStatus({ inference: "error", kvStore: "error" });
        }
      }
    }

    void checkServices();
    const interval = setInterval(() => { void checkServices(); }, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [updateConnectionStatus]);

  const rows: Array<{ label: string; value: string; dot: "live" | "warning" | "error" | "pending" }> = [
    {
      label: "Wallet",
      value: connectionStatus.wallet === "connected" && address
        ? `${address.slice(0, 6)}…${address.slice(-4)}`
        : "Disconnected",
      dot: connectionStatus.wallet === "connected" ? "live" : "error",
    },
    {
      label: "Contracts",
      dot: connectionStatus.contracts === "live" ? "live"
        : connectionStatus.contracts === "checking" ? "pending"
        : "error",
      value: connectionStatus.contracts === "live" ? "0G Testnet"
        : connectionStatus.contracts === "checking" ? "Checking…"
        : connectionStatus.contracts === "not_deployed" ? "Not deployed"
        : "Wrong network",
    },
    {
      label: "Inference",
      dot: connectionStatus.inference === "connected" ? "live"
        : connectionStatus.inference === "checking" ? "pending"
        : connectionStatus.inference === "not_configured" ? "warning"
        : "error",
      value: connectionStatus.inference === "connected" ? "0G Compute"
        : connectionStatus.inference === "checking" ? "Checking…"
        : connectionStatus.inference === "not_configured" ? "Not configured"
        : "Error",
    },
    {
      label: "KV Store",
      dot: connectionStatus.kvStore === "connected" ? "live"
        : connectionStatus.kvStore === "checking" ? "pending"
        : connectionStatus.kvStore === "not_configured" ? "warning"
        : "error",
      value: connectionStatus.kvStore === "connected" ? "0G Storage"
        : connectionStatus.kvStore === "checking" ? "Checking…"
        : connectionStatus.kvStore === "not_configured" ? "Not configured"
        : "Error",
    },
  ];

  const allLive = rows.every((r) => r.dot === "live");
  const hasError = rows.some((r) => r.dot === "error");

  return (
    <div className="space-y-1.5">
      {/* Summary pill */}
      <div className="flex items-center gap-1.5 px-2 py-1">
        <Dot status={allLive ? "live" : hasError ? "error" : "warning"} />
        <span className="text-xs font-medium text-[var(--text-tertiary)] font-mono">
          {allLive ? "All systems live" : hasError ? "Degraded" : "Partial"}
        </span>
      </div>

      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between px-2 py-1 rounded hover:bg-[var(--bg-hover)] transition-colors"
        >
          <span className="text-xs text-[var(--text-tertiary)] font-mono">{row.label}</span>
          <div className="flex items-center gap-1.5">
            <Dot status={row.dot} />
            <span className="text-xs text-[var(--text-secondary)]">{row.value}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
