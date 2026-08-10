"""
============================================================
AI Idea DNA — Mock NLP Service
============================================================
Extracts the 'DNA' components from a raw project idea:
  • Domain   — which industry/sector the idea targets
  • Tech     — which technologies are mentioned or implied
  • Problem  — what core problem is being addressed

Uses keyword matching for the MVP. In production, replace
with a real NLP pipeline (spaCy, HuggingFace, etc.).
"""

import re
from typing import List
from app.schemas import IdeaDNA


# ═══════════════════════════════════════════════════════════════
# KEYWORD DICTIONARIES
# ═══════════════════════════════════════════════════════════════
# Each dictionary maps a canonical label to a set of trigger words.

DOMAIN_KEYWORDS = {
    "Healthcare": [
        "health", "medical", "hospital", "clinical", "patient", "diagnosis",
        "symptom", "pharmaceutical", "drug", "telemedicine", "wellness",
        "mental health", "therapy", "doctor", "nurse", "biomedical",
    ],
    "Education": [
        "education", "learning", "student", "teacher", "school", "university",
        "edtech", "curriculum", "classroom", "tutorial", "course", "training",
        "e-learning", "mooc", "literacy",
    ],
    "Finance": [
        "finance", "fintech", "banking", "payment", "transaction", "fraud",
        "investment", "insurance", "credit", "loan", "cryptocurrency",
        "trading", "stock", "portfolio", "budget",
    ],
    "Agriculture": [
        "agriculture", "farming", "crop", "irrigation", "soil", "harvest",
        "agritech", "livestock", "fertilizer", "pest", "precision farming",
    ],
    "Environment": [
        "environment", "sustainability", "climate", "carbon", "renewable",
        "recycling", "waste", "pollution", "green", "ecology", "conservation",
        "solar", "wind energy", "deforestation",
    ],
    "Transportation": [
        "transport", "traffic", "navigation", "autonomous", "vehicle",
        "logistics", "delivery", "drone", "fleet", "ride-sharing", "mobility",
    ],
    "Legal": [
        "legal", "law", "contract", "compliance", "regulation", "court",
        "attorney", "litigation", "patent", "trademark", "justice",
    ],
    "Smart City": [
        "smart city", "urban", "infrastructure", "city planning",
        "public safety", "smart grid", "municipal", "civic",
    ],
    "Entertainment": [
        "entertainment", "gaming", "music", "movie", "streaming",
        "content", "media", "social media", "creator", "virtual reality",
    ],
    "E-Commerce": [
        "e-commerce", "shopping", "marketplace", "retail", "product",
        "customer", "inventory", "supply chain", "fulfillment",
    ],
}

TECH_KEYWORDS = {
    "Machine Learning": [
        "machine learning", "ml", "deep learning", "neural network",
        "classification", "regression", "clustering", "model training",
        "supervised", "unsupervised", "reinforcement learning",
    ],
    "Natural Language Processing": [
        "nlp", "natural language", "text analysis", "sentiment",
        "chatbot", "language model", "tokenization", "ner",
        "text mining", "speech recognition", "gpt", "transformer",
    ],
    "Computer Vision": [
        "computer vision", "image", "object detection", "face recognition",
        "image classification", "video analysis", "ocr", "segmentation",
        "convolutional", "cnn",
    ],
    "Blockchain": [
        "blockchain", "smart contract", "decentralized", "ethereum",
        "solidity", "web3", "nft", "token", "distributed ledger", "dao",
    ],
    "IoT": [
        "iot", "internet of things", "sensor", "embedded", "arduino",
        "raspberry pi", "edge computing", "wearable", "connected device",
    ],
    "Cloud Computing": [
        "cloud", "aws", "azure", "gcp", "kubernetes", "docker",
        "microservices", "serverless", "saas", "paas", "scalability",
    ],
    "Mobile Development": [
        "mobile", "android", "ios", "react native", "flutter",
        "app", "smartphone", "tablet", "cross-platform",
    ],
    "Data Analytics": [
        "data analytics", "big data", "data visualization", "dashboard",
        "metrics", "kpi", "reporting", "data pipeline", "etl", "tableau",
    ],
    "Cybersecurity": [
        "security", "cybersecurity", "encryption", "authentication",
        "firewall", "vulnerability", "threat", "penetration testing",
    ],
    "AR/VR": [
        "augmented reality", "virtual reality", "ar", "vr", "mixed reality",
        "metaverse", "3d", "immersive", "holographic",
    ],
}

PROBLEM_KEYWORDS = {
    "Accessibility": [
        "accessibility", "inclusive", "disability", "underserved",
        "rural", "remote", "marginalized", "equitable", "gap",
    ],
    "Efficiency": [
        "efficiency", "optimize", "automate", "streamline", "reduce cost",
        "time-saving", "productivity", "workflow", "bottleneck",
    ],
    "Safety": [
        "safety", "risk", "hazard", "prevention", "protection",
        "alert", "warning", "emergency", "incident",
    ],
    "Transparency": [
        "transparency", "trust", "verification", "accountability",
        "audit", "traceability", "provenance", "authenticity",
    ],
    "Engagement": [
        "engagement", "retention", "dropout", "motivation",
        "gamification", "personalization", "user experience",
    ],
    "Prediction": [
        "prediction", "forecasting", "early detection", "anomaly",
        "pattern recognition", "trend", "anticipation",
    ],
    "Communication": [
        "communication", "collaboration", "connect", "bridge",
        "language barrier", "real-time", "notification",
    ],
}


def extract_idea_dna(idea_text: str) -> IdeaDNA:
    """
    Parse a raw idea string and extract its DNA components.

    Algorithm:
    1. Lowercase the input text
    2. For each category (domain, tech, problem), scan for matching keywords
    3. Return a deduplicated IdeaDNA object

    Args:
        idea_text: Raw project idea description

    Returns:
        IdeaDNA with populated domain, tech, and problem lists
    """
    text_lower = idea_text.lower()

    # ── Extract domains ──────────────────────────────────────
    domains = []
    for domain, keywords in DOMAIN_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower and domain not in domains:
                domains.append(domain)
                break  # One match per domain is enough

    # ── Extract technologies ─────────────────────────────────
    techs = []
    for tech, keywords in TECH_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower and tech not in techs:
                techs.append(tech)
                break

    # ── Extract problem themes ───────────────────────────────
    problems = []
    for problem, keywords in PROBLEM_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower and problem not in problems:
                problems.append(problem)
                break

    # ── Fallback: if nothing detected, provide defaults ──────
    if not domains:
        domains = ["General Technology"]
    if not techs:
        techs = ["Software Development"]
    if not problems:
        problems = ["Innovation"]

    return IdeaDNA(
        domain=domains,
        tech=techs,
        problem=problems,
    )


def generate_tags(dna: IdeaDNA) -> List[str]:
    """
    Flatten the IdeaDNA into a single list of display tags.
    Prefixes each tag with its category for the frontend pill display.
    """
    tags = []
    for d in dna.domain:
        tags.append(f"🌐 {d}")
    for t in dna.tech:
        tags.append(f"⚡ {t}")
    for p in dna.problem:
        tags.append(f"🎯 {p}")
    return tags


def generate_summary(dna: IdeaDNA) -> str:
    """
    Create a one-line summary of the extracted DNA.
    """
    domain_str = ", ".join(dna.domain[:2])
    tech_str = ", ".join(dna.tech[:2])
    problem_str = ", ".join(dna.problem[:1])

    return (
        f"A {domain_str} project leveraging {tech_str} "
        f"to address {problem_str}."
    )
