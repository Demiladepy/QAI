"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/app", label: "Agent" },
    { href: "/dao", label: "DAO" },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{
        background: "color-mix(in srgb, var(--color-background) 80%, transparent)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ background: "var(--color-primary)" }}
          >
            Q
          </div>
          <span className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
            QAI
          </span>
        </Link>

        {/* Nav links */}
        <nav className="flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                pathname?.startsWith(link.href)
                  ? "bg-[var(--color-primary-muted)] text-[var(--color-primary)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:bg-[var(--color-muted)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Wallet */}
        <ConnectButton
          accountStatus="avatar"
          chainStatus="none"
          showBalance={false}
        />
      </div>
    </header>
  );
}
