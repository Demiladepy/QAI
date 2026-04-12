"use client";

import { useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/BrandLogo";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AppError({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("[QAI] route error:", error);
  }, [error]);

  const isDev = process.env.NODE_ENV === "development";
  const message = isDev ? error.message : "Something went wrong. Try again or return home.";

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] px-4 text-center">
      <div
        className="max-w-md rounded-[14px] border border-white/[0.1] bg-[#111111] p-8"
        style={{ boxShadow: "0 0 40px rgba(131, 81, 255, 0.08)" }}
      >
        <div className="mb-6 flex justify-center rounded-lg bg-black/40 px-3 py-2">
          <BrandLogo heightPx={32} className="max-w-[120px]" />
        </div>
        <p className="mb-2 font-mono text-xs uppercase tracking-widest text-[#8351FF]">Error</p>
        <h1 className="mb-4 font-mono text-xl font-semibold text-zinc-100">This segment failed to render</h1>
        <p className="mb-6 font-mono text-sm text-zinc-500">{message}</p>
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="rounded-[10px] bg-[#8351FF] px-4 py-2.5 font-mono text-sm font-semibold text-[#0a0a0a] transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-[10px] border border-white/15 px-4 py-2.5 font-mono text-sm text-zinc-300 transition-colors hover:border-[rgba(131,81,255,0.4)] hover:text-white"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
