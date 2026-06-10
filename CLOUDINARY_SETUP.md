# 📋 Konfigurasi Cloudinary untuk IntervU AI

## ⚠️ PENTING: Fitur Hapus Foto Tidak Akan Berfungsi Tanpa Konfigurasi Ini

Cloudinary free tier hanya menyediakan **25GB storage**. Jika foto lama tidak dihapus saat user mengganti foto, storage akan cepat penuh.

---

## 🔑 Langkah 1: Dapatkan Cloudinary Credentials

1. **Buka Dashboard Cloudinary**
   - Login ke: https://cloudinary.com/users/dashboard
   
2. **Catat Credentials Berikut:**
   - **Cloud Name**: (contoh: `dxvryfbpz`)
   - **API Key**: (contoh: `1234567890abcdef`)
   - **API Secret**: (contoh: `abcdef1234567890xyz`)

---

## 🛠️ Langkah 2: Update Backend `.env`

Edit file `/workspace/backend/.env`:

```bash
# Ganti placeholder dengan credentials asli Anda
CLOUDINARY_CLOUD_NAME=<cloud-name-anda>
CLOUDINARY_API_KEY=<api-key-anda>
CLOUDINARY_API_SECRET=<api-secret-anda>
```

**Contoh:**
```bash
CLOUDINARY_CLOUD_NAME=dxvryfbpz
CLOUDINARY_API_KEY=1234567890abcdef
CLOUDINARY_API_SECRET=abcdef1234567890xyz
```

⚠️ **JANGAN commit file `.env` ke Git!** File ini sudah ada di `.gitignore`.

---

## 🎨 Langkah 3: Setup Unsigned Upload Preset (Untuk Frontend)

Agar frontend bisa upload langsung ke Cloudinary tanpa API Secret:

1. **Buka Cloudinary Dashboard**
   - Masuk ke: **Settings** → **Upload**

2. **Scroll ke "Upload presets"**
   - Klik **"Add upload preset"**

3. **Konfigurasi Preset:**
   - **Preset name**: `intervu-unsigned` (atau nama lain yang Anda suka)
   - **Signing Mode**: **Unsigned** ✅ (PENTING!)
   - **Folder**: `cv-uploads` (opsional, untuk organisasi)
   - **Overwrite**: `true` (untuk replace file dengan nama sama)
   - **Allowed formats**: `jpg, png, jpeg`

4. **Simpan Preset**
   - Catat nama preset yang Anda buat

5. **Update Frontend `.env`**
   
   Edit file `/workspace/frontend/.env`:
   ```bash
   VITE_CLOUDINARY_UPLOAD_PRESET=<nama-preset-anda>
   ```
   
   Contoh:
   ```bash
   VITE_CLOUDINARY_UPLOAD_PRESET=intervu-unsigned
   ```

---

## 🔄 Langkah 4: Restart Servers

Setelah mengubah file `.env`, restart kedua server:

### Terminal 1 - Backend:
```bash
cd /workspace/backend
# Stop server (Ctrl+C jika sedang berjalan)
# Jalankan ulang:
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Terminal 2 - Frontend:
```bash
cd /workspace/frontend
# Stop server (Ctrl+C jika sedang berjalan)
# Jalankan ulang:
npm run dev
```

---

## ✅ Langkah 5: Verifikasi Konfigurasi

### A. Cek Backend Startup Logs

Saat backend start, Anda harus melihat:
```
✅ Cloudinary Cloud Name: <cloud-name-anda>
```

Jika masih menampilkan `your-cloud-name`, berarti `.env` belum terbaca.

### B. Test Upload Foto

1. Buka aplikasi di browser: `http://localhost:5173`
2. Login
3. Buka CV Wizard
4. Upload foto profil

**Expected:**
- Upload berhasil
- Console log menampilkan URL Cloudinary

### C. Test Hapus Foto

1. Setelah upload berhasil, klik tombol **"Hapus"**
2. Buka **Browser Console** (F12) dan lihat log:
   ```
   🗑️ Starting photo deletion process...
   🔍 Extracted publicId: cv-uploads/nama_file
   📡 Calling backend API to delete from Cloudinary...
   ✅ Cloudinary delete response: {status: "success", ...}
   ✅ Foto berhasil dihapus dari Cloudinary
   ```

3. Buka **Terminal Backend** dan lihat log:
   ```
   🗑️ Deleting image from Cloudinary: cv-uploads/nama_file
   📦 Cloudinary response: {result: "ok", ...}
   ✅ Image deleted from Cloudinary: cv-uploads/nama_file
   ```

4. Cek di Cloudinary Dashboard → Media Library
   - Foto seharusnya sudah tidak ada

---

## 🐛 Troubleshooting

### ❌ Error: "Network Error" atau "ECONNREFUSED"

**Penyebab:** Frontend tidak bisa connect ke backend.

**Solusi:**
1. Pastikan backend berjalan di `http://localhost:8000`
2. Jika akses via IP (`http://10.167.154.87:5173`), CORS sudah ditambahkan di `backend/app/main.py`
3. Restart backend setelah menambahkan CORS

### ❌ Error: "Cloudinary credentials belum dikonfigurasi"

**Penyebab:** File `.env` masih menggunakan placeholder values.

**Solusi:**
1. Cek isi `/workspace/backend/.env`
2. Pastikan `CLOUDINARY_CLOUD_NAME` TIDAK sama dengan `your-cloud-name`
3. Restart backend

### ❌ Upload Gagal di Frontend

**Penyebab:** Upload preset belum dikonfigurasi atau salah nama.

**Solusi:**
1. Cek console browser untuk error detail
2. Pastikan upload preset mode = **Unsigned**
3. Pastikan nama preset di frontend `.env` sama dengan di Cloudinary

### ❌ Foto Tidak Terhapus dari Cloudinary

**Penyebab:** 
- API Secret salah
- Public ID tidak valid
- Network error

**Solusi:**
1. Cek terminal backend untuk error detail
2. Pastikan credentials benar di Cloudinary Dashboard
3. Cek log browser untuk public_id yang dikirim

---

## 📊 Monitoring Storage Usage

Untuk memantau penggunaan storage Cloudinary:

1. Buka: https://cloudinary.com/users/dashboard
2. Lihat **Storage** usage di dashboard
3. Free tier: **25GB** total

**Tips:**
- Selalu hapus foto lama sebelum upload foto baru
- Gunakan folder `cv-uploads` untuk organisasi
- Setup alert jika storage > 80%

---

## 🔒 Keamanan

- **JANGAN pernah** menaruh `CLOUDINARY_API_SECRET` di frontend
- Backend bertanggung jawab untuk operasi delete (memerlukan API Secret)
- Frontend hanya upload menggunakan unsigned preset
- File `.env` sudah diabaikan oleh Git (`.gitignore`)

---

## 📞 Butuh Bantuan?

Jika masih ada masalah:

1. Cek log browser (F12 → Console)
2. Cek log terminal backend
3. Pastikan semua langkah di atas sudah dilakukan
4. Screenshot error dan tampilkan di chat untuk diagnosa lebih lanjut
