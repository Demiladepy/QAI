"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Activity, LayoutGrid, Scale, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store";
import { useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { toggleSidebar, sidebarOpen } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isApp = pathname?.startsWith("/app");
  const isDao = pathname?.startsWith("/dao");

  const navLinks = [
    { href: "/app", label: "Agent", icon: <Activity className="w-3.5 h-3.5" /> },
    { href: "/dao", label: "DAO", icon: <Scale className="w-3.5 h-3.5" /> },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border-subtle)]"
      style={{
        background: "rgba(9, 9, 11, 0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <div className="max-w-screen-xl mx-auto px-4 h-12 flex items-center gap-3">
        {/* Sidebar toggle (app pages only) */}
        {(isApp || isDao) && (
          <button
            onClick={toggleSidebar}
            className="p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-colors"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-[#09090b] text-xs font-bold font-mono"
            style={{ background: "var(--accent)" }}
          >
            Q
          </div>
          <span className="text-sm font-bold font-mono tracking-tight text-[var(--text-primary)] hidden sm:block">
            QAI
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden sm:flex items-center gap-0.5 ml-2" aria-label="Main navigation">
          {navLinks.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-sm)] text-xs font-medium transition-all duration-150",
                  active
                    ? "bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent-border)]"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        {/* Right: wallet */}
        <div className="flex items-center gap-2">
          {/* Mobile nav toggle */}
          <button
            className="sm:hidden p-1.5 rounded-[var(--radius-sm)] text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <LayoutGrid className="w-4 h-4" />}
          </button>

          <ConnectButton
            accountStatus="avatar"
            chainStatus="none"
            showBalance={false}
          />
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-2 flex flex-col gap-1 animate-slide-down">
          {navLinks.map((link) => {
            const active = pathname?.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium transition-all",
                  active
                    ? "bg-[var(--accent-muted)] text-[var(--accent)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
