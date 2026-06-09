import React, { useState } from 'react';
import { User, Mail, Phone, Calendar, MapPin, Image as ImageIcon, Link as LinkIcon, Upload, X } from 'lucide-react';

const Step1BasicInfo = ({ form, onNext }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  const [customLinks, setCustomLinks] = useState([]);
  
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

    // TODO: Implement upload ke Supabase Storage
    // Untuk sekarang, kita simpan sebagai placeholder
    alert('Fitur upload foto akan segera diimplementasikan dengan Supabase Storage');
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

      {/* Upload Foto CV */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto CV (3x4) <span className="text-gray-400 text-xs">(Opsional, JPG/PNG, max 2MB)</span>
        </label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            Klik untuk upload atau drag & drop foto Anda
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Format: JPG, PNG | Max: 2MB
          </p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/jpg"
            onChange={handleFileUpload}
            className="hidden"
            id="foto-cv-upload"
          />
          <label
            htmlFor="foto-cv-upload"
            className="mt-4 inline-block bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2 px-4 rounded-lg cursor-pointer transition-colors"
          >
            Pilih File
          </label>
          {watch('url_foto_cv') && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <img src={watch('url_foto_cv')} alt="Preview" className="h-20 w-16 object-cover rounded" />
              <button
                type="button"
                onClick={() => setValue('url_foto_cv', '')}
                className="text-red-500 hover:text-red-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
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
