"""
============================================================
AI Idea DNA — Evolve Router
============================================================
POST /api/evolve
Accepts an original idea and an evolution mode, then returns
mutated project concepts via the evolution service.
"""

from fastapi import APIRouter, HTTPException

from app.schemas import EvolveRequest, EvolveResponse
from app.services.evolution_service import evolve_idea

router = APIRouter(prefix="/api", tags=["Evolution"])


@router.post(
    "/evolve",
    response_model=EvolveResponse,
    summary="Evolve a project idea",
    description=(
        "Takes an original project idea and applies one of three "
        "evolution strategies (Technical, Social Impact, Product) "
        "to generate mutated concept variants."
    ),
)
async def evolve_project_idea(request: EvolveRequest):
    """
    Main evolution endpoint.

    Flow:
    1. Validate the evolution mode
    2. Generate 3 evolved variants using the selected strategy
    3. Return the original + evolved versions for comparison
    """
    try:
        # ── Generate evolved concepts ────────────────────────
        evolved_versions = evolve_idea(
            idea_text=request.idea,
            mode=request.mode,
        )

        # ── Build response ───────────────────────────────────
        return EvolveResponse(
            original_idea=request.idea,
            mode=request.mode,
            evolved_versions=evolved_versions,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Evolution failed: {str(e)}",
        )
