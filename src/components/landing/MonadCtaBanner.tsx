"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const ACCENT = "#8351FF";
const FG = "#0a0a0a";

export function MonadCtaBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-2xl text-center">
        <motion.div
          className="rounded-[20px] border px-8 py-12"
          style={{
            background: "linear-gradient(135deg, #111111 0%, #161616 100%)",
            borderColor: "rgba(131, 81, 255, 0.35)",
            boxShadow: "0 0 60px rgba(131, 81, 255, 0.12)",
          }}
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: reduceMotion ? 0 : 0.5 }}
          whileHover={
            reduceMotion
              ? {}
              : {
                  boxShadow: "0 0 72px rgba(131, 81, 255, 0.2)",
                  borderColor: "rgba(131, 81, 255, 0.5)",
                }
          }
        >
          <h2 className="mb-3 font-mono text-2xl font-bold text-zinc-100 sm:text-3xl">
            Ready to give your agent
            <br />
            <span
              className="bg-clip-text font-mono"
              style={{
                backgroundImage: `linear-gradient(135deg, ${ACCENT} 0%, #c4b5fd 100%)`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              a permanent identity?
            </span>
          </h2>
          <p className="mb-8 text-sm text-zinc-400">
            Connect your wallet, mint an Agent ID, and start building memory that outlasts any session.
          </p>
          <motion.div whileHover={reduceMotion ? {} : { scale: 1.03 }} whileTap={reduceMotion ? {} : { scale: 0.98 }}>
            <Link
              href="/app"
              className="inline-flex items-center gap-2 rounded-[10px] px-8 py-3 font-mono text-sm font-bold transition-shadow"
              style={{
                background: ACCENT,
                color: FG,
                boxShadow: "0 0 24px rgba(131, 81, 255, 0.35)",
              }}
            >
              Launch App <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
