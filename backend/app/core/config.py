"""
Konfigurasi aplikasi menggunakan Pydantic Settings.
Membaca semua environment variables dari file .env
"""
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    """
    Class untuk menyimpan semua konfigurasi aplikasi.
    Field-field ini akan otomatis diisi dari environment variables.
    """
    
    # ==========================================
    # SUPABASE
    # ==========================================
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    DATABASE_URL: str
    
    # ==========================================
    # GOOGLE OAUTH
    # ==========================================
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    
    # ==========================================
    # LLM APIs
    # ==========================================
    GROQ_API_KEY: str
    GEMINI_API_KEY: str
    
    # ==========================================
    # CLOUDINARY
    # ==========================================
    CLOUDINARY_URL: str
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    # ==========================================
    # APP CONFIG
    # ==========================================
    APP_ENV: str = "development"
    APP_DEBUG: bool = True
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Instance global yang bisa di-import di file lain
settings = Settings()