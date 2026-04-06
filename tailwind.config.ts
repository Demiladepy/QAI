import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neural Noir palette via CSS vars
        background: "var(--bg-root)",
        surface: "var(--bg-surface)",
        elevated: "var(--bg-elevated)",
        hover: "var(--bg-hover)",
        border: "var(--border-default)",
        accent: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          muted: "var(--accent-muted)",
          border: "var(--accent-border)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        status: {
          live: "var(--status-live)",
          warning: "var(--status-warning)",
          error: "var(--status-error)",
        },
        // Legacy compat
        primary: {
          DEFAULT: "var(--accent)",
          hover: "var(--accent-hover)",
          foreground: "#09090b",
          muted: "var(--accent-muted)",
        },
        muted: {
          DEFAULT: "var(--bg-elevated)",
          foreground: "var(--text-secondary)",
        },
        destructive: {
          DEFAULT: "var(--status-error)",
          foreground: "var(--status-error)",
        },
        success: {
          DEFAULT: "var(--status-live)",
          foreground: "var(--status-live)",
        },
        warning: {
          DEFAULT: "var(--status-warning)",
          foreground: "var(--status-warning)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        DEFAULT: "10px",
        lg: "14px",
        xl: "20px",
        full: "9999px",
      },
      animation: {
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.25s ease-out",
        "slide-down": "slideDown 0.2s ease-out",
        "pulse-accent": "pulse-accent 2s ease-in-out infinite",
        shimmer: "shimmer 1.5s infinite",
        breathe: "breathe 3s ease-in-out infinite",
        float: "float 4s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(12px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-8px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-accent": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        },
        breathe: {
          "0%, 100%": { transform: "scale(1)", opacity: "0.8" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      boxShadow: {
        accent: "0 0 30px rgba(0, 229, 191, 0.15)",
        "accent-sm": "0 0 12px rgba(0, 229, 191, 0.1)",
        glow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
