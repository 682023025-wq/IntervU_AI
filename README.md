Ini teks `README.md` yang lengkap dan siap copy-paste. Tinggal salin dan tempel ke file `README.md` di folder utama project kamu.

```markdown
# 🎙️ IntervU AI - Simulasi Wawancara Kerja Berbasis Kecerdasan Buatan

![Status](https://img.shields.io/badge/Status-Development-blue)
![Python](https://img.shields.io/badge/Python-3.10+-green)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-teal)
![React](https://img.shields.io/badge/React-18-blue)

**IntervU AI** adalah aplikasi web simulasi wawancara kerja yang didukung oleh Kecerdasan Buatan (AI). Aplikasi ini dirancang untuk membantu mahasiswa dan *fresh graduate* mempersiapkan diri menghadapi wawancara kerja nyata melalui simulasi interaktif, analisis CV otomatis, dan rekomendasi karier yang dipersonalisasi.

> ⚠️ **Catatan Akademis:** Proyek ini dikembangkan sebagai bagian dari tugas akhir (skripsi) dengan fokus pada implementasi **Fair AI** (menghilangkan bias demografis dalam penilaian AI) dan arsitektur *Human-in-the-Loop* untuk perbaikan CV.

---

## ✨ Fitur Utama

1. **🔐 Autentikasi Aman:** Login menggunakan Google OAuth via Supabase Auth.
2. **📝 Manajemen CV Terstruktur:** Input data CV dalam format JSON terstruktur, memudahkan AI memahami konteks secara akurat.
3. **⚖️ Prinsip Fair AI:** AI pewawancara dan evaluator **tidak** memiliki akses ke data demografis sensitif (usia, jenis kelamin), memastikan penilaian murni berdasarkan kompetensi dan pengalaman.
4. **🎤 Simulasi Wawancara Multi-Mode:** Mendukung mode Teks, Audio, dan Video dengan antarmuka yang responsif (Mobile & Desktop).
5. **💡 Human-in-the-Loop CV Improvement:** AI memberikan saran perbaikan kalimat CV, dan pengguna memiliki kendali penuh untuk *Menerima*, *Menolak*, atau *Mengedit* saran tersebut sebelum diterapkan.
6. **💼 Rekomendasi Karir Hybrid:** Analisis AI untuk posisi yang cocok, diperkaya dengan data lowongan kerja real-time dari JSearch API (dengan mekanisme *caching* untuk efisiensi).

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
| :--- | :--- |
| **Backend** | FastAPI, Python 3.10+, SQLAlchemy (Async), Pydantic V2 |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router v6, Axios |
| **Database** | PostgreSQL (via Supabase) |
| **AI / LLM** | LangChain, Groq (Llama 3 - Primary), Google Gemini (Fallback) |
| **Storage** | Cloudinary (untuk foto profil & foto CV 3x4) |
| **External API** | JSearch API (via RapidAPI) untuk data lowongan kerja |

---

## 📂 Struktur Proyek

```text
intervu-ai/
├── 📂 backend/                 # Aplikasi Backend (FastAPI)
│   ├── 📂 app/
│   │   ├── main.py             # Entry point & konfigurasi CORS
│   │   ├── config.py           # Manajemen environment variables (Pydantic V2)
│   │   ├── database.py         # Koneksi async ke PostgreSQL
│   │   ├── models.py           # SQLAlchemy ORM Models
│   │   ├── schemas.py          # Pydantic Schemas untuk validasi
│   │   ├── auth.py             # Validasi JWT Token Supabase
│   │   ├── ai_service.py       # Logika integrasi Groq & Gemini
│   │   └── routes.py           # Semua API Endpoints (/api/v1/...)
│   ├── .env.example            # Template environment variables
│   └── requirements.txt        # Dependencies Python
│
├── 📂 frontend/                # Aplikasi Frontend (React)
│   ├── 📂 src/
│   │   ├── 📂 components/      # Komponen UI reusable (Button, Card, dll)
│   │   ├── 📂 pages/           # Halaman utama (Home, Login, Dashboard, Interview)
│   │   ├── 📂 services/        # Konfigurasi Axios & API calls
│   │   ├── App.jsx             # Routing aplikasi
│   │   └── main.jsx            # Entry point React
│   ├── .env.example
│   └── package.json
│
└── README.md                   # Dokumentasi ini
```

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

### Prasyarat
Pastikan Anda telah menginstal:
- [Python 3.10+](https://www.python.org/)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME_ANDA/intervu-ai.git
cd intervu-ai
```

### 2. Setup Backend
```bash
cd backend

# Buat dan aktifkan virtual environment
python -m venv venv
source venv/bin/activate  # Untuk Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Buat file .env dari contoh
cp .env.example .env
# ⚠️ PENTING: Isi file .env dengan credentials Anda sendiri

# Jalankan server backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
Backend akan berjalan di: `http://localhost:8000`  
Dokumentasi API (Swagger) tersedia di: `http://localhost:8000/docs`

### 3. Setup Frontend
```bash
# Buka terminal baru, lalu masuk ke folder frontend
cd frontend

# Install dependencies
npm install

# Buat file .env dari contoh
cp .env.example .env
# ⚠️ PENTING: Isi VITE_API_URL dengan URL backend Anda

# Jalankan development server
npm run dev
```
Frontend akan berjalan di: `http://localhost:5173`

---

## 🔑 Environment Variables

Jangan pernah meng-commit file `.env` yang berisi kredensial asli. 

**Backend (`.env`)**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
DATABASE_URL=postgresql://user:password@host:port/dbname
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
JSEARCH_API_KEY=your_jsearch_api_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Frontend (`.env`)**
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## ⚖️ Lisensi & Hak Kekayaan Intelektual (HAKI)

Proyek ini dilindungi oleh hak cipta. Kode sumber ini disediakan untuk tujuan akademis dan referensi. 
Dilarang memperbanyak, mendistribusikan, atau menggunakan kode ini untuk tujuan komersial tanpa izin tertulis dari penulis.

**© 2024 Agil. All Rights Reserved.**
```