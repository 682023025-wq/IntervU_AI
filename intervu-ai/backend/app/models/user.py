"""
SQLAlchemy model untuk tabel profiles.
Merepresentasikan data user profile di database.
"""
from sqlalchemy import Column, String, Date, CheckConstraint
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from datetime import date
import uuid
import json

from app.core.database import Base


class Profile(Base):
    """
    Model untuk tabel profiles.
    
    Tabel ini menyimpan informasi lengkap tentang user,
    termasuk data CV yang diparsing dalam format JSONB.
    """
    __tablename__ = "profiles"
    
    # Primary Key - UUID dari Supabase Auth
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Informasi Dasar
    nama_lengkap = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    telepon = Column(String(20), nullable=True)
    tanggal_lahir = Column(Date, nullable=True)
    
    # Jenis kelamin dengan constraint
    jenis_kelamin = Column(
        String(20), 
        nullable=True,
        comment="pria, wanita, atau prefer_tidak_menyebutkan"
    )
    
    # URLs untuk avatar dan CV
    url_avatar = Column(String, nullable=True)
    url_foto_cv = Column(String, nullable=True)
    
    # Provider authentication
    penyedia_auth = Column(
        String(20), 
        default="google",
        comment="google atau email"
    )
    
    # Preferensi wawancara
    posisi_target = Column(String(100), nullable=True)
    bahasa_preferensi = Column(
        String(5), 
        default="id",
        comment="id untuk Indonesia, en untuk English"
    )
    
    # Data CV terstruktur dalam JSONB
    data_cv = Column(
        JSONB, 
        nullable=False, 
        default=dict,
        comment="""
        Struktur JSONB:
        {
            "ringkasan_profesional": string,
            "tautan_profesional": [{"platform": string, "url": string}],
            "pendidikan": [{"instansi": string, "jurusan": string, ...}],
            "pengalaman_kerja": [{"posisi": string, "perusahaan": string, ...}],
            "pengalaman_organisasi": [{"nama": string, "role": string, ...}],
            "keahlian": [string]
        }
        """
    )
    
    # Timestamps
    tanggal_dibuat = Column(
        String,  # Menggunakan String untuk kompatibilitas dengan Supabase
        server_default=func.now()
    )
    tanggal_diperbarui = Column(
        String,
        server_default=func.now(),
        onupdate=func.now()
    )
    
    # Constraints
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
    )
    
    def __repr__(self) -> str:
        return f"<Profile(id={self.id}, email={self.email}, nama={self.nama_lengkap})>"
    
    def to_dict(self) -> dict:
        """Convert model to dictionary"""
        return {
            "id": str(self.id),
            "nama_lengkap": self.nama_lengkap,
            "email": self.email,
            "telepon": self.telepon,
            "tanggal_lahir": str(self.tanggal_lahir) if self.tanggal_lahir else None,
            "jenis_kelamin": self.jenis_kelamin,
            "url_avatar": self.url_avatar,
            "url_foto_cv": self.url_foto_cv,
            "penyedia_auth": self.penyedia_auth,
            "posisi_target": self.posisi_target,
            "bahasa_preferensi": self.bahasa_preferensi,
            "data_cv": self.data_cv or {},
            "tanggal_dibuat": str(self.tanggal_dibuat) if self.tanggal_dibuat else None,
            "tanggal_diperbarui": str(self.tanggal_diperbarui) if self.tanggal_diperbarui else None,
        }