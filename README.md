# 🎯 IntervU AI - Platform Mock Interview Berbasis AI

Platform simulasi interview kerja dengan AI untuk membantu pengguna mempersiapkan diri menghadapi wawancara kerja sesungguhnya.

---

## 📚 Dokumentasi Lengkap

Proyek ini memiliki beberapa dokumen referensi utama:

| Dokumen | Deskripsi |
|---------|-----------|
| [`PROJECT_STRUCTURE.md`](./PROJECT_STRUCTURE.md) | **STRUKTUR PROYEK** - Struktur folder, framework, dan library yang digunakan |
| [`intervu-db-schema.md`](./intervu-db-schema.md) | **DATABASE SCHEMA** - Desain tabel Supabase & relasi antar entitas |
| [`INTERVU_AI_SCHEMA.md`](./INTERVU_AI_SCHEMA.md) | **AI LOGIC** - Business logic, prompt engineering, dan alur evaluasi AI |
| [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) | **UI/UX DESIGN** - Warna, tipografi, spacing, dan komponen visual |
| [`skema-cv-intervu-ai.md`](./skema-cv-intervu-ai.md) | **CV SCHEMA** - Format dan struktur data CV pengguna |

---

## 🚀 Quick Start - Menjalankan Proyek

### ⚡ Mode Development (1 Perintah)

Jalankan backend (FastAPI) dan frontend (React) **bersamaan** tanpa masalah CORS:

```bash
# Install dependency root (hanya sekali)
npm install

# Jalankan kedua server sekaligus
npm run dev
```

**Apa yang terjadi?**
- ✅ FastAPI berjalan di `http://localhost:8000`
- ✅ React/Vite berjalan di `http://localhost:5173`
- ✅ Proxy otomatis meneruskan request `/api/*` ke backend
- ✅ **Tidak ada CORS error**
- ✅ Hot-reload aktif di kedua sisi

### 📦 Mode Production

Build frontend dan sajikan melalui FastAPI (1 server saja):

```bash
# Build frontend
npm run build:frontend

# Jalankan backend production
npm run start:prod
```

Akses aplikasi di `http://localhost:8000`

---

## 🛠️ Setup Manual (Opsional)

Jika ingin menjalankan backend dan frontend secara terpisah:

### Backend (FastAPI)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

---

## 🔧 Konfigurasi Environment

### Backend `.env` (`backend/.env`)
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
JSEARCH_API_KEY=your_jsearch_api_key
```

### Frontend `.env` (`frontend/.env`)
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

> ⚠️ **Catatan:** Dengan konfigurasi proxy Vite, tidak perlu lagi mengatur `VITE_BACKEND_URL` karena semua request `/api` otomatis diteruskan ke `http://localhost:8000`.

---

## 📁 Struktur Proyek

```
intervu-ai/
│
├── backend/                 # 🐍 Python FastAPI
│   ├── app/
│   │   ├── routers/         # API Endpoints
│   │   ├── ai_engine.py     # AI Logic (Gemini & Groq)
│   │   ├── database.py      # Supabase Connection
│   │   ├── models.py        # Database Models
│   │   ├── schemas.py       # Pydantic Schemas
│   │   ├── config.py        # Environment Config
│   │   └── main.py          # Entry Point
│   ├── .env
│   └── requirements.txt
│
├── frontend/                # ⚛️ React + Vite
│   ├── public/
│   ├── src/
│   │   ├── pages/           # Main Pages
│   │   ├── components/      # Reusable Components
│   │   ├── api/             # API Client (Axios)
│   │   ├── styles/          # Global CSS
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   └── package.json
│
├── package.json             # Root package.json (concurrently)
├── vite.config.js           # Vite Proxy Configuration
└── README.md
```

---

## 🎨 Fitur Utama

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Google Login** | Autentikasi via Supabase Auth (OAuth) |
| 📄 **CV Builder** | Buat, edit, dan download CV dalam format PDF |
| 🎥 **Mock Interview** | Simulasi interview dengan video & audio real-time |
| 🤖 **AI Evaluation** | Evaluasi performa menggunakan Gemini/Groq dengan failover otomatis |
| 💼 **Job Search** | Pencarian dan rekomendasi lowongan kerja via JSearch API |
| 📊 **Dashboard** | Statistik dan progress persiapan interview |

---

## 🧑‍💻 Tech Stack

### Backend
- **Framework:** FastAPI
- **Database:** Supabase (PostgreSQL)
- **AI Engine:** Google Gemini + Groq (Failover)
- **PDF Generator:** fpdf2
- **HTTP Client:** httpx

### Frontend
- **Framework:** React 18 + Vite
- **Styling:** Tailwind CSS
- **State Management:** Zustand
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** Lucide React
- **Video/Audio:** react-webcam

---

## 📋 Alur Kerja Development

1. **Tambah fitur baru?**
   - Backend: Buat router baru di `backend/app/routers/`
   - Frontend: Buat page baru di `frontend/src/pages/`

2. **Ubah UI/Design?**
   - Edit komponen di `frontend/src/components/UI.jsx`
   - Sesuaikan style di `frontend/src/styles/global.css`

3. **Ubah logic AI?**
   - Edit `backend/app/ai_engine.py`

4. **Ubah schema database?**
   - Update `backend/app/models.py` dan `intervu-db-schema.md`

---

## 🚨 Troubleshooting

### CORS Error
Jika muncul error CORS, pastikan:
1. File `frontend/vite.config.js` sudah memiliki konfigurasi proxy
2. Base URL di `frontend/src/api/client.js` menggunakan path relatif `/api`

### Server Tidak Jalan
- Pastikan port 8000 (backend) dan 5173 (frontend) tidak digunakan aplikasi lain
- Restart terminal dan jalankan ulang `npm run dev`

---

## 📞 Kontak & Kontribusi

Untuk pertanyaan atau kontribusi, silakan buat issue di repository ini.

**Happy Coding! 🚀**
