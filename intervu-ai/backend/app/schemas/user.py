"""
Pydantic schemas untuk user profile.
Digunakan untuk validasi request/response di API endpoints.
"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional, List, Dict, Any
from datetime import date
from enum import Enum


class JenisKelamin(str, Enum):
    PRIA = "pria"
    WANITA = "wanita"
    PREFER_TIDAK_MENYEBUTKAN = "prefer_tidak_menyebutkan"


class PenyediaAuth(str, Enum):
    GOOGLE = "google"
    EMAIL = "email"


class BahasaPreferensi(str, Enum):
    ID = "id"
    EN = "en"


# Schema untuk CV Data (JSONB)
class TutanProfesional(BaseModel):
    platform: str
    url: str


class Pendidikan(BaseModel):
    instansi: str
    jurusan: str
    tingkat: str
    tahun_mulai: int
    tahun_selesai: Optional[int] = None


class PengalamanKerja(BaseModel):
    posisi: str
    perusahaan: str
    lokasi: str
    tanggal_mulai: str
    tanggal_selesai: Optional[str] = None
    deskripsi: Optional[str] = None


class PengalamanOrganisasi(BaseModel):
    nama: str
    role: str
    tanggal_mulai: str
    tanggal_selesai: Optional[str] = None
    deskripsi: Optional[str] = None


class CvDataSchema(BaseModel):
    """Schema untuk validasi data_cv JSONB"""
    ringkasan_profesional: Optional[str] = None
    tautan_profesional: Optional[List[TutanProfesional]] = []
    pendidikan: Optional[List[Pendidikan]] = []
    pengalaman_kerja: Optional[List[PengalamanKerja]] = []
    pengalaman_organisasi: Optional[List[PengalamanOrganisasi]] = []
    keahlian: Optional[List[str]] = []

    class Config:
        from_attributes = True


# Schema untuk Create Profile
class ProfileCreate(BaseModel):
    """Schema untuk membuat profile baru"""
    nama_lengkap: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    telepon: Optional[str] = Field(None, max_length=20)
    tanggal_lahir: Optional[date] = None
    jenis_kelamin: Optional[JenisKelamin] = None
    url_avatar: Optional[str] = None
    url_foto_cv: Optional[str] = None
    penyedia_auth: PenyediaAuth = PenyediaAuth.GOOGLE
    posisi_target: Optional[str] = Field(None, max_length=100)
    bahasa_preferensi: BahasaPreferensi = BahasaPreferensi.ID
    data_cv: Optional[CvDataSchema] = None

    @field_validator('telepon')
    @classmethod
    def validate_telepon(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        # Hapus karakter non-digit
        cleaned = ''.join(filter(str.isdigit, v))
        if len(cleaned) < 10 or len(cleaned) > 15:
            raise ValueError('Nomor telepon tidak valid')
        return cleaned


# Schema untuk Update Profile
class ProfileUpdate(BaseModel):
    """Schema untuk update profile"""
    nama_lengkap: Optional[str] = Field(None, min_length=3, max_length=100)
    telepon: Optional[str] = Field(None, max_length=20)
    tanggal_lahir: Optional[date] = None
    jenis_kelamin: Optional[JenisKelamin] = None
    url_avatar: Optional[str] = None
    url_foto_cv: Optional[str] = None
    posisi_target: Optional[str] = Field(None, max_length=100)
    bahasa_preferensi: Optional[BahasaPreferensi] = None
    data_cv: Optional[CvDataSchema] = None

    @field_validator('telepon')
    @classmethod
    def validate_telepon(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        cleaned = ''.join(filter(str.isdigit, v))
        if len(cleaned) < 10 or len(cleaned) > 15:
            raise ValueError('Nomor telepon tidak valid')
        return cleaned


# Schema untuk Response
class ProfileResponse(BaseModel):
    """Schema untuk response profile"""
    id: str
    nama_lengkap: str
    email: str
    telepon: Optional[str] = None
    tanggal_lahir: Optional[str] = None
    jenis_kelamin: Optional[str] = None
    url_avatar: Optional[str] = None
    url_foto_cv: Optional[str] = None
    penyedia_auth: str
    posisi_target: Optional[str] = None
    bahasa_preferensi: str
    data_cv: Dict[str, Any] = {}
    tanggal_dibuat: Optional[str] = None
    tanggal_diperbarui: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": "550e8400-e29b-41d4-a716-446655440000",
                "nama_lengkap": "John Doe",
                "email": "john.doe@example.com",
                "telepon": "081234567890",
                "tanggal_lahir": "1990-01-01",
                "jenis_kelamin": "pria",
                "url_avatar": "https://cloudinary.com/avatar.jpg",
                "url_foto_cv": None,
                "penyedia_auth": "google",
                "posisi_target": "Software Engineer",
                "bahasa_preferensi": "id",
                "data_cv": {
                    "ringkasan_profesional": "Experienced software engineer...",
                    "keahlian": ["Python", "JavaScript", "React"]
                },
                "tanggal_dibuat": "2024-01-01T00:00:00Z",
                "tanggal_diperbarui": "2024-01-01T00:00:00Z"
            }
        }