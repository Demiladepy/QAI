"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { useChat } from "@/hooks/useChat";
import { useStore } from "@/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle, Clock } from "lucide-react";
import type { Message } from "@/types";

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

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || !agent) return;
    setInput("");
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

  // Auto-resize textarea
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, []);

  if (!agent) {
    return (
      <div
        className="flex flex-col items-center justify-center h-64 rounded-xl border text-center"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
        }}
      >
        <p className="text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>
          Mint your agent first
        </p>
        <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          You need a QAI Agent ID to start chatting
        </p>
      </div>
    );
  }

  const defaultPlaceholder = daoId
    ? "Ask about proposals, past decisions, conflicts..."
    : "Message your agent... (Shift+Enter for new line)";

  return (
    <div
      className="flex flex-col rounded-xl border overflow-hidden"
      style={{
        borderColor: "var(--color-border)",
        background: "var(--color-surface)",
        height: "clamp(420px, 60vh, 640px)",
      }}
    >
      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              {daoId
                ? "Ask your governance agent about proposals or past decisions."
                : "Your agent is ready. Say something — it will remember."}
            </p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex items-start gap-2">
            <AgentAvatar />
            <div
              className="rounded-xl rounded-tl-sm px-4 py-3 max-w-[80%]"
              style={{ background: "var(--color-muted)" }}
            >
              <div className="flex gap-1 items-center h-4">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full animate-bounce"
                    style={{
                      background: "var(--color-text-muted)",
                      animationDelay: `${i * 0.15}s`,
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
      <div
        className="border-t p-3 flex items-end gap-2"
        style={{ borderColor: "var(--color-border)" }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? defaultPlaceholder}
          disabled={isLoading}
          rows={1}
          maxLength={4000}
          className="flex-1 resize-none rounded-lg px-3 py-2 text-sm outline-none transition-colors"
          style={{
            background: "var(--color-background)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
            minHeight: "40px",
            maxHeight: "160px",
          }}
          aria-label="Message input"
        />
        <Button
          onClick={() => void handleSend()}
          disabled={!input.trim() || isLoading}
          size="sm"
          className="h-10 px-3"
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
    <div
      className={cn("flex items-start gap-2", isUser && "flex-row-reverse")}
    >
      {!isUser && <AgentAvatar />}

      <div className={cn("flex flex-col gap-1 max-w-[80%]", isUser && "items-end")}>
        <div
          className={cn(
            "rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap break-words",
            isUser ? "rounded-tr-sm" : "rounded-tl-sm"
          )}
          style={{
            background: isUser
              ? "var(--color-primary)"
              : "var(--color-muted)",
            color: isUser
              ? "var(--color-primary-foreground)"
              : "var(--color-text)",
          }}
        >
          {message.content}
        </div>

        {/* Memory badge for assistant messages */}
        {!isUser && (
          <div className="flex items-center gap-1 px-1">
            {message.memoryAnchored ? (
              <span className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-success)" }}>
                <CheckCircle className="w-3 h-3" />
                Memory updated
              </span>
            ) : (
              <span className="flex items-center gap-1 text-xs"
                style={{ color: "var(--color-text-muted)" }}>
                <Clock className="w-3 h-3" />
                Writing to memory...
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
      className="flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 text-white text-xs font-bold"
      style={{ background: "var(--color-primary)" }}
      aria-label="Agent"
    >
      Q
    </div>
  );
}
