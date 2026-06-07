"""
Main FastAPI application entry point.
Menginisialisasi app, middleware, dan routers.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.core.database import init_db, close_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager untuk startup dan shutdown events.
    """
    # Startup
    print("🚀 Starting IntervU AI API...")
    await init_db()
    print("✅ Database initialized")
    
    yield
    
    # Shutdown
    print("👋 Shutting down IntervU AI API...")
    await close_db()
    print("✅ Database connections closed")


app = FastAPI(
    title="IntervU AI API",
    description="API untuk Aplikasi Simulasi Wawancara Berbasis AI",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware (untuk allow React frontend akses)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite default port
        "http://localhost:3000",  # Create React App default port
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    """Root endpoint - welcome message"""
    return {
        "message": "Selamat datang di IntervU AI API!",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "redoc": "/redoc"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "environment": settings.app_env,
        "debug": settings.app_debug
    }


# Import routers (akan kita buat nanti)
# from app.api.v1.endpoints import profiles, sessions, ai_chat
# app.include_router(profiles.router, prefix="/api/v1/profiles", tags=["profiles"])
# app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["sessions"])
# app.include_router(ai_chat.router, prefix="/api/v1/ai-chat", tags=["ai-chat"])


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host=settings.app_host,
        port=settings.app_port,
        reload=settings.app_debug
    )