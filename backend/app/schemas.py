"""
============================================================
AI Idea DNA — Pydantic Schemas (Request / Response Models)
============================================================
Defines the API contract between frontend and backend.
All schemas use Pydantic V2 model_config for serialization.
"""

from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum


# ═══════════════════════════════════════════════════════════════
# ENUMS
# ═══════════════════════════════════════════════════════════════
class EvolutionMode(str, Enum):
    """The three evolution strategies available."""
    TECHNICAL = "technical"
    SOCIAL_IMPACT = "social_impact"
    PRODUCT = "product"


# ═══════════════════════════════════════════════════════════════
# ANALYZE ENDPOINT SCHEMAS
# ═══════════════════════════════════════════════════════════════
class AnalyzeRequest(BaseModel):
    """Input: a raw project idea string from the user."""
    idea: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="The full project idea description to analyze",
        json_schema_extra={"example": "An AI-powered healthcare chatbot using NLP to diagnose symptoms in rural areas"},
    )


class IdeaDNA(BaseModel):
    """
    The extracted 'DNA' of a project idea:
      • domain  — the industry/sector the idea targets
      • tech    — technologies referenced or implied
      • problem — the core problem being addressed
    """
    domain: List[str] = Field(default_factory=list, description="Detected domains (e.g., Healthcare, EdTech)")
    tech: List[str] = Field(default_factory=list, description="Detected technologies (e.g., NLP, Blockchain)")
    problem: List[str] = Field(default_factory=list, description="Core problem keywords")


class SimilarProject(BaseModel):
    """A project from the FAISS index that resembles the submitted idea."""
    title: str
    description: str
    similarity_score: float = Field(..., ge=0.0, le=1.0, description="0 = identical, 1 = completely different")


class AnalyzeResponse(BaseModel):
    """Full analysis result returned to the frontend."""
    idea_dna: IdeaDNA
    novelty_score: float = Field(..., ge=0.0, le=100.0, description="Novelty rating from 0 (derivative) to 100 (groundbreaking)")
    similar_projects: List[SimilarProject]
    tags: List[str] = Field(default_factory=list, description="Combined list of all extracted tags")
    summary: str = Field("", description="One-line summary of the analysis")
    recommendation: Optional[str] = Field(None, description="Recommendation on how to improve cliche ideas")


# ═══════════════════════════════════════════════════════════════
# EVOLVE ENDPOINT SCHEMAS
# ═══════════════════════════════════════════════════════════════
class EvolveRequest(BaseModel):
    """Input: the original idea and the desired evolution strategy."""
    idea: str = Field(
        ...,
        min_length=10,
        max_length=5000,
        description="The original project idea to evolve",
    )
    mode: EvolutionMode = Field(
        ...,
        description="Evolution strategy: technical, social_impact, or product",
    )


class EvolvedConcept(BaseModel):
    """A single mutated/evolved version of the original idea."""
    title: str = Field(..., description="Name of the evolved concept")
    description: str = Field(..., description="Full description of the evolved idea")
    key_changes: List[str] = Field(default_factory=list, description="What changed from the original")
    evolution_score: float = Field(0.0, ge=0.0, le=100.0, description="Quality/improvement score")


class EvolveResponse(BaseModel):
    """Full evolution result comparing original to mutated versions."""
    original_idea: str
    mode: EvolutionMode
    evolved_versions: List[EvolvedConcept]
