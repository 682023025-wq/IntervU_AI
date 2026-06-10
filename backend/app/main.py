from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, dashboard

app = FastAPI(
    title="IntervU AI API",
    description="AI Mock Interview Platform Backend",
    version="1.0.0"
)

# CORS Middleware (for development without proxy)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

@app.get("/")
async def root():
    return {"message": "Welcome to IntervU AI API", "version": "1.0.0"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
