from fastapi import APIRouter, HTTPException
from typing import List, Dict
from datetime import datetime, timedelta
import random

router = APIRouter()

# Mock data for development
mock_sessions = [
    {
        "id": 1,
        "date": (datetime.now() - timedelta(days=1)).isoformat(),
        "position": "Software Engineer",
        "score": 85,
        "status": "Completed"
    },
    {
        "id": 2,
        "date": (datetime.now() - timedelta(days=3)).isoformat(),
        "position": "Frontend Developer",
        "score": 72,
        "status": "Completed"
    },
    {
        "id": 3,
        "date": (datetime.now() - timedelta(days=7)).isoformat(),
        "position": "Full Stack Developer",
        "score": 90,
        "status": "Completed"
    }
]

@router.get("/stats")
async def get_dashboard_stats():
    """
    Get dashboard statistics for the logged-in user
    In production, this will fetch from Supabase database
    """
    # Calculate stats from mock sessions
    total_interviews = len(mock_sessions)
    avg_score = sum(s["score"] for s in mock_sessions) // total_interviews if total_interviews > 0 else 0
    
    return {
        "user": {
            "name": "Demo User",
            "email": "user@example.com"
        },
        "totalInterviews": total_interviews,
        "avgScore": avg_score,
        "recentSessions": mock_sessions[:5]  # Return last 5 sessions
    }

@router.get("/sessions")
async def get_sessions(limit: int = 10):
    """
    Get list of interview sessions
    """
    return {"sessions": mock_sessions[:limit]}

@router.get("/session/{session_id}")
async def get_session(session_id: int):
    """
    Get details of a specific interview session
    """
    session = next((s for s in mock_sessions if s["id"] == session_id), None)
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    return {
        **session,
        "questions": [
            {"question": "Tell me about yourself", "score": 85, "feedback": "Good introduction"},
            {"question": "What are your strengths?", "score": 90, "feedback": "Well articulated"},
            {"question": "Describe a challenging project", "score": 80, "feedback": "Could be more specific"}
        ],
        "overall_feedback": "Great performance! Focus on providing more specific examples."
    }
