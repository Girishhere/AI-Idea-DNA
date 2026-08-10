"use client";

/**
 * ============================================================
 * NoveltyGauge — Animated Circular Progress (Monochrome)
 * ============================================================
 * SVG-based circular progress indicator with:
 * • White/silver/grey color progression
 * • Smooth counting animation
 * • Subtle glow effects
 */

import React from "react";
import { motion, animate } from "framer-motion";
import { useEffect, useState } from "react";

export default function NoveltyGauge({
  score = 0,
  size = 200,
  label = "Novelty Score",
}) {
  const [displayScore, setDisplayScore] = useState(0);

  // ── Animate the counter ───────────────────────────────────
  useEffect(() => {
    const controls = animate(0, score, {
      duration: 1.8,
      ease: [0.25, 0.46, 0.45, 0.94],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return () => controls.stop();
  }, [score]);

  // ── SVG dimensions ────────────────────────────────────────
  const strokeWidth = 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // ── Monochrome color based on score ───────────────────────
  const getScoreColor = (s) => {
    if (s === 0) return { main: "#555560", glow: "rgba(85, 85, 96, 0.2)" };
    if (s < 30) return { main: "#666672", glow: "rgba(102, 102, 114, 0.2)" };
    if (s < 50) return { main: "#888894", glow: "rgba(136, 136, 148, 0.25)" };
    if (s < 70) return { main: "#aaaaB4", glow: "rgba(170, 170, 180, 0.3)" };
    if (s < 85) return { main: "#ccccD4", glow: "rgba(204, 204, 212, 0.35)" };
    return { main: "#ffffff", glow: "rgba(255, 255, 255, 0.4)" };
  };

  const color = getScoreColor(score);

  // ── Score label ───────────────────────────────────────────
  const getScoreLabel = (s) => {
    if (s === 0) return "Rejected";
    if (s < 20) return "Cliché";
    if (s < 36) return "Vague";
    if (s < 50) return "Moderate";
    if (s < 70) return "Notable";
    if (s < 85) return "Innovative";
    return "Groundbreaking";
  };

  return (
    <motion.div
      className="flex flex-col items-center gap-3"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle (track) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />

          {/* Animated progress circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color.main}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset:
                circumference - (score / 100) * circumference,
            }}
            transition={{
              duration: 1.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
            style={{
              filter: `drop-shadow(0 0 6px ${color.glow})`,
            }}
          />

          {/* Glow overlay circle */}
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color.main}
            strokeWidth={strokeWidth + 6}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{
              strokeDashoffset:
                circumference - (score / 100) * circumference,
            }}
            transition={{
              duration: 1.8,
              ease: [0.25, 0.46, 0.45, 0.94],
              delay: 0.2,
            }}
            opacity={0.08}
          />
        </svg>

        {/* Center content (score number) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-4xl font-bold font-mono tracking-tight"
            style={{ color: color.main }}
          >
            {displayScore}
          </span>
          <span className="text-xs text-white/20 mt-1 tracking-widest uppercase font-mono">
            / 100
          </span>
        </div>
      </div>

      {/* Label */}
      <div className="text-center">
        <p className="text-sm font-medium text-white/50">{label}</p>
        <p
          className="text-xs font-semibold mt-1 tracking-widest uppercase font-mono"
          style={{ color: color.main }}
        >
          {getScoreLabel(score)}
        </p>
      </div>
    </motion.div>
  );
}
