"""
============================================================
AI Idea DNA — Application Configuration
============================================================
Centralizes all environment-driven settings using pydantic-settings.
Reads from .env file or environment variables at startup.
"""

import os
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    Defaults are provided for local development.
    """

    # ── Application ──────────────────────────────────────────
    APP_NAME: str = "AI Idea DNA"
    APP_VERSION: str = "2.0.0"
    DEBUG: bool = True

    # ── Database ─────────────────────────────────────────────
    # Default uses SQLite for MVP; swap to PostgreSQL URI in production
    DATABASE_URL: str = "sqlite:///./idea_dna.db"

    # ── CORS ─────────────────────────────────────────────────
    # Allowed origins for the frontend dev server
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    # ── ML Assets ────────────────────────────────────────────
    # Path to the directory containing the trained model, FAISS index,
    # and project metadata. Resolved relative to the backend/app/ dir.
    ML_ASSETS_DIR: str = os.path.join(
        os.path.dirname(os.path.abspath(__file__)), "ml_assets"
    )

    # ── FAISS ────────────────────────────────────────────────
    # Dimension of the SentenceTransformer embeddings (MiniLM = 384)
    EMBEDDING_DIM: int = 384

    # Number of similar results to return
    FAISS_TOP_K: int = 5

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# Singleton settings instance — import this everywhere
settings = Settings()
