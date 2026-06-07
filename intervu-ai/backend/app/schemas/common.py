"""Pydantic Schemas untuk validasi data"""

from pydantic import BaseModel, Field, EmailStr, ConfigDict, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime
from uuid import UUID


# ==========================================
# COMMON SCHEMAS
# ==========================================

class BaseResponse(BaseModel):
    """Schema response umum"""
    success: bool = True
    message: str = "Operation successful"
    data: Optional[Any] = None


class PaginationParams(BaseModel):
    """Schema untuk pagination"""
    page: int = Field(default=1, ge=1)
    limit: int = Field(default=20, ge=1, le=100)


class PaginationResponse(BaseModel):
    """Schema response dengan pagination"""
    items: List[Any]
    total: int
    page: int
    limit: int
    pages: int


# ==========================================
# PROFILE SCHEMAS
# ==========================================

class CVData(BaseModel):
    """Schema untuk data_cv - TIDAK termasuk data demografis (Fair AI)"""
    ringkasan_profesional: Optional[str] = None
    pendidikan: Optional[List[Dict[str, Any]]] = None
    pengalaman_kerja: Optional[List[Dict[str, Any]]] = None
    keahlian: Optional[List[str]] = None
    proyek: Optional[List[Dict[str, Any]]] = None
    sertifikasi: Optional[List[Dict[str, Any]]] = None
    bahasa: Optional[List[str]] = None


class ProfileBase(BaseModel):
    """Schema dasar untuk profile"""
    nama_lengkap: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    telepon: Optional[str] = Field(None, max_length=20)
    posisi_target: Optional[str] = Field(None, max_length=100)
    bahasa_preferensi: str = Field(default='id', pattern='^(id|en)$')


class ProfileCreate(ProfileBase):
    """Schema untuk membuat profile baru"""
    id: UUID
    penyedia_auth: str = Field(default='google', pattern='^(google|email)$')


class ProfileUpdate(BaseModel):
    """Schema untuk update profile"""
    nama_lengkap: Optional[str] = Field(None, min_length=1, max_length=100)
    telepon: Optional[str] = Field(None, max_length=20)
    posisi_target: Optional[str] = Field(None, max_length=100)
    bahasa_preferensi: Optional[str] = Field(None, pattern='^(id|en)$')
    url_foto_cv: Optional[str] = None
    data_cv: Optional[CVData] = None


class ProfileResponse(ProfileBase):
    """Schema response untuk profile"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    tanggal_lahir: Optional[datetime] = None
    jenis_kelamin: Optional[str] = None
    url_avatar: Optional[str] = None
    url_foto_cv: Optional[str] = None
    penyedia_auth: str
    data_cv: Dict[str, Any] = {}
    tanggal_dibuat: datetime
    tanggal_diperbarui: datetime
    
    @field_validator('jenis_kelamin')
    @classmethod
    def validate_jenis_kelamin(cls, v):
        if v and v not in ['pria', 'wanita', 'prefer_tidak_menyebutkan']:
            raise ValueError('jenis_kelamin harus salah satu dari: pria, wanita, prefer_tidak_menyebutkan')
        return v


class ProfileWithCVComplete(ProfileResponse):
    """Profile response dengan indikator kelengkapan CV"""
    is_cv_complete: bool = False


# ==========================================
# SESSION SCHEMAS
# ==========================================

class SesiWawancaraBase(BaseModel):
    """Schema dasar untuk sesi wawancara"""
    mode: str = Field(..., pattern='^(teks|audio|video)$')
    posisi_target: str = Field(..., min_length=1, max_length=100)
    bahasa: str = Field(default='id', pattern='^(id|en)$')


class SesiWawancaraCreate(SesiWawancaraBase):
    """Schema untuk membuat sesi baru"""
    pass


class SesiWawancaraResponse(SesiWawancaraBase):
    """Schema response untuk sesi"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    id_profil: UUID
    status: str
    total_pertanyaan: int = 0
    skor_akhir: Optional[int] = None
    evaluasi_ai: Optional[Dict[str, Any]] = None
    metrik_non_verbal: Optional[Dict[str, Any]] = None
    dimulai_pada: datetime
    selesai_pada: Optional[datetime] = None


class SesiWawancaraUpdate(BaseModel):
    """Schema untuk update sesi"""
    status: Optional[str] = Field(None, pattern='^(berlangsung|selesai|ditinggalkan)$')
    skor_akhir: Optional[int] = Field(None, ge=0, le=100)
    evaluasi_ai: Optional[Dict[str, Any]] = None
    metrik_non_verbal: Optional[Dict[str, Any]] = None
    selesai_pada: Optional[datetime] = None


# ==========================================
# MESSAGE SCHEMAS
# ==========================================

class PesanWawancaraBase(BaseModel):
    """Schema dasar untuk pesan"""
    peran: str = Field(..., pattern='^(pewawancara|kandidat)$')
    isi: str = Field(..., min_length=1)


class PesanWawancaraCreate(PesanWawancaraBase):
    """Schema untuk membuat pesan baru"""
    urutan_pesan: int


class PesanWawancaraResponse(PesanWawancaraBase):
    """Schema response untuk pesan"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    id_sesi: UUID
    diedit_pengguna: bool = False
    urutan_pesan: int
    dibuat_pada: datetime


class ChatMessage(BaseModel):
    """Schema untuk chat request/response"""
    message: str
    session_id: UUID


# ==========================================
# RECOMMENDATION SCHEMAS
# ==========================================

class RekomendasiKarirBase(BaseModel):
    """Schema dasar untuk rekomendasi karir"""
    posisi_direkomendasikan: Dict[str, Any]
    perusahaan_direkomendasikan: Optional[Dict[str, Any]] = None
    alasan_rekomendasi: Optional[str] = None


class RekomendasiKarirResponse(RekomendasiKarirBase):
    """Schema response untuk rekomendasi"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    id_profil: UUID
    dibuat_pada: datetime


# ==========================================
# JOB LISTING SCHEMAS
# ==========================================

class LowonganKarirBase(BaseModel):
    """Schema dasar untuk lowongan"""
    judul_pekerjaan: str = Field(..., min_length=1, max_length=255)
    nama_perusahaan: Optional[str] = Field(None, max_length=255)
    lokasi: Optional[str] = Field(None, max_length=255)
    tipe_pekerjaan: Optional[str] = Field(None, max_length=50)
    gaji_min: Optional[int] = None
    gaji_maks: Optional[int] = None
    deskripsi: Optional[str] = None
    url_lamaran: Optional[str] = None
    sumber: str = Field(default='jsearch', max_length=50)
    posisi_cocok: Optional[str] = Field(None, max_length=100)
    skor_kecocokan: Optional[int] = Field(None, ge=0, le=100)


class LowonganKarirResponse(LowonganKarirBase):
    """Schema response untuk lowongan"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    id_profil: UUID
    id_eksternal: Optional[str] = None
    diambil_pada: datetime
    dibuat_pada: datetime


# ==========================================
# CV SUGGESTION SCHEMAS
# ==========================================

class SaranPerbaikanCVBase(BaseModel):
    """Schema dasar untuk saran perbaikan CV"""
    bagian_cv: str = Field(..., min_length=1, max_length=100)
    teks_asli: Optional[str] = None
    teks_saran_ai: str = Field(..., min_length=1)
    alasan_perbaikan: Optional[str] = None


class SaranPerbaikanCVCreate(SaranPerbaikanCVBase):
    """Schema untuk membuat saran baru"""
    id_sesi: UUID


class SaranPerbaikanCVResponse(SaranPerbaikanCVBase):
    """Schema response untuk saran"""
    model_config = ConfigDict(from_attributes=True)
    
    id: UUID
    id_profil: UUID
    id_sesi: UUID
    status: str
    dibuat_pada: datetime
    ditindaklanjuti_pada: Optional[datetime] = None


class SaranPerbaikanCVAction(BaseModel):
    """Schema untuk aksi pada saran CV"""
    action: str = Field(..., pattern='^(terima|tolak|edit)$')
    teks_final: Optional[str] = None  # Digunakan jika action='edit'
