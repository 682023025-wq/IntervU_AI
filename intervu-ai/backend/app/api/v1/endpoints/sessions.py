"""
API Endpoints untuk sesi wawancara
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from uuid import UUID
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import verify_supabase_jwt
from app.services.session_service import session_service
from app.schemas.common import SesiWawancaraCreate, SesiWawancaraResponse


router = APIRouter(prefix="/sessions", tags=["Interview Sessions"])


async def get_current_user_id(request: Request) -> str:
    """Helper untuk mendapatkan user ID dari token"""
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization header"
        )
    
    token = auth_header.replace("Bearer ", "")
    payload = await verify_supabase_jwt(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    return payload.get('sub')


@router.post("/")
async def create_session(
    request: Request,
    session_data: SesiWawancaraCreate,
    db: AsyncSession = Depends(get_db)
):
    """
    Create new interview session
    ATURAN BISNIS: User hanya bisa punya 1 sesi aktif pada satu waktu
    """
    user_id = await get_current_user_id(request)
    
    # Check if user has active session
    existing_active = await session_service.get_active_session(db, user_id)
    if existing_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You already have an active interview session. Please complete or abandon it first."
        )
    
    # Create new session
    session = await session_service.create_session(
        db=db,
        id_profil=user_id,
        mode=session_data.mode,
        posisi_target=session_data.posisi_target,
        bahasa=session_data.bahasa
    )
    
    return {
        "success": True,
        "message": "Interview session created successfully",
        "data": SesiWawancaraResponse.model_validate(session)
    }


@router.get("/active")
async def get_active_session(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get current user's active session"""
    user_id = await get_current_user_id(request)
    
    session = await session_service.get_active_session(db, user_id)
    
    if not session:
        return {
            "success": True,
            "data": None  # No active session
        }
    
    return {
        "success": True,
        "data": SesiWawancaraResponse.model_validate(session)
    }


@router.get("/")
async def get_my_sessions(
    request: Request,
    limit: int = 10,
    db: AsyncSession = Depends(get_db)
):
    """Get recent interview sessions for current user"""
    user_id = await get_current_user_id(request)
    
    sessions = await session_service.get_sessions_by_profile(db, user_id, limit)
    
    return {
        "success": True,
        "data": [SesiWawancaraResponse.model_validate(s) for s in sessions]
    }


@router.get("/{session_id}")
async def get_session(
    request: Request,
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get specific session by ID"""
    user_id = await get_current_user_id(request)
    
    session = await session_service.get_session_by_id(db, session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Security check: user can only access their own sessions
    if str(session.id_profil) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this session"
        )
    
    return {
        "success": True,
        "data": SesiWawancaraResponse.model_validate(session)
    }


@router.patch("/{session_id}/complete")
async def complete_session(
    request: Request,
    session_id: str,
    evaluation_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """
    Complete interview session with AI evaluation
    ATURAN BISNIS: Skor dan evaluasi dari AI disimpan di sini
    """
    user_id = await get_current_user_id(request)
    
    session = await session_service.get_session_by_id(db, session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Security check
    if str(session.id_profil) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this session"
        )
    
    # Complete session
    skor_akhir = evaluation_data.get('overall_score', 50)
    evaluasi_ai = evaluation_data.get('star_analysis', {})
    
    session = await session_service.complete_session(
        db=db,
        session_id=session_id,
        skor_akhir=skor_akhir,
        evaluasi_ai={
            **evaluasi_ai,
            'strengths': evaluation_data.get('strengths', []),
            'weaknesses': evaluation_data.get('weaknesses', []),
            'recommendations': evaluation_data.get('recommendations', [])
        }
    )
    
    return {
        "success": True,
        "message": "Session completed successfully",
        "data": SesiWawancaraResponse.model_validate(session)
    }


@router.post("/{session_id}/abandon")
async def abandon_session(
    request: Request,
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Abandon interview session (user left without completing)"""
    user_id = await get_current_user_id(request)
    
    session = await session_service.get_session_by_id(db, session_id)
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Session not found"
        )
    
    # Security check
    if str(session.id_profil) != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this session"
        )
    
    session = await session_service.abandon_session(db, session_id)
    
    return {
        "success": True,
        "message": "Session abandoned",
        "data": SesiWawancaraResponse.model_validate(session)
    }
