"use client";

/**
 * ============================================================
 * AI Idea DNA — Dashboard Page (Monochrome Redesign)
 * ============================================================
 * Premium monochrome dashboard with:
 * • Analysis pipeline visualization
 * • Grid-based result layout
 * • Scroll-driven zoom animations
 * • Monochrome glass card components
 */

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import IdeaForm from "@/components/IdeaForm";
import GlassCard from "@/components/GlassCard";
import NoveltyGauge from "@/components/NoveltyGauge";
import IdeaDNATags from "@/components/IdeaDNATags";
import EvolutionView from "@/components/EvolutionView";
import { analyzeIdea, evolveIdea } from "@/lib/api";

// Dynamic 3D background (avoid SSR)
const ThreeDNA = dynamic(() => import("@/components/ThreeDNA"), {
  ssr: false,
  loading: () => null,
});

/* ── Pipeline Steps ──────────────────────────────────────────── */
const pipelineSteps = [
  { label: "Input", icon: "↗", desc: "Idea submitted" },
  { label: "Encode", icon: "◎", desc: "384D vector" },
  { label: "Search", icon: "⬡", desc: "FAISS lookup" },
  { label: "Filter", icon: "◆", desc: "5-layer check" },
  { label: "Score", icon: "▣", desc: "Novelty rating" },
];

export default function DashboardPage() {
  const { scrollY } = useScroll();

  // ── Scroll-driven zoom effects ─────────────────────────────
  const formScale = useTransform(scrollY, [0, 400], [1, 0.95]);
  const formOpacity = useTransform(scrollY, [0, 300], [1, 0.7]);
  const resultsScale = useTransform(scrollY, [100, 500], [0.95, 1]);
  const resultsOpacity = useTransform(scrollY, [100, 400], [0.5, 1]);

  // ── State ──────────────────────────────────────────────────
  const [analysisResult, setAnalysisResult] = useState(null);
  const [evolutionResult, setEvolutionResult] = useState(null);
  const [currentIdea, setCurrentIdea] = useState("");
  const [analyzeLoading, setAnalyzeLoading] = useState(false);
  const [evolveLoading, setEvolveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(-1);

  // ── Handlers ───────────────────────────────────────────────
  const handleAnalyze = async (ideaText) => {
    setAnalyzeLoading(true);
    setError(null);
    setAnalysisResult(null);
    setEvolutionResult(null);
    setCurrentIdea(ideaText);

    // Animate pipeline steps
    for (let i = 0; i < pipelineSteps.length; i++) {
      setActiveStep(i);
      await new Promise((r) => setTimeout(r, 300));
    }

    try {
      const result = await analyzeIdea(ideaText);
      setAnalysisResult(result);
      setActiveStep(pipelineSteps.length); // all done
    } catch (err) {
      setError(err.message || "Failed to analyze idea");
      setActiveStep(-1);
    } finally {
      setAnalyzeLoading(false);
    }
  };

  const handleEvolve = async (mode) => {
    if (!currentIdea) return;

    setEvolveLoading(true);
    setError(null);

    try {
      const result = await evolveIdea(currentIdea, mode);
      setEvolutionResult(result);
    } catch (err) {
      setError(err.message || "Failed to evolve idea");
    } finally {
      setEvolveLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <Navbar />

      {/* ── 3D Background (subtle) ─────────────────────────── */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <Suspense fallback={null}>
          <ThreeDNA />
        </Suspense>
      </div>

      {/* ── Fine Grid Background ───────────────────────────── */}
      <div className="fixed inset-0 bg-grid-fine pointer-events-none opacity-30 z-0" />

      {/* ── Dashboard Content ──────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-16">
        {/* Page Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-end gap-4 mb-2">
            <h1 className="text-3xl font-bold tracking-tight">
              <span className="gradient-text">Analysis</span>
              <span className="text-white/90 ml-2">Dashboard</span>
            </h1>
            <span className="text-[0.6rem] font-mono text-white/15 tracking-[0.2em] uppercase pb-1">
              v2.0
            </span>
          </div>
          <p className="text-sm text-white/25">
            Submit your project idea to extract its DNA, measure novelty, and
            evolve it into stronger concepts.
          </p>
        </motion.div>

        {/* ── Pipeline Visualizer ──────────────────────────── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="glass-card p-4">
            <div className="flex items-center gap-1">
              {pipelineSteps.map((step, i) => (
                <React.Fragment key={i}>
                  {/* Step */}
                  <motion.div
                    className={`flex-1 flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      activeStep === i
                        ? "bg-white/[0.06] border border-white/20"
                        : activeStep > i
                        ? "bg-white/[0.03] border border-white/[0.08]"
                        : "border border-transparent"
                    }`}
                    animate={
                      activeStep === i
                        ? { scale: [1, 1.03, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    <span
                      className={`text-lg transition-colors duration-300 ${
                        activeStep >= i ? "text-white/60" : "text-white/10"
                      }`}
                    >
                      {step.icon}
                    </span>
                    <div className="hidden md:block">
                      <div
                        className={`text-xs font-semibold transition-colors duration-300 ${
                          activeStep >= i ? "text-white/70" : "text-white/20"
                        }`}
                      >
                        {step.label}
                      </div>
                      <div
                        className={`text-[0.6rem] transition-colors duration-300 ${
                          activeStep >= i ? "text-white/30" : "text-white/10"
                        }`}
                      >
                        {step.desc}
                      </div>
                    </div>
                  </motion.div>

                  {/* Connector */}
                  {i < pipelineSteps.length - 1 && (
                    <div
                      className={`w-6 h-px transition-all duration-500 ${
                        activeStep > i
                          ? "bg-white/20"
                          : "bg-white/[0.04]"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── Idea Submission Section (Zoom Out) ───────────── */}
        <motion.div style={{ scale: formScale, opacity: formOpacity }}>
          <GlassCard className="mb-8" delay={0.1}>
            <IdeaForm onSubmit={handleAnalyze} loading={analyzeLoading} />
          </GlassCard>
        </motion.div>

        {/* ── Error Display ────────────────────────────────── */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="glass-card p-4 mb-8 border-white/10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <p className="text-white/60 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/40" />
                {error}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Analysis Results (Zoom In) ───────────────────── */}
        <AnimatePresence>
          {analysisResult && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6 }}
              style={{ scale: resultsScale, opacity: resultsOpacity }}
            >
              {/* Results Grid: Gauge + DNA + Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden mb-8">
                {/* Novelty Score Gauge */}
                <div className="bg-void/80 backdrop-blur-sm p-8 flex items-center justify-center">
                  <NoveltyGauge score={analysisResult.novelty_score} />
                </div>

                {/* Idea DNA Tags */}
                <div className="bg-void/80 backdrop-blur-sm p-8 lg:col-span-2">
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-lg text-white/20">◎</span>
                    <h3 className="text-lg font-bold gradient-text">
                      Idea DNA
                    </h3>
                  </div>
                  <IdeaDNATags ideaDNA={analysisResult.idea_dna} />

                  {/* Summary */}
                  {analysisResult.summary && (
                    <div className="mt-6 pt-4 border-t border-white/[0.04]">
                      <p className="text-sm text-white/30 italic">
                        {analysisResult.summary}
                      </p>
                    </div>
                  )}

                  {/* Recommendation Box */}
                  {analysisResult.recommendation && (
                    <motion.div
                      className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.1]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-white/40 mt-1.5 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-semibold text-white/70 mb-1">
                            Recommendation
                          </h4>
                          <p className="text-sm text-white/40 leading-relaxed">
                            {analysisResult.recommendation}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Similar Projects */}
              {analysisResult.similar_projects?.length > 0 && (
                <GlassCard className="mb-8" delay={0.4}>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-lg text-white/20">⬡</span>
                    <h3 className="text-lg font-bold text-white/70">
                      Similar Projects
                    </h3>
                    <span className="text-[0.6rem] text-white/15 ml-auto font-mono tracking-widest uppercase">
                      FAISS Vector Search
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.03] rounded-xl overflow-hidden">
                    {analysisResult.similar_projects.map((project, i) => (
                      <motion.div
                        key={i}
                        className="bg-void/70 p-5 group"
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + i * 0.08 }}
                        whileHover={{
                          backgroundColor: "rgba(255, 255, 255, 0.03)",
                        }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-sm font-semibold text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                            {project.title}
                          </h4>
                          <span className="text-[0.65rem] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] text-white/30 ml-2 shrink-0 border border-white/[0.06]">
                            {(project.similarity_score * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-xs text-white/25 leading-relaxed group-hover:text-white/35 transition-colors">
                          {project.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* ── Evolution Section ────────────────────── */}
              <EvolutionView
                originalIdea={currentIdea}
                onEvolve={handleEvolve}
                evolutionData={evolutionResult}
                loading={evolveLoading}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty State ──────────────────────────────────── */}
        {!analysisResult && !analyzeLoading && (
          <motion.div
            className="text-center py-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-5xl mb-6 text-white/[0.06]">◎</div>
            <p className="text-white/15 text-lg font-light">
              Submit an idea above to begin analysis
            </p>
            <p className="text-white/[0.08] text-sm mt-2 font-mono">
              Your idea will be deconstructed into its DNA components
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
