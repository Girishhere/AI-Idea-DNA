"""
============================================================
AI Idea DNA — Idea Evolution Service
============================================================
Evolves/mutates a project idea into new concepts using three
distinct strategies:

  • TECHNICAL     — injects cutting-edge technology pivots
  • SOCIAL_IMPACT — adds community, accessibility, and
                    sustainability angles
  • PRODUCT       — adds monetization, market-fit, and
                    scalability pivots

Each mode generates 3 evolved variants. In production,
replace this with an LLM-based generation pipeline.
"""

import random
from typing import List
from app.schemas import EvolutionMode, EvolvedConcept


# ═══════════════════════════════════════════════════════════════
# EVOLUTION TEMPLATES
# ═══════════════════════════════════════════════════════════════
# Each template defines a mutation pattern with placeholders.

TECHNICAL_MUTATIONS = [
    {
        "title_prefix": "Quantum-Enhanced",
        "description_template": (
            "Leverage quantum computing algorithms to exponentially accelerate "
            "the core processing of {idea}. Implement hybrid quantum-classical "
            "pipelines using Qiskit or Cirq for optimization problems, reducing "
            "computation time by orders of magnitude while maintaining accuracy."
        ),
        "key_changes": [
            "Added quantum computing layer for core processing",
            "Hybrid quantum-classical architecture",
            "Exponential speedup for optimization tasks",
        ],
    },
    {
        "title_prefix": "Edge AI",
        "description_template": (
            "Deploy the intelligence of {idea} directly to edge devices using "
            "TinyML and model compression techniques. Run inference on IoT "
            "hardware (NVIDIA Jetson, Coral TPU) for real-time, offline-capable "
            "operation — eliminating cloud dependency and reducing latency to <10ms."
        ),
        "key_changes": [
            "Moved inference to edge devices (TinyML)",
            "Offline-first architecture",
            "Sub-10ms latency with model compression",
        ],
    },
    {
        "title_prefix": "Federated",
        "description_template": (
            "Transform {idea} into a privacy-preserving system using Federated "
            "Learning. Each user/node trains locally; only encrypted model gradients "
            "are shared. This enables collaborative intelligence across institutions "
            "without centralizing sensitive data, using differential privacy guarantees."
        ),
        "key_changes": [
            "Federated learning for privacy preservation",
            "Decentralized data — no central repository",
            "Differential privacy with cryptographic guarantees",
        ],
    },
]

SOCIAL_IMPACT_MUTATIONS = [
    {
        "title_prefix": "Community-First",
        "description_template": (
            "Reimagine {idea} as a community-owned cooperative platform. "
            "Prioritize marginalized and underserved populations with "
            "multilingual support, offline SMS fallbacks, and partnerships "
            "with local NGOs. Revenue is reinvested into digital literacy "
            "programs in the communities served."
        ),
        "key_changes": [
            "Community cooperative ownership model",
            "Multilingual + offline SMS accessibility",
            "Revenue reinvested into digital literacy",
        ],
    },
    {
        "title_prefix": "Green",
        "description_template": (
            "Embed environmental sustainability into the core of {idea}. "
            "Track and minimize the carbon footprint of every computation. "
            "Use renewable-energy-powered cloud regions, carbon-offset APIs, "
            "and provide users with sustainability dashboards showing the "
            "environmental impact of their usage."
        ),
        "key_changes": [
            "Carbon-neutral computing infrastructure",
            "Sustainability dashboard for users",
            "Renewable energy cloud deployment",
        ],
    },
    {
        "title_prefix": "Inclusive",
        "description_template": (
            "Redesign {idea} with universal accessibility as the foundation. "
            "Implement WCAG AAA compliance, screen reader optimization, "
            "voice-first interfaces, and support for neurodiverse users. "
            "Partner with disability advocacy organizations for continuous "
            "user testing and feedback integration."
        ),
        "key_changes": [
            "WCAG AAA accessibility compliance",
            "Voice-first + screen reader optimization",
            "Neurodiverse user support built-in",
        ],
    },
]

PRODUCT_MUTATIONS = [
    {
        "title_prefix": "Platform",
        "description_template": (
            "Evolve {idea} from a standalone tool into a full platform "
            "ecosystem with a marketplace, API-first architecture, and "
            "third-party plugin system. Monetize through tiered SaaS "
            "subscriptions (Free / Pro / Enterprise) with usage-based "
            "billing for API calls and premium features."
        ),
        "key_changes": [
            "Platform ecosystem with marketplace",
            "API-first with third-party plugins",
            "Tiered SaaS monetization (Free/Pro/Enterprise)",
        ],
    },
    {
        "title_prefix": "Enterprise",
        "description_template": (
            "Scale {idea} for enterprise adoption with SSO/SAML integration, "
            "role-based access control, audit logging, SOC2 compliance, and "
            "dedicated support SLAs. Add team collaboration features, admin "
            "dashboards, and white-labeling capabilities for B2B distribution."
        ),
        "key_changes": [
            "Enterprise SSO/SAML + RBAC",
            "SOC2 compliance and audit logging",
            "White-label B2B distribution",
        ],
    },
    {
        "title_prefix": "Viral",
        "description_template": (
            "Inject viral growth mechanics into {idea}. Add gamification "
            "(points, badges, leaderboards), social sharing loops, referral "
            "rewards, and a freemium model that converts through demonstrated "
            "value. Implement cohort-based engagement campaigns and A/B test "
            "every touchpoint for conversion optimization."
        ),
        "key_changes": [
            "Gamification engine (points, badges, leaderboards)",
            "Viral referral loops with rewards",
            "Freemium-to-premium conversion funnel",
        ],
    },
]

# Map modes to their mutation templates
MODE_TEMPLATES = {
    EvolutionMode.TECHNICAL: TECHNICAL_MUTATIONS,
    EvolutionMode.SOCIAL_IMPACT: SOCIAL_IMPACT_MUTATIONS,
    EvolutionMode.PRODUCT: PRODUCT_MUTATIONS,
}


def evolve_idea(
    idea_text: str,
    mode: EvolutionMode,
) -> List[EvolvedConcept]:
    """
    Generate evolved versions of a project idea using the
    specified evolution mode.

    Args:
        idea_text: The original project idea description
        mode: Evolution strategy (technical, social_impact, product)

    Returns:
        List of 3 EvolvedConcept objects with titles, descriptions,
        key changes, and evolution scores.
    """
    templates = MODE_TEMPLATES.get(mode, TECHNICAL_MUTATIONS)

    # Create a short version of the idea for template insertion
    idea_short = idea_text[:150].strip()
    if len(idea_text) > 150:
        idea_short += "..."

    evolved = []
    for i, template in enumerate(templates):
        # ── Build the evolved concept ────────────────────────
        title = f"{template['title_prefix']} {_extract_title(idea_text)}"
        description = template["description_template"].format(idea=idea_short)

        # Score is randomized but weighted by template position
        # (first template tends to score highest)
        base_score = 85.0 - (i * 8.0)
        jitter = random.uniform(-5.0, 5.0)
        score = max(0.0, min(100.0, round(base_score + jitter, 1)))

        evolved.append(EvolvedConcept(
            title=title,
            description=description,
            key_changes=template["key_changes"],
            evolution_score=score,
        ))

    # Sort by evolution score descending
    evolved.sort(key=lambda x: x.evolution_score, reverse=True)

    return evolved


def _extract_title(idea_text: str) -> str:
    """
    Extract a short, title-like phrase from the idea text.
    Takes the first meaningful phrase (up to 6 words).
    """
    # Clean up and take first sentence-like chunk
    words = idea_text.strip().split()

    # Skip common filler starts
    skip_words = {"a", "an", "the", "my", "our", "this", "i", "we"}
    start = 0
    for i, w in enumerate(words):
        if w.lower() not in skip_words:
            start = i
            break

    # Take up to 6 words
    title_words = words[start:start + 6]
    title = " ".join(title_words)

    # Capitalize first letter of each word
    return title.title()
