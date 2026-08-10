"use client";

/**
 * ============================================================
 * AI Idea DNA — Landing / Hero Page (Monochrome Redesign)
 * ============================================================
 * Premium black/white/silver design with:
 * • Scroll-driven zoom in/out parallax effects
 * • Animated grid background with dot matrix
 * • Analysis Pipeline visualization
 * • Staggered entrance animations
 */

import React, { Suspense } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";

// Dynamic import for Three.js (avoid SSR issues)
const ThreeDNA = dynamic(() => import("@/components/ThreeDNA"), {
  ssr: false,
  loading: () => null,
});

/* ── Stagger Animation Variants ─────────────────────────────── */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

/* ── Pipeline Steps Data ─────────────────────────────────────── */
const pipelineSteps = [
  {
    num: "01",
    title: "Submit Idea",
    desc: "Describe your project concept in natural language",
    icon: "↗",
  },
  {
    num: "02",
    title: "DNA Extraction",
    desc: "NLP decomposes idea into Domain, Tech, and Problem vectors",
    icon: "◎",
  },
  {
    num: "03",
    title: "FAISS Search",
    desc: "384-dimensional cosine similarity against indexed projects",
    icon: "⬡",
  },
  {
    num: "04",
    title: "Novelty Score",
    desc: "Inverse-similarity scoring with cliché and vague-idea penalties",
    icon: "◆",
  },
  {
    num: "05",
    title: "Evolution",
    desc: "Three mutation strategies evolve weak ideas into strong ones",
    icon: "△",
  },
];

export default function LandingPage() {
  const { scrollY } = useScroll();

  // ── Zoom in/out transforms ─────────────────────────────────
  const heroScale = useTransform(scrollY, [0, 600], [1, 0.82]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const heroBlur = useTransform(scrollY, [0, 400], [0, 8]);

  const pipelineScale = useTransform(scrollY, [200, 700], [0.88, 1]);
  const pipelineOpacity = useTransform(scrollY, [200, 600], [0, 1]);

  const featuresScale = useTransform(scrollY, [600, 1100], [0.92, 1]);
  const featuresOpacity = useTransform(scrollY, [600, 900], [0, 1]);

  const gridScale = useTransform(scrollY, [0, 1000], [1, 1.15]);
  const gridOpacity = useTransform(scrollY, [0, 800], [0.4, 0.15]);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* ── Navbar ──────────────────────────────────────────── */}
      <Navbar />

      {/* ── 3D DNA Background ──────────────────────────────── */}
      <div className="absolute inset-0 opacity-20">
        <Suspense fallback={null}>
          <ThreeDNA />
        </Suspense>
      </div>

      {/* ── Animated Grid Background (Zoom Effect) ─────────── */}
      <motion.div
        className="fixed inset-0 bg-dot-grid pointer-events-none z-0"
        style={{ scale: gridScale, opacity: gridOpacity }}
      />

      {/* ── Ambient Light Orbs ─────────────────────────────── */}
      <div className="absolute top-1/3 left-1/5 w-[500px] h-[500px] rounded-full bg-white/[0.015] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/5 w-[400px] h-[400px] rounded-full bg-white/[0.01] blur-[100px] pointer-events-none" />

      {/* ── Hero Content (Zoom Out on Scroll) ──────────────── */}
      <motion.div
        className="relative z-10 flex-1 flex items-center justify-center px-6 pt-24 pb-40"
        style={{
          scale: heroScale,
          opacity: heroOpacity,
          filter: useTransform(heroBlur, (v) => `blur(${v}px)`),
        }}
      >
        <motion.div
          className="max-w-5xl w-full text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-10 flex justify-center">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse-slow" />
              <span className="text-white/50 text-sm font-medium tracking-[0.15em] uppercase">
                Neural Analysis Engine
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-7xl md:text-9xl font-black tracking-[-0.04em] leading-[0.95] mb-8"
          >
            <span className="text-white">Decode</span>
            <br />
            <span className="gradient-text">Idea DNA</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-white/35 max-w-2xl mx-auto mb-14 leading-relaxed font-light"
          >
            Analyze, score, and evolve student project ideas with{" "}
            <span className="text-white/70 font-medium">
              384-dimensional vector similarity
            </span>{" "}
            and intelligent mutation strategies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/dashboard">
              <button className="glow-button glow-button-primary text-lg px-12 py-4 rounded-xl">
                Launch Dashboard
              </button>
            </Link>

            <a
              href="#pipeline"
              className="glow-button glow-button-outline text-base px-10 py-4 rounded-xl"
            >
              View Pipeline{" "}
              <span className="ml-2 inline-block animate-bounce">↓</span>
            </a>
          </motion.div>

          {/* Stats Row */}
          <motion.div
            variants={itemVariants}
            className="mt-24 grid grid-cols-4 gap-px max-w-3xl mx-auto bg-white/[0.04] rounded-2xl overflow-hidden"
          >
            {[
              { value: "384", unit: "D", label: "Vector Dims" },
              { value: "FAISS", unit: "", label: "Search Engine" },
              { value: "5", unit: "", label: "Filter Layers" },
              { value: "3", unit: "", label: "Evolution Modes" },
            ].map((stat, i) => (
              <div
                key={i}
                className="text-center py-6 px-4 bg-void/60 backdrop-blur-sm"
              >
                <div className="text-2xl md:text-3xl font-bold font-mono text-white/90 mb-1">
                  {stat.value}
                  <span className="text-white/30 text-lg">{stat.unit}</span>
                </div>
                <div className="text-[0.65rem] text-white/25 tracking-[0.2em] uppercase font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* ── Analysis Pipeline Section (Zoom In on Scroll) ──── */}
      <motion.section
        id="pipeline"
        className="relative z-10 py-32 px-6"
        style={{ scale: pipelineScale, opacity: pipelineOpacity }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[0.7rem] font-mono text-white/25 tracking-[0.3em] uppercase block mb-4">
              How It Works
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="text-white">Analysis</span>{" "}
              <span className="gradient-text-silver">Pipeline</span>
            </h2>
          </motion.div>

          {/* Pipeline Steps */}
          <div className="space-y-0">
            {pipelineSteps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                {/* Connector line */}
                {i > 0 && <div className="pipeline-connector" />}

                {/* Step card */}
                <motion.div
                  className="pipeline-step group cursor-default"
                  whileHover={{ scale: 1.02, x: 8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="flex items-start gap-6">
                    {/* Step number */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center font-mono text-sm text-white/40 group-hover:text-white/80 group-hover:border-white/20 transition-all">
                      {step.num}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white/80 group-hover:text-white transition-colors mb-1">
                        {step.title}
                      </h3>
                      <p className="text-sm text-white/30 group-hover:text-white/50 transition-colors">
                        {step.desc}
                      </p>
                    </div>

                    {/* Icon */}
                    <span className="text-2xl text-white/10 group-hover:text-white/30 transition-colors">
                      {step.icon}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Features Grid Section (Zoom In on Scroll) ──────── */}
      <motion.section
        id="features"
        className="relative z-10 py-32 px-6"
        style={{ scale: featuresScale, opacity: featuresOpacity }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-[0.7rem] font-mono text-white/25 tracking-[0.3em] uppercase block mb-4">
              Core Capabilities
            </span>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              <span className="gradient-text">Intelligent</span>{" "}
              <span className="text-white">Features</span>
            </h2>
          </motion.div>

          {/* 3-Column Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04] rounded-2xl overflow-hidden">
            {[
              {
                icon: "◎",
                title: "DNA Extraction",
                description:
                  "NLP decomposes your idea into Domain, Technology, and Problem components with semantic understanding.",
                stat: "3 Vectors",
              },
              {
                icon: "⬡",
                title: "Novelty Scoring",
                description:
                  "FAISS cosine similarity rates uniqueness with 5-layer filtering: junk, cliché, semantic, vague, and standard.",
                stat: "384 Dims",
              },
              {
                icon: "△",
                title: "Idea Evolution",
                description:
                  "Three mutation strategies — Technical, Social Impact, and Product — transform weak concepts into winners.",
                stat: "3 Modes",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-void/80 p-10 group cursor-default"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                whileHover={{
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                }}
              >
                {/* Icon */}
                <div className="text-3xl text-white/15 group-hover:text-white/40 transition-colors mb-6">
                  {feature.icon}
                </div>

                {/* Stat badge */}
                <div className="inline-block mb-4 px-3 py-1 rounded-md bg-white/[0.04] border border-white/[0.06]">
                  <span className="text-[0.65rem] font-mono text-white/30 tracking-[0.15em] uppercase">
                    {feature.stat}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white/80 group-hover:text-white transition-colors mb-3">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-white/30 leading-relaxed group-hover:text-white/45 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── Tech Stack Ticker ──────────────────────────────── */}
      <div className="relative z-10 py-8 border-y border-white/[0.04] overflow-hidden">
        <motion.div
          className="flex gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
          {[
            "NEXT.JS",
            "FASTAPI",
            "PYTORCH",
            "FAISS",
            "SENTENCE-TRANSFORMERS",
            "THREE.JS",
            "FRAMER MOTION",
            "POSTGRESQL",
            "NEXT.JS",
            "FASTAPI",
            "PYTORCH",
            "FAISS",
            "SENTENCE-TRANSFORMERS",
            "THREE.JS",
            "FRAMER MOTION",
            "POSTGRESQL",
          ].map((tech, i) => (
            <span
              key={i}
              className="text-[0.65rem] font-mono text-white/15 tracking-[0.3em] uppercase"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="relative z-10 py-12 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-white/15">
          <p className="font-mono">© 2026 AI Idea DNA</p>
          <p className="font-mono tracking-widest">v2.0.0</p>
        </div>
      </footer>
    </div>
  );
}
