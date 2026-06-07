"""
SQLAlchemy ORM Models untuk database IntervU AI.
Semua nama kolom menggunakan Bahasa Indonesia sesuai skema database.
"""
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from sqlalchemy import (
    String, Integer, Boolean, DateTime, ForeignKey, CheckConstraint, Text
)
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship, declarative_base

from app.database import Base


class Profile(Base):
    """Model ORM untuk tabel profiles"""
    __tablename__ = "profiles"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True)
    nama_lengkap: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    telepon: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # Data Demografis
    tanggal_lahir: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    jenis_kelamin: Mapped[Optional[str]] = mapped_column(
        String(20), 
        nullable=True,
        info={'check_constraint': "jenis_kelamin IN ('pria', 'wanita', 'prefer_tidak_menyebutkan')"}
    )
    
    # Foto
    url_avatar: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    url_foto_cv: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    # Data Profesi
    penyedia_auth: Mapped[str] = mapped_column(
        String(20), 
        default='google',
        info={'check_constraint': "penyedia_auth IN ('google', 'email')"}
    )
    posisi_target: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    bahasa_preferensi: Mapped[str] = mapped_column(
        String(5), 
        default='id',
        info={'check_constraint': "bahasa_preferensi IN ('id', 'en')"}
    )
    data_cv: Mapped[dict] = mapped_column(JSONB, nullable=False, default={})
    
    # Timestamps
    tanggal_dibuat: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=datetime.utcnow
    )
    tanggal_diperbarui: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), 
        default=datetime.utcnow, 
        onupdate=datetime.utcnow
    )
    
    # Relationships
    sesi_wawancara: Mapped[List["SesiWawancara"]] = relationship(
        "SesiWawancara", 
        back_populates="profil", 
        cascade="all, delete-orphan"
    )
    rekomendasi_karir: Mapped[List["RekomendasiKarir"]] = relationship(
        "RekomendasiKarir", 
        back_populates="profil", 
        cascade="all, delete-orphan"
    )
    lowongan_karir: Mapped[List["LowonganKarir"]] = relationship(
        "LowonganKarir", 
        back_populates="profil", 
        cascade="all, delete-orphan"
    )
    saran_perbaikan_cv: Mapped[List["SaranPerbaikanCV"]] = relationship(
        "SaranPerbaikanCV", 
        back_populates="profil", 
        cascade="all, delete-orphan"
    )


class SesiWawancara(Base):
    """Model ORM untuk tabel sesi_wawancara"""
    __tablename__ = "sesi_wawancara"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=lambda: UUID(int=0))
    id_profil: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False
    )
    mode: Mapped[str] = mapped_column(
        String(10), 
        nullable=False,
        info={'check_constraint': "mode IN ('teks', 'audio', 'video')"}
    )
    posisi_target: Mapped[str] = mapped_column(String(100), nullable=False)
    bahasa: Mapped[str] = mapped_column(
        String(5), 
        default='id',
        info={'check_constraint': "bahasa IN ('id', 'en')"}
    )
    status: Mapped[str] = mapped_column(
        String(20), 
        default='berlangsung',
        info={'check_constraint': "status IN ('berlangsung', 'selesai', 'ditinggalkan')"}
    )
    total_pertanyaan: Mapped[int] = mapped_column(Integer, default=0)
    skor_akhir: Mapped[Optional[int]] = mapped_column(
        Integer, 
        nullable=True,
        info={'check_constraint': "skor_akhir BETWEEN 0 AND 100"}
    )
    evaluasi_ai: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    metrik_non_verbal: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    dimulai_pada: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    selesai_pada: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    profil: Mapped["Profile"] = relationship("Profile", back_populates="sesi_wawancara")
    pesan: Mapped[List["PesanWawancara"]] = relationship(
        "PesanWawancara", 
        back_populates="sesi", 
        cascade="all, delete-orphan"
    )
    saran_perbaikan_cv: Mapped[List["SaranPerbaikanCV"]] = relationship(
        "SaranPerbaikanCV", 
        back_populates="sesi", 
        cascade="all, delete-orphan"
    )


class PesanWawancara(Base):
    """Model ORM untuk tabel pesan_wawancara"""
    __tablename__ = "pesan_wawancara"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=lambda: UUID(int=0))
    id_sesi: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("sesi_wawancara.id", ondelete="CASCADE"), 
        nullable=False
    )
    peran: Mapped[str] = mapped_column(
        String(15), 
        nullable=False,
        info={'check_constraint': "peran IN ('pewawancara', 'kandidat')"}
    )
    isi: Mapped[str] = mapped_column(Text, nullable=False)
    diedit_pengguna: Mapped[bool] = mapped_column(Boolean, default=False)
    urutan_pesan: Mapped[int] = mapped_column(Integer, nullable=False)
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    sesi: Mapped["SesiWawancara"] = relationship("SesiWawancara", back_populates="pesan")


class RekomendasiKarir(Base):
    """Model ORM untuk tabel rekomendasi_karir"""
    __tablename__ = "rekomendasi_karir"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=lambda: UUID(int=0))
    id_profil: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False
    )
    posisi_direkomendasikan: Mapped[dict] = mapped_column(JSONB, nullable=False)
    perusahaan_direkomendasikan: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    alasan_rekomendasi: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    profil: Mapped["Profile"] = relationship("Profile", back_populates="rekomendasi_karir")


class LowonganKarir(Base):
    """Model ORM untuk tabel lowongan_karir"""
    __tablename__ = "lowongan_karir"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=lambda: UUID(int=0))
    id_profil: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False
    )
    id_eksternal: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    judul_pekerjaan: Mapped[str] = mapped_column(String(255), nullable=False)
    nama_perusahaan: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    lokasi: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    tipe_pekerjaan: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    gaji_min: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    gaji_maks: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    deskripsi: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    url_lamaran: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sumber: Mapped[str] = mapped_column(String(50), default='jsearch')
    posisi_cocok: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    skor_kecocokan: Mapped[Optional[int]] = mapped_column(
        Integer, 
        nullable=True,
        info={'check_constraint': "skor_kecocokan BETWEEN 0 AND 100"}
    )
    diambil_pada: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    
    # Relationships
    profil: Mapped["Profile"] = relationship("Profile", back_populates="lowongan_karir")


class SaranPerbaikanCV(Base):
    """Model ORM untuk tabel saran_perbaikan_cv"""
    __tablename__ = "saran_perbaikan_cv"
    
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=lambda: UUID(int=0))
    id_profil: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("profiles.id", ondelete="CASCADE"), 
        nullable=False
    )
    id_sesi: Mapped[UUID] = mapped_column(
        PG_UUID(as_uuid=True), 
        ForeignKey("sesi_wawancara.id", ondelete="CASCADE"), 
        nullable=False
    )
    bagian_cv: Mapped[str] = mapped_column(String(100), nullable=False)
    teks_asli: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    teks_saran_ai: Mapped[str] = mapped_column(Text, nullable=False)
    alasan_perbaikan: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(
        String(20), 
        default='menunggu',
        info={'check_constraint': "status IN ('menunggu', 'diterima', 'ditolak', 'diedit_dan_diterima')"}
    )
    dibuat_pada: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    ditindaklanjuti_pada: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    
    # Relationships
    profil: Mapped["Profile"] = relationship("Profile", back_populates="saran_perbaikan_cv")
    sesi: Mapped["SesiWawancara"] = relationship("SesiWawancara", back_populates="saran_perbaikan_cv")
