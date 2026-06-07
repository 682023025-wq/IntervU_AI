"""API v1 Module"""

from fastapi import APIRouter
from app.api.v1.endpoints import auth, interviews, questions

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(interviews.router, prefix="/interviews", tags=["interviews"])
api_router.include_router(questions.router, prefix="/questions", tags=["questions"])

__all__ = ["api_router"]
