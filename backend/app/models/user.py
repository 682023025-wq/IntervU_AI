"""
SQLAlchemy ORM Model untuk tabel 'profiles'.
Model ini merepresentasikan data profil user di database.
"""
from sqlalchemy import Column, String, Date, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.core.database import Base
import uuid
import enum


# ==========================================
# ENUM TYPES
# ==========================================
class JenisKelaminEnum(str, enum.Enum):
    """Enum untuk jenis kelamin."""
    PRIA = "pria"
    WANITA = "wanita"
    PREFER_TIDAK_MENYEBUTKAN = "prefer_tidak_menyebutkan"


class PenyediaAuthEnum(str, enum.Enum):
    """Enum untuk penyedia authentication."""
    GOOGLE = "google"
    EMAIL = "email"


class BahasaPreferensiEnum(str, enum.Enum):
    """Enum untuk bahasa preferensi."""
    INDONESIA = "id"
    INGGRIS = "en"


# ==========================================
# PROFILE MODEL
# ==========================================
class Profile(Base):
    """
    Model untuk tabel 'profiles'.
    
    Tabel ini menyimpan informasi profil lengkap user,
    termasuk data CV yang diparsing dalam format JSONB.
    """
    
    __tablename__ = "profiles"
    
    # ==========================================
    # COLUMNS
    # ==========================================
    id = Column(
        UUID(as_uuid=True),
        primary_key=True,
        default=uuid.uuid4,
        comment="Primary key - UUID dari Supabase Auth"
    )
    
    nama_lengkap = Column(
        String(100),
        nullable=False,
        comment="Nama lengkap user"
    )
    
    email = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
        comment="Email address user"
    )
    
    telepon = Column(
        String(20),
        nullable=True,
        comment="Nomor telepon"
    )
    
    tanggal_lahir = Column(
        Date,
        nullable=True,
        comment="Tanggal lahir"
    )
    
    jenis_kelamin = Column(
        String(20),
        nullable=True,
        comment="Jenis kelamin: pria, wanita, atau prefer_tidak_menyebutkan"
    )
    
    url_avatar = Column(
        String,
        nullable=True,
        comment="URL foto avatar di Cloudinary"
    )
    
    url_foto_cv = Column(
        String,
        nullable=True,
        comment="URL foto CV di Cloudinary"
    )
    
    penyedia_auth = Column(
        String(20),
        default="google",
        comment="Penyedia authentication: google atau email"
    )
    
    posisi_target = Column(
        String(100),
        nullable=True,
        comment="Posisi pekerjaan yang ditargetkan"
    )
    
    bahasa_preferensi = Column(
        String(5),
        default="id",
        comment="Bahasa preferensi: id atau en"
    )
    
    data_cv = Column(
        JSONB,
        nullable=False,
        default=dict,
        comment="Data CV terstruktur dalam format JSON"
    )
    
    tanggal_dibuat = Column(
        func.now(),
        nullable=False,
        comment="Timestamp saat record dibuat"
    )
    
    tanggal_diperbarui = Column(
        func.now(),
        onupdate=func.now(),
        nullable=False,
        comment="Timestamp saat record terakhir diperbarui"
    )
    
    # ==========================================
    # RELATIONSHIPS
    # ==========================================
    # Relationship ke sessions
    sessions = relationship("Session", back_populates="profile", cascade="all, delete-orphan")
    
    # ==========================================
    # CONSTRAINTS
    # ==========================================
    __table_args__ = (
        CheckConstraint(
            "jenis_kelamin IN ('pria', 'wanita', 'prefer_tidak_menyebutkan')",
            name="check_jenis_kelamin"
        ),
        CheckConstraint(
            "penyedia_auth IN ('google', 'email')",
            name="check_penyedia_auth"
        ),
        CheckConstraint(
            "bahasa_preferensi IN ('id', 'en')",
            name="check_bahasa_preferensi"
        ),
        Index("idx_profiles_email", "email"),
        Index("idx_profiles_posisi", "posisi_target"),
    )
    
    # ==========================================
    # REPRESENTATION
    # ==========================================
    def __repr__(self) -> str:
        return f"<Profile(id={self.id}, email={self.email}, nama={self.nama_lengkap})>"
    
    def to_dict(self) -> dict:
        """
        Convert model instance to dictionary.
        Berguna untuk serialisasi ke JSON.
        """
        return {
            "id": str(self.id),
            "nama_lengkap": self.nama_lengkap,
            "email": self.email,
            "telepon": self.telepon,
            "tanggal_lahir": self.tanggal_lahir.isoformat() if self.tanggal_lahir else None,
            "jenis_kelamin": self.jenis_kelamin,
            "url_avatar": self.url_avatar,
            "url_foto_cv": self.url_foto_cv,
            "penyedia_auth": self.penyedia_auth,
            "posisi_target": self.posisi_target,
            "bahasa_preferensi": self.bahasa_preferensi,
            "data_cv": self.data_cv,
            "tanggal_dibuat": self.tanggal_dibuat.isoformat() if self.tanggal_dibuat else None,
            "tanggal_diperbarui": self.tanggal_diperbarui.isoformat() if self.tanggal_diperbarui else None,
        }
