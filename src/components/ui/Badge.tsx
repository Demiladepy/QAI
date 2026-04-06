import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "destructive" | "outline" | "primary";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = "default", children, className, dot = false }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default:
      "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]",
    accent:
      "bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent-border)]",
    primary:
      "bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent-border)]",
    success:
      "bg-[var(--status-live-bg)] text-[var(--status-live)] border border-[rgba(34,197,94,0.2)]",
    warning:
      "bg-[var(--status-warning-bg)] text-[var(--status-warning)] border border-[rgba(245,158,11,0.2)]",
    destructive:
      "bg-[var(--status-error-bg)] text-[var(--status-error)] border border-[rgba(239,68,68,0.2)]",
    outline:
      "border border-[var(--border-default)] text-[var(--text-tertiary)]",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-[var(--text-tertiary)]",
    accent: "bg-[var(--accent)]",
    primary: "bg-[var(--accent)]",
    success: "bg-[var(--status-live)]",
    warning: "bg-[var(--status-warning)]",
    destructive: "bg-[var(--status-error)]",
    outline: "bg-[var(--text-tertiary)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {dot && (
        <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />
      )}
      {children}
    </span>
  );
}
