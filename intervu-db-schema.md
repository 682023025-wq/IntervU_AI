# IntervU AI - Database Schema Overview

## Entity Relationship Diagram (ERD)

```mermaid
erDiagram
    profiles ||--o{ sesi_wawancara : "memiliki"
    profiles ||--o{ rekomendasi_karir : "mendapat"
    profiles ||--o{ lowongan_karir : "melamar"
    profiles ||--o{ saran_perbaikan_cv : "menerima"
    sesi_wawancara ||--o{ pesan_wawancara : "berisi"
    sesi_wawancara ||--o{ saran_perbaikan_cv : "menghasilkan"

    profiles {
        uuid id PK
        varchar nama_lengkap
        varchar email UK
        varchar telepon
        date tanggal_lahir
        varchar jenis_kelamin
        text url_avatar
        text url_foto_cv
        varchar penyedia_auth
        varchar posisi_target
        varchar bahasa_preferensi
        jsonb data_cv
        timestamp tanggal_dibuat
        timestamp tanggal_diperbarui
    }

    sesi_wawancara {
        uuid id PK
        uuid id_profil FK
        varchar mode
        varchar posisi_target
        varchar bahasa
        varchar status
        int total_pertanyaan
        int skor_akhir
        jsonb evaluasi_ai
        jsonb metrik_non_verbal
        timestamp dimulai_pada
        timestamp selesai_pada
    }

    pesan_wawancara {
        uuid id PK
        uuid id_sesi FK
        varchar peran
        text isi
        boolean diedit_pengguna
        int urutan_pesan
        timestamp dibuat_pada
    }

    rekomendasi_karir {
        uuid id PK
        uuid id_profil FK
        jsonb posisi_direkomendasikan
        jsonb perusahaan_direkomendasikan
        text alasan_rekomendasi
        timestamp dibuat_pada
    }

    lowongan_karir {
        uuid id PK
        uuid id_profil FK
        varchar id_eksternal
        varchar judul_pekerjaan
        varchar nama_perusahaan
        varchar lokasi
        varchar tipe_pekerjaan
        int gaji_min
        int gaji_maks
        text deskripsi
        text url_lamaran
        varchar sumber
        varchar posisi_cocok
        int skor_kecocokan
        timestamp diambil_pada
        timestamp dibuat_pada
    }

    saran_perbaikan_cv {
        uuid id PK
        uuid id_profil FK
        uuid id_sesi FK
        varchar bagian_cv
        text teks_asli
        text teks_saran_ai
        text alasan_perbaikan
        varchar status
        timestamp dibuat_pada
        timestamp ditindaklanjuti_pada
    }
```

## Tabel & Deskripsi

| Tabel | Deskripsi | Relasi |
|-------|-----------|--------|
| **profiles** | Data pengguna/pelamar kerja | Parent table, terhubung ke auth.users |
| **sesi_wawancara** | Sesi wawancara AI dengan kandidat | Child dari profiles, parent dari pesan_wawancara |
| **pesan_wawancara** | Transkrip percakapan wawancara | Child dari sesi_wawancara |
| **rekomendasi_karir** | Rekomendasi karir dari AI | Child dari profiles |
| **lowongan_karir** | Daftar lowongan pekerjaan | Child dari profiles |
| **saran_perbaikan_cv** | Saran perbaikan CV dari AI | Child dari profiles & sesi_wawancara |

## Flow Diagram

```mermaid
flowchart TD
    A[User Register] --> B[profiles]
    B --> C[Upload CV]
    B --> D[Start Interview Session]
    D --> E[sesi_wawancara]
    E --> F[pesan_wawancara<br/>Q&A Recording]
    E --> G[Evaluation AI]
    G --> H[saran_perbaikan_cv]
    B --> I[rekomendasi_karir]
    B --> J[lowongan_karir]
```

## Enum Values

### `profiles.jenis_kelamin`
- `pria`
- `wanita`
- `prefer_tidak_menyebutkan`

### `profiles.penyedia_auth`
- `google`
- `email`

### `profiles.bahasa_preferensi`
- `id` (Indonesia)
- `en` (English)

### `sesi_wawancara.mode`
- `teks`
- `audio`
- `video`

### `sesi_wawancara.bahasa`
- `id`
- `en`

### `sesi_wawancara.status`
- `berlangsung`
- `selesai`
- `ditinggalkan`

### `pesan_wawancara.peran`
- `pewawancara`
- `kandidat`

### `saran_perbaikan_cv.status`
- `menunggu`
- `diterima`
- `ditolak`
- `diedit_dan_diterima`

### `lowongan_karir.sumber`
- `jsearch` (default)
- _lainnya_

## Key Metrics

- **skor_akhir**: 0-100 (nilai wawancara)
- **skor_kecocokan**: 0-100 (kecocokan lowongan dengan profil)

---
*Generated for IntervU AI Database Documentation*
