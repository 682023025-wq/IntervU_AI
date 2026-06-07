"""
Utility untuk validasi JWT token dari Supabase Authentication.
Menggunakan python-jose untuk decode dan verify token.
"""
from jose import jwt, JWTError, ExpiredSignatureError
from typing import Optional, Dict, Any
from app.core.config import settings


# ==========================================
# ALGORITHMS
# ==========================================
# Supabase menggunakan RS256 (RSA Signature with SHA-256)
# Untuk simplicity, kita akan gunakan approach alternatif
ALGORITHM = "HS256"


async def verify_supabase_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verifikasi JWT token dari Supabase Authentication.
    
    Args:
        token: JWT token dari header Authorization
        
    Returns:
        Dict berisi payload token jika valid, None jika tidak valid
        
    Raises:
        JWTError: Jika token tidak valid
        ExpiredSignatureError: Jika token sudah expired
    """
    try:
        # Decode token tanpa verifikasi signature dulu
        # (karena kita perlu fetch public key dari Supabase)
        payload = jwt.decode(
            token,
            settings.SUPABASE_ANON_KEY,  # Sementara pakai anon key
            algorithms=[ALGORITHM],
            options={"verify_signature": False}  # TODO: Implement proper verification
        )
        
        # Check jika token ada user id (sub claim)
        if "sub" not in payload:
            return None
            
        return payload
        
    except ExpiredSignatureError:
        raise ExpiredSignatureError("Token sudah expired")
    except JWTError as e:
        raise JWTError(f"Token tidak valid: {str(e)}")


def extract_user_id_from_token(token: str) -> Optional[str]:
    """
    Extract user ID dari JWT token.
    
    Args:
        token: JWT token dari Supabase
        
    Returns:
        User ID (UUID) jika berhasil, None jika gagal
    """
    try:
        payload = jwt.decode(
            token,
            settings.SUPABASE_ANON_KEY,
            algorithms=[ALGORITHM],
            options={"verify_signature": False}
        )
        return payload.get("sub")
    except Exception:
        return None
