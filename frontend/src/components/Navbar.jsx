"use client";

/**
 * ============================================================
 * Navbar — Top Navigation Bar (Monochrome Redesign)
 * ============================================================
 * Fixed glassmorphism navigation bar with minimal monochrome design.
 */

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between glass-card px-6 py-3">
        {/* ── Logo & Brand ─────────────────────────────────── */}
        <Link href="/" className="flex items-center gap-3 group">
          {/* DNA Icon — Monochrome */}
          <div className="relative w-10 h-10 flex items-center justify-center">
            <svg
              viewBox="0 0 40 40"
              className="w-10 h-10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Helix strand 1 */}
              <path
                d="M12 5C12 5 28 12 28 20C28 28 12 35 12 35"
                stroke="url(#white-grad-1)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="group-hover:animate-pulse"
              />
              {/* Helix strand 2 */}
              <path
                d="M28 5C28 5 12 12 12 20C12 28 28 35 28 35"
                stroke="url(#white-grad-2)"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="group-hover:animate-pulse"
              />
              {/* Bridge rungs */}
              <line x1="14" y1="12" x2="26" y2="12" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <line x1="13" y1="20" x2="27" y2="20" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
              <line x1="14" y1="28" x2="26" y2="28" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              {/* Gradient definitions — monochrome */}
              <defs>
                <linearGradient id="white-grad-1" x1="12" y1="5" x2="28" y2="35">
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor="#ffffff" stopOpacity="0.2" />
                </linearGradient>
                <linearGradient id="white-grad-2" x1="28" y1="5" x2="12" y2="35">
                  <stop stopColor="#888890" />
                  <stop offset="1" stopColor="#888890" stopOpacity="0.2" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Brand Name */}
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="gradient-text">AI Idea</span>
              <span className="text-white/90 ml-1">DNA</span>
            </h1>
            <p className="text-[0.6rem] text-white/20 tracking-[0.2em] uppercase -mt-0.5 font-mono">
              Analyze · Score · Evolve
            </p>
          </div>
        </Link>

        {/* ── Navigation Links ─────────────────────────────── */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="glow-button glow-button-outline text-sm py-2 px-5"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
