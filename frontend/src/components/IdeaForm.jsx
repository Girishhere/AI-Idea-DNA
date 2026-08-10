"use client";

/**
 * ============================================================
 * IdeaForm — Idea Submission Form
 * ============================================================
 * A glassmorphism textarea with:
 * • Animated focus border
 * • Character count indicator
 * • Loading spinner on submit
 * • Pulse animation on the submit button
 *
 * Props:
 *   onSubmit  — callback(ideaText: string)
 *   loading   — boolean, disables input during analysis
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const MAX_CHARS = 5000;
const MIN_CHARS = 10;

export default function IdeaForm({ onSubmit, loading = false }) {
  const [idea, setIdea] = useState("");
  const charCount = idea.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isValid && !loading) {
      onSubmit(idea);
    }
  };

  // Character count color
  const countColor =
    charCount === 0
      ? "text-white/15"
      : charCount < MIN_CHARS
      ? "text-white/30"
      : charCount > MAX_CHARS * 0.9
      ? "text-white/50"
      : "text-white/25";

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* ── Label ──────────────────────────────────────────── */}
      <label
        htmlFor="idea-input"
        className="block text-sm font-medium text-white/50 mb-3 tracking-wide"
      >
        Describe your project idea
      </label>

      {/* ── Textarea ───────────────────────────────────────── */}
      <div className="relative">
        <textarea
          id="idea-input"
          value={idea}
          onChange={(e) => setIdea(e.target.value)}
          placeholder="e.g., An AI-powered healthcare chatbot that uses NLP to pre-diagnose symptoms and recommend specialists for patients in rural areas with limited medical access..."
          className="glass-input w-full h-40 p-5 text-[0.95rem] leading-relaxed resize-none"
          disabled={loading}
          maxLength={MAX_CHARS}
        />

        {/* Character counter */}
        <div
          className={`absolute bottom-3 right-4 text-xs font-mono ${countColor} transition-colors`}
        >
          {charCount} / {MAX_CHARS}
        </div>
      </div>

      {/* ── Submit Button ──────────────────────────────────── */}
      <div className="mt-4 flex items-center gap-4">
        <button
          type="submit"
          disabled={!isValid || loading}
          className={`
            glow-button glow-button-solid
            flex items-center gap-3 text-base
            disabled:opacity-30 disabled:cursor-not-allowed
            disabled:transform-none disabled:shadow-none
          `}
        >
          {loading ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-25"
                />
                <path
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  className="opacity-75"
                />
              </svg>
              Analyzing DNA...
            </>
          ) : (
            <>
              <span>🧬</span>
              Analyze Idea DNA
            </>
          )}
        </button>

        {/* Validation hint */}
        <AnimatePresence>
          {charCount > 0 && charCount < MIN_CHARS && (
            <motion.p
              className="text-xs text-white/30 font-mono"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              At least {MIN_CHARS} characters needed
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.form>
  );
}
