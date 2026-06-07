"""
Security utilities untuk validasi JWT token dari Supabase.
Menggunakan python-jose untuk decode dan verify token.
"""
from jose import jwt, JWTError
from typing import Optional, Dict, Any
from datetime import datetime

from app.core.config import settings


async def verify_supabase_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify JWT token dari Supabase.
    
    Args:
        token: JWT token dari header Authorization
        
    Returns:
        Payload token jika valid, None jika tidak valid
    """
    try:
        # Supabase menggunakan HS256 algorithm dengan service role key atau anon key
        payload = jwt.decode(
            token,
            settings.supabase_anon_key,  # Atau service_role_key untuk admin access
            algorithms=["HS256"],
            options={
                "verify_signature": True,
                "verify_exp": True,  # Verify expiration
                "verify_iat": True,  # Verify issued at
            }
        )
        return payload
    except JWTError as e:
        print(f"Token verification failed: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error during token verification: {e}")
        return None


def extract_user_info_from_token(token_payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Extract user information dari token payload.
    
    Args:
        token_payload: Payload dari JWT token yang sudah verified
        
    Returns:
        Dictionary berisi user info (sub, email, dll)
    """
    return {
        "user_id": token_payload.get("sub"),
        "email": token_payload.get("email"),
        "role": token_payload.get("role", "authenticated"),
        "app_metadata": token_payload.get("app_metadata", {}),
        "user_metadata": token_payload.get("user_metadata", {}),
    }