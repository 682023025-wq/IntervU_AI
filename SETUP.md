# IntervU AI - Setup Guide

## 📋 Prerequisites

- **Python 3.9+** for backend
- **Node.js 18+** for frontend
- **npm** or **yarn** package manager

## 🚀 Quick Start

### 1. Clone & Navigate
```bash
cd intervu-ai
```

### 2. Install Dependencies

#### Root (for concurrent runner)
```bash
npm install
```

#### Frontend
```bash
cd frontend
npm install
cd ..
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 3. Configure Environment Variables

#### Backend (.env)
```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your actual keys:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
JSEARCH_API_KEY=your_jsearch_api_key
SECRET_KEY=your_random_secret_key_here
```

#### Frontend (.env)
```bash
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env`:
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

From the **root directory**:
```bash
npm run dev
```

This will start:
- **Backend**: http://localhost:8000
- **Frontend**: http://localhost:5173

✅ **No CORS issues** - Vite proxy handles all `/api` requests automatically!

## 🧪 Test the Application

1. Open browser: http://localhost:5173
2. Login with any email/password (demo mode auto-creates user)
   - Email: `user@example.com`
   - Password: `password123`
3. You'll be redirected to Dashboard

## 📦 Production Build

```bash
# Build frontend
npm run build:frontend

# Start production server (backend serves frontend)
npm run start:prod
```

Access at: http://localhost:8000

## 🛠️ Manual Run (Alternative)

If you prefer to run services separately:

### Backend Only
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

### Frontend Only
```bash
cd frontend
npm run dev
```

## 📁 Project Structure

```
intervu-ai/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── routers/         # API endpoints (auth, dashboard, etc.)
│   │   ├── main.py          # Entry point
│   │   └── ...              # Other modules
│   ├── .env                 # Environment variables (DO NOT COMMIT)
│   ├── .env.example         # Template for .env
│   ├── requirements.txt     # Python dependencies
│   └── .gitignore
│
├── frontend/                # React + Vite Frontend
│   ├── src/
│   │   ├── pages/           # Main pages (Login, Dashboard)
│   │   ├── components/      # Reusable components
│   │   ├── api/             # API client (axios setup)
│   │   ├── styles/          # Global CSS & Tailwind
│   │   ├── App.jsx          # Router configuration
│   │   └── main.jsx         # Entry point
│   ├── public/              # Static assets
│   ├── .env                 # Environment variables (DO NOT COMMIT)
│   ├── .env.example         # Template for .env
│   ├── package.json         # Dependencies
│   ├── vite.config.js       # Vite config with proxy
│   ├── tailwind.config.js   # Tailwind CSS config
│   └── .gitignore
│
├── package.json             # Root package.json (concurrent runner)
├── README.md                # Main documentation
└── .gitignore               # Git ignore rules
```

## 🔧 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Run both frontend & backend (development) |
| `npm run build:frontend` | Build frontend for production |
| `npm run start:prod` | Start production server |

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Module Not Found (Python)
```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt
```

### Dependency Issues (Node)
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### CORS Errors
Make sure you're accessing frontend via `http://localhost:5173` (not direct backend URL). The proxy is configured in `frontend/vite.config.js`.

## 📚 Documentation

- `README.md` - Main overview
- `PROJECT_STRUCTURE.md` - Detailed structure guide
- `intervu-db-schema.md` - Database schema
- `INTERVU_AI_SCHEMA.md` - AI logic and flow
- `DESIGN_SYSTEM.md` - UI/UX guidelines
- `skema-cv-intervu-ai.md` - CV generation schema

## 🎯 Next Steps

1. ✅ Setup complete - Login & Dashboard working
2. 🔲 Implement CV page (`frontend/src/pages/CV.jsx`)
3. 🔲 Implement Interview page (`frontend/src/pages/Interview.jsx`)
4. 🔲 Implement Jobs page (`frontend/src/pages/Jobs.jsx`)
5. 🔲 Implement Profile page (`frontend/src/pages/Profile.jsx`)
6. 🔲 Connect to real Supabase database
7. 🔲 Integrate Gemini/Groq AI engines
8. 🔲 Add job search functionality

Happy coding! 🚀
