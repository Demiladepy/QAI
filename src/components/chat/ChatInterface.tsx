"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { BrandLogo } from "@/components/BrandLogo";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle, Clock } from "lucide-react";
import type { Message } from "@/types";

const PROMPT_SUGGESTIONS = [
  "Remember: my name is Alex and I'm building a DeFi startup.",
  "What have we discussed in previous sessions?",
  "Summarize what you know about me so far.",
];

interface ChatInterfaceProps {
  daoId?: string;
  placeholder?: string;
}

export function ChatInterface({ daoId, placeholder }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage } = useChat();
  const { agent } = useStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !agent) return;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendMessage(trimmed, daoId);
  }, [input, isLoading, agent, sendMessage, daoId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        void handleSend();
      }
    },
    [handleSend]
  );

  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const ta = e.target;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }, []);

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-64 rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-center p-8 animate-fade-in">
        <div className="rounded-[var(--radius-lg)] bg-black/50 px-3 py-2 mb-4 flex items-center justify-center">
          <BrandLogo heightPx={36} className="max-w-[140px]" />
        </div>
        <p className="text-sm font-medium text-[var(--text-primary)] mb-1">Mint your agent first</p>
        <p className="text-xs text-[var(--text-tertiary)]">You need a QAI Agent ID to start chatting</p>
      </div>
    );
  }

  const defaultPlaceholder = daoId
    ? "Ask about proposals, past decisions, conflicts…"
    : "Message your agent… (Enter to send, Shift+Enter for newline)";

  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden h-full min-h-[420px]">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center py-8">
            <div className="rounded-[var(--radius)] bg-black/45 px-2 py-1.5 mb-4 animate-breathe">
              <BrandLogo heightPx={32} className="max-w-[120px] mx-auto" />
            </div>
            <p className="text-sm text-[var(--text-primary)] font-medium mb-1">
              {daoId ? "Governance Agent Ready" : "Your Agent is Ready"}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mb-6 max-w-xs">
              {daoId
                ? "Ask about proposals, past decisions, or conflicts in this DAO."
                : "Say something — it will remember across every session."}
            </p>
            {!daoId && (
              <div className="flex flex-col gap-2 w-full max-w-xs">
                {PROMPT_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s)}
                    className="text-left text-xs px-3 py-2 rounded-[var(--radius-sm)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] hover:border-[var(--accent-border)] hover:text-[var(--text-secondary)] transition-all duration-150"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-2 animate-fade-in">
            <AgentAvatar />
            <div className="rounded-[var(--radius-lg)] rounded-tl-sm px-4 py-3 bg-[var(--bg-elevated)]">
              <div className="flex gap-1 items-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: "var(--accent)",
                      animation: `pulse-accent 1s ease-in-out ${i * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-[var(--border-subtle)] p-3 flex items-end gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? defaultPlaceholder}
          disabled={isLoading}
          rows={1}
          maxLength={4000}
          className={cn(
            "flex-1 resize-none rounded-[var(--radius)] px-3 py-2 text-sm",
            "bg-[var(--bg-elevated)] text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]",
            "border border-[var(--border-default)] outline-none",
            "focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-muted)]",
            "transition-all duration-150",
            "min-h-[40px] max-h-[160px]"
          )}
          aria-label="Message input"
        />
        <Button
          onClick={() => void handleSend()}
          disabled={!input.trim() || isLoading}
          size="icon"
          variant="accent"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex items-start gap-2 animate-slide-up", isUser && "flex-row-reverse")}>
      {!isUser && <AgentAvatar />}

      <div className={cn("flex flex-col gap-1 max-w-[82%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-[var(--radius-lg)] px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser ? "rounded-tr-sm" : "rounded-tl-sm"
          )}
          style={
            isUser
              ? { background: "var(--accent)", color: "#09090b" }
              : { background: "var(--bg-elevated)", color: "var(--text-primary)" }
          }
        >
          {message.content}
        </div>

        {!isUser && (
          <div className="flex items-center gap-1 px-1">
            {message.memoryAnchored ? (
              <span className="flex items-center gap-1 text-xs text-[var(--status-live)]">
                <CheckCircle className="w-3 h-3" />
                Saved to 0G memory
              </span>
            ) : message.memorySettled ? (
              <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                <Clock className="w-3 h-3" />
                {message.memoryPersistHint === "inactive"
                  ? "Persistence off — set NEXT_PUBLIC_ZEROG_KV_CONTRACT + INFERENCE_GATEWAY_PRIVATE_KEY"
                  : "Not saved — check KV, gateway key, or server logs (timeout / SDK)"}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs text-[var(--text-tertiary)]">
                <Clock className="w-3 h-3" />
                Writing to memory…
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentAvatar() {
  return (
    <div
      className="flex items-center justify-center h-7 min-w-[1.75rem] rounded-[var(--radius-sm)] shrink-0 overflow-hidden bg-black/60 px-0.5"
      aria-label="QAI Agent"
    >
      <BrandLogo heightPx={22} className="max-w-[52px]" />
    </div>
  );
}
