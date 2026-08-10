"""
============================================================
AI Idea DNA — Analyze Router
============================================================
POST /api/analyze
Accepts a project idea, extracts its DNA (domain, tech, problem),
computes a novelty score via FAISS similarity, and returns
the full analysis.
"""

from fastapi import APIRouter, HTTPException

from app.schemas import AnalyzeRequest, AnalyzeResponse
from app.services.nlp_service import extract_idea_dna, generate_tags, generate_summary
from app.services.scoring_service import compute_novelty_score

router = APIRouter(prefix="/api", tags=["Analysis"])


@router.post(
    "/analyze",
    response_model=AnalyzeResponse,
    summary="Analyze a project idea",
    description=(
        "Extracts the Idea DNA (domain, technologies, problem themes), "
        "computes a novelty score against existing projects via FAISS "
        "similarity search, and returns tagged components."
    ),
)
async def analyze_idea(request: AnalyzeRequest):
    """
    Main analysis endpoint.

    Flow:
    1. Extract Idea DNA via NLP service (mock keyword matching)
    2. Compute novelty score via FAISS similarity search
    3. Generate display tags and summary
    4. Return unified AnalyzeResponse
    """
    try:
        # ── Step 1: Extract DNA components ───────────────────
        idea_dna = extract_idea_dna(request.idea)

        # ── Step 2: Compute novelty score + find similar ─────
        novelty_score, similar_projects, recommendation = compute_novelty_score(request.idea)

        # ── Step 3: Generate tags and summary ────────────────
        tags = generate_tags(idea_dna)
        summary = generate_summary(idea_dna)

        # ── Step 4: Build response ───────────────────────────
        return AnalyzeResponse(
            idea_dna=idea_dna,
            novelty_score=novelty_score,
            similar_projects=similar_projects,
            tags=tags,
            summary=summary,
            recommendation=recommendation,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}",
        )
