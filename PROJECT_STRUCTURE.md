# IntervU AI - Project Structure & Framework

## 📁 Project Structure (English)

```
intervu-ai/
│
├── backend/                 # 🐍 Python FastAPI
│   ├── app/
│   │   ├── routers/         # 🔀 API Endpoints (Separated by menu)
│   │   │   ├── auth.py      # Login & Register (Google OAuth)
│   │   │   ├── dashboard.py # Data for Dashboard
│   │   │   ├── interview.py # Session, Messages, & Interview Evaluation
│   │   │   ├── cv.py        # CRUD CV & Download PDF
│   │   │   └── jobs.py      # Job Search & Recommendations
│   │   │
│   │   ├── ai_engine.py     #  AI Logic (Gemini & Groq Failover)
│   │   ├── database.py      # Supabase Connection
│   │   ├── models.py        # Database Table Formats
│   │   ├── schemas.py       # API Input/Output Data Format (Pydantic)
│   │   ├── config.py        # Read .env file (API Keys, etc.)
│   │   └── main.py          # Backend Entry Point
│   │
│   ├── .env                 # API Keys & Database URL (Do NOT commit!)
│   └── requirements.txt     # Python Libraries List
│
├── frontend/                # ⚛️ React + Vite
│   ├── public/              # Static files (favicon, logo, robots.txt)
│   ├── src/
│   │   ├── pages/           #  MAIN PAGES (Flat Structure, 1 file = 1 menu)
│   │   │   ├── Login.jsx          # Login & Register Page
│   │   │   ├── Dashboard.jsx      # Dashboard Page
│   │   │   ├── CV.jsx             # Create & Edit CV Page
│   │   │   ├── Interview.jsx      # Simulation & Interview Results Page
│   │   │   ├── Jobs.jsx           # Job Search Page
│   │   │   └── Profile.jsx        # Account Settings Page
│   │   │
│   │   ├── components/      # 🧩 GLOBAL COMPONENTS (Reusable anywhere)
│   │   │   ├── Layout.jsx         # Contains Navbar Desktop & BottomNav Mobile
│   │   │   └── UI.jsx             # Contains Buttons, Inputs, Cards, Badges (Design System)
│   │   │
│   │   ├── api/             #  BACKEND CALL FUNCTIONS
│   │   │   └── client.js        # Axios/Fetch Setup to connect to Backend
│   │   │
│   │   ├── styles/          # 🎨 CSS & DESIGN SYSTEM
│   │   │   └── global.css       # Colors, Fonts, Spacing (according to desain.md)
│   │   │
│   │   ├── App.jsx          # Route Configuration (Routing between pages)
│   │   └── main.jsx         # React Entry Point
│   │
│   ├── .env                 # Backend URL & Vite Configuration
│   ├── index.html
│   └── package.json
│
└── README.md                # Project running instructions
```

---

## 🛠️ Framework & Libraries

### 🐍 1. Backend (Python FastAPI)

**Main Framework:** `FastAPI` (Very fast, modern, auto-generates API documentation)

**Supporting Libraries (`requirements.txt`):**
- **Database & Auth:** `supabase` (For Supabase connection and Google Auth)
- **AI Engine:** `google-generativeai` (Gemini) and `groq` (Groq API)
- **HTTP Requests:** `httpx` (For async calls to JSearch API and AI)
- **Environment:** `python-dotenv` (To read `.env` file)
- **PDF Generator:** `fpdf2` or `reportlab` (To generate downloadable CV PDF)
- **CORS:** `fastapi` (Built-in, to allow frontend access)
- **Data Validation:** `pydantic` (For data schemas)

📥 **Backend Installation:**
```bash
pip install fastapi uvicorn supabase google-generativeai groq httpx python-dotenv fpdf2 pydantic
```

---

### ⚛️ 2. Frontend (React + Vite)

**Main Framework:** `React.js` with Build Tool `Vite` (Very fast during development)

**Supporting Libraries (`package.json`):**
- **Routing:** `react-router-dom` (For page navigation: Login -> Dashboard -> Interview)
- **HTTP Client:** `axios` (For sending data to Backend)
- **Styling (Design System):** `tailwindcss` (Perfect for applying colors & layout from `desain.md` quickly)
- **State Management:** `zustand` (Much simpler and lighter than Redux for storing user/session data)
- **Form & Validation:** `react-hook-form` + `zod` (For CV and Profile input validation)
- **Icons:** `lucide-react` (Modern and lightweight icons for UI)
- **Video/Audio:** `react-webcam` (For camera/mic access during interview simulation)
- **PDF Preview:** `react-to-print` (For CV download/print feature)

📥 **Frontend Installation:**
```bash
npm install react-router-dom axios tailwindcss zustand react-hook-form zod lucide-react react-webcam react-to-print
```

---

## 📝 Feature to Framework Mapping

| Application Feature | Framework / Library Used |
| :--- | :--- |
| **Google Login** | Supabase Auth (Backend) + Supabase JS (Frontend) |
| **UI Design (Blue/White)** | Tailwind CSS (Frontend) |
| **Page Navigation** | React Router DOM (Frontend) |
| **Video Simulation** | React Webcam + MediaRecorder API (Frontend) |
| **Dual AI (Gemini/Groq)** | `google-generativeai` & `groq` (Backend) |
| **Job Search** | `httpx` / `axios` to JSearch API (Backend) |
| **Download CV PDF** | `fpdf2` (Backend) or `react-to-print` (Frontend) |

---

## 💡 Quick Edit Cheat Sheet

Because the structure is very flat, you don't need to open many folders:

1. **Want to change the Interview page?**
   Open: `frontend/src/pages/Interview.jsx`

2. **Want to change buttons or cards (Design System)?**
   Open: `frontend/src/components/UI.jsx`

3. **Want to change AI logic (Gemini/Groq)?**
   Open: `backend/app/ai_engine.py`

4. **Want to add a new backend feature?**
   Add 1 new file in: `backend/app/routers/` (e.g., `reports.py`), then register it in `main.py`.

---

## 🚀 How to Run

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 💡 Additional Tips

### For Styling (CSS)
We highly recommend using **Tailwind CSS**. Instead of writing manual CSS in `global.css`, with Tailwind you can directly apply colors from your design file in the React file:

```jsx
// Example of applying design.md colors using Tailwind
<button className="bg-[#0F4C75] text-white px-6 py-3 rounded-lg hover:bg-[#1B5F8C]">
  Start Interview
</button>
```

### Environment Variables

**Backend `.env`:**
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
JSEARCH_API_KEY=your_jsearch_api_key
```

**Frontend `.env`:**
```env
VITE_BACKEND_URL=http://localhost:8000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## ✅ Next Steps

1. Create the folder structure as shown above
2. Install backend dependencies
3. Install frontend dependencies
4. Configure environment variables
5. Start building features one by one

Happy coding! 🚀
