"""
AI Service - Integrasi Groq + Gemini dengan fallback otomatis
Business Logic: Fair AI (tidak menggunakan data demografis)
"""
import json
from typing import List, Dict, Any, Optional
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.schema import HumanMessage, SystemMessage, AIMessage
from app.core.config import settings


class AIService:
    """
    Service untuk interaksi dengan AI (Groq primary, Gemini fallback)
    """
    
    def __init__(self):
        self.groq_client = None
        self.gemini_client = None
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize AI clients"""
        try:
            self.groq_client = ChatGroq(
                model="llama-3.1-70b-versatile",
                temperature=0.7,
                max_tokens=1024,
                timeout=30,
                max_retries=2
            )
        except Exception as e:
            print(f"Warning: Could not initialize Groq: {e}")
        
        try:
            self.gemini_client = ChatGoogleGenerativeAI(
                model="gemini-pro",
                temperature=0.7,
                max_output_tokens=1024,
                timeout=30
            )
        except Exception as e:
            print(f"Warning: Could not initialize Gemini: {e}")
    
    def _prepare_cv_context_for_ai(self, data_cv: Dict[str, Any]) -> str:
        """
        MENYIAPKAN CONTEXT CV UNTUK AI - FAIR AI IMPLEMENTATION
        ATURAN BISNIS: Data demografis (tanggal_lahir, jenis_kelamin) TIDAK dikirim ke AI
        Hanya skill, pengalaman, dan pencapaian yang digunakan
        """
        context_parts = []
        
        # Ringkasan profesional
        if data_cv.get('ringkasan_profesional'):
            context_parts.append(f"Ringkasan Profesional: {data_cv['ringkasan_profesional']}")
        
        # Pendidikan (tanpa tahun lahir)
        if data_cv.get('pendidikan'):
            pendidikan_list = []
            for edu in data_cv['pendidikan']:
                pend_desc = f"- {edu.get('jurusan', '')} di {edu.get('institusi', '')}"
                if edu.get('tahun_lulus'):
                    pend_desc += f" (Lulus: {edu['tahun_lulus']})"
                pendidikan_list.append(pend_desc)
            context_parts.append("Pendidikan:\n" + "\n".join(pendidikan_list))
        
        # Pengalaman kerja - FOKUS pada pencapaian
        if data_cv.get('pengalaman_kerja'):
            pengalaman_list = []
            for exp in data_cv['pengalaman_kerja']:
                exp_desc = f"- {exp.get('posisi', '')} di {exp.get('perusahaan', '')}"
                if exp.get('durasi'):
                    exp_desc += f" ({exp['durasi']})"
                pengalaman_list.append(exp_desc)
                
                # Poin-poin pencapaian
                if exp.get('pencapaian'):
                    for achievement in exp['pencapaian']:
                        pengalaman_list.append(f"  • {achievement}")
            
            context_parts.append("Pengalaman Kerja:\n" + "\n".join(pengalaman_list))
        
        # Keahlian
        if data_cv.get('keahlian'):
            context_parts.append(f"Keahlian: {', '.join(data_cv['keahlian'])}")
        
        # Proyek
        if data_cv.get('proyek'):
            proyek_list = []
            for project in data_cv['proyek']:
                proj_desc = f"- {project.get('nama', '')}: {project.get('deskripsi', '')}"
                if project.get('hasil'):
                    proj_desc += f" (Hasil: {project['hasil']})"
                proyek_list.append(proj_desc)
            context_parts.append("Proyek:\n" + "\n".join(proyek_list))
        
        # Sertifikasi
        if data_cv.get('sertifikasi'):
            cert_list = [f"- {cert.get('nama', '')} ({cert.get('penerbit', '')})" 
                        for cert in data_cv['sertifikasi']]
            context_parts.append("Sertifikasi:\n" + "\n".join(cert_list))
        
        return "\n\n".join(context_parts) if context_parts else "Tidak ada data CV"
    
    async def chat_with_interviewer(
        self,
        messages: List[Dict[str, str]],
        cv_data: Dict[str, Any],
        posisi_target: str,
        bahasa: str = 'id',
        riwayat_jawaban: Optional[List[Dict]] = None
    ) -> str:
        """
        Chat dengan AI pewawancara
        ATURAN BISNIS: AI bertindak sebagai HRD profesional, ramah namun kritis
        """
        cv_context = self._prepare_cv_context_for_ai(cv_data)
        
        # System prompt untuk interviewer
        system_prompt = self._get_interviewer_system_prompt(
            posisi_target=posisi_target,
            cv_context=cv_context,
            bahasa=bahasa
        )
        
        # Convert messages to LangChain format
        langchain_messages = [SystemMessage(content=system_prompt)]
        
        for msg in messages:
            if msg['role'] == 'user':
                langchain_messages.append(HumanMessage(content=msg['content']))
            elif msg['role'] == 'assistant':
                langchain_messages.append(AIMessage(content=msg['content']))
        
        # Try Groq first, fallback to Gemini
        response = await self._chat_with_fallback(langchain_messages)
        return response
    
    def _get_interviewer_system_prompt(
        self,
        posisi_target: str,
        cv_context: str,
        bahasa: str = 'id'
    ) -> str:
        """
        Generate system prompt untuk AI interviewer
        PERSONA: Profesional, ramah, namun kritis seperti HRD perusahaan teknologi top
        """
        if bahasa == 'en':
            return f"""You are a professional HR interviewer at a top tech company. Conduct an interview for the position of {posisi_target}.

INTERVIEW RULES:
1. Start with "Tell me about yourself" based on the candidate's professional summary
2. Ask specific questions about their work experience and projects from their CV
3. If answers are too brief, ask follow-up questions to dig deeper
4. Use the STAR method (Situation, Task, Action, Result) to evaluate responses
5. Be professional, friendly, but critical

CANDIDATE'S CV CONTEXT (Use this for personalized questions):
{cv_context}

LANGUAGE: English
Keep questions concise and professional. Maximum 2-3 sentences per question."""
        
        else:  # Bahasa Indonesia
            return f"""Anda adalah pewawancara HR profesional di perusahaan teknologi terkemuka. Lakukan wawancara untuk posisi {posisi_target}.

ATURAN WAWANCARA:
1. Selalu mulai dengan "Ceritakan tentang diri Anda" berdasarkan ringkasan profesional kandidat
2. Ajukan pertanyaan spesifik mengenai pengalaman kerja dan proyek dari CV kandidat
3. Jika jawaban terlalu singkat, lakukan follow-up (gali lebih dalam)
4. Gunakan metode STAR (Situation, Task, Action, Result) untuk menilai jawaban
5. Bersikap profesional, ramah, namun kritis
6. JANGAN pernah menanyakan atau menyinggung data demografis (umur, jenis kelamin, status pernikahan)

CONTEXT CV KANDIDAT (Gunakan untuk pertanyaan yang dipersonalisasi):
{cv_context}

BAHASA: Bahasa Indonesia
Buat pertanyaan ringkas dan profesional. Maksimal 2-3 kalimat per pertanyaan."""
    
    async def evaluate_interview(
        self,
        messages: List[Dict[str, str]],
        cv_data: Dict[str, Any],
        posisi_target: str,
        bahasa: str = 'id'
    ) -> Dict[str, Any]:
        """
        Evaluasi hasil wawancara menggunakan metode STAR
        Returns: skor, kekuatan, kelemahan, saran
        """
        cv_context = self._prepare_cv_context_for_ai(cv_data)
        
        # Format conversation history
        conversation_text = "\n".join([
            f"{msg['role']}: {msg['content']}" for msg in messages
        ])
        
        if bahasa == 'en':
            prompt = f"""Evaluate this interview conversation for a {posisi_target} position.

CONVERSATION:
{conversation_text}

CANDIDATE CV CONTEXT:
{cv_context}

Provide evaluation in JSON format:
{{
    "overall_score": 0-100,
    "star_analysis": {{
        "situation": "How well did they describe the situation?",
        "task": "How clear was their understanding of the task?",
        "action": "How specific were their actions?",
        "result": "Did they quantify results? (Critical!)"
    }},
    "strengths": ["list of strengths"],
    "weaknesses": ["list of weaknesses"],
    "recommendations": ["specific recommendations for improvement"]
}}

Focus on:
- Whether answers include quantifiable results (numbers, percentages)
- Specificity of actions taken
- Clarity of communication
- Relevance to the target position"""
        
        else:  # Bahasa Indonesia
            prompt = f"""Evaluasi percakapan wawancara ini untuk posisi {posisi_target}.

PERCAKAPAN:
{conversation_text}

CONTEXT CV KANDIDAT:
{cv_context}

Berikan evaluasi dalam format JSON:
{{
    "overall_score": 0-100,
    "star_analysis": {{
        "situation": "Seberapa baik mereka mendeskripsikan situasi?",
        "task": "Seberapa jelas pemahaman mereka tentang tugas?",
        "action": "Seberapa spesifik tindakan yang mereka ambil?",
        "result": "Apakah mereka menyebutkan hasil yang terukur? (Sangat Penting!)"
    }},
    "strengths": ["daftar kekuatan"],
    "weaknesses": ["daftar kelemahan"],
    "recommendations": ["rekomendasi spesifik untuk perbaikan"]
}}

Fokus pada:
- Apakah jawaban mencakup hasil yang terukur (angka, persentase)
- Spesifisitas tindakan yang diambil
- Kejelasan komunikasi
- Relevansi dengan posisi target"""
        
        langchain_messages = [HumanMessage(content=prompt)]
        response = await self._chat_with_fallback(langchain_messages)
        
        # Parse JSON response
        try:
            # Extract JSON from response (sometimes AI adds markdown)
            json_str = response.replace('```json', '').replace('```', '').strip()
            evaluation = json.loads(json_str)
            return evaluation
        except Exception as e:
            print(f"Error parsing evaluation JSON: {e}")
            return {
                "overall_score": 50,
                "star_analysis": {},
                "strengths": ["Komunikasi baik"],
                "weaknesses": ["Perlu peningkatan"],
                "recommendations": ["Latih penggunaan metode STAR"]
            }
    
    async def generate_cv_suggestions(
        self,
        cv_data: Dict[str, Any],
        interview_messages: List[Dict[str, str]],
        bahasa: str = 'id'
    ) -> List[Dict[str, str]]:
        """
        Generate saran perbaikan CV berdasarkan hasil wawancara
        ATURAN BISNIS: Ubah kalimat pasif menjadi aktif, tambahkan metrik kuantitatif
        """
        cv_context = self._prepare_cv_context_for_ai(cv_data)
        
        conversation_text = "\n".join([
            f"{msg['role']}: {msg['content']}" for msg in interview_messages
        ])
        
        if bahasa == 'en':
            prompt = f"""Analyze this CV and interview conversation to suggest specific improvements.

CURRENT CV:
{cv_context}

INTERVIEW CONVERSATION:
{conversation_text}

Identify 3-5 specific sentences/phrases from the CV that should be improved. For each:
1. Change passive voice to active voice
2. Add quantifiable metrics if possible (numbers, percentages, time saved)
3. Make it result-oriented

Example transformation:
- Before: "Made API for the system"
- After: "Designed and implemented REST API that improved data efficiency by 20%"

Return JSON array format:
[
    {{
        "bagian_cv": "experience/professional_summary/skills",
        "teks_asli": "original text from CV",
        "teks_saran_ai": "improved version",
        "alasan_perbaikan": "why this is better"
    }}
]

If no improvements needed, return empty array []."""
        
        else:  # Bahasa Indonesia
            prompt = f"""Analisis CV dan percakapan wawancara ini untuk memberikan saran perbaikan spesifik.

CV SAAT INI:
{cv_context}

PERCAKAPAN WAWANCARA:
{conversation_text}

Identifikasi 3-5 kalimat/frasa spesifik dari CV yang perlu diperbaiki. Untuk setiap:
1. Ubah kalimat pasif menjadi aktif
2. Tambahkan metrik kuantitatif jika memungkinkan (angka, persentase, waktu yang dihemat)
3. Buat berorientasi pada hasil

Contoh transformasi:
- Sebelum: "Membuat API untuk sistem"
- Sesudah: "Merancang dan mengimplementasikan REST API yang meningkatkan efisiensi data sebesar 20%"

Kembalikan dalam format array JSON:
[
    {{
        "bagian_cv": "experience/professional_summary/skills",
        "teks_asli": "teks asli dari CV",
        "teks_saran_ai": "versi yang diperbaiki",
        "alasan_perbaikan": "mengapa ini lebih baik"
    }}
]

Jika tidak ada perbaikan yang diperlukan, kembalikan array kosong []."""
        
        langchain_messages = [HumanMessage(content=prompt)]
        response = await self._chat_with_fallback(langchain_messages)
        
        # Parse JSON response
        try:
            json_str = response.replace('```json', '').replace('```', '').strip()
            suggestions = json.loads(json_str)
            return suggestions if isinstance(suggestions, list) else []
        except Exception as e:
            print(f"Error parsing CV suggestions JSON: {e}")
            return []
    
    async def generate_career_recommendations(
        self,
        cv_data: Dict[str, Any],
        bahasa: str = 'id'
    ) -> Dict[str, Any]:
        """
        Generate rekomendasi karir berdasarkan CV
        """
        cv_context = self._prepare_cv_context_for_ai(cv_data)
        
        if bahasa == 'en':
            prompt = f"""Based on this CV, provide career recommendations.

CV CONTEXT:
{cv_context}

Return JSON format:
{{
    "recommended_positions": [
        {{"title": "Job Title", "match_score": 0-100, "reason": "Why this fits"}}
    ],
    "recommended_companies": [
        {{"name": "Company Name", "reason": "Why this company"}}
    ],
    "career_advice": "General career advice based on profile"
}}"""
        
        else:  # Bahasa Indonesia
            prompt = f"""Berdasarkan CV ini, berikan rekomendasi karir.

CONTEXT CV:
{cv_context}

Kembalikan format JSON:
{{
    "recommended_positions": [
        {{"title": "Judul Pekerjaan", "match_score": 0-100, "reason": "Mengapa cocok"}}
    ],
    "recommended_companies": [
        {{"name": "Nama Perusahaan", "reason": "Mengapa perusahaan ini"}}
    ],
    "career_advice": "Saran karir umum berdasarkan profil"
}}"""
        
        langchain_messages = [HumanMessage(content=prompt)]
        response = await self._chat_with_fallback(langchain_messages)
        
        try:
            json_str = response.replace('```json', '').replace('```', '').strip()
            recommendations = json.loads(json_str)
            return recommendations
        except Exception as e:
            print(f"Error parsing career recommendations JSON: {e}")
            return {
                "recommended_positions": [],
                "recommended_companies": [],
                "career_advice": "Silakan konsultasikan dengan mentor karir"
            }
    
    async def _chat_with_fallback(self, messages: List) -> str:
        """
        Chat dengan AI menggunakan Groq, fallback ke Gemini jika error
        ATURAN BISNIS: Tidak boleh memutus sesi user jika Groq error
        """
        # Try Groq first
        if self.groq_client:
            try:
                response = await self.groq_client.ainvoke(messages)
                return response.content
            except Exception as e:
                print(f"Groq error, falling back to Gemini: {e}")
        
        # Fallback to Gemini
        if self.gemini_client:
            try:
                response = await self.gemini_client.ainvoke(messages)
                return response.content
            except Exception as e:
                print(f"Gemini error: {e}")
        
        raise Exception("All AI services unavailable")


# Singleton instance
ai_service = AIService()
