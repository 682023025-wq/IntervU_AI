"""
SQLAlchemy model untuk tabel interview_sessions.
Merepresentasikan sesi wawancara AI yang dilakukan user.
"""
from sqlalchemy import Column, String, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
import uuid

from app.core.database import Base


class SessionStatus(str, enum.Enum):
    """Enum untuk status sesi wawancara"""
    DRAFT = "draft"  # Baru dibuat, belum mulai
    IN_PROGRESS = "in_progress"  # Sedang berlangsung
    COMPLETED = "completed"  # Selesai
    CANCELLED = "cancelled"  # Dibatalkan


class InterviewSession(Base):
    """
    Model untuk tabel interview_sessions.
    
    Tabel ini menyimpan setiap sesi wawancara yang dilakukan user,
    termasuk pertanyaan, jawaban, dan feedback dari AI.
    """
    __tablename__ = "interview_sessions"
    
    # Primary Key
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Foreign Key ke profiles
    user_id = Column(
        UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    # Informasi Sesi
    posisi = Column(String(100), nullable=False)  # Posisi yang dilamar
    durasi_menit = Column(Integer, default=30)  # Durasi rencana dalam menit
    
    # Status
    status = Column(
        SQLEnum(SessionStatus), 
        default=SessionStatus.DRAFT,
        nullable=False
    )
    
    # Data sesi dalam JSONB
    data_sesi = Column(
        JSONB,
        nullable=False,
        default=dict,
        comment="""
        Struktur JSONB:
        {
            "pertanyaan": [
                {
                    "urutan": int,
                    "teks": string,
                    "kategori": string,
                    "timestamp": string
                }
            ],
            "jawaban": [
                {
                    "pertanyaan_id": int,
                    "teks": string,
                    "durasi_detik": int,
                    "timestamp": string
                }
            ],
            "feedback": {
                "skor_overall": float,
                "skor_per_kategori": dict,
                "kekuatan": [string],
                "kelemahan": [string],
                "saran_perbaikan": [string]
            }
        }
        """
    )
    
    # Timestamps
    tanggal_dibuat = Column(
        String,
        server_default=func.now()
    )
    tanggal_diperbarui = Column(
        String,
        server_default=func.now(),
        onupdate=func.now()
    )
    tanggal_selesai = Column(String, nullable=True)
    
    # Relationship ke Profile
    profile = relationship("Profile", back_populates="sessions")
    
    def __repr__(self) -> str:
        return f"<InterviewSession(id={self.id}, user_id={self.user_id}, status={self.status})>"
    
    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "posisi": self.posisi,
            "durasi_menit": self.durasi_menit,
            "status": self.status.value if self.status else None,
            "data_sesi": self.data_sesi or {},
            "tanggal_dibuat": str(self.tanggal_dibuat) if self.tanggal_dibuat else None,
            "tanggal_diperbarui": str(self.tanggal_diperbarui) if self.tanggal_diperbarui else None,
            "tanggal_selesai": str(self.tanggal_selesai) if self.tanggal_selesai else None,
        }


# Tambahkan relationship di Profile model
# Note: Ini akan di-import di models/__init__.py
def add_profile_relationship():
    """Helper untuk menambahkan relationship ke Profile"""
    from app.models.user import Profile
    Profile.sessions = relationship(
        "InterviewSession",
        back_populates="profile",
        cascade="all, delete-orphan"
    )