"""
API Endpoints untuk chat AI selama wawancara
CORE FEATURE: Integrasi dengan AI interviewer
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict
from uuid import UUID
from datetime import datetime, timezone
from app.core.database import get_db
from app.core.security import verify_supabase_jwt
from app.models.base import PesanWawancara, SesiWawancara, Profile
from app.services.ai_service import ai_service
from app.services.session_service import session_service
from app.services.profile_service import profile_service


router = APIRouter(prefix="/chat", tags=["AI Chat"])


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


@router.post("/{session_id}/send")
async def send_message(
    request: Request,
    session_id: str,
    message_data: dict,
    db: AsyncSession = Depends(get_db)
):
    """
    Send message to AI interviewer
    ALUR: User jawaban -> Save to DB -> Send to AI -> Get response -> Save to DB
    """
    user_id = await get_current_user_id(request)
    user_message = message_data.get('message', '').strip()
    
    if not user_message:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty"
        )
    
    # Get session
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
    
    # Check session status
    if session.status != 'berlangsung':
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Session is not active"
        )
    
    # Get profile for CV data
    profile = await profile_service.get_profile_by_id(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Get conversation history
    result = await db.execute(
        select(PesanWawancara)
        .where(PesanWawancara.id_sesi == session_id)
        .order_by(PesanWawancara.urutan_pesan)
    )
    messages = result.scalars().all()
    
    # Convert to format for AI
    chat_history = [
        {"role": "user" if msg.peran == "kandidat" else "assistant", "content": msg.isi}
        for msg in messages
    ]
    
    # Add user's new message
    chat_history.append({"role": "user", "content": user_message})
    
    # Save user message to DB
    user_msg = PesanWawancara(
        id_sesi=session_id,
        peran='kandidat',
        isi=user_message,
        urutan_pesan=len(messages)
    )
    db.add(user_msg)
    await db.flush()  # Get ID without committing
    
    # Get AI response
    try:
        ai_response = await ai_service.chat_with_interviewer(
            messages=chat_history,
            cv_data=profile.data_cv or {},
            posisi_target=session.posisi_target,
            bahasa=session.bahasa
        )
    except Exception as e:
        print(f"AI service error: {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service temporarily unavailable"
        )
    
    # Save AI response to DB
    ai_msg = PesanWawancara(
        id_sesi=session_id,
        peran='pewawancara',
        isi=ai_response,
        urutan_pesan=len(messages) + 1
    )
    db.add(ai_msg)
    
    # Increment question count
    await session_service.increment_question_count(db, session_id)
    
    # Commit all changes
    await db.commit()
    
    return {
        "success": True,
        "data": {
            "user_message": {
                "id": str(user_msg.id),
                "message": user_message,
                "role": "kandidat",
                "timestamp": user_msg.dibuat_pada.isoformat()
            },
            "ai_response": {
                "id": str(ai_msg.id),
                "message": ai_response,
                "role": "pewawancara",
                "timestamp": ai_msg.dibuat_pada.isoformat()
            }
        }
    }


@router.get("/{session_id}/history")
async def get_chat_history(
    request: Request,
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get chat history for a session"""
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
    
    # Get messages
    result = await db.execute(
        select(PesanWawancara)
        .where(PesanWawancara.id_sesi == session_id)
        .order_by(PesanWawancara.urutan_pesan)
    )
    messages = result.scalars().all()
    
    return {
        "success": True,
        "data": [
            {
                "id": str(msg.id),
                "message": msg.isi,
                "role": msg.peran,
                "edited": msg.diedit_pengguna,
                "timestamp": msg.dibuat_pada.isoformat(),
                "order": msg.urutan_pesan
            }
            for msg in messages
        ]
    }


@router.post("/{session_id}/end")
async def end_interview(
    request: Request,
    session_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    End interview and get AI evaluation
    ALUR: End session -> AI evaluates -> Generate CV suggestions -> Return results
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
    
    # Get chat history
    result = await db.execute(
        select(PesanWawancara)
        .where(PesanWawancara.id_sesi == session_id)
        .order_by(PesanWawancara.urutan_pesan)
    )
    messages = result.scalars().all()
    
    if len(messages) < 2:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Interview must have at least one question and answer"
        )
    
    # Get profile
    profile = await profile_service.get_profile_by_id(db, user_id)
    
    # Convert to format for AI
    chat_history = [
        {"role": "user" if msg.peran == "kandidat" else "assistant", "content": msg.isi}
        for msg in messages
    ]
    
    # Get AI evaluation
    try:
        evaluation = await ai_service.evaluate_interview(
            messages=chat_history,
            cv_data=profile.data_cv or {},
            posisi_target=session.posisi_target,
            bahasa=session.bahasa
        )
        
        # Generate CV suggestions
        cv_suggestions = await ai_service.generate_cv_suggestions(
            cv_data=profile.data_cv or {},
            interview_messages=chat_history,
            bahasa=session.bahasa
        )
        
    except Exception as e:
        print(f"AI evaluation error: {e}")
        evaluation = {
            "overall_score": 50,
            "star_analysis": {},
            "strengths": ["Komunikasi baik"],
            "weaknesses": ["Perlu peningkatan"],
            "recommendations": ["Latih penggunaan metode STAR"]
        }
        cv_suggestions = []
    
    # Complete session
    session = await session_service.complete_session(
        db=db,
        session_id=session_id,
        skor_akhir=evaluation.get('overall_score', 50),
        evaluasi_ai=evaluation
    )
    
    # Save CV suggestions to database
    saran_objects = []
    for suggestion in cv_suggestions:
        saran = PesanWawancara(
            # We'll create a separate endpoint for saving suggestions
            # For now, just return them
        )
        saran_objects.append(suggestion)
    
    return {
        "success": True,
        "data": {
            "session": {
                "id": str(session.id),
                "status": session.status,
                "skor_akhir": session.skor_akhir
            },
            "evaluation": evaluation,
            "cv_suggestions": cv_suggestions
        }
    }
