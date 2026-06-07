"""
Konfigurasi database async dengan SQLAlchemy dan asyncpg.
Menggunakan Supabase PostgreSQL.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base

from app.config import settings

# Membuat async engine untuk koneksi ke PostgreSQL via Supabase
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,  # Set True untuk debug SQL queries
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)

# Session factory untuk async sessions
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Base class untuk semua ORM models
Base = declarative_base()


async def get_db() -> AsyncSession:
    """
    Dependency untuk mendapatkan database session.
    Menggunakan async context manager untuk memastikan session ditutup dengan benar.
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
