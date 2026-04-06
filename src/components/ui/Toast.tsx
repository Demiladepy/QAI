"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, Info, X, ExternalLink } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "pending";

export interface ToastData {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  txHash?: string;
  duration?: number; // ms, 0 = persistent
}

interface ToastContextValue {
  toast: (data: Omit<ToastData, "id">) => string;
  dismiss: (id: string) => void;
  success: (message: string, description?: string) => string;
  error: (message: string, description?: string) => string;
  info: (message: string, description?: string) => string;
  pending: (message: string, description?: string) => string;
  txSuccess: (message: string, txHash: string) => string;
}

const ToastContext = createContext<ToastContextValue | null>(null);

// ── Hook ──────────────────────────────────────────────────────

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

// ── Individual Toast ──────────────────────────────────────────

function ToastItem({
  toast: t,
  onDismiss,
}: {
  toast: ToastData;
  onDismiss: (id: string) => void;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const duration = t.duration ?? (t.type === "pending" ? 0 : 5000);

  useEffect(() => {
    if (duration === 0) return;
    timerRef.current = setTimeout(() => onDismiss(t.id), duration);
    return () => clearTimeout(timerRef.current);
  }, [t.id, duration, onDismiss]);

  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle className="w-4 h-4 text-[var(--status-live)] shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-[var(--status-error)] shrink-0" />,
    info: <Info className="w-4 h-4 text-[var(--accent)] shrink-0" />,
    pending: (
      <div className="w-4 h-4 shrink-0">
        <svg className="animate-spin w-4 h-4 text-[var(--accent)]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>
    ),
  };

  const leftBorders: Record<ToastType, string> = {
    success: "border-l-[var(--status-live)]",
    error: "border-l-[var(--status-error)]",
    info: "border-l-[var(--accent)]",
    pending: "border-l-[var(--accent)] animate-border-glow",
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 w-80 rounded-[var(--radius-lg)]",
        "bg-[var(--bg-elevated)] border border-[var(--border-default)]",
        "border-l-2 px-4 py-3 shadow-glow animate-slide-up",
        leftBorders[t.type]
      )}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => clearTimeout(timerRef.current)}
      onMouseLeave={() => {
        if (duration > 0) {
          timerRef.current = setTimeout(() => onDismiss(t.id), duration);
        }
      }}
    >
      {icons[t.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] leading-snug">{t.message}</p>
        {t.description && (
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{t.description}</p>
        )}
        {t.txHash && (
          <a
            href={`https://chainscan-galileo.0g.ai/tx/${t.txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-[var(--accent)] mt-1 hover:underline"
          >
            View tx <ExternalLink className="w-3 h-3" />
          </a>
        )}
      </div>
      <button
        onClick={() => onDismiss(t.id)}
        className="shrink-0 p-0.5 rounded hover:bg-[var(--bg-hover)] transition-colors"
        aria-label="Dismiss notification"
      >
        <X className="w-3.5 h-3.5 text-[var(--text-tertiary)]" />
      </button>
    </div>
  );
}

// ── Provider ──────────────────────────────────────────────────

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback((data: Omit<ToastData, "id">): string => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => {
      const next = [...prev, { ...data, id }];
      return next.slice(-4); // max 4 toasts
    });
    return id;
  }, []);

  const success = useCallback(
    (message: string, description?: string) => toast({ type: "success", message, description }),
    [toast]
  );
  const error = useCallback(
    (message: string, description?: string) => toast({ type: "error", message, description }),
    [toast]
  );
  const info = useCallback(
    (message: string, description?: string) => toast({ type: "info", message, description }),
    [toast]
  );
  const pending = useCallback(
    (message: string, description?: string) => toast({ type: "pending", message, description, duration: 0 }),
    [toast]
  );
  const txSuccess = useCallback(
    (message: string, txHash: string) => toast({ type: "success", message, txHash }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss, success, error, info, pending, txSuccess }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-5 right-5 z-[200] flex flex-col-reverse gap-2"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
