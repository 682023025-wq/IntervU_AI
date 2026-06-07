"""
Konfigurasi aplikasi menggunakan Pydantic V2 Settings.
Membaca semua variabel environment dari file .env
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Konfigurasi aplikasi IntervU AI"""
    
    # Supabase Configuration
    SUPABASE_URL: str
    SUPABASE_ANON_KEY: str
    SUPABASE_SERVICE_ROLE_KEY: str
    
    # Database Configuration
    DATABASE_URL: str
    
    # Google OAuth Configuration
    GOOGLE_CLIENT_ID: str
    GOOGLE_CLIENT_SECRET: str
    
    # AI API Keys
    GROQ_API_KEY: str
    GEMINI_API_KEY: str
    
    # Job Search API
    JSEARCH_API_KEY: str
    
    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME: str
    CLOUDINARY_API_KEY: str
    CLOUDINARY_API_SECRET: str
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
        str_strip_whitespace=True
    )


# Instance global settings
settings = Settings()
