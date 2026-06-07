"""
SQLAlchemy Models untuk IntervU AI
"""
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text, ForeignKey, CheckConstraint, Index
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime, timezone
import uuid

Base = declarative_base()


def generate_uuid():
    """Generate UUID v4"""
    return str(uuid.uuid4())


def now_utc():
    """Get current UTC timestamp"""
    return datetime.now(timezone.utc)


class Profile(Base):
    """Model untuk tabel profiles"""
    __tablename__ = "profiles"
    
    id = Column(UUID(as_uuid=True), primary_key=True)
    nama_lengkap = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    telepon = Column(String(20))
    
    # Data Demografis (Untuk CV formal, TIDAK untuk AI)
    tanggal_lahir = Column(DateTime(timezone=True))
    jenis_kelamin = Column(String(20))
    
    # Foto
    url_avatar = Column(Text)  # Foto profil dari Google
    url_foto_cv = Column(Text)  # Pas foto 3x4 untuk CV
    
    # Data Profesi
    penyedia_auth = Column(String(20), default='google')
    posisi_target = Column(String(100), index=True)
    bahasa_preferensi = Column(String(5), default='id')
    data_cv = Column(JSONB, nullable=False, default=dict)
    
    tanggal_dibuat = Column(DateTime(timezone=True), default=now_utc)
    tanggal_diperbarui = Column(DateTime(timezone=True), default=now_utc, onupdate=now_utc)
    
    # Relationships
    sesi_wawancara = relationship("SesiWawancara", back_populates="profil", cascade="all, delete-orphan")
    rekomendasi_karir = relationship("RekomendasiKarir", back_populates="profil", cascade="all, delete-orphan")
    lowongan_karir = relationship("LowonganKarir", back_populates="profil", cascade="all, delete-orphan")
    saran_perbaikan_cv = relationship("SaranPerbaikanCV", back_populates="profil", cascade="all, delete-orphan")


class SesiWawancara(Base):
    """Model untuk tabel sesi_wawancara"""
    __tablename__ = "sesi_wawancara"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    id_profil = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    mode = Column(String(10), nullable=False)  # teks, audio, video
    posisi_target = Column(String(100), nullable=False)
    bahasa = Column(String(5), default='id')
    status = Column(String(20), default='berlangsung', index=True)  # berlangsung, selesai, ditinggalkan
    total_pertanyaan = Column(Integer, default=0)
    skor_akhir = Column(Integer)
    evaluasi_ai = Column(JSONB)
    metrik_non_verbal = Column(JSONB)
    dimulai_pada = Column(DateTime(timezone=True), default=now_utc)
    selesai_pada = Column(DateTime(timezone=True))
    
    # Relationships
    profil = relationship("Profile", back_populates="sesi_wawancara")
    pesan = relationship("PesanWawancara", back_populates="sesi", cascade="all, delete-orphan", order_by="PesanWawancara.urutan_pesan")
    saran_perbaikan_cv = relationship("SaranPerbaikanCV", back_populates="sesi", cascade="all, delete-orphan")


class PesanWawancara(Base):
    """Model untuk tabel pesan_wawancara"""
    __tablename__ = "pesan_wawancara"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    id_sesi = Column(UUID(as_uuid=True), ForeignKey("sesi_wawancara.id", ondelete="CASCADE"), nullable=False, index=True)
    peran = Column(String(15), nullable=False)  # pewawancara, kandidat
    isi = Column(Text, nullable=False)
    diedit_pengguna = Column(Boolean, default=False)
    urutan_pesan = Column(Integer, nullable=False)
    dibuat_pada = Column(DateTime(timezone=True), default=now_utc)
    
    # Relationships
    sesi = relationship("SesiWawancara", back_populates="pesan")
    
    __table_args__ = (
        Index('idx_pesan_urutan', 'id_sesi', 'urutan_pesan'),
    )


class RekomendasiKarir(Base):
    """Model untuk tabel rekomendasi_karir"""
    __tablename__ = "rekomendasi_karir"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    id_profil = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    posisi_direkomendasikan = Column(JSONB, nullable=False)
    perusahaan_direkomendasikan = Column(JSONB)
    alasan_rekomendasi = Column(Text)
    dibuat_pada = Column(DateTime(timezone=True), default=now_utc)
    
    # Relationships
    profil = relationship("Profile", back_populates="rekomendasi_karir")


class LowonganKarir(Base):
    """Model untuk tabel lowongan_karir"""
    __tablename__ = "lowongan_karir"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    id_profil = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    id_eksternal = Column(String(255), index=True)
    judul_pekerjaan = Column(String(255), nullable=False)
    nama_perusahaan = Column(String(255))
    lokasi = Column(String(255))
    tipe_pekerjaan = Column(String(50))
    gaji_min = Column(Integer)
    gaji_maks = Column(Integer)
    deskripsi = Column(Text)
    url_lamaran = Column(Text)
    sumber = Column(String(50), default='jsearch')
    posisi_cocok = Column(String(100))
    skor_kecocokan = Column(Integer)
    diambil_pada = Column(DateTime(timezone=True), default=now_utc)
    dibuat_pada = Column(DateTime(timezone=True), default=now_utc)
    
    # Relationships
    profil = relationship("Profile", back_populates="lowongan_karir")


class SaranPerbaikanCV(Base):
    """Model untuk tabel saran_perbaikan_cv"""
    __tablename__ = "saran_perbaikan_cv"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=generate_uuid)
    id_profil = Column(UUID(as_uuid=True), ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)
    id_sesi = Column(UUID(as_uuid=True), ForeignKey("sesi_wawancara.id", ondelete="CASCADE"), nullable=False, index=True)
    bagian_cv = Column(String(100), nullable=False)
    teks_asli = Column(Text)
    teks_saran_ai = Column(Text, nullable=False)
    alasan_perbaikan = Column(Text)
    status = Column(String(20), default='menunggu')  # menunggu, diterima, ditolak, diedit_dan_diterima
    dibuat_pada = Column(DateTime(timezone=True), default=now_utc)
    ditindaklanjuti_pada = Column(DateTime(timezone=True))
    
    # Relationships
    profil = relationship("Profile", back_populates="saran_perbaikan_cv")
    sesi = relationship("SesiWawancara", back_populates="saran_perbaikan_cv")
