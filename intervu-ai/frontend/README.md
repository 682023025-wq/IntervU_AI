# Frontend untuk IntervU AI

## Setup & Instalasi

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Instalasi Dependencies

```bash
cd frontend
npm install
```

### Konfigurasi Environment

1. Copy file `.env.example` ke `.env`:
```bash
cp .env.example .env
```

2. Isi variabel environment di `.env`:
- `VITE_SUPABASE_URL`: URL project Supabase Anda
- `VITE_SUPABASE_ANON_KEY`: Anon key dari Supabase
- `VITE_API_URL`: URL backend FastAPI (default: http://localhost:8000/api/v1)

### Menjalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Build untuk Production

```bash
npm run build
```

Output akan ada di folder `dist/`

### Preview Production Build

```bash
npm run preview
```

## Struktur Folder

```
src/
├── components/
│   ├── common/          # Komponen umum (ProtectedRoute)
│   └── ui/              # Komponen UI reusable (Button, Card, Input, Modal)
├── context/             # React Context (AuthContext)
├── lib/                 # Library configurations (Supabase client)
├── pages/               # Halaman utama (Home, Login, Profile, Interview)
├── services/            # API services (Axios instance)
├── App.jsx              # Main app component dengan routing
├── main.jsx             # Entry point
└── index.css            # Global styles dengan Tailwind
```

## Fitur

### Authentication
- Login dengan Google OAuth via Supabase
- Protected routes untuk halaman yang membutuhkan autentikasi
- Session management otomatis

### Profile & CV Management
- Form edit profil pengguna
- Dynamic CV builder (pengalaman kerja, pendidikan, skills)
- Preview JSON CV
- Simpan data ke Supabase

### Interview Page
- **Mobile-first responsive design**
- Kamera full screen di mobile portrait
- Split screen (60% kamera, 40% chat) di desktop
- Chat overlay dengan animasi smooth
- Akses kamera/mikrofon dengan cleanup otomatis
- Real-time chat dengan AI interviewer

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router v6** - Routing
- **Axios** - HTTP client
- **Supabase JS Client** - Auth & database

## Customization

### Theme Colors
Edit `tailwind.config.js` untuk mengubah warna:
```js
colors: {
  primary: {
    DEFAULT: '#0EA5E9', // sky-500
    // ... shades
  },
}
```

### Font
Font 'Inter' sudah diimport di `index.css`. Ganti di file yang sama jika ingin menggunakan font lain.
