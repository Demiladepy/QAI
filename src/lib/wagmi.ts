// ============================================================
// QAI — wagmi + RainbowKit configuration
// ============================================================
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { ZEROG_TESTNET } from "./contracts";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

if (!projectId && typeof window !== "undefined") {
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
