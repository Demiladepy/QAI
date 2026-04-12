"use client";

import { useEffect, useState } from "react";

/**
 * Returns false on the server and first client paint, then true after mount.
 * Use to gate client-only UI (animations, Date, random) and avoid hydration mismatches.
 */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted;
}
