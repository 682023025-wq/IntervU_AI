# 📋 Proses Bisnis & Optimisasi UX - IntervU AI (Revisi)

## 1. 🔄 Alur Proses Bisnis (User Journey)

### A. Authentication & Onboarding Flow

#### 1.1 Login/Signup
```
User → Landing Page → Google OAuth Sign In/Sign Up
  ↓
Supabase Auth (auth.users) → Buat/Get Profile
  ↓
Cek tabel profiles → User Baru atau Lama?
```

**Detail Proses:**
- **User Baru**: `profiles.data_cv` kosong (`{}`) → Redirect ke halaman **Onboarding CV** (sudah dibahas terpisah)
- **User Lama**: `profiles.data_cv` terisi → Redirect ke **Dashboard Utama**
- **Fallback**: Jika user logout di tengah pengisian CV, data tersimpan otomatis (auto-save setiap 30 detik)

---

### B. Dashboard & Navigasi Fitur

#### 2.1 Dashboard Utama
```
Dashboard → Widget Ringkasan → Quick Actions
```

**Komponen Dashboard:**
| Widget | Data Source | Aksi |
|--------|-------------|------|
| **Skor Wawancara Terakhir** | `sesi_wawancara.skor_akhir` | Klik → Lihat detail sesi |
| **Total Sesi** | COUNT(`sesi_wawancara`) | - |
| **Rata-rata Skor** | AVG(`sesi_wawancara.skor_akhir`) | Trend chart |
| **Lowongan Baru** | `lowongan_karir` (limit 5) | Klik → Detail lowongan |
| **Saran CV Pending** | `saran_perbaikan_cv` WHERE status='menunggu' | Klik → Review saran |

**Quick Actions (Tombol Cepat):**
- 🎥 **Mulai Simulasi Baru** → Pilih posisi target & mode (teks/audio/video)
- 📄 **Edit CV** → Langsung ke form CV
- 💼 **Cari Lowongan** → Ke halaman lowongan dengan filter

---

### C. Simulasi Wawancara AI (Core Feature) - Dual AI Strategy

#### 3.1 Arsitektur Dual AI (Gemini + Groq)

**Strategi Penggunaan:**
```
┌─────────────────────────────────────────────────────┐
│  AI ROUTER LAYER                                     │
│  ├─ Cek token usage & rate limit                    │
│  ├─ Pilih AI provider (Gemini/Groq)                 │
│  └─ Failover otomatis jika salah satu error         │
└─────────────────────────────────────────────────────┘
         ↓                    ↓
   ┌──────────┐        ┌──────────┐
   │ Gemini   │        │  Groq    │
   │ API      │        │  API     │
   └──────────┘        └──────────┘
```

**Pembagian Tugas AI:**
| Task | Primary AI | Secondary AI | Alasan |
|------|-----------|--------------|--------|
| **Generate Pertanyaan Wawancara** | Gemini | Groq | Gemini lebih baik dalam konteks panjang (CV analysis) |
| **Evaluasi Jawaban** | Groq | Gemini | Groq lebih cepat untuk real-time feedback |
| **Text-to-Speech** | Gemini | - | Gemini TTS lebih natural |
| **Speech-to-Text** | Groq | - | Groq Whisper lebih akurat & cepat |
| **Analisis Non-Verbal** | Gemini | Groq | Gemini Vision lebih advanced |
| **Generate Saran CV** | Gemini | Groq | Gemini lebih baik dalam structured output |
| **Matching Lowongan** | Groq | Gemini | Groq lebih cepat untuk multiple queries |

**Failover Mechanism:**
```python
async def call_ai_with_failover(task, prompt, context):
    # Coba primary AI dulu
    primary_ai = get_primary_ai(task)
    try:
        response = await primary_ai.generate(prompt, context)
        log_ai_usage(primary_ai, task, success=True)
        return response
    except TokenLimitError:
        # Jika token habis, switch ke secondary
        secondary_ai = get_secondary_ai(task)
        try:
            response = await secondary_ai.generate(prompt, context)
            log_ai_usage(secondary_ai, task, success=True, fallback=True)
            return response
        except Exception as e:
            # Jika keduanya gagal, tampilkan error user-friendly
            raise AIServiceUnavailable("Layanan AI sedang sibuk. Coba lagi dalam beberapa saat.")
    except RateLimitError:
        # Rate limit exceeded, tunggu dan retry
        await asyncio.sleep(5)
        return await call_ai_with_failover(task, prompt, context)
```

**Token Management:**
- ✅ **Token Tracker**: Monitor usage real-time di dashboard admin
- ✅ **Alert System**: Notifikasi jika token <20% remaining
- ✅ **Auto-Switch**: Otomatis switch ke AI lain jika token habis
- ✅ **Daily Reset**: Token reset setiap hari (atau sesuai plan)
- ✅ **Cost Optimization**: Gunakan AI yang lebih murah untuk task sederhana

**Load Balancing Strategy:**
```
Morning (08:00-12:00): Gemini 60% | Groq 40%
Afternoon (12:00-17:00): Gemini 50% | Groq 50%
Evening (17:00-22:00): Gemini 40% | Groq 60%
```
*Strategi ini bisa di-adjust berdasarkan performance metrics*

---

#### 3.2 Persiapan Simulasi
```
User klik "Mulai Simulasi" → Pilih Posisi Target → Pilih Mode (Video/Audio/Teks)
  ↓
AI baca profiles.data_cv + posisi_target → Generate pertanyaan (random 5-10 pertanyaan)
  ↓
Setup kamera & mikrofon → Mulai sesi
```

**Detail Teknis:**
- **Jumlah Pertanyaan**: Random 5-10, disesuaikan dengan kompleksitas posisi
- **Kategori Pertanyaan**:
  - Pertanyaan umum (perkenalan, motivasi) - 20%
  - Pertanyaan teknis (sesuai skill di CV) - 40%
  - Pertanyaan behavioral (pengalaman kerja) - 25%
  - Pertanyaan situasional (studi kasus) - 15%

**Contoh Prompt untuk Generate Pertanyaan:**
```python
prompt = f"""
Berdasarkan CV berikut dan posisi target "{posisi_target}", 
generate 8 pertanyaan wawancara yang relevan:

CV Data: {cv_data}

Kriteria:
- 2 pertanyaan umum (perkenalan, motivasi)
- 3 pertanyaan teknis (sesuai skill di CV)
- 2 pertanyaan behavioral (pengalaman)
- 1 pertanyaan situasional

Format output: JSON array dengan struktur:
[
  {{
    "kategori": "teknis",
    "pertanyaan": "...",
    "tujuan": "Menguji pemahaman tentang...",
    "jawaban_ideal_hint": "..."
  }}
]
"""
```

---

#### 3.3 Proses Simulasi Real-time (Mode Video)
```
AI generate pertanyaan → Text-to-Speech (suara AI) → User menjawab (video + audio)
  ↓
Sistem merekam: Video wajah user + Audio jawaban → Simpan ke Cloudinary
  ↓
Real-time Analysis:
  - Speech-to-Text (Groq Whisper) → jawaban user jadi teks
  - Computer Vision (Gemini Vision): Deteksi kepercayaan diri, kontak mata, gesture
  ↓
Simpan ke pesan_wawancara (peran='pewawancara' & 'kandidat')
  ↓
Ulangi sampai semua pertanyaan selesai → Status sesi = 'selesai'
```

**Deteksi Non-Verbal (Computer Vision dengan Gemini Vision):**
| Metrik | Metode Deteksi | Threshold |
|--------|---------------|-----------|
| **Kontak Mata** | Face mesh tracking | >70% = Good |
| **Ekspresi Wajah** | Emotion recognition | Netral/Smile = Good |
| **Gesture Tangan** | Pose estimation | Tidak berlebihan |
| **Postur Tubuh** | Shoulder alignment | Tegap = Good |
| **Gugup/Cemas** | Micro-expression + fidgeting | Deteksi gerakan berulang |
| **Mencotek** | Eye tracking (melihat ke samping/layar lain) | >3 detik = Warning |

**UX Optimization untuk Simulasi:**
- ✅ **Countdown Timer** 5 detik sebelum pertanyaan berikutnya
- ✅ **Indikator "Sedang Merekam"** (lampu merah berkedip)
- ✅ **Tombol Emergency**: Pause, Skip Pertanyaan, End Session
- ✅ **Live Caption**: Tampilkan teks pertanyaan AI di bawah video
- ✅ **Feedback Visual**: Jika terdeteksi mencotek, tampilkan warning halus ("Cobalah untuk fokus pada kamera")
- ✅ **Mode Hemat Data**: Untuk user dengan koneksi lambat, tawarkan mode audio-only
- ✅ **AI Status Indicator**: Tampilkan "Menggunakan Gemini" atau "Menggunakan Groq" secara transparan

---

#### 3.4 Review & Feedback AI
```
Sesi selesai → AI analisis seluruh percakapan + metrik non-verbal
  ↓
Generate:
  - Skor akhir (0-100)
  - Evaluasi per pertanyaan (jawaban ideal vs jawaban user)
  - Rekomendasi perbaikan jawaban
  - Analisis non-verbal (kepercayaan diri, kontak mata, dll)
  ↓
Simpan ke sesi_wawancara.evaluasi_ai (JSONB) & metrik_non_verbal (JSONB)
  ↓
User bisa: Tonton rekaman, Baca transkrip, Lihat saran perbaikan
```

**Struktur Evaluasi AI (JSONB):**
```json
{
  "skor_total": 78,
  "ai_provider_used": "Gemini",
  "fallback_used": false,
  "ringkasan": "Jawaban teknis bagus, tapi perlu lebih percaya diri...",
  "per_pertanyaan": [
    {
      "pertanyaan": "Ceritakan tentang pengalaman Anda dengan Python",
      "kategori": "teknis",
      "skor": 85,
      "jawaban_ideal": "Sebutkan proyek spesifik, teknologi yang digunakan...",
      "kekuatan": "Menyebutkan framework Django dan Flask",
      "kelemahan": "Kurang detail tentang tantangan yang dihadapi",
      "saran_perbaikan": "Tambahkan contoh masalah yang dipecahkan...",
      "durasi_jawaban": "45 detik",
      "kecepatan_bicara": "Normal"
    }
  ],
  "analisis_non_verbal": {
    "kontak_mata": {"skor": 70, "catatan": "Sering melihat ke bawah"},
    "kepercayaan_diri": {"skor": 65, "catatan": "Suara terdagu ragu di pertanyaan ke-3"},
    "gestur": {"skor": 80, "catatan": "Gerakan tangan natural"}
  },
  "rekomendasi_umum": [
    "Latih kontak mata dengan melihat langsung ke kamera",
    "Gunakan metode STAR (Situation, Task, Action, Result) untuk menjawab behavioral questions"
  ],
  "perbandingan_dengan_sesi_sebelumnya": {
    "skor_sebelumnya": 65,
    "perbaikan": "+13 poin",
    "area_membaik": ["Kecepatan bicara", "Struktur jawaban"],
    "area_perlu_latihan": ["Kontak mata", "Contoh konkret"]
  }
}
```

---

### D. Revisi CV oleh AI

#### 4.1 Generate Saran Perbaikan
```
Setelah wawancara selesai → AI analisis CV vs jawaban user
  ↓
Identifikasi gap: Skill yang kurang disebutkan, pengalaman yang bisa diperjelas
  ↓
Generate saran per bagian CV → Simpan ke saran_perbaikan_cv
  ↓
User review: Terima / Tolak / Edit & Terima
```

**Contoh Saran AI:**
| Bagian CV | Teks Asli | Saran AI | Alasan |
|-----------|-----------|----------|--------|
| Deskripsi | "Saya lulusan SI yang suka coding" | "Lulusan Sistem Informasi dengan keahlian dalam pengembangan web full-stack menggunakan Python Flask dan React" | Lebih spesifik dan menonjolkan skill |
| Skill | "Python, SQL" | "Python (Flask, Django), SQL (PostgreSQL, MySQL), JavaScript" | Tambahkan framework dan database yang dikuasai |
| Pengalaman | "Magang di PT X" | "Software Engineer Intern di PT X - Mengembangkan REST API menggunakan Flask yang digunakan oleh 1000+ user" | Tambahkan metrik dan teknologi |

**UX untuk Review Saran:**
- ✅ **Side-by-side comparison**: Teks asli vs saran AI
- ✅ **Highlight perubahan**: Warna hijau untuk tambahan, merah untuk hapusan
- ✅ **Bulk actions**: "Terima Semua" atau "Tolak Semua"
- ✅ **Auto-update CV**: Setelah diterima, langsung update `profiles.data_cv`
- ✅ **Version history**: User bisa rollback ke versi CV sebelumnya

---

### E. Pencarian Lowongan Kerja

#### 5.1 Rekomendasi Otomatis (Post-Interview)
```
Wawancara selesai → AI extract: posisi_target, skill, preferensi dari CV
  ↓
Query JSearch API dengan filter yang sesuai
  ↓
Hitung skor_kecocokan (0-100) menggunakan AI:
  - Match skill (40%)
  - Match pengalaman (30%)
  - Match gaji yang diharapkan (20%)
  - Match lokasi (10%)
  ↓
Simpan ke lowongan_karir → Tampilkan di dashboard "Lowongan Rekomendasi"
```

**AI Matching Algorithm:**
```python
async def calculate_job_match(cv_data, job_data):
    prompt = f"""
    Analisis kecocokan antara CV kandidat dan lowongan kerja berikut.
    
    CV: {cv_data}
    Lowongan: {job_data}
    
    Berikan skor kecocokan 0-100 berdasarkan:
    - Skill match (40%)
    - Pengalaman relevan (30%)
    - Gaji match (20%)
    - Lokasi match (10%)
    
    Output JSON:
    {{
      "skor_total": 85,
      "breakdown": {{
        "skill_match": 90,
        "experience_match": 80,
        "salary_match": 85,
        "location_match": 100
      }},
      "alasan": "Kandidat memiliki skill yang sangat relevan...",
      "gap": ["Perlu pengalaman dengan Kubernetes"],
      "recommendation": "Sangat direkomendasikan untuk melamar"
    }}
    """
    
    response = await call_ai_with_failover("job_matching", prompt, {})
    return response
```

#### 5.2 Manual Search & Filter
```
User ke halaman Lowongan → Filter:
  - Kata kunci (judul/posisi)
  - Gaji min-maks
  - Tipe pekerjaan (full-time, part-time, remote)
  - Lokasi
  - Skor kecocokan min (slider 0-100)
  ↓
Hasil ditampilkan sebagai Card/List → User klik → Detail lowongan
  ↓
Tombol "Lamar Sekarang" → Buka url_lamaran di tab baru
```

**UX untuk Lowongan:**
- ✅ **Smart filter**: Filter yang sering dipakai disimpan di localStorage
- ✅ **Sort options**: Skor kecocokan (default), Gaji tertinggi, Terbaru
- ✅ **Save lowongan**: User bisa bookmark lowongan untuk dilamar nanti
- ✅ **Alert lowongan baru**: Notifikasi jika ada lowongan baru yang match >80%
- ✅ **Quick apply**: Simpan CV & cover letter template untuk apply cepat

---

### F. Manajemen Profil

#### 6.1 Edit Profil
```
User ke halaman Profil → Edit:
  - Nama lengkap
  - Email (verifikasi ulang jika ganti)
  - Telepon
  - Tanggal lahir
  - Jenis kelamin
  - Avatar (upload ke Cloudinary)
  - Bahasa preferensi (ID/EN)
  ↓
Update tabel profiles → Sinkronisasi ke auth.users jika perlu
```

#### 6.2 Pengaturan Akun
- **Ganti email**: Verifikasi email baru via link
- **Hapus akun**: Konfirmasi 2 langkah, hapus data dari semua tabel (cascade delete)
- **Export data**: Download semua data user (CV, riwayat wawancara, dll) dalam format JSON/PDF
- **Privasi**: Toggle untuk menonaktifkan penyimpanan rekaman video
- **AI Preference**: Pilih AI provider preferensi (Gemini/Groq/Auto)

---

## 2. 🚀 Optimisasi UX & Performance

### A. Performance Optimization

#### 1.1 Frontend Performance
| Optimisasi | Implementasi | Benefit |
|-----------|--------------|---------|
| **Code Splitting** | Lazy load halaman (React.lazy / dynamic import) | Initial load <2s |
| **Image Optimization** | Cloudinary auto-format (WebP), responsive sizes | 50% lebih kecil |
| **Caching Strategy** | Service Worker untuk static assets, SWR untuk API data | Offline support, faster repeat visits |
| **Virtual Scrolling** | Untuk list lowongan/sesi yang panjang (react-window) | Smooth scroll 1000+ items |
| **Debounce Input** | Search & filter debounce 300ms | Reduce API calls |
| **AI Response Caching** | Cache pertanyaan & evaluasi yang sama (Redis/Memcached) | Reduce AI API calls 30% |

#### 1.2 API Optimization
```python
# Contoh: Pagination & Filtering di Supabase
def get_lowongan(user_id, page=1, limit=20, min_skor=0):
    return supabase.table('lowongan_karir')\
        .select('*')\
        .eq('id_profil', user_id)\
        .gte('skor_kecocokan', min_skor)\
        .order('skor_kecocokan', desc=True)\
        .range((page-1)*limit, page*limit-1)\
        .execute()
```

**Strategi:**
- ✅ **Pagination**: Semua list pakai cursor-based pagination
- ✅ **Batch requests**: Gabungkan multiple queries dalam satu request (GraphQL-style)
- ✅ **Background sync**: Sinkronisasi data saat koneksi stabil (untuk mode offline)
- ✅ **API rate limiting**: Implementasi retry dengan exponential backoff
- ✅ **AI Request Queue**: Queue system untuk manage concurrent AI requests

---

### B. User Experience (UX) Enhancements

#### 2.1 Onboarding Experience
| Masalah | Solusi UX |
|---------|-----------|
| User baru bingung harus mulai dari mana | **Guided tour** dengan tooltip interaktif di setiap fitur |
| User tidak tahu CV-nya sudah bagus atau belum | **CV Score** (0-100) dengan breakdown per bagian |
| User malas mengisi CV lengkap | **Import dari LinkedIn** (jika memungkinkan) atau **template CV** yang tinggal diisi |

#### 2.2 Simulasi Wawancara UX
| Masalah | Solusi UX |
|---------|-----------|
| User gugup karena tidak tahu apa yang diharapkan | **Mode latihan** dengan 2-3 pertanyaan mudah dulu |
| Koneksi internet tidak stabil saat video call | **Fallback ke audio-only** otomatis, rekam lokal lalu upload nanti |
| User tidak tahu kapan harus menjawab | **Visual cue**: Animasi "AI sedang berbicara" → "Giliran Anda" |
| User ingin mengulang pertanyaan | **Tombol "Ulangi Pertanyaan"** (maks 2x per sesi) |
| User tidak paham feedback AI | **Contoh jawaban ideal** dengan highlight bagian penting |
| User khawatir tentang privasi rekaman | **Privacy toggle**: Pilih apakah rekaman disimpan atau auto-delete |

#### 2.3 Dual AI Transparency
| Masalah | Solusi UX |
|---------|-----------|
| User tidak tahu AI mana yang digunakan | **AI Badge**: Tampilkan "Powered by Gemini" atau "Powered by Groq" di header sesi |
| User khawatir jika satu AI error | **Auto-failover notification**: "Beralih ke Groq untuk performa lebih baik" |
| User ingin pilih AI spesifik | **AI Preference setting**: Pilih primary AI di profil (opsional) |

#### 2.4 Mobile-First UX
| Fitur Desktop | Adaptasi Mobile |
|---------------|-----------------|
| Sidebar navigation | Bottom navigation bar |
| Split-screen (CV + saran) | Tab switcher atau bottom sheet |
| Hover effects | Long-press untuk preview |
| Keyboard shortcuts | Swipe gestures (swipe left = hapus, swipe right = archive) |
| Multi-column grid | Single column, card-based |

**Mobile-Specific Features:**
- ✅ **Pull-to-refresh** untuk dashboard & lowongan
- ✅ **Swipe to delete** untuk notifikasi/saran CV
- ✅ **Haptic feedback** saat tombol penting ditekan (vibrasi halus)
- ✅ **Dark mode** otomatis mengikuti sistem
- ✅ **Offline mode**: Lihat CV & riwayat wawancara tanpa internet

---

### C. Accessibility (A11y)

#### 3.1 WCAG 2.1 AA Compliance
| Aspek | Implementasi |
|-------|--------------|
| **Color Contrast** | Teks di atas Deep Navy = Putih (#FFFFFF), kontras ratio 8.5:1 |
| **Keyboard Navigation** | Semua interaktif elements bisa diakses dengan Tab, Enter, Space |
| **Screen Reader** | ARIA labels untuk semua ikon, alt text untuk gambar |
| **Focus Indicators** | Outline 2px Teal Mint saat element di-focus |
| **Text Resize** | Support zoom hingga 200% tanpa break layout |
| **Motion Reduction** | Respect `prefers-reduced-motion` untuk user dengan vestibular disorders |

#### 3.2 Inclusive Design
- ✅ **Bahasa**: Toggle ID/EN di semua halaman
- ✅ **Font Size**: User bisa adjust ukuran font (Small/Medium/Large)
- ✅ **High Contrast Mode**: Opsi untuk kontras lebih tinggi
- ✅ **Dyslexia-friendly font**: Opsi font OpenDyslexic

---

### D. Error Handling & Edge Cases

#### 4.1 Error States
| Error | User-Friendly Message | Action |
|-------|----------------------|--------|
| **Koneksi hilang** | "Koneksi internet terputus. Data Anda tersimpan lokal dan akan di-sync otomatis." | Tombol "Coba Lagi" + indicator offline |
| **Upload foto gagal** | "Gagal mengupload foto. Pastikan ukuran <2MB dan format JPG/PNG." | Tombol "Pilih Foto Lain" |
| **AI API timeout** | "AI sedang sibuk. Coba lagi dalam beberapa detik." | Auto-retry 3x, lalu manual retry |
| **AI token habis** | "Token AI habis. Beralih ke backup AI..." | Auto-switch ke AI kedua, notifikasi user |
| **Kedua AI error** | "Layanan AI sedang mengalami gangguan. Silakan coba lagi nanti." | Tombol "Coba Lagi" + link ke status page |
| **Kamera/mic tidak terdeteksi** | "Kamera atau mikrofon tidak terdeteksi. Periksa izin browser Anda." | Link ke panduan setting browser |
| **Sesi wawancara crash** | "Sesi terganggu. Rekamangan Anda tersimpan. Lanjutkan atau mulai ulang?" | Opsi "Lanjutkan dari pertanyaan terakhir" |

#### 4.2 Empty States
| Halaman | Empty State Message | CTA |
|---------|---------------------|-----|
| **Dashboard (user baru)** | "Selamat datang! Lengkapi CV Anda untuk mulai simulasi wawancara." | Tombol "Isi CV Sekarang" |
| **Riwayat Wawancara** | "Belum ada sesi wawancara. Mulai simulasi pertama Anda!" | Tombol "Mulai Simulasi" |
| **Lowongan** | "Belum ada lowongan yang cocok. Coba ubah filter atau isi CV lebih lengkap." | Tombol "Ubah Filter" |
| **Saran CV** | "CV Anda sudah bagus! Terus tingkatkan dengan simulasi wawancara." | Tombol "Lihat CV" |

---

### E. Security & Privacy

#### 5.1 Data Protection
| Aspek | Implementasi |
|-------|--------------|
| **Row Level Security (RLS)** | User hanya bisa akses data sendiri (`id_profil = auth.uid()`) |
| **Encryption at rest** | Supabase otomatis encrypt database |
| **Encryption in transit** | HTTPS only, HSTS enabled |
| **API Keys** | Frontend hanya pakai ANON_KEY, SERVICE_ROLE_KEY hanya di backend |
| **Video recordings** | Disimpan di Cloudinary private folder, auto-delete setelah 30 hari (configurable) |
| **GDPR compliance** | User bisa export & delete semua data |
| **AI Data Privacy** | Tidak kirim data sensitif (email, telepon) ke AI API |

#### 5.2 Privacy Controls
- ✅ **Opt-in recording**: User pilih apakah rekaman video disimpan atau tidak
- ✅ **Anonymous mode**: User bisa pakai nama samaran untuk simulasi
- ✅ **Data retention**: Setting auto-delete data setelah X bulan
- ✅ **Third-party sharing**: Toggle untuk tidak share data ke JSearch (lowongan manual only)
- ✅ **AI Provider Choice**: User bisa pilih AI provider (Gemini/Groq) berdasarkan privacy policy

---

### F. Analytics & Monitoring

#### 6.1 User Analytics
| Metric | Tool | Purpose |
|--------|------|---------|
| **Page views** | Supabase Realtime / PostHog | Track feature usage |
| **Session duration** | Custom event | Engagement metric |
| **Conversion rate** | Funnel analysis (Onboarding → First Interview → Job Applied) | Identify drop-off points |
| **Error rate** | Sentry | Monitor bugs |
| **API latency** | Supabase Dashboard / Datadog | Performance monitoring |
| **AI Provider Usage** | Custom tracking | Monitor Gemini vs Groq usage |
| **AI Failover Rate** | Custom tracking | Monitor reliability |

#### 6.2 AI Performance Tracking
```python
# Track AI response quality & usage
def track_ai_performance(ai_provider, task, response_time, success, token_used):
    supabase.table('ai_performance_logs').insert({
        'ai_provider': ai_provider,  # 'gemini' or 'groq'
        'task': task,  # 'generate_questions', 'evaluate_answer', etc
        'response_time_ms': response_time,
        'success': success,
        'token_used': token_used,
        'timestamp': datetime.now()
    }).execute()

# User bisa rate: "Jawaban AI membantu" (👍/👎)
def track_ai_feedback(session_id, question_id, user_rating):
    supabase.table('ai_feedback').insert({
        'id_sesi': session_id,
        'id_pertanyaan': question_id,
        'rating': user_rating,  # 1-5
        'feedback_text': optional_text
    }).execute()
```

**Metrik AI:**
- ✅ **Response time**: Rata-rata waktu AI generate pertanyaan (<3s target)
- ✅ **User satisfaction**: Rating untuk kualitas feedback AI
- ✅ **Improvement rate**: Apakah skor user meningkat dari sesi ke sesi?
- ✅ **Token efficiency**: Token used per task (optimize prompt)
- ✅ **Failover rate**: Persentase switch dari primary ke secondary AI (target <5%)
- ✅ **Cost per session**: Total cost AI API per sesi wawancara

---

## 3. 📊 Ringkasan User Flow

```
┌─────────────────────────────────────────────────────────────┐
│ 1. LOGIN (Google OAuth)                                      │
│    ↓                                                         │
│ 2. CEK USER BARU/LAMA                                        │
│    ├─ BARU → Onboarding CV (Wajib) → Dashboard              │
│    └─ LAMA → Dashboard Langsung                             │
│                                                              │
│ 3. DASHBOARD                                                 │
│    ├─ Widget: Skor terakhir, Total sesi, Lowongan baru      │
│    ├─ Quick Actions: Mulai Simulasi, Edit CV, Cari Lowongan │
│    └─ Notifikasi: Saran CV pending, Lowongan match tinggi   │
│                                                              │
│ 4. SIMULASI WAWANCARA (Dual AI: Gemini + Groq)              │
│    ├─ Pilih posisi & mode (video/audio/teks)                │
│    ├─ AI Router: Pilih Gemini/Groq berdasarkan task         │
│    ├─ AI generate pertanyaan (baca CV + posisi)             │
│    ├─ Real-time: Video + Speech-to-Text + Non-verbal detect │
│    ├─ Failover: Auto-switch jika token habis/error          │
│    ├─ Selesai → AI evaluasi + skor + rekomendasi            │
│    └─ User review: Tonton rekaman, Baca transkrip, Saran    │
│                                                              │
│ 5. REVISI CV (Otomatis post-interview)                       │
│    ├─ AI saran per bagian CV                                │
│    ├─ User: Terima / Tolak / Edit                           │
│    └─ Auto-update CV → Download PDF terbaru                 │
│                                                              │
│ 6. LOWONGAN KERJA                                            │
│    ├─ Rekomendasi otomatis (berdasarkan CV + wawancara)     │
│    ├─ AI matching dengan scoring 0-100                      │
│    ├─ Manual search + filter (gaji, lokasi, tipe)           │
│    └─ Lamar → Buka url_lamaran                              │
│                                                              │
│ 7. PROFIL                                                    │
│    ├─ Edit data pribadi, avatar, bahasa                     │
│    ├─ AI preference: Pilih Gemini/Groq/Auto                 │
│    ├─ Pengaturan privasi, notifikasi                        │
│    └─ Export/Hapus data                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. 🔧 Dual AI Implementation Details

### A. AI Router Configuration
```python
# config/ai_router.py
AI_CONFIG = {
    "gemini": {
        "api_key": os.getenv("GEMINI_API_KEY"),
        "base_url": "https://generativelanguage.googleapis.com/v1beta ",
        "models": {
            "text": "gemini-1.5-pro",
            "vision": "gemini-1.5-pro-vision",
            "tts": "gemini-tts-1"
        },
        "token_limit": 1000000,  # per day
        "rate_limit": 60,  # requests per minute
        "strengths": ["long_context", "vision", "structured_output"],
        "cost_per_1k_tokens": 0.0005
    },
    "groq": {
        "api_key": os.getenv("GROQ_API_KEY"),
        "base_url": "https://api.groq.com/openai/v1 ",
        "models": {
            "text": "llama-3.1-70b-versatile",
            "stt": "whisper-large-v3"
        },
        "token_limit": 500000,  # per day
        "rate_limit": 30,  # requests per minute
        "strengths": ["speed", "stt", "cost_efficient"],
        "cost_per_1k_tokens": 0.0003
    }
}

TASK_ROUTING = {
    "generate_questions": {"primary": "gemini", "secondary": "groq"},
    "evaluate_answer": {"primary": "groq", "secondary": "gemini"},
    "text_to_speech": {"primary": "gemini", "secondary": None},
    "speech_to_text": {"primary": "groq", "secondary": None},
    "analyze_non_verbal": {"primary": "gemini", "secondary": "groq"},
    "generate_cv_suggestions": {"primary": "gemini", "secondary": "groq"},
    "job_matching": {"primary": "groq", "secondary": "gemini"}
}
```

### B. Token Usage Dashboard (Admin Panel)
```
┌─────────────────────────────────────────────────────────┐
│  AI Token Usage - Last 24 Hours                         │
├─────────────────────────────────────────────────────────┤
│  Gemini: ████████████████████░░░░ 80% (800K/1M tokens) │
│  Groq:   ██████████░░░░░░░░░░░░░░ 40% (200K/500K)      │
│                                                         │
│  Status: ✅ Gemini OK | ✅ Groq OK                      │
│  Failover Events: 3 (last 24h)                         │
│  Avg Response Time: Gemini 2.3s | Groq 1.1s            │
│  Total Cost: $12.50                                    │
└─────────────────────────────────────────────────────────┘
```

---
