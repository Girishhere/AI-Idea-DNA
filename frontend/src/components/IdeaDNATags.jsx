"use client";

/**
 * ============================================================
 * IdeaDNATags — Monochrome Floating Pill Tags
 * ============================================================
 * Renders the extracted Idea DNA as categorized, animated pills
 * following a strict monochrome (black/white/silver) aesthetic.
 *
 * Props:
 *   ideaDNA — { domain: string[], tech: string[], problem: string[] }
 */

import React from "react";
import { motion } from "framer-motion";

/* ── Stagger Animation Variants ─────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const tagVariants = {
  hidden: { opacity: 0, y: 15, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20,
    },
  },
};

/* ── Category Config ─────────────────────────────────────────── */
const categories = [
  {
    key: "domain",
    label: "Domain",
    icon: "[ DOMAIN ]",
  },
  {
    key: "tech",
    label: "Technology",
    icon: "/// TECH",
  },
  {
    key: "problem",
    label: "Problem",
    icon: "> PROBLEM",
  },
];

export default function IdeaDNATags({ ideaDNA }) {
  if (!ideaDNA) return null;

  return (
    <motion.div
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {categories.map((cat) => {
        const tags = ideaDNA[cat.key] || [];
        if (tags.length === 0) return null;

        return (
          <div key={cat.key}>
            {/* Category Label */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-mono text-neutral-500 tracking-widest">{cat.icon}</span>
              <h4 className="text-xs font-semibold tracking-widest uppercase text-neutral-400">
                {cat.label}
              </h4>
              <div className="flex-1 h-px bg-gradient-to-r from-neutral-700/60 to-transparent" />
            </div>

            {/* Pill Tags */}
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <motion.span
                  key={`${cat.key}-${i}`}
                  className="
                    inline-flex items-center px-4 py-1.5 
                    text-sm font-medium text-white 
                    bg-neutral-900/50 
                    border border-neutral-700 
                    rounded-full cursor-default
                    transition-colors duration-200
                  "
                  variants={tagVariants}
                  whileHover={{
                    scale: 1.05,
                    borderColor: "rgba(255, 255, 255, 1)",
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    transition: { duration: 0.2 },
                  }}
                >
                  {tag}
                </motion.span>
              ))}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
}
