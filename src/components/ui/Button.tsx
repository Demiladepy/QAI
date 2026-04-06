"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost" | "destructive" | "accent";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium rounded-[var(--radius)] transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-root)] disabled:opacity-40 disabled:cursor-not-allowed select-none shrink-0";

    const variants = {
      primary:
        "bg-[var(--accent)] text-[#09090b] hover:bg-[var(--accent-hover)] active:scale-[0.98]",
      accent:
        "bg-[var(--accent)] text-[#09090b] hover:bg-[var(--accent-hover)] active:scale-[0.98] shadow-[0_0_20px_var(--accent-glow)]",
      outline:
        "border border-[var(--border-default)] text-[var(--text-secondary)] hover:border-[var(--accent-border)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)] active:scale-[0.98]",
      ghost:
        "text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] active:scale-[0.98]",
      destructive:
        "bg-[var(--status-error-bg)] text-[var(--status-error)] border border-[var(--status-error)] border-opacity-30 hover:bg-[var(--status-error)] hover:text-white active:scale-[0.98]",
    };

    const sizes = {
      sm: "text-xs px-3 py-1.5 gap-1.5 h-7",
      md: "text-sm px-4 py-2 gap-2 h-9",
      lg: "text-sm px-5 py-2.5 gap-2 h-10",
      icon: "text-sm p-2 h-9 w-9",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span>{children ?? "Loading..."}</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
