"""
Pydantic schemas untuk validasi request/response API.
Menggunakan Pydantic V2 dengan ConfigDict.
"""
from datetime import datetime
from typing import List, Optional, Dict, Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field, EmailStr


# ==========================================
# SCHEMA UNTUK DATA CV (STRUCTURED)
# ==========================================
class PendidikanItem(BaseModel):
    """Schema untuk item pendidikan dalam CV"""
    institusi: str
    jurusan: str
    gelar: str
    tanggal_mulai: datetime
    tanggal_selesai: Optional[datetime] = None
    deskripsi: Optional[str] = None


class PengalamanKerjaItem(BaseModel):
    """Schema untuk item pengalaman kerja dalam CV"""
    perusahaan: str
    posisi: str
    tanggal_mulai: datetime
    tanggal_selesai: Optional[datetime] = None
    deskripsi: Optional[str] = None
    lokasi: Optional[str] = None


class PengalamanOrganisasiItem(BaseModel):
    """Schema untuk item pengalaman organisasi dalam CV"""
    organisasi: str
    posisi: str
    tanggal_mulai: datetime
    tanggal_selesai: Optional[datetime] = None
    deskripsi: Optional[str] = None


class KeahlianItem(BaseModel):
    """Schema untuk item keahlian dalam CV"""
    nama: str
    tingkat: str = Field(..., description="Tingkat keahlian: pemula, menengah, ahli")


class TautanProfesional(BaseModel):
    """Schema untuk tautan profesional"""
    platform: str
    url: str


class CvData(BaseModel):
    """
    Schema terstruktur untuk data_cv.
    TIDAK termasuk data demografis (Fair AI principle).
    """
    ringkasan_profesional: str
    tautan_profesional: List[TautanProfesional] = []
    pendidikan: List[PendidikanItem] = []
    pengalaman_kerja: List[PengalamanKerjaItem] = []
    pengalaman_organisasi: List[PengalamanOrganisasiItem] = []
    keahlian: List[KeahlianItem] = []


# ==========================================
# SCHEMA UNTUK PROFILE
# ==========================================
class ProfileBase(BaseModel):
    """Base schema untuk Profile"""
    nama_lengkap: str
    email: EmailStr
    telepon: Optional[str] = None
    posisi_target: Optional[str] = None
    bahasa_preferensi: str = "id"


class ProfileCreate(ProfileBase):
    """Schema untuk membuat profile baru"""
    id: UUID
    penyedia_auth: str = "google"
    url_avatar: Optional[str] = None


class ProfileUpdate(BaseModel):
    """Schema untuk update profile"""
    nama_lengkap: Optional[str] = None
    telepon: Optional[str] = None
    posisi_target: Optional[str] = None
    bahasa_preferensi: Optional[str] = None
    data_cv: Optional[CvData] = None
    url_foto_cv: Optional[str] = None


class ProfileResponse(ProfileBase):
    """Schema untuk response profile"""
    id: UUID
    telepon: Optional[str] = None
    tanggal_lahir: Optional[datetime] = None
    jenis_kelamin: Optional[str] = None
    url_avatar: Optional[str] = None
    url_foto_cv: Optional[str] = None
    penyedia_auth: str
    posisi_target: Optional[str] = None
    bahasa_preferensi: str
    data_cv: Dict[str, Any] = {}
    tanggal_dibuat: datetime
    tanggal_diperbarui: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMA UNTUK SESI WAWANCARA
# ==========================================
class SesiWawancaraBase(BaseModel):
    """Base schema untuk SesiWawancara"""
    mode: str = Field(..., description="teks, audio, atau video")
    posisi_target: str
    bahasa: str = "id"


class SesiWawancaraCreate(SesiWawancaraBase):
    """Schema untuk membuat sesi wawancara baru"""
    pass


class SesiWawancaraResponse(SesiWawancaraBase):
    """Schema untuk response sesi wawancara"""
    id: UUID
    id_profil: UUID
    status: str
    total_pertanyaan: int
    skor_akhir: Optional[int] = None
    evaluasi_ai: Optional[Dict[str, Any]] = None
    metrik_non_verbal: Optional[Dict[str, Any]] = None
    dimulai_pada: datetime
    selesai_pada: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMA UNTUK PESAN WAWANCARA
# ==========================================
class PesanWawancaraBase(BaseModel):
    """Base schema untuk PesanWawancara"""
    peran: str = Field(..., description="pewawancara atau kandidat")
    isi: str


class PesanWawancaraCreate(PesanWawancaraBase):
    """Schema untuk membuat pesan baru"""
    diedit_pengguna: bool = False


class PesanWawancaraResponse(PesanWawancaraBase):
    """Schema untuk response pesan"""
    id: UUID
    id_sesi: UUID
    diedit_pengguna: bool
    urutan_pesan: int
    dibuat_pada: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMA UNTUK REKOMENDASI KARIR
# ==========================================
class RekomendasiKarirResponse(BaseModel):
    """Schema untuk response rekomendasi karir"""
    id: UUID
    id_profil: UUID
    posisi_direkomendasikan: Dict[str, Any]
    perusahaan_direkomendasikan: Optional[Dict[str, Any]] = None
    alasan_rekomendasi: Optional[str] = None
    dibuat_pada: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMA UNTUK LOWONGAN KARIR
# ==========================================
class LowonganKarirBase(BaseModel):
    """Base schema untuk LowonganKarir"""
    judul_pekerjaan: str
    nama_perusahaan: Optional[str] = None
    lokasi: Optional[str] = None
    tipe_pekerjaan: Optional[str] = None
    gaji_min: Optional[int] = None
    gaji_maks: Optional[int] = None
    deskripsi: Optional[str] = None
    url_lamaran: Optional[str] = None


class LowonganKarirResponse(LowonganKarirBase):
    """Schema untuk response lowongan karir"""
    id: UUID
    id_profil: UUID
    id_eksternal: Optional[str] = None
    sumber: str
    posisi_cocok: Optional[str] = None
    skor_kecocokan: Optional[int] = None
    diambil_pada: datetime
    dibuat_pada: datetime
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMA UNTUK SARAN PERBAIKAN CV
# ==========================================
class SaranPerbaikanCVBase(BaseModel):
    """Base schema untuk SaranPerbaikanCV"""
    bagian_cv: str
    teks_asli: Optional[str] = None
    teks_saran_ai: str
    alasan_perbaikan: Optional[str] = None


class SaranPerbaikanCVCreate(SaranPerbaikanCVBase):
    """Schema untuk membuat saran perbaikan CV"""
    id_sesi: UUID


class SaranPerbaikanCVUpdate(BaseModel):
    """Schema untuk update status saran perbaikan CV"""
    status: str = Field(..., description="menunggu, diterima, ditolak, diedit_dan_diterima")
    teks_diedit: Optional[str] = None


class SaranPerbaikanCVResponse(SaranPerbaikanCVBase):
    """Schema untuk response saran perbaikan CV"""
    id: UUID
    id_profil: UUID
    id_sesi: UUID
    status: str
    dibuat_pada: datetime
    ditindaklanjuti_pada: Optional[datetime] = None
    
    model_config = ConfigDict(from_attributes=True)


# ==========================================
# SCHEMA UNTUK AUTH
# ==========================================
class TokenPayload(BaseModel):
    """Schema untuk payload JWT token"""
    sub: str  # User ID
    exp: int  # Expiration time
    iat: int  # Issued at
    email: Optional[str] = None
    role: Optional[str] = None
