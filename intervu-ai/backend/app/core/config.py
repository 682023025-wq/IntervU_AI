"""
Konfigurasi inti aplikasi - Membaca environment variables
"""
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_KEY: str  # Service Role Key untuk backend
    SUPABASE_ANON_KEY: str  # Anon key untuk frontend
    
    # Database (Supabase PostgreSQL connection string)
    DATABASE_URL: str
    
    # AI Services
    GROQ_API_KEY: str
    GEMINI_API_KEY: str
    
    # External APIs
    JSEARCH_API_KEY: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    # App Settings
    APP_NAME: str = "IntervU AI"
    DEBUG: bool = False
    API_V1_PREFIX: str = "/api/v1"
    
    # JWT & Auth
    JWT_ALGORITHM: str = "HS256"
    
    # Cache Settings (untuk lowongan kerja)
    CACHE_EXPIRY_DAYS: int = 7
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Singleton instance
settings = Settings()
