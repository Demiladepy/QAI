/**
 * Static blueprint grid + radial wash — safe as a Server Component (no hydration mismatch).
 */
export function BlueprintBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 blueprint-grid-monad" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_85%_55%_at_50%_-15%,rgba(131,81,255,0.12),transparent_55%)]" />
    </div>
  );
}
