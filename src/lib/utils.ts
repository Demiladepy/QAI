// ============================================================
// QAI — Shared utility functions
// ============================================================
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Truncate an Ethereum address for display.
 * 0x1234...5678
 */
export function truncateAddress(address: string, chars = 4): string {
  if (!address) return "";
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}

/**
 * Format a unix timestamp to a readable string.
 */
export function formatTimestamp(ts: number): string {
  return new Date(ts * 1000).toLocaleString();
}

/**
 * Format a bigint reputation score out of 10,000 to a percentage string.
 */
export function formatReputation(score: bigint): string {
  const pct = Number(score) / 100;
  return `${pct.toFixed(1)}%`;
}

/**
 * Build a 0G Storage KV key for a session.
 */
export function buildSessionKey(tokenId: string, sessionIndex: number): string {
  return `agent:${tokenId}:session:${sessionIndex}`;
}

/**
 * Build a 0G Storage Log key for a session transcript.
 */
export function buildLogKey(tokenId: string, timestamp: number): string {
  return `agent:${tokenId}:log:${timestamp}`;
}

/**
 * Sanitize a string for use in prompts — strip null bytes and excessive whitespace.
 * Never trust user input passed to an LLM without sanitizing.
 */
export function sanitizeForPrompt(input: string): string {
  return input
    .replace(/\0/g, "") // null bytes
    .replace(/[\u2028\u2029]/g, "\n") // line/paragraph separators
    .trim()
    .slice(0, 4000); // hard cap to prevent prompt stuffing
}

/**
 * Generate a unique session ID.
 */
export function generateSessionId(): string {
  const array = new Uint8Array(16);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Server-side fallback
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256);
    }
  }
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Sleep for n milliseconds. Use sparingly.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Clamp a number between min and max.
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
