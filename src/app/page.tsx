import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      {/* Logo */}
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ background: "var(--color-primary)", boxShadow: "0 0 40px color-mix(in srgb, var(--color-primary) 40%, transparent)" }}>
          <span className="text-white text-2xl font-bold">Q</span>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-gradient">QAI</h1>
        <p className="mt-3 text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Decentralized AI Identity &amp; Memory Protocol
        </p>
      </div>

      {/* Tagline */}
      <p className="max-w-xl text-base leading-relaxed mb-10"
        style={{ color: "var(--color-text-secondary)" }}>
        Every AI agent deserves a persistent on-chain identity, cross-session memory,
        and private cloudless inference — powered by 0G infrastructure.
      </p>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/app"
          className="px-8 py-3 rounded-lg font-semibold text-sm transition-all"
          style={{
            background: "var(--color-primary)",
            color: "var(--color-primary-foreground)",
          }}
        >
          Launch Your Agent
        </Link>
        <Link
          href="/dao"
          className="px-8 py-3 rounded-lg font-semibold text-sm transition-all border"
          style={{
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
        >
          DAO Governance
        </Link>
      </div>

      {/* Feature pills */}
      <div className="flex flex-wrap justify-center gap-2 mt-12">
        {[
          "On-Chain Identity",
          "0G Storage Memory",
          "0G Compute Inference",
          "TEE Privacy",
          "DAO Governance",
          "No Cloud",
        ].map((feature) => (
          <span
            key={feature}
            className="px-3 py-1 rounded-full text-xs font-medium"
            style={{
              background: "var(--color-muted)",
              color: "var(--color-muted-foreground)",
            }}
          >
            {feature}
          </span>
        ))}
      </div>
    </main>
  );
}
