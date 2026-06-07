"""
JSearch Service - Integrasi dengan JSearch API untuk lowongan kerja
Business Logic: Caching untuk menghemat kuota API (7 hari)
"""
import httpx
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_
from app.models.base import LowonganKarir
from app.core.config import settings


class JSearchService:
    """Service untuk integrasi JSearch API dengan caching"""
    
    BASE_URL = "https://jsearch.p.rapidapi.com"
    HEADERS = {
        "x-rapidapi-key": settings.JSEARCH_API_KEY,
        "x-rapidapi-host": "jsearch.p.rapidapi.com"
    }
    
    @staticmethod
    async def search_jobs(
        db: AsyncSession,
        query: str,
        profile_id: str,
        page: int = 1,
        num_pages: int = 1
    ) -> List[Dict[str, Any]]:
        """
        Search jobs dari JSearch API dengan caching
        ATURAN BISNIS: Cache selama 7 hari untuk menghemat kuota API
        """
        # Check cache first
        cached_jobs = await JSearchService._get_cached_jobs(
            db, profile_id, query
        )
        
        if cached_jobs:
            print(f"Using cached jobs for query: {query}")
            return cached_jobs
        
        # Fetch from API
        try:
            url = f"{JSearchService.BASE_URL}/search"
            params = {
                "query": query,
                "page": page,
                "num_pages": num_pages,
                "date_posted": "month",  # Only recent jobs
                "language": "id"
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.get(url, headers=JSearchService.HEADERS, params=params)
                response.raise_for_status()
                data = response.json()
            
            jobs = data.get('data', [])
            
            # Save to cache
            await JSearchService._save_jobs_to_cache(
                db, profile_id, query, jobs
            )
            
            return jobs
            
        except Exception as e:
            print(f"JSearch API error: {e}")
            # Return cached jobs even if expired
            return await JSearchService._get_cached_jobs(db, profile_id, query, ignore_expiry=True)
    
    @staticmethod
    async def _get_cached_jobs(
        db: AsyncSession,
        profile_id: str,
        query: str,
        ignore_expiry: bool = False
    ) -> List[Dict[str, Any]]:
        """Get cached jobs from database"""
        expiry_date = datetime.now(timezone.utc) - timedelta(days=settings.CACHE_EXPIRY_DAYS)
        
        # Query for matching position
        result = await db.execute(
            select(LowonganKarir)
            .where(LowonganKarir.id_profil == profile_id)
            .where(LowonganKarir.posisi_cocok == query)
            .where(
                and_(
                    LowonganKarir.sumber == 'jsearch',
                    LowonganKarir.diambil_pada >= expiry_date
                )
            )
            .order_by(LowonganKarir.diambil_pada.desc())
            .limit(20)
        )
        
        cached = result.scalars().all()
        
        if not cached and ignore_expiry:
            # Get expired cache if no fresh cache
            result = await db.execute(
                select(LowonganKarir)
                .where(LowonganKarir.id_profil == profile_id)
                .where(LowonganKarir.posisi_cocok == query)
                .where(LowonganKarir.sumber == 'jsearch')
                .order_by(LowonganKarir.diambil_pada.desc())
                .limit(20)
            )
            cached = result.scalars().all()
        
        return [JSearchService._model_to_dict(job) for job in cached]
    
    @staticmethod
    async def _save_jobs_to_cache(
        db: AsyncSession,
        profile_id: str,
        query: str,
        jobs: List[Dict[str, Any]]
    ):
        """Save jobs to cache"""
        now = datetime.now(timezone.utc)
        
        for job_data in jobs[:20]:  # Max 20 jobs
            job = LowonganKarir(
                id_profil=profile_id,
                id_eksternal=job_data.get('job_id'),
                judul_pekerjaan=job_data.get('job_title', ''),
                nama_perusahaan=job_data.get('employer_name', ''),
                lokasi=job_data.get('job_city', '') + ', ' + job_data.get('job_country', ''),
                tipe_pekerjaan=job_data.get('job_type', ''),
                gaji_min=None,  # JSearch doesn't always provide this
                gaji_maks=None,
                deskripsi=job_data.get('job_description', ''),
                url_lamaran=job_data.get('job_apply_link', ''),
                sumber='jsearch',
                posisi_cocok=query,
                skor_kecocokan=None,  # Will be calculated later
                diambil_pada=now
            )
            db.add(job)
        
        await db.commit()
    
    @staticmethod
    def _model_to_dict(job: LowonganKarir) -> Dict[str, Any]:
        """Convert model to dict"""
        return {
            'id': str(job.id),
            'job_id': job.id_eksternal,
            'job_title': job.judul_pekerjaan,
            'employer_name': job.nama_perusahaan,
            'job_city': job.lokasi.split(',')[0] if job.lokasi else '',
            'job_country': job.lokasi.split(',')[-1] if job.lokasi else '',
            'job_type': job.tipe_pekerjaan,
            'job_description': job.deskripsi,
            'job_apply_link': job.url_lamaran,
            'cached_at': job.diambil_pada.isoformat()
        }
    
    @staticmethod
    async def get_job_by_external_id(
        db: AsyncSession,
        external_id: str
    ) -> Optional[LowonganKarir]:
        """Get job by external ID"""
        result = await db.execute(
            select(LowonganKarir).where(LowonganKarir.id_eksternal == external_id)
        )
        return result.scalar_one_or_none()


# Singleton instance
jsearch_service = JSearchService()
