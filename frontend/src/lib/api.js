/**
 * ============================================================
 * AI Idea DNA — API Client
 * ============================================================
 * Centralized API helper functions for communicating with
 * the FastAPI backend. Uses Next.js proxy rewrites so all
 * requests go through the same origin.
 */

const API_BASE = "/api";

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint path (e.g., "/analyze")
 * @param {object} options - Fetch options
 * @returns {Promise<object>} Parsed JSON response
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API error: ${response.status}`);
  }

  return response.json();
}

/**
 * Analyze a project idea — extracts DNA, computes novelty score.
 * @param {string} idea - The raw project idea text
 * @returns {Promise<{idea_dna, novelty_score, similar_projects, tags, summary}>}
 */
export async function analyzeIdea(idea) {
  return apiFetch("/analyze", {
    method: "POST",
    body: JSON.stringify({ idea }),
  });
}

/**
 * Evolve a project idea using a mutation strategy.
 * @param {string} idea - The original project idea text
 * @param {string} mode - Evolution mode: "technical" | "social_impact" | "product"
 * @returns {Promise<{original_idea, mode, evolved_versions}>}
 */
export async function evolveIdea(idea, mode) {
  return apiFetch("/evolve", {
    method: "POST",
    body: JSON.stringify({ idea, mode }),
  });
}
