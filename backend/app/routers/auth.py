from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional

router = APIRouter()

# Mock database for development (replace with Supabase in production)
fake_users_db = {
    "user@example.com": {
        "email": "user@example.com",
        "hashed_password": "$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3VsPGiwUv.",  # "password"
        "name": "Test User"
    }
}

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Optional[dict] = None

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

@router.post("/login", response_model=LoginResponse)
async def login(login_data: LoginRequest):
    """
    Login endpoint - returns JWT token
    In production, this will verify against Supabase Auth
    """
    user = fake_users_db.get(login_data.email)
    
    if not user:
        # For demo purposes, auto-create user if doesn't exist
        fake_users_db[login_data.email] = {
            "email": login_data.email,
            "hashed_password": "demo_password",
            "name": login_data.email.split('@')[0]
        }
        user = fake_users_db[login_data.email]
    
    # In production, verify password hash here
    # For demo, just return token
    return {
        "access_token": f"demo_token_{login_data.email}",
        "token_type": "bearer",
        "user": {
            "email": user["email"],
            "name": user.get("name", "User")
        }
    }

@router.post("/register", response_model=LoginResponse)
async def register(register_data: RegisterRequest):
    """
    Register endpoint - creates new user and returns JWT token
    In production, this will create user in Supabase Auth
    """
    if register_data.email in fake_users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Store user (in production, use Supabase)
    fake_users_db[register_data.email] = {
        "email": register_data.email,
        "hashed_password": register_data.password,  # In production, hash this!
        "name": register_data.name
    }
    
    return {
        "access_token": f"demo_token_{register_data.email}",
        "token_type": "bearer",
        "user": {
            "email": register_data.email,
            "name": register_data.name
        }
    }
