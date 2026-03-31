"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { type ReactNode } from "react";
import { wagmiConfig } from "@/lib/wagmi";
import { ThemeProvider, useTheme } from "@/lib/theme";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});

function RainbowKitWithTheme({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  return (
    <RainbowKitProvider
      theme={
        isDark
          ? darkTheme({
              accentColor: "#7c5cff",
              accentColorForeground: "white",
              borderRadius: "medium",
            })
          : lightTheme({
              accentColor: "#6c47ff",
              accentColorForeground: "white",
              borderRadius: "medium",
            })
      }
      modalSize="compact"
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitWithTheme>{children}</RainbowKitWithTheme>
        </QueryClientProvider>
      </WagmiProvider>
    </ThemeProvider>
  );
}
