import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  preload: true,
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "QAI — Decentralized AI Identity",
  description:
    "Persistent on-chain AI agent identities powered by 0G Storage, Compute, and TEE.",
  keywords: ["AI", "agents", "blockchain", "0G", "decentralized", "identity", "memory"],
  authors: [{ name: "QAI Protocol" }],
  openGraph: {
    title: "QAI — Decentralized AI Identity",
    description: "Give your AI agent a persistent on-chain identity and memory.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#09090b",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
