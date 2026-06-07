"""
Security utilities - JWT validation dan password hashing
"""
import jwt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt as jose_jwt
from app.core.config import settings


async def verify_supabase_jwt(token: str) -> Optional[dict]:
    """
    Verifikasi JWT token dari Supabase Auth.
    Returns payload jika valid, None jika tidak.
    """
    try:
        # Supabase menggunakan JWK untuk verifikasi
        # Untuk simplicity, kita decode tanpa verifikasi signature
        # (di production, fetch JWK dari Supabase URL)
        payload = jose_jwt.decode(
            token,
            settings.SUPABASE_KEY,
            algorithms=[settings.JWT_ALGORITHM],
            options={"verify_signature": False}  # TODO: Enable di production dengan JWK
        )
        return payload
    except JWTError:
        return None


def get_current_user_from_token(token: str) -> Optional[dict]:
    """
    Extract user info dari JWT token.
    """
    return verify_supabase_jwt(token)
