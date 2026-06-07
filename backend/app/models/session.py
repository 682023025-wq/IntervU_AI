"""
SQLAlchemy ORM Model untuk tabel 'sessions'.
Model ini merepresentasikan sesi wawancara AI.
"""
from sqlalchemy import Column, String, Integer, ForeignKey, Index, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.core.database import Base
import uuid


# ==========================================
# SESSION MODEL
# ==========================================
class Session(Base):
    """
    Model untuk tabel 'sessions'.
    
    Tabel ini menyimpan informasi setiap sesi wawancara AI,
    termasuk pertanyaan, jawaban user, dan feedback dari AI.
    """
    
    __tablename__ = "sessions"
    
    # ==========================================
    # COLUMNS
    # ==========================================
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        comment="Primary key - UUID unik untuk setiap sesi"
    )
    
    user_id = Column(
        UUID(as_uuid=True),
        ForeignKey("profiles.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
        comment="Foreign key ke tabel profiles"
    )
    
    posisi = Column(
        String(100),
        nullable=False,
        comment="Posisi pekerjaan yang dilamar untuk sesi ini"
    )
    
    status = Column(
        String(20),
        default="draft",
        comment="Status sesi: draft, in_progress, completed, cancelled"
    )
    
    bahasa = Column(
        String(5),
        default="id",
        comment="Bahasa yang digunakan: id atau en"
    )
    
    total_pertanyaan = Column(
        Integer,
        default=5,
        comment="Jumlah total pertanyaan dalam sesi"
    )
    
    pertanyaan_selesai = Column(
        Integer,
        default=0,
        comment="Jumlah pertanyaan yang sudah dijawab"
    )
    
    skor_akhir = Column(
        Integer,
        nullable=True,
        comment="Skor akhir sesi (0-100)"
    )
    
    feedback_umum = Column(
        Text,
        nullable=True,
        comment="Feedback umum dari AI setelah sesi selesai"
    )
    
    metadata_sesi = Column(
        JSONB,
        nullable=False,
        default=dict,
        comment="Metadata tambahan seperti durasi, timestamp, dll"
    )
    
    tanggal_dibuat = Column(
        func.now(),
        nullable=False,
        comment="Timestamp saat sesi dibuat"
    )
    
    tanggal_diperbarui = Column(
        func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="Timestamp saat sesi terakhir diperbarui"
    )
    
    # ==========================================
    # RELATIONSHIPS
    # ==========================================
    # Relationship ke profile user
    profile = relationship("Profile", back_populates="sessions")
    
    # ==========================================
    # INDEXES
    # ==========================================
    __table_args__ = (
        Index("idx_sessions_user_id", "user_id"),
        Index("idx_sessions_status", "status"),
        Index("idx_sessions_posisi", "posisi"),
    )
    
    # ==========================================
    # REPRESENTATION
    # ==========================================
    def __repr__(self) -> str:
        return f"<Session(id={self.id}, user_id={self.user_id}, status={self.status})>"
    
    def to_dict(self) -> dict:
        """
        Convert model instance to dictionary.
        Berguna untuk serialisasi ke JSON.
        """
        return {
            "id": str(self.id),
            "user_id": str(self.user_id),
            "posisi": self.posisi,
            "status": self.status,
            "bahasa": self.bahasa,
            "total_pertanyaan": self.total_pertanyaan,
            "pertanyaan_selesai": self.pertanyaan_selesai,
            "skor_akhir": self.skor_akhir,
            "feedback_umum": self.feedback_umum,
            "metadata_sesi": self.metadata_sesi,
            "tanggal_dibuat": self.tanggal_dibuat.isoformat() if self.tanggal_dibuat else None,
            "tanggal_diperbarui": self.tanggal_diperbarui.isoformat() if self.tanggal_diperbarui else None,
        }
