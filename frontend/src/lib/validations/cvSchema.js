import { z } from 'zod';

// Schema untuk item pendidikan
const educationSchema = z.object({
  institusi: z.string().min(1, 'Nama institusi wajib diisi'),
  jurusan: z.string().min(1, 'Jurusan wajib diisi'),
  jenjang: z.enum(['SMA', 'D3', 'S1', 'S2', 'S3'], {
    errorMap: () => ({ message: 'Jenjang pendidikan wajib dipilih' })
  }),
  tahun_masuk: z.string().min(4, 'Tahun masuk wajib diisi').regex(/^\d{4}$/, 'Format tahun harus 4 digit'),
  tahun_lulus: z.string().min(4, 'Tahun lulus wajib diisi').regex(/^\d{4}$/, 'Format tahun harus 4 digit'),
  ipk: z.string().optional(),
  prestasi: z.string().optional()
});

// Schema untuk pengalaman kerja
const experienceSchema = z.object({
  perusahaan: z.string().min(1, 'Nama perusahaan wajib diisi'),
  posisi: z.string().min(1, 'Posisi wajib diisi'),
  tanggal_mulai: z.string().min(7, 'Tanggal mulai wajib diisi'),
  tanggal_selesai: z.string().optional(),
  sedang_bekerja: z.boolean().default(false),
  deskripsi: z.array(z.string().min(1, 'Deskripsi tidak boleh kosong')).min(1, 'Minimal satu poin deskripsi')
});

// Schema untuk pengalaman organisasi
const organizationSchema = z.object({
  nama_organisasi: z.string().min(1, 'Nama organisasi wajib diisi'),
  posisi: z.string().min(1, 'Posisi wajib diisi'),
  tanggal_mulai: z.string().min(7, 'Tanggal mulai wajib diisi'),
  tanggal_selesai: z.string().optional(),
  masih_aktif: z.boolean().default(false),
  deskripsi: z.array(z.string().min(1, 'Deskripsi tidak boleh kosong')).min(1, 'Minimal satu poin deskripsi')
});

// Schema untuk proyek
const projectSchema = z.object({
  nama_proyek: z.string().min(1, 'Nama proyek wajib diisi'),
  peran: z.string().min(1, 'Peran wajib diisi'),
  tanggal: z.string().min(7, 'Tanggal wajib diisi'),
  teknologi: z.array(z.string().min(1, 'Teknologi tidak boleh kosong')),
  deskripsi: z.string().min(1, 'Deskripsi proyek wajib diisi'),
  url: z.string().url('URL harus format yang valid').optional().or(z.literal('')),
  pencapaian: z.string().optional()
});

// Schema untuk sertifikasi
const certificationSchema = z.object({
  nama: z.string().min(1, 'Nama sertifikasi wajib diisi'),
  institusi: z.string().min(1, 'Institusi wajib diisi'),
  tanggal: z.string().min(7, 'Tanggal wajib diisi'),
  url: z.string().url('URL harus format yang valid').optional().or(z.literal(''))
});

// Schema untuk prestasi
const achievementSchema = z.object({
  nama: z.string().min(1, 'Nama prestasi wajib diisi'),
  penyelenggara: z.string().min(1, 'Penyelenggara wajib diisi'),
  tanggal: z.string().min(7, 'Tanggal wajib diisi'),
  deskripsi: z.string().optional()
});

// Schema untuk tautan profesional (dinamis array)
const professionalLinkSchema = z.object({
  platform: z.string().min(1, 'Nama platform wajib diisi'),
  url: z.string().url('URL harus format yang valid')
});

// Schema utama CV
export const cvSchema = z.object({
  // Langkah 1: Informasi Dasar
  nama_lengkap: z.string().min(1, 'Nama lengkap wajib diisi'),
  email: z.string().email('Email tidak valid'),
  telepon: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  tanggal_lahir: z.string().optional().or(z.literal('')),
  jenis_kelamin: z.enum(['pria', 'wanita', 'prefer_tidak_menyebutkan']).optional(),
  alamat: z.string().optional(),
  url_foto_cv: z.string().url('URL foto tidak valid').optional().or(z.literal('')),
  tautan_profesional: z.array(professionalLinkSchema).optional(),
  deskripsi_diri: z.string().min(50, 'Deskripsi diri minimal 50 karakter'),
  
  // Langkah 2: Pendidikan & Keahlian
  pendidikan: z.array(educationSchema).min(1, 'Minimal 1 pendidikan wajib diisi'),
  keahlian_teknis: z.array(z.string().min(1, 'Keahlian tidak boleh kosong')),
  keahlian_non_teknis: z.array(z.string().min(1, 'Keahlian tidak boleh kosong')),
  bahasa: z.array(z.string().min(1, 'Bahasa tidak boleh kosong')),
  
  // Langkah 3: Pengalaman & Proyek
  pengalaman_kerja: z.array(experienceSchema).optional(),
  pengalaman_organisasi: z.array(organizationSchema).optional(),
  proyek: z.array(projectSchema).optional(),
  
  // Langkah 4: Sertifikasi & Prestasi
  sertifikasi: z.array(certificationSchema).optional(),
  prestasi: z.array(achievementSchema).optional(),
  
  // Data tambahan untuk profil
  posisi_target: z.string().optional(),
  bahasa_preferensi: z.enum(['id', 'en']).default('id')
});

// JSDoc type definition for compatibility
/** @typedef {z.infer<typeof cvSchema>} CvFormData */
