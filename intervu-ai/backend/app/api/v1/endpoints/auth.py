"""
API Endpoints untuk autentikasi
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from app.core.database import get_db
from app.core.security import verify_supabase_jwt
from app.services.profile_service import profile_service
from app.schemas.common import ProfileResponse


router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.get("/me")
async def get_current_user(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Get current authenticated user profile
    Validasi JWT token dari Supabase
    """
    # Extract token from Authorization header
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    
    token = auth_header.replace("Bearer ", "")
    
    # Verify token
    payload = await verify_supabase_jwt(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get('sub')
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    
    # Get profile
    profile = await profile_service.get_profile_by_id(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    # Check CV completeness
    is_cv_complete = await profile_service.is_cv_complete(profile)
    
    return {
        "success": True,
        "data": {
            "profile": ProfileResponse.model_validate(profile),
            "is_cv_complete": is_cv_complete,
            "user_metadata": payload
        }
    }


@router.post("/verify")
async def verify_token(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Verify Supabase JWT token
    Used by frontend to check authentication status
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Missing authorization header"}
        )
    
    token = auth_header.replace("Bearer ", "")
    payload = await verify_supabase_jwt(token)
    
    if not payload:
        return JSONResponse(
            status_code=status.HTTP_401_UNAUTHORIZED,
            content={"success": False, "message": "Invalid token"}
        )
    
    user_id = payload.get('sub')
    profile = await profile_service.get_profile_by_id(db, user_id) if user_id else None
    
    return {
        "success": True,
        "data": {
            "user_id": user_id,
            "email": payload.get('email'),
            "profile_exists": profile is not None
        }
    }
