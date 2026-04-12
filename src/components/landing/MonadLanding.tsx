import { ExternalLink } from "lucide-react";
import { BrandLogo } from "@/components/BrandLogo";
import { BlueprintBackdrop } from "./BlueprintBackdrop";
import { MonadArchitectureSection } from "./MonadArchitectureSection";
import { MonadCtaBanner } from "./MonadCtaBanner";
import { MonadHero } from "./MonadHero";
import { MonadHowSection } from "./MonadHowSection";

/**
 * Marketing landing: Server Component shell; motion lives in client subcomponents.
 */
export function MonadLanding() {
  return (
    <div
      data-landing="monad"
      className="relative min-h-screen bg-[#0a0a0a] text-zinc-100 antialiased selection:bg-[rgba(131,81,255,0.25)] selection:text-white"
    >
      <BlueprintBackdrop />
      <MonadHero />
      <MonadHowSection />
      <MonadArchitectureSection />
      <MonadCtaBanner />

      <footer className="border-t border-white/[0.06] px-4 py-6">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <BrandLogo heightPx={20} className="max-w-[76px]" />
            <span className="font-mono text-xs text-zinc-500">Built for the 0G Hackathon</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://chainscan-galileo.0g.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-xs text-zinc-500 transition-colors hover:text-[#8351FF]"
            >
              0G Explorer <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://0g.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 font-mono text-xs text-zinc-500 transition-colors hover:text-[#8351FF]"
            >
              0G.ai <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
