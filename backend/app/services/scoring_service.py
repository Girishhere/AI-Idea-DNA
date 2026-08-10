"""
============================================================
AI Idea DNA — Novelty Scoring Service (Real Inference)
============================================================
Computes a Novelty Score (0-100%) for a submitted idea based
on its FAISS L2 distances to the nearest existing projects.

Scoring Logic (for L2-normalized vectors):
  - L2 distance range: [0, 4] for unit-norm vectors
  - distance = 0  -> identical (novelty = 0%)
  - distance = 2  -> orthogonal (novelty ~100%)
  - We use the CLOSEST match (not average) to determine novelty,
    because a single close match means the idea already exists.
  - Formula: novelty = min(100, (closest_distance / 2.0) * 100)
"""

import math
from typing import List, Tuple, Dict, Optional

from app.services.faiss_service import faiss_service

CLICHE_KEYWORDS = [
    "resume maker", "resume builder", "todo list", "weather app", 
    "calculator", "library management", "expense tracker", "portfolio",
    "ai bot", "chatbot", "chat bot", "discord bot", "whatsapp bot", 
    "clone", "management system", "app for students", "detection system"
]

def compute_novelty_score(idea_text: str) -> Tuple[float, List[Dict], Optional[str]]:
    """
    Compute the novelty score for a given idea using real FAISS search.

    Steps:
    1. Search FAISS for top-k similar existing projects (real embeddings)
    2. Check for cliché keywords and short descriptions
    3. Use the closest match distance to compute novelty
    4. Format similar projects for the response

    Args:
        idea_text: The raw project idea text

    Returns:
        Tuple of (novelty_score: float, similar_projects: list, recommendation: Optional[str])
    """
    # ── Step 1: FAISS similarity search (real inference) ─────
    raw_results = faiss_service.search_similar(idea_text, k=5)

    if not raw_results:
        return 95.0, [], None  # No comparisons = very novel

    # ── Step 2: Junk & Low-Effort Input Filter ───────────────
    # ── Step 2: Format similar projects context ──────────────
    similar_projects = []
    for project, distance in raw_results:
        cos_sim = max(0.0, 1.0 - (distance / 2.0))
        similar_projects.append({
            "title": project["title"],
            "description": project["description"],
            "similarity_score": round(cos_sim, 3),
        })
    similar_projects.sort(key=lambda x: x["similarity_score"], reverse=True)

    # ── Step 3: Compute variables ────────────────────────────
    word_count = len(idea_text.split())
    idea_lower = idea_text.lower()
    is_cliche = any(keyword in idea_lower for keyword in CLICHE_KEYWORDS)
    
    distances = [dist for _, dist in raw_results]
    closest_distance = min(distances)
    highest_similarity = max(0.0, 1.0 - (closest_distance / 2.0))
    avg_distance = sum(distances) / len(distances)

    # Base novelty math
    blended_distance = 0.7 * closest_distance + 0.3 * avg_distance
    base_novelty_score = 100.0 * (1.0 - math.exp(-2.5 * blended_distance))

    # ── Step 4: Strict Scoring Hierarchy ─────────────────────
    recommendation = None
    final_score = base_novelty_score

    # Step A (Junk)
    if word_count < 5:
        return 0.0, similar_projects, "⚠️ Invalid Input: Your description is too short. Please provide a complete sentence detailing the problem and proposed technology."
    if highest_similarity < 0.12:
        return 0.0, similar_projects, "⚠️ Unrecognized Concept: This does not appear to be a valid technical project. Please describe a concrete software, hardware, or research idea."

    # Step B (Explicit Cliché)
    if is_cliche:
        final_score = min(final_score, 15.0)
        recommendation = "⚠️ Highly Cliché: This is a highly overused concept. Use the Evolution panel to add a unique technical edge."
    # Step C (Semantic Cliché)
    elif highest_similarity > 0.65:
        final_score = min(final_score, 20.0)
        recommendation = "⚠️ Common Idea Detected: This concept is extremely common. To stand out, integrate automated ATS scoring, real-time feedback, or job-description matching."
    # Step D (Vague Idea Penalty - NEW)
    elif word_count <= 18:
        final_score = min(final_score, 35.0)
        recommendation = "⚠️ Vague Concept: This idea is too brief. A strong hackathon project requires a clear problem statement, target audience, and specific tech stack. Please elaborate."
    # Step E (Standard Calculation) - Falls through natively

    # Clamp to valid range
    final_score = max(0.0, min(100.0, round(final_score, 1)))

    return final_score, similar_projects, recommendation


