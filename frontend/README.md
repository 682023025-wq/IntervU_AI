# IntervU AI - Frontend

Frontend React untuk aplikasi **IntervU AI** (Simulasi Wawancara Berbasis AI).

## 🚀 Tech Stack

- **React 18** dengan Vite
- **React Router v6** untuk routing
- **Tailwind CSS** untuk styling
- **Axios** untuk API calls
- **Supabase JS Client** untuk authentication

## 📋 Prerequisites

- Node.js 18+ 
- npm atau yarn
- Backend FastAPI harus sudah berjalan di `http://localhost:8000`

## 🛠️ Instalasi

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Setup environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` dan isi dengan credentials Anda:
   ```
   VITE_API_URL=http://localhost:8000/api/v1
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```
   
   Aplikasi akan berjalan di `http://localhost:5173`

## 📁 Struktur Folder

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/              # Komponen UI reusable
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   └── TextArea.jsx
│   │   └── common/          # Komponen umum
│   │       └── ProtectedRoute.jsx
│   ├── context/             # React Context
│   │   └── AuthContext.jsx
│   ├── pages/               # Halaman aplikasi
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Profile.jsx
│   │   └── Interview.jsx
│   ├── services/            # API services
│   │   └── api.js
│   ├── lib/                 # Library setup
│   │   └── supabase.js
│   ├── App.jsx              # Main app component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── index.html
├── tailwind.config.js
├── vite.config.js
├── package.json
└── .env.example
```

## 🎨 Fitur Utama

### 1. **Authentication**
- Login dengan Google OAuth via Supabase
- Protected routes untuk halaman yang memerlukan login
- Auto-redirect ke dashboard setelah login

### 2. **Dashboard**
- Statistik wawancara (total sesi, skor rata-rata)
- Quick actions untuk mulai wawancara baru
- Navigasi ke fitur lainnya

### 3. **Profil & CV**
- Form lengkap untuk edit data diri
- Manajemen data CV terstruktur:
  - Ringkasan profesional
  - Tautan profesional (LinkedIn, GitHub, Portfolio)
  - Pendidikan (add/remove)
  - Pengalaman kerja (add/remove)
  - Keahlian (tags)
- **Fair AI**: Tidak ada input tanggal_lahir atau jenis_kelamin di form CV

### 4. **Wawancara AI**
- **Layout Mobile**: Kamera full screen dengan overlay chat di bawah
- **Layout Desktop**: Split screen (60% kamera, 40% chat panel)
- **Animasi halus** saat rotate device (`transition-all duration-500`)
- Real-time camera stream dengan `getUserMedia`
- Chat interface dengan auto-scroll
- Loading states dan error handling

## 🔌 API Integration

Semua API calls menggunakan Axios instance dengan interceptor otomatis:
- Menambahkan `Authorization: Bearer <token>` dari session Supabase
- Handle 401 errors dengan auto-logout
- Base URL dari `VITE_API_URL` environment variable

## 🎯 Development Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 📱 Responsive Design

- **Mobile-first** approach dengan Tailwind breakpoints
- Layout interview berubah smooth saat rotate device
- Touch-friendly buttons dan inputs
- Optimized untuk berbagai ukuran layar

## 🔐 Security Notes

- JWT tokens disimpan oleh Supabase client (httpOnly cookies atau localStorage)
- Token otomatis ditambahkan ke setiap API request
- Session management ditangani oleh Supabase Auth
- Tidak ada credentials yang di-hardcode

## 🐛 Troubleshooting

### Camera tidak berfungsi
- Pastikan browser memiliki izin untuk mengakses kamera
- Gunakan HTTPS di production (camera memerlukan secure context)
- Test di localhost biasanya bekerja tanpa HTTPS

### API connection error
- Pastikan backend berjalan di port yang benar
- Cek `VITE_API_URL` di `.env`
- Verifikasi CORS settings di backend

### Login gagal
- Cek Supabase credentials di `.env`
- Pastikan Google OAuth sudah dikonfigurasi di Supabase dashboard
- Cek redirect URL di Supabase OAuth settings

## 📄 License

MIT
