import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Link as LinkIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import api from '../../services/api';
import PhotoUpload from './common/PhotoUpload';

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const Step1BasicInfo = ({ form, onNext }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const { user, profile } = useAuth();
  const [customLinks, setCustomLinks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Platform umum yang disediakan
  const commonPlatforms = [
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'github', label: 'GitHub' },
    { value: 'portfolio', label: 'Portfolio Website' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'facebook', label: 'Facebook' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'dribbble', label: 'Dribbble' },
    { value: 'behance', label: 'Behance' },
  ];

  // Auto-fill data dari database saat component mount
  useEffect(() => {
    if (profile) {
      // Fill nama dan email dari profile database
      if (profile.nama_lengkap) {
        setValue('nama_lengkap', profile.nama_lengkap);
      }
      if (profile.email) {
        setValue('email', profile.email);
      }
      // Fill data lainnya jika ada
      if (profile.telepon) {
        setValue('telepon', profile.telepon);
      }
      if (profile.tanggal_lahir) {
        setValue('tanggal_lahir', profile.tanggal_lahir);
      }
      if (profile.jenis_kelamin) {
        setValue('jenis_kelamin', profile.jenis_kelamin);
      }
      if (profile.alamat) {
        setValue('alamat', profile.alamat);
      }
      if (profile.url_foto_cv) {
        setValue('url_foto_cv', profile.url_foto_cv);
      }
      if (profile.data_cv?.deskripsi_diri) {
        setValue('deskripsi_diri', profile.data_cv.deskripsi_diri);
      }
      if (profile.data_cv?.tautan_profesional) {
        setValue('tautan_profesional', profile.data_cv.tautan_profesional);
      }
    } else if (user) {
      // Fallback ke user metadata dari Supabase Auth
      if (user.user_metadata?.full_name) {
        setValue('nama_lengkap', user.user_metadata.full_name);
      }
      if (user.email) {
        setValue('email', user.email);
      }
    }
  }, [profile, user, setValue]);

  const onSubmit = (data) => {
    // Gabungkan custom links dengan data
    onNext(data);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validasi format file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Format foto harus JPG atau PNG');
      return;
    }

    // Validasi ukuran file (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran foto maksimal 2MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Upload ke Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'cv_photos');

      // Simulasi progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Upload gagal');
      }

      const data = await response.json();
      const imageUrl = data.secure_url;
      
      // Set URL foto ke form
      setValue('url_foto_cv', imageUrl);
      
      // Update juga ke database profile
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            url_foto_cv: imageUrl,
            tanggal_diperbarui: new Date().toISOString()
          })
          .eq('id', user.id);
        
        if (error) {
          console.error('Error updating profile photo:', error);
          alert('Foto berhasil diupload ke Cloudinary, tetapi gagal update ke database.');
        } else {
          alert('Foto berhasil diupload dan disimpan!');
        }
      } else {
        alert('Foto berhasil diupload!');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Gagal mengupload foto. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const addLink = () => {
    const newLinks = [...(watch('tautan_profesional') || []), { platform: '', url: '' }];
    setValue('tautan_profesional', newLinks);
  };

  const removeLink = (index) => {
    const newLinks = (watch('tautan_profesional') || []).filter((_, i) => i !== index);
    setValue('tautan_profesional', newLinks);
  };

  const updateLink = (index, field, value) => {
    const newLinks = [...(watch('tautan_profesional') || [])];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setValue('tautan_profesional', newLinks);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-700">
          💡 <strong>Catatan:</strong> Data demografis hanya untuk format CV cetak, tidak digunakan untuk penilaian AI agar bebas bias.
        </p>
      </div>

      {/* Nama Lengkap */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nama Lengkap <span className="text-red-500">*</span> <span className="text-gray-400 text-xs">(Wajib)</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('nama_lengkap')}
            type="text"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.nama_lengkap ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Masukkan nama lengkap"
          />
        </div>
        {errors.nama_lengkap && <p className="mt-1 text-sm text-red-500">{errors.nama_lengkap.message}</p>}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email <span className="text-red-500">*</span> <span className="text-gray-400 text-xs">(Wajib)</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('email')}
            type="email"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="contoh@email.com"
          />
        </div>
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Telepon */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nomor Telepon <span className="text-red-500">*</span> <span className="text-gray-400 text-xs">(Wajib)</span>
        </label>
        <div className="relative">
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('telepon')}
            type="tel"
            className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.telepon ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="08123456789"
          />
        </div>
        {errors.telepon && <p className="mt-1 text-sm text-red-500">{errors.telepon.message}</p>}
      </div>

      {/* Tanggal Lahir & Jenis Kelamin */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Lahir <span className="text-gray-400 text-xs">(Opsional)</span>
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              {...register('tanggal_lahir')}
              type="date"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Jenis Kelamin <span className="text-gray-400 text-xs">(Opsional)</span>
          </label>
          <select
            {...register('jenis_kelamin')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Pilih jenis kelamin</option>
            <option value="pria">Pria</option>
            <option value="wanita">Wanita</option>
            <option value="prefer_tidak_menyebutkan">Prefer tidak menyebutkan</option>
          </select>
        </div>
      </div>

      {/* Alamat */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Alamat <span className="text-gray-400 text-xs">(Opsional)</span>
        </label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
          <textarea
            {...register('alamat')}
            rows={2}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Alamat lengkap"
          />
        </div>
      </div>

      {/* Upload Foto CV - Menggunakan komponen PhotoUpload yang responsive */}
      <div>
        <PhotoUpload
          name="url_foto_cv"
          label="Foto CV (3x4)"
          value={watch('url_foto_cv')}
          onChange={(url) => {
            setValue('url_foto_cv', url);
            // Update juga ke database profile jika ada user
            if (user) {
              supabase
                .from('profiles')
                .update({
                  url_foto_cv: url,
                  tanggal_diperbarui: new Date().toISOString()
                })
                .eq('id', user.id)
                .then(({ error }) => {
                  if (error) {
                    console.error('Error updating profile photo:', error);
                  }
                });
            }
          }}
          onFileDelete={async (oldUrl, publicId) => {
            console.log('🗑️ Menghapus foto dari Cloudinary:', publicId, 'URL:', oldUrl);
            
            // Call backend API untuk hapus dari Cloudinary
            if (publicId) {
              try {
                const response = await api.post('/cloudinary/delete', { public_id: publicId });
                console.log('✅ Cloudinary delete result:', response.data);
                if (response.data.status === 'success') {
                  console.log('✅ Foto berhasil dihapus dari Cloudinary');
                } else if (response.data.status === 'skipped') {
                  console.warn('⚠️ Cleanup dilewati:', response.data.message);
                } else {
                  console.error('❌ Gagal menghapus dari Cloudinary:', response.data);
                }
              } catch (err) {
                console.error('❌ Network error saat hapus dari Cloudinary:', err.message);
                // Jangan tampilkan error ke user, log saja
              }
            } else {
              console.warn('⚠️ publicId tidak ditemukan, tidak bisa hapus dari Cloudinary');
            }
            
            // Update profile di Supabase untuk hapus reference URL
            if (user) {
              try {
                await supabase
                  .from('profiles')
                  .update({ url_foto_cv: null })
                  .eq('id', user.id);
                console.log('✅ Reference URL dihapus dari database');
              } catch (error) {
                console.error('Error removing profile photo reference:', error);
              }
            }
          }}
          maxSize={2 * 1024 * 1024}
          required={false}
        />
      </div>

      {/* Deskripsi Diri */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Diri <span className="text-red-500">*</span> <span className="text-gray-400 text-xs">(Wajib, min 50 karakter)</span>
        </label>
        <textarea
          {...register('deskripsi_diri')}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${errors.deskripsi_diri ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Ceritakan tentang diri Anda, latar belakang, dan tujuan karir..."
        />
        {errors.deskripsi_diri && <p className="mt-1 text-sm text-red-500">{errors.deskripsi_diri.message}</p>}
        <p className="text-xs text-gray-500 mt-1">
          {(watch('deskripsi_diri') || '').length} / 50 karakter minimum
        </p>
      </div>

      {/* Tautan Profesional Dinamis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-gray-700">Tautan Profesional <span className="text-gray-400 text-xs">(Opsional)</span></h4>
          <button
            type="button"
            onClick={addLink}
            className="text-sm bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg flex items-center gap-1"
          >
            <span className="text-lg">+</span> Tambah Tautan
          </button>
        </div>
        
        {(watch('tautan_profesional') || []).map((link, index) => (
          <div key={index} className="flex gap-2 items-start">
            <div className="flex-1">
              <select
                value={link.platform}
                onChange={(e) => updateLink(index, 'platform', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              >
                <option value="">Pilih Platform</option>
                {commonPlatforms.map((platform) => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
                <option value="custom">+ Lainnya (Custom)</option>
              </select>
              {link.platform === 'custom' && (
                <input
                  type="text"
                  placeholder="Nama platform"
                  onChange={(e) => updateLink(index, 'platform', e.target.value)}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              )}
            </div>
            <div className="flex-[2]">
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="url"
                  value={link.url}
                  onChange={(e) => updateLink(index, 'url', e.target.value)}
                  placeholder="URL profil"
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => removeLink(index)}
              className="text-red-500 hover:text-red-700 p-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
      >
        Lanjut ke Langkah 2
      </button>
    </form>
  );
};

export default Step1BasicInfo;
