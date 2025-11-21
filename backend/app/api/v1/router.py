from fastapi import APIRouter
from app.api.v1.endpoints import institution, student, verifier, auth

router = APIRouter()

router.include_router(auth.router, prefix="/auth", tags=["auth"])
router.include_router(institution.router, prefix="/institution", tags=["institution"])
router.include_router(student.router, prefix="/student", tags=["student"])
router.include_router(verifier.router, prefix="/verifier", tags=["verifier"])
