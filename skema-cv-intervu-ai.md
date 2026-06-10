# 📄 Skema CV IntervU AI

## Struktur CV (Format 2-3 Halaman)

---

## Halaman 1: Informasi Utama & Profil

### 1. Foto 3x4
- Upload via Cloudinary
- Format: JPG/PNG, max 2MB
- Rasio: 3:4
- Background: Bebas (disarankan polos/profesional)

### 2. Deskripsi Singkat / Profil Profesional
- **Tipe**: Textarea
- **Panjang**: 150-300 karakter
- **Placeholder**: "Ceritakan secara singkat profil Anda, keahlian utama, dan tujuan karir..."
- **Contoh**: "Lulusan Sistem Informasi dengan pengalaman 2 tahun dalam pengembangan web full-stack. Menguasai React, Node.js, dan PostgreSQL. Berminat pada posisi Backend Developer."

### 3. Informasi Kontak
**Dynamic List** - User bisa menambah/hapus dan mengatur urutan:

| Platform | Input Type | Validasi | Icon |
|----------|-----------|----------|------|
| Email | Email (auto dari profil) | Valid email format | ✉️ |
| Telepon | Text | Format: 08xx-xxxx-xxxx / +62xxx | 📱 |
| LinkedIn | URL | linkedin.com/in/... | 💼 |
| GitHub | URL | github.com/... | 🔧 |
| Instagram | URL | instagram.com/... | 📷 |
| Facebook | URL | facebook.com/... | 👥 |
| Portfolio Website | URL | Valid URL | 🌐 |
| Lainnya | Text + URL | Custom platform | ➕ |

**UX Features:**
- ✅ **Drag & Drop** untuk mengatur urutan prioritas
- ✅ **Toggle Show/Hide** untuk setiap kontak (privasi)
- ✅ **Auto-detect** platform dari URL yang dimasukkan
- ✅ **Preview icon** otomatis muncul

### 4. Skill / Keahlian
**Input**: Tag Input dengan kategori

**Struktur Skill:**
```
Kategori:
├─ Technical Skills
│  ├─ Programming Languages (Python, JavaScript, Java, etc.)
│  ├─ Frameworks (React, Django, Flask, etc.)
│  ├─ Database (MySQL, PostgreSQL, MongoDB, etc.)
│  ├─ Tools (Git, Docker, AWS, etc.)
│  └─ Lainnya
├─ Soft Skills
│  ├─ Communication
│  ├─ Leadership
│  ├─ Problem Solving
│  └─ Teamwork
└─ Bahasa
   ├─ Indonesia (Native)
   ├─ English (Active/Passive)
   └─ Lainnya
```

**Level Mastery** (untuk setiap skill):
- ⭐ Beginner (0-2 tahun)
- ⭐⭐ Intermediate (2-4 tahun)
- ⭐⭐⭐ Advanced (4-6 tahun)
- ⭐⭐⭐⭐ Expert (6+ tahun)

**Validasi**: Minimum 5 skill (3 technical + 2 soft skills)

---

## Halaman 2: Pengalaman Profesional & Organisasi

### 5. Pengalaman Kerja (Work Experience)
**Repeater Field** - Bisa menambah multiple entries

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Posisi/Jabatan** | Text | ✅ | Max 100 karakter |
| **Nama Perusahaan** | Text | ✅ | Max 150 karakter |
| **Lokasi** | Text | ✅ | Kota, Negara |
| **Tanggal Mulai** | Date (MM/YYYY) | ✅ | Valid date |
| **Tanggal Selesai** | Date (MM/YYYY) | ✅ | Harus > tanggal mulai |
| **Masih Bekerja?** | Checkbox | - | Jika centang, tanggal selesai hidden |
| **Tipe Pekerjaan** | Dropdown | ✅ | Full-time, Part-time, Contract, Freelance |
| **Deskripsi Pekerjaan** | Textarea | ✅ | Min 100 karakter, max 500 |
| **Pencapaian** | Bullet points | ✅ | Min 2 pencapaian, gunakan metrik (angka/%) |
| **Teknologi/Tools** | Tag input | - | Skill yang digunakan di pekerjaan ini |
| **Gaji** | Number (opsional) | - | Range gaji (untuk matching lowongan) |
| **Alasan Keluar** | Text (opsional) | - | Max 200 karakter |

**Contoh Input:**
```
Posisi: Senior Backend Developer
Perusahaan: PT Teknologi Indonesia
Lokasi: Jakarta, Indonesia
Periode: Maret 2022 - Sekarang (2 tahun 3 bulan)
Tipe: Full-time

Deskripsi:
- Mengembangkan dan maintain RESTful API untuk aplikasi e-commerce dengan 100K+ daily users
- Memimpin tim 5 developer dalam migrasi sistem monolith ke microservices
- Melakukan code review dan mentoring junior developer

Pencapaian:
✓ Berhasil meningkatkan performance API sebesar 40% melalui query optimization
✓ Mengurangi bug production sebesar 60% dengan implementasi automated testing
✓ Memimpin successful deployment sistem baru 2 minggu lebih cepat dari deadline

Tech Stack: Python, Django, PostgreSQL, Redis, Docker, AWS
```

---

### 6. Pengalaman Magang (Internship Experience)
**Repeater Field** - Mirip dengan kerja tapi lebih sederhana

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Posisi** | Text | ✅ | Max 100 karakter |
| **Nama Perusahaan/Instansi** | Text | ✅ | Max 150 karakter |
| **Lokasi** | Text | ✅ | Kota |
| **Periode** | Date Range | ✅ | MM/YYYY - MM/YYYY |
| **Durasi** | Auto-calculate | - | Contoh: "3 bulan" |
| **Departemen/Divisi** | Text | - | Max 100 karakter |
| **Deskripsi** | Textarea | ✅ | Min 50 karakter |
| **Tugas & Tanggung Jawab** | Bullet points | ✅ | Min 3 poin |
| **Skill yang Dipelajari** | Tag input | ✅ | Min 2 skill |
| **Sertifikat** | Upload/URL | - | Link atau upload sertifikat magang |

**Contoh Input:**
```
Posisi: Frontend Developer Intern
Perusahaan: Startup Digital Indonesia
Lokasi: Bandung, Indonesia
Periode: Januari 2023 - Maret 2023 (3 bulan)
Divisi: Product Development

Tugas & Tanggung Jawab:
• Mengembangkan UI/UX untuk fitur dashboard admin menggunakan React.js
• Berkolaborasi dengan tim desain untuk implementasi wireframe menjadi komponen interaktif
• Melakukan bug fixing dan optimization pada aplikasi existing
• Berpartisipasi dalam daily standup dan sprint planning

Skill yang Dipelajari: React.js, TypeScript, Tailwind CSS, Git Workflow
```

---

### 7. Pengalaman Organisasi (Organization Experience)
**Repeater Field** - Untuk organisasi kemahasiswaan, komunitas, profesi

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Nama Organisasi** | Text | ✅ | Max 150 karakter |
| **Posisi/Jabatan** | Text | ✅ | Max 100 karakter |
| **Tingkat** | Dropdown | ✅ | Universitas, Nasional, Internasional |
| **Lokasi** | Text | ✅ | Kota/Online |
| **Periode** | Date Range | ✅ | MM/YYYY - MM/YYYY |
| **Masih Aktif?** | Checkbox | - | Jika ya, tanggal selesai hidden |
| **Deskripsi Organisasi** | Textarea | - | Max 200 karakter (opsional) |
| **Tanggung Jawab** | Bullet points | ✅ | Min 2 poin |
| **Pencapaian/Proyek** | Bullet points | - | Min 1 (jika ada) |
| **Jumlah Anggota** | Number | - | Untuk menunjukkan skala organisasi |

**Contoh Input:**
```
Organisasi: Himpunan Mahasiswa Sistem Informasi (HMSI)
Jabatan: Ketua Divisi Acara
Tingkat: Universitas
Lokasi: Universitas Indonesia, Depok
Periode: Agustus 2022 - Agustus 2023 (1 tahun)

Deskripsi: Organisasi kemahasiswaan untuk mahasiswa Sistem Informasi dengan 200+ anggota

Tanggung Jawab:
• Memimpin tim 15 orang dalam perencanaan dan eksekusi 5 acara besar tahunan
• Mengelola budget Rp 150 juta untuk event "TechFest 2023"
• Melakukan koordinasi dengan 20+ sponsor dan partner eksternal
• Menyusun proposal dan laporan pertanggungjawaban acara

Pencapaian:
✓ Berhasil mengadakan TechFest 2023 dengan 500+ peserta dari 50 universitas
✓ Mendapatkan sponsorship sebesar Rp 200 juta, melebihi target 33%

Jumlah Anggota: 15 orang (dalam divisi)
```

---

### 8. Pengalaman Kepanitiaan (Committee Experience)
**Repeater Field** - Untuk kepanitiaan event, seminar, lomba, dll

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Nama Acara/Kegiatan** | Text | ✅ | Max 150 karakter |
| **Posisi/Divisi** | Text | ✅ | Max 100 karakter |
| **Penyelenggara** | Text | ✅ | Max 150 karakter |
| **Skala** | Dropdown | ✅ | Kampus, Regional, Nasional, Internasional |
| **Tanggal Acara** | Date | ✅ | Tanggal pelaksanaan |
| **Periode Kepanitiaan** | Date Range | - | Jika berbeda dengan tanggal acara |
| **Deskripsi Acara** | Textarea | - | Max 200 karakter |
| **Tanggung Jawab** | Bullet points | ✅ | Min 2 poin |
| **Hasil/Pencapaian** | Textarea | - | Max 300 karakter |
| **Jumlah Peserta** | Number | - | Untuk menunjukkan skala acara |

**Contoh Input:**
```
Acara: National IT Competition 2023
Posisi: Koordinator Acara
Penyelenggara: Fakultas Ilmu Komputer
Skala: Nasional
Tanggal: 15-17 September 2023

Deskripsi: Kompetisi tahunan bidang IT dengan 3 kategori lomba (Web Dev, Mobile Dev, UI/UX)

Tanggung Jawab:
• Mengkoordinasi 30 panitia dalam pelaksanaan acara 3 hari
• Menyusun rundown dan technical meeting dengan 150+ peserta
• Menjadi liaison antara juri, peserta, dan panitia
• Menangani troubleshooting selama acara berlangsung

Hasil: Acara berjalan lancar dengan tingkat kepuasan peserta 4.8/5.0
Jumlah Peserta: 150 tim (450 orang) dari 75 universitas
```

---

## Halaman 3: Pendidikan & Prestasi

### 9. Pendidikan (Education)
**Repeater Field** - Minimal 1 (pendidikan terakhir), maksimal 3-4

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Jenjang** | Dropdown | ✅ | SD, SMP, SMA/SMK, D3, S1, S2, S3 |
| **Nama Institusi** | Text | ✅ | Max 200 karakter |
| **Jurusan/Program Studi** | Text | ✅ | Max 150 karakter |
| **Lokasi** | Text | ✅ | Kota |
| **Tahun Masuk** | Year | ✅ | Valid year |
| **Tahun Lulus** | Year | ✅ | Harus > tahun masuk |
| **IPK/GPA** | Number | - | Scale 4.00 (contoh: 3.75) |
| **Predikat** | Auto/Dropdown | - | Cumlaude, Sangat Memuaskan, etc. |
| **Mata Kuliah Relevan** | Tag input | - | Untuk fresh graduate |
| **Pencapaian Akademik** | Bullet points | - | Beasiswa, dean's list, dll |

**Contoh Input:**
```
Jenjang: S1 (Sarjana)
Institusi: Universitas Indonesia
Jurusan: Sistem Informasi
Lokasi: Depok, Jawa Barat
Periode: 2019 - 2023
IPK: 3.68/4.00
Predikat: Sangat Memuaskan

Mata Kuliah Relevan: 
• Basis Data Lanjut (A)
• Pemrograman Web (A)
• Struktur Data (A-)
• Machine Learning (B+)

Pencapaian:
🎓 Beasiswa Unggulan Kemendikbud 2020-2023
🎓 Dean's List Semester 4, 5, 6
```

---

### 10. Sertifikasi & Lisensi (Certifications)
**Repeater Field**

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Nama Sertifikasi** | Text | ✅ | Max 200 karakter |
| **Lembaga Penerbit** | Text | ✅ | Max 150 karakter |
| **Tanggal Diperoleh** | Date | ✅ | MM/YYYY |
| **Tanggal Kadaluarsa** | Date | - | Jika ada (contoh: IT cert) |
| **Credential ID/URL** | Text/URL | - | Untuk verifikasi |
| **Skill yang Divalidasi** | Tag input | - | Terkait skill di CV |

**Contoh:**
```
Sertifikasi: AWS Certified Solutions Architect - Associate
Lembaga: Amazon Web Services
Tanggal: Juni 2023
Kadaluarsa: Juni 2026
Credential ID: AWS-ASA-12345678
URL: https://aws.amazon.com/verification 
Skill: Cloud Computing, AWS, System Architecture
```

---

### 11. Proyek (Projects)
**Repeater Field** - Penting untuk developer/fresh graduate

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Nama Proyek** | Text | ✅ | Max 150 karakter |
| **Tipe** | Dropdown | ✅ | Pribadi, Kampus, Freelance, Open Source |
| **Periode** | Date Range | ✅ | MM/YYYY - MM/YYYY |
| **Role/Posisi** | Text | ✅ | Max 100 karakter |
| **Deskripsi** | Textarea | ✅ | Min 50, max 300 karakter |
| **Teknologi** | Tag input | ✅ | Min 2 teknologi |
| **Link Proyek** | URL | - | GitHub, Live Demo, Portfolio |
| **Pencapaian/Impact** | Textarea | - | Max 200 karakter |

**Contoh:**
```
Nama Proyek: E-Commerce Platform UMKM
Tipe: Tugas Akhir Kampus
Periode: Februari 2023 - Mei 2023
Role: Full Stack Developer (Lead)

Deskripsi: 
Platform e-commerce untuk membantu UMKM lokal go digital dengan fitur inventory management, payment gateway, dan analytics dashboard.

Teknologi: React.js, Node.js, Express, PostgreSQL, Midtrans API, Chart.js

Link: github.com/user/ecommerce-umkm | demo: ecommerce-umkm.vercel.app

Impact: 
Platform ini digunakan oleh 15 UMKM di Depok dengan total transaksi Rp 50 juta dalam 3 bulan pertama.
```

---

### 12. Prestasi & Penghargaan (Achievements & Awards)
**Repeater Field**

**Field per Entry:**
| Field | Tipe | Required | Validasi |
|-------|------|----------|----------|
| **Nama Prestasi** | Text | ✅ | Max 200 karakter |
| **Tingkat** | Dropdown | ✅ | Kampus, Regional, Nasional, Internasional |
| **Penyelenggara** | Text | ✅ | Max 150 karakter |
| **Peringkat/Kategori** | Text | ✅ | Juara 1, Finalis, Best Paper, dll |
| **Tanggal** | Date | ✅ | MM/YYYY |
| **Deskripsi** | Textarea | - | Max 200 karakter |
| **Hadiah/Sertifikat** | Upload/URL | - | Bukti prestasi |

**Contoh:**
```
Prestasi: National Hackathon 2023
Tingkat: Nasional
Penyelenggara: Dicoding Indonesia x Google
Peringkat: Juara 2
Tanggal: Oktober 2023

Deskripsi: 
Hackathon 48 jam dengan tema "AI for Social Good". Tim kami mengembangkan aplikasi deteksi stunting berbasis computer vision.

Hadiah: Rp 15.000.000 + Sertifikat + Mentorship dari Google Engineers
```

---

### 13. Bahasa (Languages)
**Simple List** - Tidak perlu repeater kompleks

| Bahasa | Level | Sertifikasi (Opsional) |
|--------|-------|------------------------|
| Indonesia | Native | - |
| Inggris | Active/Passive | TOEFL 550 / IELTS 6.5 |
| Mandarin | Beginner | HSK 2 |
| Lainnya | Dropdown | - |

**Level Dropdown:**
- Native
- Fluent
- Professional Working Proficiency
- Limited Working Proficiency
- Elementary

---

### 14. Informasi Tambahan (Optional)
**Accordion/Collapsible Section**

| Field | Tipe |
|-------|------|
| **Hobi/Minat** | Tag input (max 5) |
| **Referensi** | Text (Nama, Jabatan, Perusahaan, Kontak) |
| **Ketersediaan** | Dropdown (Immediate, 1 bulan notice, dll) |
| **Ekspektasi Gaji** | Number range |
| **Preferensi Lokasi** | Text |
| **Relokasi** | Yes/No |

---

## 🎨 Fitur UX untuk Form CV

### A. Multi-Step Wizard dengan Progress Bar

```
Step 1: Informasi Dasar (20%)
├─ Foto 3x4
├─ Deskripsi Singkat
└─ Kontak

Step 2: Skill & Keahlian (20%)
└─ Technical & Soft Skills

Step 3: Pengalaman Profesional (30%)
├─ Pengalaman Kerja
├─ Pengalaman Magang
├─ Pengalaman Organisasi
└─ Pengalaman Kepanitiaan

Step 4: Pendidikan & Prestasi (20%)
├─ Pendidikan
├─ Sertifikasi
├─ Proyek
└─ Prestasi

Step 5: Review & Download (10%)
├─ Preview CV
├─ Edit terakhir
└─ Download PDF
```

### B. Auto-Save & Recovery
- ✅ **Auto-save setiap 30 detik** ke Supabase
- ✅ **Local storage backup** untuk antisipasi koneksi terputus
- ✅ **Version history**: Simpan 5 versi terakhir CV
- ✅ **Recovery prompt**: "Kami menemukan draft yang belum tersimpan. Pulihkan?"

### C. Real-time Preview
- **Desktop**: Split screen - Form di kiri (60%), Preview CV di kanan (40%)
- **Mobile**: Tab switcher "Edit" | "Preview"
- **Template selector**: 3-5 template CV yang bisa dipilih (Modern, Professional, Creative, Minimalist)

### D. CV Score & Validation
```javascript
CV Score Calculation:
├─ Kelengkapan Data (30%)
│  ├─ Semua section terisi
│  └─ Minimum requirements terpenuhi
├─ Kualitas Konten (40%)
│  ├─ Deskripsi detail & menggunakan metrik
│  ├─ Pencapaian terukur (angka/%)
│  └─ Tidak ada typo/grammar error
└─ Relevansi (30%)
   ├─ Skill match dengan posisi target
   └─ Pengalaman relevan dengan industri

Score < 60: "CV perlu dilengkapi" (Warning)
Score 60-80: "CV cukup baik" (Info)
Score > 80: "CV sangat baik!" (Success)
```

### E. Smart Suggestions
- **AI-powered**: Gemini API analisis CV dan berikan saran
- **Contoh**: 
  - "Tambahkan angka/metrik di pencapaian kerja Anda"
  - "Skill 'Python' disebut 3x tapi tidak ada proyek yang menggunakannya"
  - "Pengalaman organisasi Anda impressive! Pindahkan ke bagian atas CV"

### F. Export Options
- **PDF**: Download dengan 1 klik (html2pdf.js / jsPDF)
- **Templates**: Pilih template sebelum download
- **Page Break Control**: User bisa atur manual page break
- **Watermark**: Opsional untuk versi gratis
- **Share Link**: Generate public URL untuk CV (hosting di Cloudinary Pages)

---

## 📐 Layout CV Per Halaman

### Halaman 1:
```
┌─────────────────────────────────────────┐
│  [FOTO]  NAMA LENGKAP                   │
│          Posisi Target                  │
│                                         │
│  ─────────────────────────────────────  │
│  📧 email | 📱 08xx | 📍 Lokasi        │
│  💼 LinkedIn | 🔗 GitHub               │
│                                         │
│  ─────────────────────────────────────  │
│  PROFIL SINGKAT                         │
│  (Paragraf 3-4 kalimat)                │
│                                         │
│  ─────────────────────────────────────  │
│  SKILL                                  │
│  • Technical: Python, React, SQL       │
│  • Soft: Leadership, Communication     │
│  • Bahasa: Indonesia (Native), English │
│                                         │
│  ─────────────────────────────────────  │
│  PENGALAMAN KERJA                       │
│  Posisi | Perusahaan | 2022-Sekarang   │
│  • Pencapaian 1 dengan metrik          │
│  • Pencapaian 2 dengan metrik          │
│                                         │
│  ─────────────────────────────────────  │
│  PENGALAMAN MAGANG                      │
│  Posisi | Perusahaan | 2021 (3 bulan)  │
│  • Tugas & tanggung jawab              │
└─────────────────────────────────────────┘
```

### Halaman 2:
```
┌─────────────────────────────────────────┐
│  PENGALAMAN ORGANISASI                  │
│  Jabatan | Organisasi | 2020-2021       │
│  • Tanggung jawab & pencapaian         │
│                                         │
│  ─────────────────────────────────────  │
│  PENGALAMAN KEPANITIAAN                 │
│  Posisi | Acara | September 2022       │
│  • Tanggung jawab & hasil              │
│                                         │
│  ─────────────────────────────────────  │
│  PENDIDIKAN                             │
│  S1 Sistem Informasi | UI | 2019-2023  │
│  IPK: 3.68/4.00                        │
│  • Pencapaian akademik                 │
│                                         │
│  ─────────────────────────────────────  │
│  PROYEK                                 │
│  Nama Proyek | 2023                    │
│  Deskripsi singkat & teknologi         │
│  Link: github.com/...                  │
│                                         │
│  ─────────────────────────────────────  │
│  SERTIFIKASI                            │
│  AWS Certified | Amazon | 2023         │
│  Google UX Design | Coursera | 2022    │
└─────────────────────────────────────────┘
```

### Halaman 3 (Opsional):
```
┌─────────────────────────────────────────┐
│  PRESTASI & PENGHARGAAN                 │
│  Juara 1 Hackathon Nasional | 2023     │
│  Dean's List | 2020-2022               │
│                                         │
│  ─────────────────────────────────────  │
│  PUBLIKASI & KARYA ILMIAH              │
│  (Jika ada)                            │
│                                         │
│  ─────────────────────────────────────  │
│  PELATIHAN & WORKSHOP                   │
│  Machine Learning Bootcamp | 40 jam    │
│  Leadership Training | 16 jam          │
│                                         │
│  ─────────────────────────────────────  │
│  INFORMASI TAMBAHAN                     │
│  Hobi: Membaca, Hiking, Coding         │
│  Ketersediaan: Immediate               │
│  Preferensi: Remote/Hybrid             │
│                                         │
│  Referensi tersedia upon request       │
└─────────────────────────────────────────┘
```

---

## 📝 Ringkasan Fitur

| Kategori | Fitur |
|----------|-------|
| **Total Sections** | 14 sections utama |
| **Repeater Fields** | 8 (Kerja, Magang, Organisasi, Kepanitiaan, Pendidikan, Sertifikasi, Proyek, Prestasi) |
| **Upload Fields** | 3 (Foto, Sertifikat, Bukti Prestasi) |
| **Validasi** | Real-time dengan indikator kelengkapan |
| **Auto-Save** | Setiap 30 detik + local storage backup |
| **Preview** | Real-time split screen (desktop) / tab switcher (mobile) |
| **Export** | PDF dengan multiple templates |
| **AI Features** | Smart suggestions via Gemini API |
| **CV Scoring** | Automated quality assessment (0-100) |

---

**Dibuat untuk**: IntervU AI - CV Builder System  
**Versi**: 1.0  
**Last Updated**: 2024
