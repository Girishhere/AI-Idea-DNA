"use client";

/**
 * ============================================================
 * EvolutionView — Side-by-Side Evolution Comparison
 * ============================================================
 * Displays the original idea alongside AI-evolved mutations.
 * Features:
 * • Mode selector tabs (Technical / Social Impact / Product)
 * • Animated card transitions when switching modes
 * • Original idea on the left, evolved versions on the right
 * • Key changes highlighted as pill tags
 *
 * Props:
 *   originalIdea   — string
 *   onEvolve       — callback(mode: string)
 *   evolutionData  — { mode, evolved_versions: [...] } | null
 *   loading        — boolean
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassCard from "./GlassCard";

/* ── Evolution Modes ─────────────────────────────────────────── */
const modes = [
  {
    key: "technical",
    label: "Technical",
    icon: "⚙️",
    description: "Add cutting-edge technology",
    color: "#00f0ff",
  },
  {
    key: "social_impact",
    label: "Social Impact",
    icon: "🌍",
    description: "Community & sustainability",
    color: "#34d399",
  },
  {
    key: "product",
    label: "Product",
    icon: "🚀",
    description: "Monetization & market-fit",
    color: "#a855f7",
  },
];

export default function EvolutionView({
  originalIdea,
  onEvolve,
  evolutionData,
  loading = false,
}) {
  const [selectedMode, setSelectedMode] = useState("technical");

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    onEvolve(mode);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* ── Section Header ───────────────────────────────────── */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">🧬</span>
        <h3 className="text-xl font-bold gradient-text">Idea Evolution</h3>
      </div>

      {/* ── Mode Selector Tabs ───────────────────────────────── */}
      <div className="flex flex-wrap gap-3">
        {modes.map((mode) => (
          <button
            key={mode.key}
            onClick={() => handleModeSelect(mode.key)}
            disabled={loading}
            className={`
              glow-button flex items-center gap-2 text-sm py-2.5 px-5
              transition-all duration-300
              disabled:opacity-40 disabled:cursor-not-allowed
              ${
                selectedMode === mode.key
                  ? "border-opacity-60 shadow-lg"
                  : "opacity-60 hover:opacity-100"
              }
            `}
            style={{
              borderColor:
                selectedMode === mode.key ? mode.color : "rgba(255,255,255,0.1)",
              color: selectedMode === mode.key ? mode.color : "rgba(255,255,255,0.6)",
              background:
                selectedMode === mode.key
                  ? `rgba(${mode.color === "#00f0ff" ? "0,240,255" : mode.color === "#34d399" ? "52,211,153" : "168,85,247"}, 0.1)`
                  : "rgba(255,255,255,0.02)",
              border: `1px solid ${
                selectedMode === mode.key ? mode.color + "40" : "rgba(255,255,255,0.08)"
              }`,
              borderRadius: "12px",
            }}
          >
            <span>{mode.icon}</span>
            <div className="text-left">
              <div className="font-semibold">{mode.label}</div>
              <div className="text-[0.65rem] opacity-60">{mode.description}</div>
            </div>
          </button>
        ))}
      </div>

      {/* ── Comparison Grid ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Idea (Left) */}
        <GlassCard glowColor="none" delay={0.1}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-white/30" />
            <h4 className="text-sm font-semibold text-white/50 tracking-wide uppercase">
              Original Idea
            </h4>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            {originalIdea}
          </p>
        </GlassCard>

        {/* Evolved Versions (Right) */}
        <div className="space-y-4">
          <AnimatePresence mode="wait">
            {loading ? (
              /* Loading State */
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card p-5">
                    <div className="loading-shimmer h-4 w-3/4 rounded mb-3" />
                    <div className="loading-shimmer h-3 w-full rounded mb-2" />
                    <div className="loading-shimmer h-3 w-5/6 rounded" />
                  </div>
                ))}
              </motion.div>
            ) : evolutionData?.evolved_versions ? (
              /* Results */
              <motion.div
                key={evolutionData.mode}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="space-y-4"
              >
                {evolutionData.evolved_versions.map((version, i) => {
                  const modeConfig = modes.find(
                    (m) => m.key === evolutionData.mode
                  );
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.12 }}
                    >
                      <GlassCard
                        glowColor={
                          evolutionData.mode === "technical"
                            ? "cyan"
                            : "purple"
                        }
                        delay={0}
                      >
                        {/* Title + Score */}
                        <div className="flex items-start justify-between mb-3">
                          <h5
                            className="text-sm font-bold tracking-tight"
                            style={{ color: modeConfig?.color || "#fff" }}
                          >
                            {version.title}
                          </h5>
                          <span
                            className="text-xs font-mono px-2 py-1 rounded-full"
                            style={{
                              color: modeConfig?.color,
                              background: `${modeConfig?.color}15`,
                              border: `1px solid ${modeConfig?.color}30`,
                            }}
                          >
                            {version.evolution_score}
                          </span>
                        </div>

                        {/* Description */}
                        <p className="text-white/60 text-xs leading-relaxed mb-3">
                          {version.description}
                        </p>

                        {/* Key Changes */}
                        <div className="flex flex-wrap gap-1.5">
                          {version.key_changes.map((change, j) => (
                            <span
                              key={j}
                              className="text-[0.65rem] px-2.5 py-1 rounded-full"
                              style={{
                                color: modeConfig?.color,
                                background: `${modeConfig?.color}10`,
                                border: `1px solid ${modeConfig?.color}20`,
                              }}
                            >
                              {change}
                            </span>
                          ))}
                        </div>
                      </GlassCard>
                    </motion.div>
                  );
                })}
              </motion.div>
            ) : (
              /* Empty State */
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-8 text-center"
              >
                <p className="text-white/30 text-sm">
                  Select an evolution mode to generate mutated concepts
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
