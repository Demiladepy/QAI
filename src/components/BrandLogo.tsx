"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

/** Intrinsic size of `public/logo-qai.png` (PNG IHDR). */
const LOGO_WIDTH = 615;
const LOGO_HEIGHT = 418;

export interface BrandLogoProps {
  className?: string;
  /** Display height in px; width follows aspect ratio. */
  heightPx: number;
  priority?: boolean;
}

/**
 * QAI wordmark with orbital ring — uses `/logo-qai.png` (white on transparent/black).
 */
export function BrandLogo({ className, heightPx, priority }: BrandLogoProps) {
  return (
    <Image
      src="/logo-qai.png"
      alt="QAI"
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      sizes={`${Math.ceil(heightPx * (LOGO_WIDTH / LOGO_HEIGHT))}px`}
      className={cn("w-auto object-contain object-left", className)}
      style={{ height: heightPx, width: "auto" }}
    />
  );
}
