"use client";

import { useStore } from "@/store";
import { MOCK_DAOS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { Users, Wallet } from "lucide-react";
import type { DAO } from "@/types";

function formatUSD(amount: number): string {
  if (amount >= 1_000_000)
    return `$${(amount / 1_000_000).toFixed(1)}M`;
  return `$${(amount / 1_000).toFixed(0)}K`;
}

export function DAOSelector() {
  const { selectedDAO, setSelectedDAO } = useStore();

  return (
    <div>
      <p className="text-xs font-medium mb-2" style={{ color: "var(--color-text-muted)" }}>
        Select a DAO
      </p>
      <div className="space-y-2">
        {MOCK_DAOS.map((dao) => (
          <DAOItem
            key={dao.id}
            dao={dao}
            isSelected={selectedDAO?.id === dao.id}
            onSelect={() => setSelectedDAO(dao)}
          />
        ))}
      </div>
    </div>
  );
}

function DAOItem({
  dao,
  isSelected,
  onSelect,
}: {
  dao: DAO;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full text-left rounded-xl p-3 border transition-all",
        "hover:border-[var(--color-primary)] focus-visible:outline-none"
      )}
      style={{
        background: isSelected
          ? "var(--color-primary-muted)"
          : "var(--color-surface)",
        borderColor: isSelected
          ? "var(--color-primary)"
          : "var(--color-border)",
      }}
      aria-pressed={isSelected}
      aria-label={`Select ${dao.name}`}
    >
      <div className="flex items-start justify-between mb-1">
        <span
          className="text-sm font-semibold"
          style={{
            color: isSelected
              ? "var(--color-primary)"
              : "var(--color-text)",
          }}
        >
          {dao.name}
        </span>
      </div>

      <p
        className="text-xs line-clamp-2 mb-2"
        style={{ color: "var(--color-text-muted)" }}
      >
        {dao.description}
      </p>

      <div className="flex items-center gap-3">
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Users className="w-3 h-3" />
          {dao.memberCount.toLocaleString()}
        </span>
        <span
          className="flex items-center gap-1 text-xs"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <Wallet className="w-3 h-3" />
          {formatUSD(dao.treasuryUSD)}
        </span>
      </div>
    </button>
  );
}
