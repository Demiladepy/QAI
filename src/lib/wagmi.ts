// ============================================================
// QAI — wagmi + RainbowKit configuration
// ============================================================
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ZEROG_TESTNET } from "./contracts";

// RainbowKit requires a non-empty projectId even during SSR static generation.
// We fall back to a placeholder so builds succeed without env vars.
// In production, set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID for WalletConnect to work.
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ??
  "00000000000000000000000000000000";

if (
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID === undefined &&
  typeof window !== "undefined"
) {
  console.warn(
    "QAI: NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set. " +
      "WalletConnect modals will not work."
  );
}

export const wagmiConfig = getDefaultConfig({
  appName: "QAI — Decentralized AI Identity",
  projectId,
  chains: [ZEROG_TESTNET],
  ssr: true,
});
