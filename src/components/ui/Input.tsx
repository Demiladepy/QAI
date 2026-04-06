"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-medium text-[var(--text-secondary)]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-[var(--radius)] border bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm",
              "placeholder:text-[var(--text-tertiary)]",
              "border-[var(--border-default)] focus:border-[var(--accent)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)]",
              "transition-all duration-150 h-9 px-3",
              leftIcon && "pl-9",
              error && "border-[var(--status-error)] focus:border-[var(--status-error)] focus:ring-[rgba(239,68,68,0.1)]",
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[var(--status-error)]">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-[var(--text-tertiary)]">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[var(--text-secondary)]">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          className={cn(
            "w-full rounded-[var(--radius)] border bg-[var(--bg-elevated)] text-[var(--text-primary)] text-sm",
            "placeholder:text-[var(--text-tertiary)]",
            "border-[var(--border-default)] focus:border-[var(--accent)]",
            "focus:outline-none focus:ring-2 focus:ring-[var(--accent-muted)]",
            "transition-all duration-150 px-3 py-2 resize-none",
            error && "border-[var(--status-error)]",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-[var(--status-error)]">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
