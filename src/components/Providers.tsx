"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { type ReactNode } from "react";
import { wagmiConfig } from "@/lib/wagmi";
import { ToastProvider } from "@/components/ui/Toast";

import "@rainbow-me/rainbowkit/styles.css";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const rainbowTheme = darkTheme({
  accentColor: "#00e5bf",
  accentColorForeground: "#09090b",
  borderRadius: "medium",
  overlayBlur: "small",
  fontStack: "system",
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rainbowTheme} modalSize="compact">
          <ToastProvider>
            {children}
          </ToastProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
