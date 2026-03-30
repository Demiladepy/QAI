"use client";

import React from "react";
import { Button } from "@/components/ui/Button";

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  State
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, errorMessage: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      // Never expose stack traces in production
      errorMessage:
        process.env.NODE_ENV === "development"
          ? error.message
          : "An unexpected error occurred.",
    };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // Log to monitoring service in production
    console.error("[QAI ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div
          className="rounded-xl border p-6 text-center"
          style={{
            borderColor: "var(--color-destructive)",
            background: "var(--color-destructive-bg)",
          }}
          role="alert"
        >
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: "var(--color-destructive-foreground)" }}
          >
            Something went wrong
          </p>
          <p
            className="text-xs mb-4"
            style={{ color: "var(--color-destructive-foreground)", opacity: 0.8 }}
          >
            {this.state.errorMessage}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => this.setState({ hasError: false, errorMessage: "" })}
          >
            Try again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
