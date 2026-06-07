"""
Konfigurasi aplikasi menggunakan Pydantic Settings.
Membaca semua environment variables dari file .env
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Settings class untuk konfigurasi aplikasi"""
    
    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""
    database_url: str = ""
    
    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""
    
    # LLM APIs
    groq_api_key: str = ""
    gemini_api_key: str = ""
    
    # Cloudinary
    cloudinary_url: str = ""
    cloudinary_cloud_name: str = ""
    cloudinary_api_key: str = ""
    cloudinary_api_secret: str = ""
    
    # App Config
    app_env: str = "development"
    app_debug: bool = True
    app_host: str = "0.0.0.0"
    app_port: int = 8000
    
    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """
    Singleton pattern untuk Settings.
    Hanya akan load sekali dan di-cache.
    """
    return Settings()


settings = get_settings()