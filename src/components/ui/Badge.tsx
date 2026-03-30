import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "outline" | "primary";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = "default", children, className }: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
    primary: "bg-[var(--color-primary-muted)] text-[var(--color-primary)]",
    success: "bg-[var(--color-success-bg)] text-[var(--color-success-foreground)]",
    warning: "bg-[var(--color-warning-bg)] text-[var(--color-warning-foreground)]",
    destructive: "bg-[var(--color-destructive-bg)] text-[var(--color-destructive-foreground)]",
    outline: "border border-[var(--color-border)] text-[var(--color-text-secondary)]",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
