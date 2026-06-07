"""
Entry point aplikasi FastAPI - IntervU AI API.
Menginisialisasi app, middleware, dan routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import init_db, close_db


# ==========================================
# LIFESPAN CONTEXT MANAGER
# ==========================================
@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Mengelola lifecycle aplikasi - dijalankan saat startup dan shutdown.
    """
    # Startup: Inisialisasi database (skip jika DATABASE_URL tidak valid)
    print("🚀 Starting up IntervU AI API...")
    try:
        await init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️  Database connection failed (ini normal jika DATABASE_URL belum dikonfigurasi): {e}")
        print("✅ Server tetap berjalan, tapi fitur database tidak tersedia")
    
    yield  # Aplikasi berjalan di sini
    
    # Shutdown: Tutup koneksi database
    print("👋 Shutting down IntervU AI API...")
    try:
        await close_db()
        print("✅ Database connections closed")
    except Exception:
        pass


# ==========================================
# CREATE FASTAPI APP
# ==========================================
app = FastAPI(
    title="IntervU AI API",
    description="""
    ## API untuk Aplikasi Simulasi Wawancara Berbasis AI
    
    **IntervU AI** membantu pengguna mempersiapkan wawancara kerja dengan:
    - 🎯 Simulasi wawancara realistis berbasis AI
    - 📊 Feedback otomatis untuk meningkatkan performa
    - 📝 Analisis CV dan rekomendasi personalisasi
    - 🌐 Support multi-bahasa (Indonesia & English)
    
    ### Authentication
    Semua endpoint dilindungi dengan JWT token dari Supabase Authentication.
    Sertakan token di header: `Authorization: Bearer <your-token>`
    """,
    version="1.0.0",
    docs_url="/docs",      # Swagger UI
    redoc_url="/redoc",    # ReDoc
    openapi_url="/openapi.json",
    lifespan=lifespan,
)


# ==========================================
# CORS MIDDLEWARE
# ==========================================
# Allow frontend untuk akses API dari different origin
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Create React App default port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,  # Allow cookies/authentication
    allow_methods=["*"],     # Allow all HTTP methods
    allow_headers=["*"],     # Allow all headers
)


# ==========================================
# ROOT ENDPOINTS
# ==========================================
@app.get("/")
async def root():
    """
    Root endpoint - welcome message.
    """
    return {
        "message": "Selamat datang di IntervU AI API!",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health")
async def health_check():
    """
    Health check endpoint untuk monitoring.
    """
    return {
        "status": "healthy",
        "environment": settings.APP_ENV,
    }


# ==========================================
# API ROUTERS (v1)
# ==========================================
# Import routers dari endpoints
# Note: Kita comment dulu karena belum implement endpoint-nya
# from app.api.v1.endpoints import profiles, sessions, ai_chat

# Register routers dengan prefix /api/v1
# app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["Profiles"])
# app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["Sessions"])
# app.include_router(ai_chat.router, prefix="/api/v1/ai-chat", tags=["AI Chat"])


# ==========================================
# EXCEPTION HANDLERS
# ==========================================
from fastapi import Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import ValidationError


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler untuk validation errors.
    Response lebih readable untuk client.
    """
    errors = []
    for error in exc.errors():
        errors.append({
            "field": ".".join(str(x) for x in error["loc"]),
            "message": error["msg"],
            "type": error["type"],
        })
    
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error",
            "errors": errors,
        }
    )


@app.exception_handler(ValidationError)
async def pydantic_validation_exception_handler(request: Request, exc: ValidationError):
    """
    Custom handler untuk Pydantic validation errors.
    """
    return JSONResponse(
        status_code=422,
        content={
            "success": False,
            "message": "Validation error",
            "errors": exc.errors(),
        }
    )


# ==========================================
# START SERVER
# ==========================================
if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=settings.APP_DEBUG,
    )
