"""
============================================================
AI Idea DNA — Database Connection Layer
============================================================
Sets up SQLAlchemy engine, session factory, and declarative base.
Uses the DATABASE_URL from config (SQLite for MVP, PostgreSQL for prod).
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import settings

# ── Engine ───────────────────────────────────────────────────
# connect_args is needed only for SQLite (thread safety)
engine_kwargs = {}
if settings.DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    **engine_kwargs,
)

# ── Session Factory ──────────────────────────────────────────
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

# ── Declarative Base ─────────────────────────────────────────
# All ORM models inherit from this base class
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that provides a database session.
    Ensures the session is properly closed after each request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
