import React from 'react';
import { User, Mail, Phone, Calendar, MapPin, Image as ImageIcon, Link as LinkIcon } from 'lucide-react';

const Step1BasicInfo = ({ form, onNext }) => {
  const { register, handleSubmit, formState: { errors }, watch } = form;
  
  const onSubmit = (data) => {
    onNext(data);
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

      {/* URL Foto CV */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          URL Foto CV (3x4) <span className="text-gray-400 text-xs">(Opsional)</span>
        </label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('url_foto_cv')}
            type="url"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/foto.jpg"
          />
        </div>
        {errors.url_foto_cv && <p className="mt-1 text-sm text-red-500">{errors.url_foto_cv.message}</p>}
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

      {/* Tautan Profesional */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-700">Tautan Profesional <span className="text-gray-400 text-xs">(Opsional)</span></h4>
        
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('tautan_profesional.linkedin')}
            type="url"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="LinkedIn URL"
          />
        </div>
        {errors.tautan_profesional?.linkedin && <p className="text-sm text-red-500">{errors.tautan_profesional.linkedin.message}</p>}

        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('tautan_profesional.github')}
            type="url"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="GitHub URL"
          />
        </div>
        {errors.tautan_profesional?.github && <p className="text-sm text-red-500">{errors.tautan_profesional.github.message}</p>}

        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            {...register('tautan_profesional.portfolio')}
            type="url"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Portfolio URL"
          />
        </div>
        {errors.tautan_profesional?.portfolio && <p className="text-sm text-red-500">{errors.tautan_profesional.portfolio.message}</p>}
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
