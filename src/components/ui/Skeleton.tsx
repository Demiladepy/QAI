import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "line" | "circle" | "rect" | "card";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = "rect", width, height }: SkeletonProps) {
  const variants = {
    line: "h-4 rounded-full",
    circle: "rounded-full aspect-square",
    rect: "rounded-[var(--radius)]",
    card: "rounded-[var(--radius-lg)] h-32",
  };

  return (
    <div
      className={cn("skeleton", variants[variant], className)}
      style={{
        width: width !== undefined ? (typeof width === "number" ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === "number" ? `${height}px` : height) : undefined,
      }}
      aria-hidden="true"
    />
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="line" width="60%" height={14} />
          <Skeleton variant="line" width="40%" height={12} />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <Skeleton height={56} />
        <Skeleton height={56} />
        <Skeleton height={56} />
      </div>
      <div className="flex gap-2">
        <Skeleton height={36} className="flex-1" />
        <Skeleton height={36} width={80} />
      </div>
    </div>
  );
}

export function MessageSkeleton() {
  return (
    <div className="space-y-3 p-4">
      <div className="flex gap-3">
        <Skeleton variant="circle" width={28} height={28} />
        <div className="flex-1 space-y-2">
          <Skeleton variant="line" width="80%" height={14} />
          <Skeleton variant="line" width="60%" height={14} />
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <div className="flex-1 max-w-xs space-y-2">
          <Skeleton variant="line" width="100%" height={14} className="ml-auto" />
          <Skeleton variant="line" width="70%" height={14} className="ml-auto" />
        </div>
        <Skeleton variant="circle" width={28} height={28} />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 space-y-2">
      <Skeleton variant="line" width="50%" height={12} />
      <Skeleton variant="line" width="35%" height={28} />
    </div>
  );
}
