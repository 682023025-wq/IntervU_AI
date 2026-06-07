"""
Profile Service - Business logic untuk manajemen profil dan CV
"""
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.base import Profile
from app.schemas.common import ProfileUpdate, CVData
from datetime import datetime, timezone


class ProfileService:
    """Service untuk operasi profil user"""
    
    @staticmethod
    async def get_profile_by_id(db: AsyncSession, profile_id: str) -> Optional[Profile]:
        """Get profile by ID"""
        result = await db.execute(
            select(Profile).where(Profile.id == profile_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_profile_by_email(db: AsyncSession, email: str) -> Optional[Profile]:
        """Get profile by email"""
        result = await db.execute(
            select(Profile).where(Profile.email == email)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def create_profile(
        db: AsyncSession,
        profile_data: Dict[str, Any]
    ) -> Profile:
        """Create new profile (biasanya dipanggil oleh trigger Supabase)"""
        profile = Profile(**profile_data)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
        return profile
    
    @staticmethod
    async def update_profile(
        db: AsyncSession,
        profile_id: str,
        update_data: ProfileUpdate
    ) -> Optional[Profile]:
        """Update profile data"""
        profile = await ProfileService.get_profile_by_id(db, profile_id)
        if not profile:
            return None
        
        # Update fields
        update_dict = update_data.model_dump(exclude_unset=True)
        for field, value in update_dict.items():
            if value is not None:
                setattr(profile, field, value)
        
        profile.tanggal_diperbarui = datetime.now(timezone.utc)
        
        await db.commit()
        await db.refresh(profile)
        return profile
    
    @staticmethod
    async def update_cv_data(
        db: AsyncSession,
        profile_id: str,
        cv_data: CVData
    ) -> Optional[Profile]:
        """
        Update CV data - FAIR AI IMPLEMENTATION
        Data demografis tetap di database tapi tidak dikirim ke AI
        """
        profile = await ProfileService.get_profile_by_id(db, profile_id)
        if not profile:
            return None
        
        # Merge CV data
        current_cv = profile.data_cv or {}
        new_cv = cv_data.model_dump(exclude_none=True)
        current_cv.update(new_cv)
        
        profile.data_cv = current_cv
        profile.tanggal_diperbarui = datetime.now(timezone.utc)
        
        await db.commit()
        await db.refresh(profile)
        return profile
    
    @staticmethod
    async def is_cv_complete(profile: Profile) -> bool:
        """
        Check if CV is complete enough for interview
        Minimal: ringkasan_profesional + 1 pengalaman_kerja OR pendidikan
        """
        data_cv = profile.data_cv
        if not data_cv:
            return False
        
        has_summary = bool(data_cv.get('ringkasan_profesional'))
        has_experience = bool(data_cv.get('pengalaman_kerja'))
        has_education = bool(data_cv.get('pendidikan'))
        
        return has_summary and (has_experience or has_education)
    
    @staticmethod
    async def get_profiles_without_cv(db: AsyncSession) -> List[Profile]:
        """Get all profiles with empty CV (for analytics)"""
        result = await db.execute(
            select(Profile).where(
                Profile.data_cv == {}
            )
        )
        return result.scalars().all()


# Singleton instance
profile_service = ProfileService()
