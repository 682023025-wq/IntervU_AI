"""
AI Service untuk integrasi dengan Groq (primary) dan Gemini (fallback).
Menggunakan LangChain untuk orchestration.
"""
import asyncio
from typing import List, Dict, Any
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from langchain_core.messages import BaseMessage

from app.config import settings


def _convert_history_to_langchain(history: List[Dict[str, str]]) -> List[BaseMessage]:
    """
    Mengkonversi history chat ke format LangChain messages.
    
    Args:
        history: List of dict dengan keys 'role' dan 'content'
        
    Returns:
        List of LangChain message objects
    """
    messages = []
    for msg in history:
        role = msg.get("role", "").lower()
        content = msg.get("content", "")
        
        if role == "system":
            messages.append(SystemMessage(content=content))
        elif role == "assistant":
            messages.append(AIMessage(content=content))
        else:  # user
            messages.append(HumanMessage(content=content))
    
    return messages


async def generate_ai_response(
    system_prompt: str,
    user_message: str,
    history: List[Dict[str, str]] = None
) -> str:
    """
    Generate response AI menggunakan Groq (Llama 3) sebagai primary,
    dengan fallback ke Google Gemini jika terjadi error.
    
    Args:
        system_prompt: Prompt sistem untuk mengatur perilaku AI
        user_message: Pesan dari user
        history: List history percakapan (opsional)
        
    Returns:
        str: Response dari AI
        
    Raises:
        Exception: Jika semua provider AI gagal
    """
    if history is None:
        history = []
    
    # Siapkan messages untuk LangChain
    messages = _convert_history_to_langchain(history)
    messages.insert(0, SystemMessage(content=system_prompt))
    messages.append(HumanMessage(content=user_message))
    
    # Coba Groq dulu (primary)
    try:
        return await _call_groq(messages)
    except Exception as e:
        print(f"Groq failed: {str(e)}. Falling back to Gemini...")
        
    # Fallback ke Gemini
    try:
        return await _call_gemini(messages)
    except Exception as e:
        print(f"Gemini also failed: {str(e)}")
        raise Exception(f"Semua AI provider gagal: Groq error, kemudian Gemini error: {str(e)}")


async def _call_groq(messages: List[BaseMessage]) -> str:
    """
    Call Groq API (Llama 3) untuk generate response.
    
    Args:
        messages: List of LangChain messages
        
    Returns:
        str: Response dari Groq
    """
    # Inisialisasi Groq client
    llm = ChatGroq(
        api_key=settings.GROQ_API_KEY,
        model="llama-3.1-70b-versatile",  # Model Llama 3 terbaru
        temperature=0.7,
        max_tokens=1024,
    )
    
    # Invoke model secara async
    response = await asyncio.get_event_loop().run_in_executor(
        None, 
        lambda: llm.invoke(messages)
    )
    
    return response.content


async def _call_gemini(messages: List[BaseMessage]) -> str:
    """
    Call Google Gemini API untuk generate response (fallback).
    
    Args:
        messages: List of LangChain messages
        
    Returns:
        str: Response dari Gemini
    """
    # Inisialisasi Gemini client
    llm = ChatGoogleGenerativeAI(
        api_key=settings.GEMINI_API_KEY,
        model="gemini-1.5-flash",  # Model Gemini cepat untuk fallback
        temperature=0.7,
        max_output_tokens=1024,
    )
    
    # Invoke model secara async
    response = await asyncio.get_event_loop().run_in_executor(
        None, 
        lambda: llm.invoke(messages)
    )
    
    return response.content


async def analyze_cv_for_recommendations(cv_data: Dict[str, Any]) -> str:
    """
    Analisis CV untuk memberikan rekomendasi karir.
    
    Args:
        cv_data: Data CV dalam format dictionary
        
    Returns:
        str: Analisis dan rekomendasi karir dari AI
    """
    system_prompt = """
    Anda adalah konselor karir profesional yang membantu kandidat menganalisis CV mereka
    dan memberikan rekomendasi posisi serta perusahaan yang cocok.
    
    Berikan analisis yang objektif berdasarkan keahlian, pengalaman, dan pendidikan.
    JANGAN gunakan data demografis (usia, jenis kelamin, dll) dalam analisis (Fair AI principle).
    
    Format respons:
    1. Ringkasan profil kandidat
    2. Posisi yang direkomendasikan (3-5 posisi)
    3. Perusahaan yang mungkin cocok
    4. Alasan rekomendasi
    """
    
    user_message = f"""
    Berikut adalah data CV kandidat:
    {cv_data}
    
    Tolong berikan analisis dan rekomendasi karir yang detail.
    """
    
    return await generate_ai_response(
        system_prompt=system_prompt,
        user_message=user_message,
        history=[]
    )


async def generate_interview_question(
    posisi: str,
    cv_data: Dict[str, Any],
    previous_questions: List[str] = None
) -> str:
    """
    Generate pertanyaan wawancara berdasarkan posisi dan CV.
    
    Args:
        posisi: Posisi target yang dilamar
        cv_data: Data CV kandidat
        previous_questions: List pertanyaan yang sudah ditanyakan
        
    Returns:
        str: Pertanyaan wawancara baru
    """
    if previous_questions is None:
        previous_questions = []
    
    system_prompt = f"""
    Anda adalah pewawancara profesional untuk posisi {posisi}.
    Tugas Anda adalah mengajukan pertanyaan wawancara yang relevan berdasarkan CV kandidat.
    
    Panduan:
    - Ajukan pertanyaan satu per satu, tidak sekaligus
    - Sesuaikan pertanyaan dengan pengalaman dan keahlian di CV
    - Hindari pertanyaan tentang data demografis (Fair AI)
    - Gunakan bahasa yang profesional dan ramah
    """
    
    previous_qs_str = "\n".join([f"- {q}" for q in previous_questions]) if previous_questions else "Belum ada pertanyaan sebelumnya"
    
    user_message = f"""
    Data CV kandidat:
    {cv_data}
    
    Pertanyaan yang sudah ditanyakan:
    {previous_qs_str}
    
    Tolong ajukan SATU pertanyaan wawancara berikutnya yang relevan.
    Jangan ulangi pertanyaan yang sudah ada.
    """
    
    return await generate_ai_response(
        system_prompt=system_prompt,
        user_message=user_message,
        history=[]
    )


async def evaluate_interview_performance(
    chat_history: List[Dict[str, str]],
    posisi: str
) -> Dict[str, Any]:
    """
    Evaluasi performa kandidat setelah sesi wawancara selesai.
    
    Args:
        chat_history: History lengkap percakapan wawancara
        posisi: Posisi target
        
    Returns:
        dict: Evaluasi performa termasuk skor dan feedback
    """
    system_prompt = f"""
    Anda adalah evaluator wawancara profesional untuk posisi {posisi}.
    Tugas Anda adalah mengevaluasi performa kandidat berdasarkan transkrip wawancara.
    
    Berikan evaluasi yang mencakup:
    1. Skor keseluruhan (0-100)
    2. Kekuatan kandidat
    3. Area yang perlu ditingkatkan
    4. Feedback spesifik untuk setiap jawaban
    
    Format output JSON:
    {{
        "skor": <integer 0-100>,
        "kekuatan": [<list of strengths>],
        "area_perbaikan": [<list of areas to improve>],
        "feedback": "<detailed feedback>"
    }}
    """
    
    chat_transcript = "\n".join([
        f"{msg['role']}: {msg['content']}" for msg in chat_history
    ])
    
    user_message = f"""
    Berikut adalah transkrip wawancara untuk posisi {posisi}:
    
    {chat_transcript}
    
    Tolong berikan evaluasi performa kandidat dalam format JSON.
    """
    
    response = await generate_ai_response(
        system_prompt=system_prompt,
        user_message=user_message,
        history=[]
    )
    
    # Parse JSON response (basic parsing, production should use proper JSON parser)
    import json
    try:
        # Extract JSON from response if it contains markdown code blocks
        if "```json" in response:
            json_str = response.split("```json")[1].split("```")[0].strip()
        elif "```" in response:
            json_str = response.split("```")[1].split("```")[0].strip()
        else:
            json_str = response
        
        return json.loads(json_str)
    except Exception as e:
        print(f"Failed to parse evaluation JSON: {e}")
        return {
            "skor": 50,
            "kekuatan": ["Tidak dapat dievaluasi"],
            "area_perbaikan": ["Error parsing response"],
            "feedback": response
        }
