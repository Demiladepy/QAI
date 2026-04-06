import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  hover?: boolean;
  accent?: boolean;
}

export function Card({ children, className, as: Tag = "div", hover = false, accent = false }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-[var(--radius-lg)] border p-5",
        "bg-[var(--bg-surface)] border-[var(--border-subtle)]",
        hover && "transition-all duration-200 hover:border-[var(--accent-border)] hover:shadow-accent hover:-translate-y-px",
        accent && "border-[var(--accent-border)] shadow-[0_0_24px_var(--accent-glow)]",
        className
      )}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-4", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <h3 className={cn("text-sm font-semibold font-mono text-[var(--text-primary)]", className)}>
      {children}
    </h3>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("text-sm text-[var(--text-secondary)]", className)}>{children}</div>;
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("mt-4 pt-4 border-t border-[var(--border-subtle)] flex items-center gap-3", className)}>
      {children}
    </div>
  );
}
