"""
Authentication module untuk validasi JWT token dari Supabase.
Menggunakan library PyJWT untuk decode token.
"""
import jwt
from typing import Optional
from fastapi import HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.config import settings
from app.schemas import TokenPayload


# Security scheme untuk Bearer token
security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    """
    Dependency untuk memvalidasi JWT token dari Supabase.
    
    Args:
        credentials: HTTP Authorization credentials dengan Bearer token
        
    Returns:
        dict: Payload token yang sudah di-decode (termasuk 'sub' sebagai user_id)
        
    Raises:
        HTTPException: Jika token tidak valid atau expired
    """
    token = credentials.credentials
    
    try:
        # Decode JWT token menggunakan service role key
        # Supabase menggunakan algoritma HS256
        payload = jwt.decode(
            token,
            settings.SUPABASE_SERVICE_ROLE_KEY,
            algorithms=["HS256"],
            options={"verify_exp": True}
        )
        
        # Validasi bahwa payload memiliki 'sub' (user ID)
        if "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token tidak valid: missing user ID",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return payload
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token telah expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token tidak valid: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )
