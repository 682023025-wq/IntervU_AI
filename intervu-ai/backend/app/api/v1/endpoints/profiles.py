"""
API Endpoints untuk manajemen profil dan CV
Business Logic: Fair AI - data demografis tidak dikirim ke AI
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request, UploadFile, File
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from uuid import UUID
from app.core.database import get_db
from app.core.security import verify_supabase_jwt
from app.services.profile_service import profile_service
from app.services.cloudinary_service import cloudinary_service
from app.schemas.common import ProfileUpdate, CVData, ProfileResponse


router = APIRouter(prefix="/profiles", tags=["Profiles"])


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


@router.get("/me")
async def get_my_profile(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Get current user's profile"""
    user_id = await get_current_user_id(request)
    
    profile = await profile_service.get_profile_by_id(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    is_cv_complete = await profile_service.is_cv_complete(profile)
    
    return {
        "success": True,
        "data": {
            "profile": ProfileResponse.model_validate(profile),
            "is_cv_complete": is_cv_complete
        }
    }


@router.patch("/me")
async def update_my_profile(
    request: Request,
    profile_data: ProfileUpdate,
    db: AsyncSession = Depends(get_db)
):
    """Update current user's profile"""
    user_id = await get_current_user_id(request)
    
    profile = await profile_service.update_profile(db, user_id, profile_data)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return {
        "success": True,
        "message": "Profile updated successfully",
        "data": ProfileResponse.model_validate(profile)
    }


@router.put("/me/cv")
async def update_cv(
    request: Request,
    cv_data: CVData,
    db: AsyncSession = Depends(get_db)
):
    """
    Update CV data
    ATURAN BISNIS: Data demografis tetap di database, tidak dikirim ke AI
    """
    user_id = await get_current_user_id(request)
    
    profile = await profile_service.update_cv_data(db, user_id, cv_data)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    is_cv_complete = await profile_service.is_cv_complete(profile)
    
    return {
        "success": True,
        "message": "CV updated successfully",
        "data": {
            "profile": ProfileResponse.model_validate(profile),
            "is_cv_complete": is_cv_complete
        }
    }


@router.post("/me/upload-avatar")
async def upload_avatar(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """Upload avatar photo to Cloudinary"""
    user_id = await get_current_user_id(request)
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Read file bytes
    file_bytes = await file.read()
    
    # Upload to Cloudinary
    result = await cloudinary_service.upload_avatar(file_bytes, user_id)
    
    # Update profile with URL
    profile = await profile_service.update_profile(
        db, user_id, 
        ProfileUpdate(url_foto_cv=result['secure_url'])
    )
    
    return {
        "success": True,
        "message": "Avatar uploaded successfully",
        "data": {
            "url": result['secure_url'],
            "profile": ProfileResponse.model_validate(profile)
        }
    }


@router.post("/me/upload-cv-photo")
async def upload_cv_photo(
    request: Request,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_db)
):
    """
    Upload CV photo (3x4) to Cloudinary
    Untuk CV formal
    """
    user_id = await get_current_user_id(request)
    
    # Validate file type
    if not file.content_type or not file.content_type.startswith('image/'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be an image"
        )
    
    # Read file bytes
    file_bytes = await file.read()
    
    # Upload to Cloudinary
    result = await cloudinary_service.upload_cv_photo(file_bytes, user_id)
    
    # Update profile with URL
    profile = await profile_service.update_profile(
        db, user_id,
        ProfileUpdate(url_foto_cv=result['secure_url'])
    )
    
    return {
        "success": True,
        "message": "CV photo uploaded successfully",
        "data": {
            "url": result['secure_url'],
            "profile": ProfileResponse.model_validate(profile)
        }
    }


@router.get("/me/check-cv")
async def check_cv_completeness(
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Check if CV is complete enough for interview"""
    user_id = await get_current_user_id(request)
    
    profile = await profile_service.get_profile_by_id(db, user_id)
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    is_complete = await profile_service.is_cv_complete(profile)
    
    return {
        "success": True,
        "data": {
            "is_complete": is_complete,
            "missing_fields": [] if is_complete else ["ringkasan_profesional", "pengalaman_kerja"]
        }
    }
