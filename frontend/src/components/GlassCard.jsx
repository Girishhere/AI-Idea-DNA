"use client";

/**
 * ============================================================
 * GlassCard — Reusable Glassmorphism Card Component
 * ============================================================
 * A frosted-glass container with configurable glow color,
 * hover effects, and optional animated border.
 *
 * Props:
 *   children     — card content
 *   className    — additional CSS classes
 *   glowColor    — "cyan" | "purple" | "none" (default: "none")
 *   animated     — enable rotating gradient border
 *   hoverable    — enable hover lift effect
 */

import React from "react";
import { motion } from "framer-motion";

const glowStyles = {
  cyan: "hover:shadow-glow-cyan hover:border-neon-cyan/20",
  purple: "hover:shadow-glow-purple hover:border-electric-purple/20",
  none: "",
};

export default function GlassCard({
  children,
  className = "",
  glowColor = "none",
  animated = false,
  hoverable = true,
  delay = 0,
  ...props
}) {
  const glow = glowStyles[glowColor] || "";
  const hoverClass = hoverable
    ? "hover:translate-y-[-2px] transition-all duration-300"
    : "";

  const cardContent = (
    <div
      className={`
        glass-card p-6
        ${glow}
        ${hoverClass}
        ${animated ? "animated-border" : ""}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );

  // Wrap in Framer Motion for entrance animation
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      {cardContent}
    </motion.div>
  );
}
