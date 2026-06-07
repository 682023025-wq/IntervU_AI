# IntervU AI Backend

Backend API untuk aplikasi **IntervU AI** - Simulasi Wawancara Kerja Berbasis AI.

## 🚀 Tech Stack

- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL via Supabase
- **ORM**: SQLAlchemy (async) + asyncpg
- **Validation**: Pydantic V2
- **Authentication**: JWT (Supabase Auth)
- **AI Integration**: LangChain dengan Groq (primary) + Gemini (fallback)

## 📁 Struktur Folder

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # Entry point FastAPI
│   ├── config.py            # Konfigurasi environment
│   ├── database.py          # Koneksi database async
│   ├── models.py            # SQLAlchemy ORM models
│   ├── schemas.py           # Pydantic schemas
│   ├── auth.py              # JWT authentication
│   ├── ai_service.py        # Integrasi AI (Groq + Gemini)
│   └── routes.py            # API endpoints
├── .env                     # Environment variables (JANGAN commit!)
├── .env.example             # Template environment variables
├── .gitignore
├── requirements.txt
└── README.md
```

## 🛠️ Setup & Instalasi

### 1. Clone Repository

```bash
cd backend
```

### 2. Buat Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Setup Environment Variables

Copy file `.env.example` ke `.env` dan isi dengan credentials Anda:

```bash
cp .env.example .env
```

Edit `.env` dengan nilai yang sesuai:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

DATABASE_URL=postgresql+asyncpg://postgres:password@db.host:5432/postgres

GROQ_API_KEY=gsk_your-key
GEMINI_API_KEY=your-key

# ... dan lainnya
```

### 5. Jalankan Server Development

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server akan berjalan di: `http://localhost:8000`

## 📚 API Documentation

Setelah server berjalan, akses dokumentasi interaktif:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔑 Authentication

Semua endpoint API memerlukan JWT token dari Supabase Auth.

Sertakan token di header request:

```
Authorization: Bearer <your-jwt-token>
```

## 📡 API Endpoints

### Profiles
- `GET /api/v1/profiles/me` - Get profil saya
- `PUT /api/v1/profiles/me` - Update profil saya

### Sessions (Wawancara)
- `POST /api/v1/sessions` - Buat sesi wawancara baru
- `GET /api/v1/sessions` - List semua sesi
- `GET /api/v1/sessions/{id}` - Detail sesi
- `GET /api/v1/sessions/{id}/messages` - List pesan dalam sesi
- `POST /api/v1/sessions/{id}/messages` - Kirim pesan (AI auto-respond)
- `POST /api/v1/sessions/{id}/complete` - Selesaikan sesi & dapat evaluasi

### Recommendations
- `GET /api/v1/recommendations` - List rekomendasi karir
- `POST /api/v1/recommendations/generate` - Generate rekomendasi baru dari CV

### Jobs
- `GET /api/v1/jobs` - List lowongan kerja
- `POST /api/v1/jobs/fetch` - Fetch lowongan baru dari API eksternal

### CV Suggestions
- `GET /api/v1/cv-suggestions` - List saran perbaikan CV
- `POST /api/v1/sessions/{id}/cv-suggestions` - Buat saran baru
- `PATCH /api/v1/cv-suggestions/{id}` - Update status saran

### Health Check
- `GET /api/v1/health` - Cek status server

## 🤖 AI Integration

Aplikasi menggunakan 2 AI provider dengan fallback:

1. **Primary**: Groq (Llama 3.1 70B) - Cepat dan akurat
2. **Fallback**: Google Gemini 1.5 Flash - Jika Groq gagal

### Fair AI Principle

Aplikasi ini TIDAK menggunakan data demografis (usia, jenis kelamin, suku, agama) dalam:
- Analisis CV
- Evaluasi wawancara
- Rekomendasi karir

Ini untuk memastikan penilaian yang adil dan objektif untuk semua kandidat.

## 🗄️ Database Schema

Database menggunakan PostgreSQL dengan tabel:
- `profiles` - Data pengguna
- `sesi_wawancara` - Sesi wawancara
- `pesan_wawancara` - Chat history
- `rekomendasi_karir` - Rekomendasi dari AI
- `lowongan_karir` - Lowongan kerja
- `saran_perbaikan_cv` - Saran improvement CV

Schema lengkap ada di file SQL terpisah (lihat root project).

## 🔒 Row Level Security (RLS)

Semua tabel memiliki RLS enabled. User hanya bisa akses data mereka sendiri berdasarkan `auth.uid()` dari Supabase.

## 🧪 Testing

```bash
# Run tests (akan ditambahkan)
pytest
```

## 📝 License

MIT License

## 👥 Team

Dibuat dengan ❤️ oleh Tim IntervU AI
