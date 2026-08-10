/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      /* ── Monochrome Color System ────────────────────────────── */
      colors: {
        void: {
          DEFAULT: "#050507",
          50: "#0a0a0e",
          100: "#0e0e14",
          200: "#131318",
          300: "#1a1a22",
          400: "#22222e",
        },
        silver: {
          DEFAULT: "#c0c0c8",
          50: "#f7f7f8",
          100: "#ebebee",
          200: "#d4d4da",
          300: "#c0c0c8",
          400: "#a8a8b4",
          500: "#8e8e9c",
          600: "#6e6e7c",
          700: "#52525c",
          800: "#38383e",
          900: "#1e1e22",
        },
        accent: {
          DEFAULT: "#ffffff",
          muted: "rgba(255, 255, 255, 0.6)",
          subtle: "rgba(255, 255, 255, 0.08)",
        },
      },
      /* ── Font Families ──────────────────────────────────────── */
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      /* ── Animations ─────────────────────────────────────────── */
      animation: {
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "scan-line": "scan-line 4s linear infinite",
        "grid-fade": "grid-fade 8s ease-in-out infinite",
        "ticker": "ticker 20s linear infinite",
      },
      keyframes: {
        "pulse-slow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.8" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100vh)" },
        },
        "grid-fade": {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        "ticker": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      /* ── Backdrop Blur ──────────────────────────────────────── */
      backdropBlur: {
        xs: "2px",
        "2xl": "40px",
        "3xl": "64px",
      },
      /* ── Box Shadow ─────────────────────────────────────────── */
      boxShadow: {
        "glow-white": "0 0 20px rgba(255, 255, 255, 0.1), 0 0 60px rgba(255, 255, 255, 0.05)",
        "glow-white-strong": "0 0 30px rgba(255, 255, 255, 0.2), 0 0 80px rgba(255, 255, 255, 0.08)",
        "inner-glow": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
    },
  },
  plugins: [],
};
