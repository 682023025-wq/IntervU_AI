"""
Pydantic Schemas untuk validasi dan serialisasi data User/Profile.
Schema ini digunakan untuk request/response validation di API endpoints.
"""
from pydantic import BaseModel, Field, EmailStr, field_validator, ConfigDict
from typing import Optional, List, Dict, Any
from datetime import date, datetime
import uuid


# ==========================================
# CV DATA SCHEMA
# ==========================================
class PendidikanSchema(BaseModel):
    """Schema untuk pendidikan dalam CV."""
    institusi: str = Field(..., description="Nama institusi pendidikan")
    jurusan: str = Field(..., description="Jurusan/program studi")
    gelar: Optional[str] = Field(None, description="Gelar yang diperoleh")
    tanggal_mulai: Optional[str] = Field(None, description="Tanggal mulai (YYYY-MM)")
    tanggal_selesai: Optional[str] = Field(None, description="Tanggal selesai (YYYY-MM)")
    ipk: Optional[str] = Field(None, description="IPK/nilai akhir")
    deskripsi: Optional[str] = Field(None, description="Deskripsi tambahan")


class PengalamanKerjaSchema(BaseModel):
    """Schema untuk pengalaman kerja dalam CV."""
    perusahaan: str = Field(..., description="Nama perusahaan")
    posisi: str = Field(..., description="Posisi/jabatan")
    lokasi: Optional[str] = Field(None, description="Lokasi pekerjaan")
    tanggal_mulai: Optional[str] = Field(None, description="Tanggal mulai (YYYY-MM)")
    tanggal_selesai: Optional[str] = Field(None, description="Tanggal selesai (YYYY-MM) atau 'present'")
    deskripsi: Optional[List[str]] = Field(None, description="Daftar tanggung jawab/pencapaian")


class PengalamanOrganisasiSchema(BaseModel):
    """Schema untuk pengalaman organisasi dalam CV."""
    organisasi: str = Field(..., description="Nama organisasi")
    posisi: str = Field(..., description="Posisi/jabatan dalam organisasi")
    tanggal_mulai: Optional[str] = Field(None, description="Tanggal mulai (YYYY-MM)")
    tanggal_selesai: Optional[str] = Field(None, description="Tanggal selesai (YYYY-MM)")
    deskripsi: Optional[str] = Field(None, description="Deskripsi aktivitas")


class KeahlianSchema(BaseModel):
    """Schema untuk keahlian dalam CV."""
    nama: str = Field(..., description="Nama keahlian")
    kategori: Optional[str] = Field(None, description="Kategori keahlian (technical, soft skill, dll)")
    level: Optional[str] = Field(None, description="Level kemahiran (beginner, intermediate, advanced)")


class CvDataSchema(BaseModel):
    """
    Schema lengkap untuk data CV terstruktur.
    Digunakan untuk validasi field JSONB data_cv.
    """
    ringkasan_profesional: Optional[str] = Field(None, description="Ringkasan profesional/career objective")
    tautan_profesional: Optional[Dict[str, str]] = Field(
        default_factory=dict,
        description="Tautan profesional (LinkedIn, GitHub, Portfolio, dll)"
    )
    pendidikan: Optional[List[PendidikanSchema]] = Field(
        default_factory=list,
        description="Riwayat pendidikan"
    )
    pengalaman_kerja: Optional[List[PengalamanKerjaSchema]] = Field(
        default_factory=list,
        description="Riwayat pengalaman kerja"
    )
    pengalaman_organisasi: Optional[List[PengalamanOrganisasiSchema]] = Field(
        default_factory=list,
        description="Riwayat pengalaman organisasi"
    )
    keahlian: Optional[List[KeahlianSchema]] = Field(
        default_factory=list,
        description="Daftar keahlian"
    )
    
    class Config:
        from_attributes = True


# ==========================================
# PROFILE SCHEMAS
# ==========================================
class ProfileBase(BaseModel):
    """Base schema untuk Profile dengan field umum."""
    nama_lengkap: str = Field(..., min_length=2, max_length=100, description="Nama lengkap user")
    email: EmailStr = Field(..., description="Email address")
    telepon: Optional[str] = Field(None, max_length=20, description="Nomor telepon")
    tanggal_lahir: Optional[date] = Field(None, description="Tanggal lahir")
    jenis_kelamin: Optional[str] = Field(None, description="Jenis kelamin")
    posisi_target: Optional[str] = Field(None, max_length=100, description="Posisi yang ditargetkan")
    bahasa_preferensi: str = Field(default="id", pattern="^(id|en)$", description="Bahasa preferensi")
    
    @field_validator('jenis_kelamin')
    @classmethod
    def validate_jenis_kelamin(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ['pria', 'wanita', 'prefer_tidak_menyebutkan']:
            raise ValueError('jenis_kelamin harus salah satu dari: pria, wanita, prefer_tidak_menyebutkan')
        return v


class ProfileCreate(ProfileBase):
    """Schema untuk membuat profile baru."""
    id: Optional[str] = Field(None, description="UUID dari Supabase Auth (opsional)")
    penyedia_auth: str = Field(default="google", pattern="^(google|email)$", description="Penyedia auth")
    url_avatar: Optional[str] = Field(None, description="URL avatar")
    url_foto_cv: Optional[str] = Field(None, description="URL foto CV")
    data_cv: CvDataSchema = Field(default_factory=CvDataSchema, description="Data CV terstruktur")


class ProfileUpdate(BaseModel):
    """Schema untuk update profile. Semua field optional."""
    nama_lengkap: Optional[str] = Field(None, min_length=2, max_length=100)
    telepon: Optional[str] = Field(None, max_length=20)
    tanggal_lahir: Optional[date] = Field(None)
    jenis_kelamin: Optional[str] = Field(None)
    url_avatar: Optional[str] = Field(None)
    url_foto_cv: Optional[str] = Field(None)
    posisi_target: Optional[str] = Field(None, max_length=100)
    bahasa_preferensi: Optional[str] = Field(None, pattern="^(id|en)$")
    data_cv: Optional[CvDataSchema] = Field(None)
    
    @field_validator('jenis_kelamin')
    @classmethod
    def validate_jenis_kelamin(cls, v: Optional[str]) -> Optional[str]:
        if v is not None and v not in ['pria', 'wanita', 'prefer_tidak_menyebutkan']:
            raise ValueError('jenis_kelamin harus salah satu dari: pria, wanita, prefer_tidak_menyebutkan')
        return v


class ProfileResponse(ProfileBase):
    """Schema untuk response profile."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(..., description="User ID (UUID)")
    url_avatar: Optional[str] = Field(None, description="URL avatar")
    url_foto_cv: Optional[str] = Field(None, description="URL foto CV")
    penyedia_auth: str = Field(..., description="Penyedia authentication")
    data_cv: CvDataSchema = Field(..., description="Data CV terstruktur")
    tanggal_dibuat: datetime = Field(..., description="Timestamp pembuatan")
    tanggal_diperbarui: datetime = Field(..., description="Timestamp update terakhir")


# ==========================================
# RESPONSE WRAPPER
# ==========================================
class ProfileListResponse(BaseModel):
    """Schema untuk response list profiles."""
    total: int = Field(..., description="Total jumlah profiles")
    profiles: List[ProfileResponse] = Field(..., description="Daftar profiles")


class MessageResponse(BaseModel):
    """Schema untuk response message sederhana."""
    message: str = Field(..., description="Pesan response")
    success: bool = Field(default=True, description="Status sukses/gagal")
