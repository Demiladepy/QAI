// ============================================================
// QAI — Contract client utilities (read-only, viem-based)
// ============================================================
import {
  createPublicClient,
  http,
  getAddress,
  type PublicClient,
  type Address,
} from "viem";
import { AGENT_REGISTRY_ABI, MEMORY_ANCHOR_ABI } from "./abis";
import type { AgentMetadata } from "@/types";

// ── Chain config ─────────────────────────────────────────────

export const ZEROG_TESTNET = {
  id: 16601,
  name: "0G Testnet",
  nativeCurrency: { name: "A0GI", symbol: "A0GI", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        process.env.NEXT_PUBLIC_ZEROG_RPC_URL ?? "https://evmrpc-testnet.0g.ai",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "0G Explorer",
      url: "https://chainscan-galileo.0g.ai",
    },
  },
  testnet: true,
} as const;

// ── Public client (no wallet required) ───────────────────────

let _publicClient: PublicClient | null = null;

export function getPublicClient(): PublicClient {
  if (!_publicClient) {
    _publicClient = createPublicClient({
      chain: ZEROG_TESTNET,
      transport: http(
        process.env.NEXT_PUBLIC_ZEROG_RPC_URL ?? "https://evmrpc-testnet.0g.ai"
      ),
    });
  }
  return _publicClient;
}

// ── Contract addresses ────────────────────────────────────────

function getContractAddress(envVar: string, name: string): Address {
  const val = process.env[envVar];
  if (!val) {
    throw new Error(
      `${name} address not configured. Set ${envVar} in .env.local`
    );
  }
  return getAddress(val);
}

export function getAgentRegistryAddress(): Address {
  return getContractAddress(
    "NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS",
    "AgentRegistry"
  );
}

export function getMemoryAnchorAddress(): Address {
  return getContractAddress(
    "NEXT_PUBLIC_MEMORY_ANCHOR_ADDRESS",
    "MemoryAnchor"
  );
}

// ── Read helpers ──────────────────────────────────────────────

/**
 * Get agent token ID for a wallet. Returns 0n if no agent.
 */
export async function getAgentByOwner(
  ownerAddress: string
): Promise<bigint> {
  const client = getPublicClient();
  const result = await client.readContract({
    address: getAgentRegistryAddress(),
    abi: AGENT_REGISTRY_ABI,
    functionName: "getAgentByOwner",
    args: [getAddress(ownerAddress)],
  });
  return result;
}

/**
 * Get full on-chain metadata for an agent.
 */
export async function getAgentMetadata(
  tokenId: bigint
): Promise<AgentMetadata | null> {
  if (tokenId === 0n) return null;
  const client = getPublicClient();

  const [agent, uri] = await Promise.all([
    client.readContract({
      address: getAgentRegistryAddress(),
      abi: AGENT_REGISTRY_ABI,
      functionName: "getAgent",
      args: [tokenId],
    }),
    client.readContract({
      address: getAgentRegistryAddress(),
      abi: AGENT_REGISTRY_ABI,
      functionName: "tokenURI",
      args: [tokenId],
    }),
  ]);

  return {
    tokenId,
    owner: agent.agentOwner,
    createdAt: Number(agent.createdAt),
    sessionCount: agent.sessionCount,
    reputationScore: agent.reputationScore,
    active: agent.active,
    metadataURI: uri,
  };
}

/**
 * Check if a wallet has an agent.
 */
export async function hasAgent(ownerAddress: string): Promise<boolean> {
  const tokenId = await getAgentByOwner(ownerAddress);
  return tokenId > 0n;
}

/**
 * Get on-chain session history from MemoryAnchor.
 */
export async function getOnChainSessionHistory(
  tokenId: bigint,
  offset = 0,
  limit = 20
): Promise<
  Array<{ sessionHash: `0x${string}`; timestamp: bigint; anchoredBy: Address }>
> {
  const client = getPublicClient();
  const result = await client.readContract({
    address: getMemoryAnchorAddress(),
    abi: MEMORY_ANCHOR_ABI,
    functionName: "getSessionHistoryPaginated",
    args: [tokenId, BigInt(offset), BigInt(limit)],
  });
  return result as Array<{
    sessionHash: `0x${string}`;
    timestamp: bigint;
    anchoredBy: Address;
  }>;
}

/**
 * Verify a session hash exists on-chain.
 */
export async function verifySessionOnChain(
  tokenId: bigint,
  sessionHash: `0x${string}`
): Promise<boolean> {
  const client = getPublicClient();
  return client.readContract({
    address: getMemoryAnchorAddress(),
    abi: MEMORY_ANCHOR_ABI,
    functionName: "verifySession",
    args: [tokenId, sessionHash],
  });
}

// ── Explorer URL helpers ──────────────────────────────────────

export function getExplorerTxUrl(txHash: string): string {
  return `https://chainscan-galileo.0g.ai/tx/${txHash}`;
}

export function getExplorerAddressUrl(address: string): string {
  return `https://chainscan-galileo.0g.ai/address/${address}`;
}

export function getExplorerTokenUrl(
  contractAddress: string,
  tokenId: string
): string {
  return `https://chainscan-galileo.0g.ai/token/${contractAddress}/instance/${tokenId}`;
}
