"""
Database connection setup menggunakan SQLAlchemy Async dengan asyncpg.
Mendukung PostgreSQL via Supabase.
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from typing import AsyncGenerator

from app.core.config import settings


# Base class untuk semua models
class Base(DeclarativeBase):
    """Base class untuk SQLAlchemy models"""
    pass


# Create async engine
# Echo=True untuk logging SQL queries (gunakan False di production)
engine = create_async_engine(
    settings.database_url,
    echo=settings.app_debug,  # Log SQL queries jika debug mode
    pool_pre_ping=True,  # Auto reconnect jika koneksi putus
    pool_size=10,  # Jumlah koneksi di pool
    max_overflow=20,  # Maks koneksi tambahan di luar pool
)


# Async session factory
async_session_maker = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,  # Jangan expire objects setelah commit
    autocommit=False,
    autoflush=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency untuk mendapatkan database session.
    Digunakan di FastAPI endpoints.
    
    Usage:
        @router.get("/users")
        async def get_users(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()  # Auto commit jika tidak ada error
        except Exception:
            await session.rollback()  # Rollback jika ada error
            raise
        finally:
            await session.close()  # Close session


async def init_db():
    """
    Initialize database - membuat semua tables.
    Dipanggil sekali saat aplikasi start.
    """
    from app.models.user import Profile  # Import semua models
    from app.models.session import InterviewSession
    
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """
    Close database connection.
    Dipanggil saat aplikasi shutdown.
    """
    await engine.dispose()