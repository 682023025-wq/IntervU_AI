"""
Session Service - Business logic untuk manajemen sesi wawancara
"""
from typing import Optional, Dict, Any, List
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.base import SesiWawancara, PesanWawancara
from datetime import datetime, timezone


class SessionService:
    """Service untuk operasi sesi wawancara"""
    
    @staticmethod
    async def create_session(
        db: AsyncSession,
        id_profil: str,
        mode: str,
        posisi_target: str,
        bahasa: str = 'id'
    ) -> SesiWawancara:
        """Create new interview session"""
        session = SesiWawancara(
            id_profil=id_profil,
            mode=mode,
            posisi_target=posisi_target,
            bahasa=bahasa,
            status='berlangsung',
            total_pertanyaan=0
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def get_session_by_id(
        db: AsyncSession,
        session_id: str
    ) -> Optional[SesiWawancara]:
        """Get session by ID"""
        result = await db.execute(
            select(SesiWawancara).where(SesiWawancara.id == session_id)
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_active_session(
        db: AsyncSession,
        profile_id: str
    ) -> Optional[SesiWawancara]:
        """Get active session for a profile"""
        result = await db.execute(
            select(SesiWawancara)
            .where(SesiWawancara.id_profil == profile_id)
            .where(SesiWawancara.status == 'berlangsung')
            .order_by(SesiWawancara.dimulai_pada.desc())
        )
        return result.scalar_one_or_none()
    
    @staticmethod
    async def get_sessions_by_profile(
        db: AsyncSession,
        profile_id: str,
        limit: int = 10
    ) -> List[SesiWawancara]:
        """Get recent sessions for a profile"""
        result = await db.execute(
            select(SesiWawancara)
            .where(SesiWawancara.id_profil == profile_id)
            .order_by(SesiWawancara.dimulai_pada.desc())
            .limit(limit)
        )
        return result.scalars().all()
    
    @staticmethod
    async def update_session(
        db: AsyncSession,
        session_id: str,
        update_data: Dict[str, Any]
    ) -> Optional[SesiWawancara]:
        """Update session data"""
        session = await SessionService.get_session_by_id(db, session_id)
        if not session:
            return None
        
        for field, value in update_data.items():
            if value is not None:
                setattr(session, field, value)
        
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def complete_session(
        db: AsyncSession,
        session_id: str,
        skor_akhir: int,
        evaluasi_ai: Dict[str, Any],
        metrik_non_verbal: Optional[Dict[str, Any]] = None
    ) -> Optional[SesiWawancara]:
        """Mark session as completed with evaluation"""
        session = await SessionService.get_session_by_id(db, session_id)
        if not session:
            return None
        
        session.status = 'selesai'
        session.selesai_pada = datetime.now(timezone.utc)
        session.skor_akhir = skor_akhir
        session.evaluasi_ai = evaluasi_ai
        session.metrik_non_verbal = metrik_non_verbal
        
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def abandon_session(
        db: AsyncSession,
        session_id: str
    ) -> Optional[SesiWawancara]:
        """Mark session as abandoned"""
        session = await SessionService.get_session_by_id(db, session_id)
        if not session:
            return None
        
        session.status = 'ditinggalkan'
        session.selesai_pada = datetime.now(timezone.utc)
        
        await db.commit()
        await db.refresh(session)
        return session
    
    @staticmethod
    async def increment_question_count(
        db: AsyncSession,
        session_id: str
    ) -> Optional[SesiWawancara]:
        """Increment question count"""
        session = await SessionService.get_session_by_id(db, session_id)
        if not session:
            return None
        
        session.total_pertanyaan += 1
        await db.commit()
        await db.refresh(session)
        return session


# Singleton instance
session_service = SessionService()
