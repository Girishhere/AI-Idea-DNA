"""
============================================================
AI Idea DNA — FastAPI Application Entry Point
============================================================
Sets up the FastAPI application with:
  • CORS middleware for frontend communication
  • Lifespan events (FAISS initialization on startup)
  • Router registration for /api/analyze and /api/evolve
  • Health check endpoint
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import engine, Base
from app.routers import analyze, evolve
from app.services.faiss_service import faiss_service


# ═══════════════════════════════════════════════════════════════
# LIFESPAN — Startup & Shutdown Events
# ═══════════════════════════════════════════════════════════════
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan context manager.
    
    Startup:
      1. Create database tables (if using SQLite for MVP)
      2. Initialize FAISS index with mock project embeddings
    
    Shutdown:
      Clean up resources (if needed).
    """
    # ── Startup ──────────────────────────────────────────────
    print(f"[DNA] Starting {settings.APP_NAME} v{settings.APP_VERSION}")

    # Create database tables
    Base.metadata.create_all(bind=engine)
    print("[OK] Database tables created")

    # Initialize FAISS with mock project embeddings
    faiss_service.initialize()
    print("[OK] FAISS index ready")

    print(f"[LIVE] {settings.APP_NAME} is live!")

    yield  # Application runs here

    # ── Shutdown ─────────────────────────────────────────────
    print(f"[BYE] Shutting down {settings.APP_NAME}")


# ═══════════════════════════════════════════════════════════════
# APPLICATION FACTORY
# ═══════════════════════════════════════════════════════════════
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AI Idea DNA analyzes, scores, and evolves student project ideas "
        "using mock NLP extraction, FAISS vector similarity search, and "
        "template-based evolution strategies."
    ),
    lifespan=lifespan,
    docs_url="/docs",        # Swagger UI
    redoc_url="/redoc",      # ReDoc
)


# ═══════════════════════════════════════════════════════════════
# MIDDLEWARE
# ═══════════════════════════════════════════════════════════════
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ═══════════════════════════════════════════════════════════════
# ROUTERS
# ═══════════════════════════════════════════════════════════════
app.include_router(analyze.router)
app.include_router(evolve.router)


# ═══════════════════════════════════════════════════════════════
# HEALTH CHECK
# ═══════════════════════════════════════════════════════════════
@app.get(
    "/",
    tags=["Health"],
    summary="Health check",
)
async def health_check():
    """Root endpoint returning application status."""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "faiss_index_size": faiss_service.index.ntotal if faiss_service.index else 0,
    }


@app.get(
    "/api/health",
    tags=["Health"],
    summary="API health check",
)
async def api_health():
    """API-specific health endpoint."""
    return {
        "status": "ok",
        "services": {
            "faiss": "ready" if faiss_service._initialized else "not_initialized",
            "database": "connected",
        },
    }
