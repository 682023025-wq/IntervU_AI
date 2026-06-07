"""
Pydantic Schemas untuk validasi dan serialisasi data Session.
Schema ini digunakan untuk request/response validation di API endpoints.
"""
from pydantic import BaseModel, Field, field_validator, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime


# ==========================================
# SESSION SCHEMAS
# ==========================================
class SessionBase(BaseModel):
    """Base schema untuk Session dengan field umum."""
    posisi: str = Field(..., min_length=2, max_length=100, description="Posisi pekerjaan yang dilamar")
    bahasa: str = Field(default="id", pattern="^(id|en)$", description="Bahasa wawancara")
    total_pertanyaan: int = Field(default=5, ge=3, le=20, description="Jumlah pertanyaan (3-20)")


class SessionCreate(SessionBase):
    """Schema untuk membuat sesi baru."""
    user_id: str = Field(..., description="User ID (UUID)")
    metadata_sesi: Optional[Dict[str, Any]] = Field(
        default_factory=dict,
        description="Metadata tambahan"
    )


class SessionUpdate(BaseModel):
    """Schema untuk update sesi. Semua field optional."""
    posisi: Optional[str] = Field(None, min_length=2, max_length=100)
    status: Optional[str] = Field(None, pattern="^(draft|in_progress|completed|cancelled)$")
    bahasa: Optional[str] = Field(None, pattern="^(id|en)$")
    total_pertanyaan: Optional[int] = Field(None, ge=3, le=20)
    pertanyaan_selesai: Optional[int] = Field(None, ge=0)
    skor_akhir: Optional[int] = Field(None, ge=0, le=100)
    feedback_umum: Optional[str] = Field(None)
    metadata_sesi: Optional[Dict[str, Any]] = Field(None)


class SessionResponse(SessionBase):
    """Schema untuk response session."""
    model_config = ConfigDict(from_attributes=True)
    
    id: str = Field(..., description="Session ID (UUID)")
    user_id: str = Field(..., description="User ID (UUID)")
    status: str = Field(..., description="Status sesi")
    pertanyaan_selesai: int = Field(..., description="Jumlah pertanyaan selesai")
    skor_akhir: Optional[int] = Field(None, description="Skor akhir")
    feedback_umum: Optional[str] = Field(None, description="Feedback umum")
    metadata_sesi: Dict[str, Any] = Field(..., description="Metadata sesi")
    tanggal_dibuat: datetime = Field(..., description="Timestamp pembuatan")
    tanggal_diperbarui: datetime = Field(..., description="Timestamp update terakhir")


# ==========================================
# RESPONSE WRAPPERS
# ==========================================
class SessionListResponse(BaseModel):
    """Schema untuk response list sessions."""
    total: int = Field(..., description="Total jumlah sessions")
    sessions: list[SessionResponse] = Field(..., description="Daftar sessions")


class MessageResponse(BaseModel):
    """Schema untuk response message sederhana."""
    message: str = Field(..., description="Pesan response")
    success: bool = Field(default=True, description="Status sukses/gagal")
