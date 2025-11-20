from fastapi import APIRouter
from app.api.v1.endpoints import institution, student, verifier

router = APIRouter()

router.include_router(institution.router, prefix="/institution", tags=["institution"])
router.include_router(student.router, prefix="/student", tags=["student"])
router.include_router(verifier.router, prefix="/verify", tags=["verifier"])
