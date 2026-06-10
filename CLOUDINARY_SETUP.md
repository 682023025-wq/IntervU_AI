# Panduan Konfigurasi Cloudinary untuk Hapus Foto

## Masalah
Fitur hapus foto CV tidak bekerja karena credentials Cloudinary belum dikonfigurasi dengan benar.

## Solusi

### 1. Dapatkan Credentials Cloudinary
1. Login ke [Cloudinary Dashboard](https://cloudinary.com/users/dashboard)
2. Catat informasi berikut:
   - **Cloud Name** (contoh: `dxxxxx`)
   - **API Key** (contoh: `123456789012345`)
   - **API Secret** (contoh: `abcdefghijklmnopqrst`)

### 2. Konfigurasi Backend (.env)
Edit file `/workspace/backend/.env`:

```bash
# Ganti placeholder dengan credentials Anda yang sebenarnya
CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
CLOUDINARY_API_KEY=your-actual-api-key
CLOUDINARY_API_SECRET=your-actual-api-secret
```

### 3. Konfigurasi Frontend (.env)
Edit file `/workspace/frontend/.env`:

```bash
# Untuk upload (unsigned preset)
VITE_CLOUDINARY_CLOUD_NAME=your-actual-cloud-name
VITE_CLOUDINARY_UPLOAD_PRESET=your-upload-preset-name
```

**Catatan untuk Upload Preset:**
1. Di Cloudinary Dashboard, pergi ke **Settings** > **Upload**
2. Scroll ke bagian **Upload presets**
3. Klik **Add upload preset**
4. Set **Signing Mode** ke **Unsigned**
5. Catat nama preset dan masukkan ke `VITE_CLOUDINARY_UPLOAD_PRESET`

### 4. Restart Servers
Setelah mengubah .env, restart kedua server:

```bash
# Terminal 1 - Backend
cd /workspace/backend
# Pastikan .env sudah diupdate, lalu restart uvicorn

# Terminal 2 - Frontend  
cd /workspace/frontend
npm run dev
```

### 5. Verifikasi
1. Buka browser dan login ke aplikasi
2. Upload foto CV
3. Klik tombol "Hapus" pada foto
4. Periksa console log di browser (F12) dan terminal backend

**Log yang diharapkan:**
```
🗑️ Starting photo deletion process...
🔍 Extracted publicId: cv-uploads/temp/1234567890-abc123 from URL: https://res.cloudinary.com/...
📡 Calling backend API to delete from Cloudinary...
🗑️ Deleting image from Cloudinary: cv-uploads/temp/1234567890-abc123
✅ Image deleted from Cloudinary: cv-uploads/temp/1234567890-abc123
✅ Foto berhasil dihapus dari Cloudinary
✅ Reference URL dihapus dari database
```

## Troubleshooting

### Jika muncul pesan "Cloudinary credentials belum dikonfigurasi"
- Pastikan file `.env` di backend sudah diisi dengan credentials yang benar
- Pastikan tidak ada spasi atau karakter khusus yang tidak perlu
- Restart backend server setelah mengubah .env

### Jika upload berhasil tapi hapus gagal
- Cek apakah API Secret sudah benar (ini yang paling sering salah)
- Pastikan timezone server sinkron (signature menggunakan timestamp)
- Periksa firewall/proxy yang mungkin memblokir koneksi ke api.cloudinary.com

### Jika foto terhapus dari UI tapi masih ada di Cloudinary
- Periksa log backend untuk error detail
- Pastikan endpoint `/api/v1/cloudinary/delete` dapat diakses
- Verifikasi bahwa user sedang login (endpoint memerlukan authentication)
