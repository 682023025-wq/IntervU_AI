"""
Konfigurasi database SQLAlchemy Async untuk Supabase PostgreSQL.
Menggunakan asyncpg sebagai driver untuk performa maksimal.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings


# ==========================================
# CREATE ASYNC ENGINE
# ==========================================
# Engine adalah titik awal koneksi ke database
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.APP_DEBUG,  # Log semua query jika debug mode
    pool_pre_ping=True,       # Auto-reconnect jika koneksi putus
    pool_size=10,             # Jumlah koneksi yang dipool
    max_overflow=20,          # Maksimum koneksi tambahan di luar pool
)


# ==========================================
# SESSION FACTORY
# ==========================================
# Membuat session baru untuk setiap request
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,   # Jangan expire object setelah commit
    autocommit=False,
    autoflush=False,
)


# ==========================================
# BASE MODEL
# ==========================================
# Base class untuk semua model SQLAlchemy
class Base(DeclarativeBase):
    """
    Base class untuk semua model database.
    Semua model harus inherit dari class ini.
    """
    pass


# ==========================================
# DEPENDENCY INJECTION
# ==========================================
async def get_db() -> AsyncSession:
    """
    Dependency untuk mendapatkan database session.
    Digunakan di endpoint FastAPI dengan Depends().
    
    Usage:
        @router.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


# ==========================================
# INIT DATABASE
# ==========================================
async def init_db():
    """
    Inisialisasi database - membuat semua tabel.
    Dipanggil sekali saat aplikasi start.
    """
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ==========================================
# CLOSE DATABASE
# ==========================================
async def close_db():
    """
    Menutup koneksi database.
    Dipanggil saat aplikasi shutdown.
    """
    await engine.dispose()
