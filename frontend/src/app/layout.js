/**
 * ============================================================
 * AI Idea DNA — Root Layout (Monochrome Redesign)
 * ============================================================
 * Application shell with dark monochrome theme.
 */

import "./globals.css";

/* ── SEO Metadata ────────────────────────────────────────────── */
export const metadata = {
  title: "AI Idea DNA — Analyze, Score & Evolve Project Ideas",
  description:
    "A deep learning-powered platform that deconstructs student project ideas " +
    "into their DNA components, scores novelty using vector similarity, and " +
    "evolves concepts through AI-driven mutation strategies.",
  keywords: [
    "AI", "project ideas", "idea analysis", "novelty scoring",
    "idea evolution", "student projects", "deep learning", "NLP",
  ],
  authors: [{ name: "AI Idea DNA Team" }],
  openGraph: {
    title: "AI Idea DNA",
    description: "Analyze, Score & Evolve Student Project Ideas with AI",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* ── Google Fonts ────────────────────────────────────── */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#050507] text-[#d4d4da] antialiased">
        {/* Cinematic spotlight overlay */}
        <div className="spotlight" />

        {/* Dot grid background */}
        <div className="fixed inset-0 bg-grid pointer-events-none opacity-30 z-0" />

        {/* Main content */}
        <main className="relative z-10">{children}</main>
      </body>
    </html>
  );
}
