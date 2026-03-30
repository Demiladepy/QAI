// ============================================================
// QAI — useChat hook
// Handles sending messages to /api/infer and updating store.
// ============================================================
"use client";

import { useCallback } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { useStore } from "@/store";
import { generateSessionId } from "@/lib/utils";
import type { AgentMode } from "@/types";

export function useChat() {
  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const {
    messages,
    isLoading,
    addMessage,
    setLoading,
    updateMessageAnchorStatus,
    mode,
    agent,
  } = useStore();

  const sendMessage = useCallback(
    async (content: string, daoId?: string) => {
      if (!address || !agent || isLoading) return;
      if (!content.trim()) return;

      // Trim to 4000 chars client-side as a UX safeguard
      const trimmedContent = content.trim().slice(0, 4000);

      const userMsgId = generateSessionId();
      addMessage({
        id: userMsgId,
        role: "user",
        content: trimmedContent,
        timestamp: Math.floor(Date.now() / 1000),
      });

      setLoading(true);

      try {
        // Build signature message (must match server-side expectedMessage)
        const agentId = agent.tokenId.toString();
        const msgToSign = `QAI: Authenticate agent ${agentId} for ${address}`;

        let signature: string;
        try {
          signature = await signMessageAsync({ message: msgToSign });
        } catch {
          addMessage({
            id: generateSessionId(),
            role: "assistant",
            content: "Signature rejected. Please approve the wallet prompt to continue.",
            timestamp: Math.floor(Date.now() / 1000),
          });
          return;
        }

        const response = await fetch("/api/infer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            agentId,
            userMessage: trimmedContent,
            walletAddress: address,
            signature,
            mode: mode as AgentMode,
            daoId,
          }),
        });

        const data = await response.json();

        if (!response.ok || data.error) {
          addMessage({
            id: generateSessionId(),
            role: "assistant",
            content: `Error: ${data.error ?? "Something went wrong. Please try again."}`,
            timestamp: Math.floor(Date.now() / 1000),
          });
          return;
        }

        const assistantMsgId = generateSessionId();
        addMessage({
          id: assistantMsgId,
          role: "assistant",
          content: data.content,
          timestamp: Math.floor(Date.now() / 1000),
          memoryAnchored: false,
        });

        // Mark memory as anchored after a short delay (simulates async anchor)
        if (data.memoryWritten !== false) {
          setTimeout(() => {
            updateMessageAnchorStatus(assistantMsgId, true);
          }, 1500);
        }
      } catch (err) {
        console.error("[useChat] sendMessage error:", err);
        addMessage({
          id: generateSessionId(),
          role: "assistant",
          content: "Network error. Please check your connection and try again.",
          timestamp: Math.floor(Date.now() / 1000),
        });
      } finally {
        setLoading(false);
      }
    },
    [address, agent, isLoading, addMessage, setLoading, updateMessageAnchorStatus, mode, signMessageAsync]
  );

  return { messages, isLoading, sendMessage };
}
