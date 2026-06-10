"""
Entry point untuk FastAPI application.
Menginisialisasi app, middleware CORS, lifespan events, dan router.
"""
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager untuk startup dan shutdown events.
    """
    # Startup
    print("=" * 50)
    print("🚀 IntervU AI Backend Starting...")
    print("=" * 50)
    print(f"✅ Database URL: {settings.DATABASE_URL[:30]}...")
    print(f"✅ Supabase URL: {settings.SUPABASE_URL}")
    print(f"✅ Groq API Key: {'***' + settings.GROQ_API_KEY[-4:] if settings.GROQ_API_KEY else 'Not set'}")
    print(f"✅ Gemini API Key: {'***' + settings.GEMINI_API_KEY[-4:] if settings.GEMINI_API_KEY else 'Not set'}")
    print(f"✅ Cloudinary Cloud Name: {settings.CLOUDINARY_CLOUD_NAME}")
    print("=" * 50)
    print("✨ Server is ready! 🎉")
    print("=" * 50)
    
    yield
    
    # Shutdown
    print("\n👋 IntervU AI Backend Shutting Down...")
    print("💾 Database connections closed")
    print("✅ Shutdown complete")


# Inisialisasi FastAPI app
app = FastAPI(
    title="IntervU AI - Simulasi Wawancara Berbasis AI",
    description="""
## API Documentation untuk IntervU AI

Aplikasi simulasi wawancara kerja berbasis AI dengan fitur:
- **Wawancara Interaktif**: Chat dengan AI pewawancara (teks, audio, video)
- **Evaluasi Otomatis**: AI memberikan skor dan feedback setelah wawancara
- **Analisis CV**: Upload CV dan dapatkan saran perbaikan
- **Rekomendasi Karir**: AI menganalisis profil dan merekomendasikan posisi
- **Lowongan Kerja**: Integrasi dengan JSearch/LinkedIn untuk lowongan relevan

### Authentication
Semua endpoint memerlukan JWT token dari Supabase Auth.
Sertakan token di header: `Authorization: Bearer <your_token>`

### Fair AI Principle
Aplikasi ini TIDAK menggunakan data demografis (usia, jenis kelamin, dll) 
dalam analisis AI untuk memastikan penilaian yang adil dan objektif.
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Konfigurasi CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Alternative port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://10.167.154.87:5173",  # Local network IP - frontend
        "http://10.167.154.87:8000",  # Local network IP - backend
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Semua HTTP methods
    allow_headers=["*"],  # Semua headers
)

# Include router dengan prefix /api/v1
app.include_router(router)


@app.get("/")
async def root():
    """
    Root endpoint - informasi API.
    """
    return {
        "message": "Selamat datang di IntervU AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


# Jalankan dengan: uvicorn app.main:app --reload
