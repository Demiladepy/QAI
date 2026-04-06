// ============================================================
// QAI — Environment validation
// Called at runtime to determine which services are available.
// ============================================================

export interface EnvConfig {
  hasWalletConnect: boolean;
  hasContracts: boolean;
  hasInference: boolean;
  hasStorage: boolean;
  agentRegistryAddress: string | null;
  memoryAnchorAddress: string | null;
  rpcUrl: string;
}

let _config: EnvConfig | null = null;

export function getEnvConfig(): EnvConfig {
  if (_config) return _config;

  _config = {
    hasWalletConnect: !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    hasContracts:
      !!process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS &&
      !!process.env.NEXT_PUBLIC_MEMORY_ANCHOR_ADDRESS,
    hasInference: !!process.env.ZEROG_COMPUTE_ENDPOINT,
    hasStorage: !!process.env.ZEROG_STORAGE_NODE_URL,
    agentRegistryAddress: process.env.NEXT_PUBLIC_AGENT_REGISTRY_ADDRESS ?? null,
    memoryAnchorAddress: process.env.NEXT_PUBLIC_MEMORY_ANCHOR_ADDRESS ?? null,
    rpcUrl:
      process.env.NEXT_PUBLIC_ZEROG_RPC_URL ?? "https://evmrpc-testnet.0g.ai",
  };

  // Warn in dev about missing config — don't throw, show UI error states instead
  if (process.env.NODE_ENV === "development") {
    if (!_config.hasWalletConnect) {
      console.warn("[QAI] NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID not set — wallet modals disabled");
    }
    if (!_config.hasContracts) {
      console.warn("[QAI] Contract addresses not set — deploy contracts and populate .env.local");
    }
    if (!_config.hasInference) {
      console.warn("[QAI] ZEROG_COMPUTE_ENDPOINT not set — inference will fail");
    }
    if (!_config.hasStorage) {
      console.warn("[QAI] ZEROG_STORAGE_NODE_URL not set — memory persistence disabled");
    }
  }

  return _config;
}

/** Server-side only: throw if critical server-side vars missing */
export function requireServerEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required server env var: ${key}`);
  return val;
}
