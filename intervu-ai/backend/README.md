# IntervU AI - Backend

Backend FastAPI untuk aplikasi IntervU AI (AI Interview Platform).

## 🚀 Fitur Utama

- **Autentikasi Supabase**: JWT validation untuk user authentication
- **Manajemen Profil & CV**: CRUD profil dengan Fair AI implementation
- **Sesi Wawancara**: Manajemen sesi wawancara (teks, audio, video)
- **AI Chat Integration**: Groq (primary) + Gemini (fallback) untuk AI interviewer
- **Evaluasi AI**: Analisis menggunakan metode STAR
- **Saran Perbaikan CV**: Human-in-the-loop CV improvement
- **Cloudinary Integration**: Upload foto profil dan CV photo

## 📋 Prerequisites

- Python 3.10+
- PostgreSQL (Supabase)
- API Keys:
  - Supabase (URL + Keys)
  - Groq API
  - Google Gemini API
  - JSearch API (optional)
  - Cloudinary (optional)

## ⚙️ Instalasi

1. **Clone repository**
```bash
cd intervU-ai/backend
```

2. **Buat virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
# atau
venv\Scripts\activate  # Windows
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env dengan credentials Anda
```

5. **Jalankan server**
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server akan berjalan di `http://localhost:8000`

## 📚 API Documentation

Setelah server berjalan, akses dokumentasi API:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔑 Endpoint Utama

### Authentication
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/verify` - Verify token

### Profiles
- `GET /api/v1/profiles/me` - Get my profile
- `PATCH /api/v1/profiles/me` - Update profile
- `PUT /api/v1/profiles/me/cv` - Update CV data
- `POST /api/v1/profiles/me/upload-avatar` - Upload avatar
- `POST /api/v1/profiles/me/upload-cv-photo` - Upload CV photo

### Sessions
- `POST /api/v1/sessions/` - Create interview session
- `GET /api/v1/sessions/active` - Get active session
- `GET /api/v1/sessions/` - Get my sessions
- `GET /api/v1/sessions/{id}` - Get session by ID
- `PATCH /api/v1/sessions/{id}/complete` - Complete session
- `POST /api/v1/sessions/{id}/abandon` - Abandon session

### AI Chat
- `POST /api/v1/chat/{session_id}/send` - Send message to AI
- `GET /api/v1/chat/{session_id}/history` - Get chat history
- `POST /api/v1/chat/{session_id}/end` - End interview & get evaluation

## 🧠 Business Logic Highlights

### Fair AI Implementation
- Data demografis (tanggal_lahir, jenis_kelamin) disimpan di database untuk CV formal
- **TIDAK** dikirim ke AI saat wawancara
- AI hanya menganalisis skill, pengalaman, dan pencapaian

### AI Fallback
- Primary: Groq (Llama 3.1 70B)
- Fallback: Google Gemini
- Tidak memutus sesi user jika primary AI error

### Caching Lowongan Kerja
- Hasil JSearch API di-cache selama 7 hari
- Menghemat kuota API calls
- User mendapat data yang sama untuk posisi yang sama

### Human-in-the-Loop CV Improvement
- AI memberikan saran perbaikan CV
- User punya 3 opsi: Terima, Tolak, atau Edit
- Jika Edit, user bisa modifikasi saran AI sebelum menyimpan

## 🧪 Testing

```bash
pytest tests/
```

## 🐳 Docker (Optional)

```bash
docker build -t intervu-backend .
docker run -p 8000:8000 --env-file .env intervu-backend
```

## 📁 Struktur Folder

```
backend/
├── app/
│   ├── core/           # Config, database, security
│   ├── api/v1/         # API routes
│   ├── models/         # SQLAlchemy models
│   ├── schemas/        # Pydantic schemas
│   ├── services/       # Business logic
│   └── utils/          # Helper functions
├── tests/              # Unit tests
├── requirements.txt
└── .env.example
```

## 🔒 Security

- JWT token validation dari Supabase Auth
- Row Level Security (RLS) di database
- User hanya bisa akses data mereka sendiri
- Service role untuk backend operations

## 📝 License

Proprietary - Hak Cipta dilindungi
