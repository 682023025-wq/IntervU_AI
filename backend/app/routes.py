"""
API Routes untuk IntervU AI Backend.
Semua endpoint dilindungi dengan authentication kecuali health check.
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID
import httpx

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.database import get_db
from app.auth import get_current_user
from app.models import (
    Profile, SesiWawancara, PesanWawancara, 
    RekomendasiKarir, LowonganKarir, SaranPerbaikanCV
)
from app.schemas import (
    ProfileResponse, ProfileUpdate,
    SesiWawancaraCreate, SesiWawancaraResponse,
    PesanWawancaraCreate, PesanWawancaraResponse,
    RekomendasiKarirResponse,
    LowonganKarirResponse,
    SaranPerbaikanCVCreate, SaranPerbaikanCVUpdate, SaranPerbaikanCVResponse
)
from app.ai_service import (
    generate_ai_response, 
    generate_interview_question,
    evaluate_interview_performance,
    analyze_cv_for_recommendations
)
from app.config import settings


router = APIRouter(prefix="/api/v1", tags=["IntervU AI"])


# ==========================================
# PROFILE ENDPOINTS
# ==========================================

@router.get("/profiles/me", response_model=ProfileResponse)
async def get_my_profile(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mendapatkan profil pengguna yang sedang login.
    """
    user_id = UUID(current_user["sub"])
    
    result = await db.execute(
        select(Profile).where(Profile.id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil tidak ditemukan"
        )
    
    return profile


@router.put("/profiles/me", response_model=ProfileResponse)
async def update_my_profile(
    profile_update: ProfileUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update profil pengguna yang sedang login.
    Hanya field yang disediakan yang akan diupdate.
    """
    user_id = UUID(current_user["sub"])
    
    result = await db.execute(
        select(Profile).where(Profile.id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil tidak ditemukan"
        )
    
    # Update hanya field yang disediakan
    update_data = profile_update.model_dump(exclude_unset=True)
    
    # Handle data_cv khusus (convert Pydantic model ke dict)
    if "data_cv" in update_data and update_data["data_cv"]:
        if hasattr(update_data["data_cv"], 'model_dump'):
            update_data["data_cv"] = update_data["data_cv"].model_dump()
    
    for field, value in update_data.items():
        if value is not None:
            setattr(profile, field, value)
    
    profile.tanggal_diperbarui = datetime.utcnow()
    
    await db.commit()
    await db.refresh(profile)
    
    return profile


# ==========================================
# SESI WAWANCARA ENDPOINTS
# ==========================================

@router.post("/sessions", response_model=SesiWawancaraResponse)
async def create_session(
    session_data: SesiWawancaraCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Membuat sesi wawancara baru.
    """
    user_id = UUID(current_user["sub"])
    
    # Verifikasi profil user ada
    result = await db.execute(
        select(Profile).where(Profile.id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil tidak ditemukan"
        )
    
    # Buat sesi baru
    from uuid import uuid4
    new_session = SesiWawancara(
        id=uuid4(),
        id_profil=user_id,
        mode=session_data.mode,
        posisi_target=session_data.posisi_target,
        bahasa=session_data.bahasa,
        status="berlangsung",
        total_pertanyaan=0
    )
    
    db.add(new_session)
    await db.commit()
    await db.refresh(new_session)
    
    return new_session


@router.get("/sessions", response_model=List[SesiWawancaraResponse])
async def get_my_sessions(
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mendapatkan semua sesi wawancara pengguna.
    Bisa difilter berdasarkan status.
    """
    user_id = UUID(current_user["sub"])
    
    query = select(SesiWawancara).where(SesiWawancara.id_profil == user_id)
    
    if status_filter:
        query = query.where(SesiWawancara.status == status_filter)
    
    query = query.order_by(SesiWawancara.dimulai_pada.desc())
    
    result = await db.execute(query)
    sessions = result.scalars().all()
    
    return sessions


@router.get("/sessions/{session_id}", response_model=SesiWawancaraResponse)
async def get_session_detail(
    session_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mendapatkan detail sesi wawancara tertentu.
    """
    user_id = UUID(current_user["sub"])
    
    result = await db.execute(
        select(SesiWawancara).where(
            SesiWawancara.id == session_id,
            SesiWawancara.id_profil == user_id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sesi tidak ditemukan atau bukan milik Anda"
        )
    
    return session


# ==========================================
# PESAN WAWANCARA ENDPOINTS
# ==========================================

@router.get("/sessions/{session_id}/messages", response_model=List[PesanWawancaraResponse])
async def get_session_messages(
    session_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mendapatkan semua pesan dalam sesi wawancara.
    """
    user_id = UUID(current_user["sub"])
    
    # Verifikasi sesi milik user
    result = await db.execute(
        select(SesiWawancara).where(
            SesiWawancara.id == session_id,
            SesiWawancara.id_profil == user_id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sesi tidak ditemukan atau bukan milik Anda"
        )
    
    # Ambil pesan diurutkan berdasarkan urutan
    result = await db.execute(
        select(PesanWawancara)
        .where(PesanWawancara.id_sesi == session_id)
        .order_by(PesanWawancara.urutan_pesan)
    )
    messages = result.scalars().all()
    
    return messages


@router.post("/sessions/{session_id}/messages", response_model=PesanWawancaraResponse)
async def send_message(
    session_id: UUID,
    message_data: PesanWawancaraCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mengirim pesan dalam sesi wawancara.
    Jika kandidat mengirim pesan, AI akan merespons otomatis.
    """
    user_id = UUID(current_user["sub"])
    
    # Verifikasi sesi milik user
    result = await db.execute(
        select(SesiWawancara).where(
            SesiWawancara.id == session_id,
            SesiWawancara.id_profil == user_id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sesi tidak ditemukan atau bukan milik Anda"
        )
    
    if session.status != "berlangsung":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sesi sudah selesai atau ditinggalkan"
        )
    
    # Hitung urutan pesan berikutnya
    result = await db.execute(
        select(func.max(PesanWawancara.urutan_pesan))
        .where(PesanWawancara.id_sesi == session_id)
    )
    max_urutan = result.scalar() or 0
    next_urutan = max_urutan + 1
    
    # Simpan pesan kandidat
    from uuid import uuid4
    candidate_message = PesanWawancara(
        id=uuid4(),
        id_sesi=session_id,
        peran=message_data.peran,
        isi=message_data.isi,
        diedit_pengguna=message_data.diedit_pengguna,
        urutan_pesan=next_urutan
    )
    
    db.add(candidate_message)
    
    # Jika ini pesan dari kandidat, generate respons AI
    if message_data.peran == "kandidat":
        # Ambil history percakapan
        result = await db.execute(
            select(PesanWawancara)
            .where(PesanWawancara.id_sesi == session_id)
            .order_by(PesanWawancara.urutan_pesan)
        )
        all_messages = result.scalars().all()
        
        history = [
            {"role": msg.peran if msg.peran == "pewawancara" else "user", "content": msg.isi}
            for msg in all_messages
        ]
        
        # Generate pertanyaan/respons AI
        system_prompt = f"""
        Anda adalah pewawancara profesional untuk posisi {session.posisi_target}.
        Anda sedang conducting wawancara kerja dalam bahasa {session.bahasa}.
        
        Panduan:
        - Ajukan pertanyaan satu per satu
        - Bersikap profesional dan ramah
        - Evaluasi jawaban kandidat
        - Jangan tanyakan tentang data demografis (Fair AI)
        """
        
        ai_response = await generate_ai_response(
            system_prompt=system_prompt,
            user_message=message_data.isi,
            history=history[:-1]  # Exclude current message from history
        )
        
        # Simpan respons AI
        ai_message = PesanWawancara(
            id=uuid4(),
            id_sesi=session_id,
            peran="pewawancara",
            isi=ai_response,
            diedit_pengguna=False,
            urutan_pesan=next_urutan + 1
        )
        
        db.add(ai_message)
        session.total_pertanyaan += 1
    
    await db.commit()
    await db.refresh(candidate_message)
    
    return candidate_message


@router.post("/sessions/{session_id}/complete")
async def complete_session(
    session_id: UUID,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Menyelesaikan sesi wawancara dan mendapatkan evaluasi AI.
    """
    user_id = UUID(current_user["sub"])
    
    result = await db.execute(
        select(SesiWawancara).where(
            SesiWawancara.id == session_id,
            SesiWawancara.id_profil == user_id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sesi tidak ditemukan atau bukan milik Anda"
        )
    
    if session.status != "berlangsung":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Sesi sudah selesai"
        )
    
    # Ambil semua pesan untuk evaluasi
    result = await db.execute(
        select(PesanWawancara)
        .where(PesanWawancara.id_sesi == session_id)
        .order_by(PesanWawancara.urutan_pesan)
    )
    messages = result.scalars().all()
    
    chat_history = [
        {"role": msg.peran if msg.peran == "pewawancara" else "user", "content": msg.isi}
        for msg in messages
    ]
    
    # Evaluasi performa
    evaluation = await evaluate_interview_performance(
        chat_history=chat_history,
        posisi=session.posisi_target
    )
    
    # Update sesi dengan hasil evaluasi
    session.status = "selesai"
    session.selesai_pada = datetime.utcnow()
    session.evaluasi_ai = evaluation
    session.skor_akhir = evaluation.get("skor", 0)
    
    await db.commit()
    
    return {
        "message": "Sesi wawancara selesai",
        "evaluasi": evaluation
    }


# ==========================================
# REKOMENDASI KARIR ENDPOINTS
# ==========================================

@router.get("/recommendations", response_model=List[RekomendasiKarirResponse])
async def get_my_recommendations(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mendapatkan semua rekomendasi karir untuk pengguna.
    """
    user_id = UUID(current_user["sub"])
    
    result = await db.execute(
        select(RekomendasiKarir)
        .where(RekomendasiKarir.id_profil == user_id)
        .order_by(RekomendasiKarir.dibuat_pada.desc())
    )
    recommendations = result.scalars().all()
    
    return recommendations


@router.post("/recommendations/generate")
async def generate_recommendations(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate rekomendasi karir baru berdasarkan CV pengguna.
    """
    from uuid import uuid4
    
    user_id = UUID(current_user["sub"])
    
    # Ambil profil dengan data_cv
    result = await db.execute(
        select(Profile).where(Profile.id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil tidak ditemukan"
        )
    
    if not profile.data_cv:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data CV belum diisi. Silakan update profil terlebih dahulu."
        )
    
    # Analisis CV dengan AI
    analysis_result = await analyze_cv_for_recommendations(cv_data=profile.data_cv)
    
    # Parse hasil analisis (sederhana - production perlu parsing yang lebih robust)
    # Di sini kita simpan sebagai text dulu
    new_recommendation = RekomendasiKarir(
        id=uuid4(),
        id_profil=user_id,
        posisi_direkomendasikan={"analysis": analysis_result},
        perusahaan_direkomendasikan={},
        alasan_rekomendasi=analysis_result[:500] if len(analysis_result) > 500 else analysis_result
    )
    
    db.add(new_recommendation)
    await db.commit()
    await db.refresh(new_recommendation)
    
    return new_recommendation


# ==========================================
# LOWONGAN KARIR ENDPOINTS
# ==========================================

@router.get("/jobs", response_model=List[LowonganKarirResponse])
async def get_my_jobs(
    limit: int = Query(20, ge=1, le=100),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mendapatkan lowongan karir yang relevan untuk pengguna.
    """
    user_id = UUID(current_user["sub"])
    
    result = await db.execute(
        select(LowonganKarir)
        .where(LowonganKarir.id_profil == user_id)
        .order_by(LowonganKarir.dibuat_pada.desc())
        .limit(limit)
    )
    jobs = result.scalars().all()
    
    return jobs


@router.post("/jobs/fetch")
async def fetch_jobs(
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Fetch lowongan kerja baru dari API eksternal (JSearch/LinkedIn).
    Note: Implementasi actual memerlukan integrasi dengan JSearch API.
    """
    from uuid import uuid4
    
    user_id = UUID(current_user["sub"])
    
    # Ambil profil untuk mendapatkan posisi_target
    result = await db.execute(
        select(Profile).where(Profile.id == user_id)
    )
    profile = result.scalar_one_or_none()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profil tidak ditemukan"
        )
    
    posisi_target = profile.posisi_target or "Software Engineer"
    
    # TODO: Implementasi actual call ke JSearch API
    # Di sini kita buat dummy job untuk demonstrasi
    dummy_job = LowonganKarir(
        id=uuid4(),
        id_profil=user_id,
        id_eksternal=f"ext_{uuid4()}",
        judul_pekerjaan=f"{posisi_target} - Example Company",
        nama_perusahaan="Example Company",
        lokasi="Jakarta, Indonesia",
        tipe_pekerjaan="Full-time",
        gaji_min=10000000,
        gaji_maks=20000000,
        deskripsi=f"Kami mencari {posisi_target} yang berpengalaman...",
        url_lamaran="https://example.com/apply",
        sumber="jsearch",
        posisi_cocok=posisi_target,
        skor_kecocokan=85
    )
    
    db.add(dummy_job)
    await db.commit()
    await db.refresh(dummy_job)
    
    return {"message": "Lowongan berhasil ditambahkan", "job": dummy_job}


# ==========================================
# SARAN PERBAIKAN CV ENDPOINTS
# ==========================================

@router.get("/cv-suggestions", response_model=List[SaranPerbaikanCVResponse])
async def get_my_cv_suggestions(
    session_id: Optional[UUID] = Query(None, description="Filter by session ID"),
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mendapatkan semua saran perbaikan CV untuk pengguna.
    """
    user_id = UUID(current_user["sub"])
    
    query = select(SaranPerbaikanCV).where(SaranPerbaikanCV.id_profil == user_id)
    
    if session_id:
        query = query.where(SaranPerbaikanCV.id_sesi == session_id)
    
    query = query.order_by(SaranPerbaikanCV.dibuat_pada.desc())
    
    result = await db.execute(query)
    suggestions = result.scalars().all()
    
    return suggestions


@router.post("/sessions/{session_id}/cv-suggestions", response_model=SaranPerbaikanCVResponse)
async def create_cv_suggestion(
    session_id: UUID,
    suggestion_data: SaranPerbaikanCVCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Membuat saran perbaikan CV baru (biasanya dari AI setelah wawancara).
    """
    from uuid import uuid4
    
    user_id = UUID(current_user["sub"])
    
    # Verifikasi sesi milik user
    result = await db.execute(
        select(SesiWawancara).where(
            SesiWawancara.id == session_id,
            SesiWawancara.id_profil == user_id
        )
    )
    session = result.scalar_one_or_none()
    
    if not session:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Sesi tidak ditemukan atau bukan milik Anda"
        )
    
    new_suggestion = SaranPerbaikanCV(
        id=uuid4(),
        id_profil=user_id,
        id_sesi=session_id,
        bagian_cv=suggestion_data.bagian_cv,
        teks_asli=suggestion_data.teks_asli,
        teks_saran_ai=suggestion_data.teks_saran_ai,
        alasan_perbaikan=suggestion_data.alasan_perbaikan,
        status="menunggu"
    )
    
    db.add(new_suggestion)
    await db.commit()
    await db.refresh(new_suggestion)
    
    return new_suggestion


@router.patch("/cv-suggestions/{suggestion_id}", response_model=SaranPerbaikanCVResponse)
async def update_cv_suggestion(
    suggestion_id: UUID,
    suggestion_update: SaranPerbaikanCVUpdate,
    current_user: dict = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Update status saran perbaikan CV (diterima/ditolak).
    """
    user_id = UUID(current_user["sub"])
    
    result = await db.execute(
        select(SaranPerbaikanCV).where(
            SaranPerbaikanCV.id == suggestion_id,
            SaranPerbaikanCV.id_profil == user_id
        )
    )
    suggestion = result.scalar_one_or_none()
    
    if not suggestion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Saran tidak ditemukan atau bukan milik Anda"
        )
    
    # Update status
    suggestion.status = suggestion_update.status
    
    # Jika diterima atau diedit, set timestamp tindak lanjut
    if suggestion.status in ["diterima", "diedit_dan_diterima"]:
        suggestion.ditindaklanjuti_pada = datetime.utcnow()
        
        # Jika ada teks diedit, update saran AI
        if suggestion_update.teks_diedit:
            suggestion.teks_saran_ai = suggestion_update.teks_diedit
    
    await db.commit()
    await db.refresh(suggestion)
    
    return suggestion


# ==========================================
# CLOUDINARY CLEANUP ENDPOINT
# ==========================================

@router.post("/cloudinary/delete")
async def delete_cloudinary_image(
    request_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """
    Hapus gambar dari Cloudinary saat user mengganti atau menghapus foto CV.
    Hanya public_id yang akan dihapus dari Cloudinary.
    """
    public_id = request_data.get("public_id")
    
    if not public_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="public_id diperlukan"
        )
    
    # Validasi Cloudinary credentials
    if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY or not settings.CLOUDINARY_API_SECRET:
        # Log warning tapi jangan fail, mungkin menggunakan free tier tanpa cleanup
        print(f"⚠️ Cloudinary credentials tidak lengkap, skip cleanup untuk {public_id}")
        return {"status": "skipped", "message": "Cloudinary credentials tidak lengkap"}
    
    try:
        import base64
        import hashlib
        import time
        
        # Generate signature untuk Cloudinary API
        timestamp = int(time.time())
        to_sign = f"public_id={public_id}&timestamp={timestamp}{settings.CLOUDINARY_API_SECRET}"
        signature = hashlib.sha1(to_sign.encode()).hexdigest()
        
        # Call Cloudinary Admin API untuk delete
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"https://api.cloudinary.com/v1_1/{settings.CLOUDINARY_CLOUD_NAME}/image/destroy",
                params={
                    "public_id": public_id,
                    "api_key": settings.CLOUDINARY_API_KEY,
                    "timestamp": timestamp,
                    "signature": signature
                }
            )
            
            if response.status_code == 200:
                result = response.json()
                if result.get("result") == "ok":
                    print(f"✅ Image deleted from Cloudinary: {public_id}")
                    return {"status": "success", "message": "Image deleted successfully"}
                else:
                    print(f"⚠️ Cloudinary delete failed: {result}")
                    return {"status": "failed", "message": "Failed to delete image", "detail": result}
            else:
                print(f"❌ Cloudinary API error: {response.status_code} - {response.text}")
                return {"status": "error", "message": f"Cloudinary API error: {response.status_code}"}
                
    except Exception as e:
        print(f"❌ Error deleting image from Cloudinary: {e}")
        # Jangan throw error ke user, log saja
        return {"status": "error", "message": str(e)}


# ==========================================
# HEALTH CHECK ENDPOINT
# ==========================================

@router.get("/health")
async def health_check():
    """
    Health check endpoint untuk monitoring.
    """
    return {
        "status": "healthy",
        "service": "IntervU AI Backend",
        "timestamp": datetime.utcnow().isoformat()
    }
