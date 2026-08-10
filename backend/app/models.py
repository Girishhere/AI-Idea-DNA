"""
============================================================
AI Idea DNA — SQLAlchemy ORM Models
============================================================
Defines the core database tables:
  • User           — platform users
  • ProjectIdea    — submitted ideas with extracted DNA
  • EvolutionResult — AI-evolved mutations of an idea

All models use UUIDs for primary keys and include audit timestamps.
"""

import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Float,
    Text,
    DateTime,
    ForeignKey,
    Integer,
)
from sqlalchemy.orm import relationship

from app.database import Base


def _utcnow():
    """Return timezone-aware UTC timestamp."""
    return datetime.now(timezone.utc)


# ═══════════════════════════════════════════════════════════════
# USER MODEL
# ═══════════════════════════════════════════════════════════════
class User(Base):
    """
    Represents a platform user who can submit and evolve project ideas.
    """
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(120), unique=True, nullable=False, index=True)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=_utcnow)

    # ── Relationships ────────────────────────────────────────
    ideas = relationship("ProjectIdea", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(username='{self.username}')>"


# ═══════════════════════════════════════════════════════════════
# PROJECT IDEA MODEL
# ═══════════════════════════════════════════════════════════════
class ProjectIdea(Base):
    """
    Stores a submitted project idea along with its extracted 'DNA':
    domain classification, detected technologies, and problem statement.
    The novelty_score (0-100) is computed by the FAISS similarity engine.
    """
    __tablename__ = "project_ideas"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)

    # ── Raw Input ────────────────────────────────────────────
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    # ── Extracted DNA ────────────────────────────────────────
    domain = Column(String(100), nullable=True)       # e.g., "Healthcare", "EdTech"
    tech_stack = Column(String(500), nullable=True)    # Comma-separated technologies
    problem_statement = Column(Text, nullable=True)    # Core problem being solved

    # ── Scoring ──────────────────────────────────────────────
    novelty_score = Column(Float, default=0.0)         # 0-100 novelty rating

    # ── Audit ────────────────────────────────────────────────
    created_at = Column(DateTime, default=_utcnow)

    # ── Relationships ────────────────────────────────────────
    user = relationship("User", back_populates="ideas")
    evolutions = relationship("EvolutionResult", back_populates="project_idea", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<ProjectIdea(title='{self.title}', novelty={self.novelty_score})>"


# ═══════════════════════════════════════════════════════════════
# EVOLUTION RESULT MODEL
# ═══════════════════════════════════════════════════════════════
class EvolutionResult(Base):
    """
    Stores a single evolved/mutated version of a project idea.
    Each evolution is associated with a mode:
      • technical    — adds cutting-edge technology pivots
      • social_impact — adds community/sustainability angles
      • product      — adds monetization/market-fit pivots
    """
    __tablename__ = "evolution_results"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    project_idea_id = Column(String(36), ForeignKey("project_ideas.id"), nullable=False)

    # ── Evolution Details ────────────────────────────────────
    mode = Column(String(30), nullable=False)           # technical | social_impact | product
    original_idea = Column(Text, nullable=False)        # Snapshot of the input
    evolved_title = Column(String(200), nullable=False)
    evolved_description = Column(Text, nullable=False)
    key_changes = Column(Text, nullable=True)           # Comma-separated change highlights
    evolution_score = Column(Float, default=0.0)        # Improvement metric

    # ── Audit ────────────────────────────────────────────────
    created_at = Column(DateTime, default=_utcnow)

    # ── Relationships ────────────────────────────────────────
    project_idea = relationship("ProjectIdea", back_populates="evolutions")

    def __repr__(self):
        return f"<EvolutionResult(mode='{self.mode}', title='{self.evolved_title}')>"
