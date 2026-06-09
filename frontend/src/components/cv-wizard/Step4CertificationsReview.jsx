import React from 'react';
import { Plus, Trash2, Award, Trophy } from 'lucide-react';

const Step4CertificationsReview = ({ form, onNext, onBack, data }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  
  const sertifikasi = watch('sertifikasi') || [];
  const prestasi = watch('prestasi') || [];

  const [activeSections, setActiveSections] = React.useState({
    sertifikasi: true,
    prestasi: false
  });

  const onSubmit = (formData) => {
    onNext(formData);
  };

  // Sertifikasi handlers
  const addSertifikasi = () => {
    setValue('sertifikasi', [
      ...sertifikasi,
      { nama: '', institusi: '', tanggal: '', url: '' }
    ]);
  };

  const removeSertifikasi = (index) => {
    const updated = sertifikasi.filter((_, i) => i !== index);
    setValue('sertifikasi', updated);
  };

  // Prestasi handlers
  const addPrestasi = () => {
    setValue('prestasi', [
      ...(prestasi || []),
      { nama: '', penyelenggara: '', tanggal: '', deskripsi: '' }
    ]);
  };

  const removePrestasi = (index) => {
    const updated = (prestasi || []).filter((_, i) => i !== index);
    setValue('prestasi', updated);
  };

  const toggleSection = (section) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Sertifikasi */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('sertifikasi')}
          className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-gray-800">Sertifikasi</h3>
          </div>
          <span className="text-gray-500">{activeSections.sertifikasi ? '−' : '+'}</span>
        </button>
        
        {activeSections.sertifikasi && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Opsional - Tambahkan sertifikasi profesional Anda</p>
              <button
                type="button"
                onClick={addSertifikasi}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Sertifikasi
              </button>
            </div>

            {sertifikasi.map((cert, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removeSertifikasi(index)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Sertifikasi *</label>
                    <input
                      {...register(`sertifikasi.${index}.nama`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: AWS Certified Solutions Architect"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Institusi Penerbit *</label>
                    <input
                      {...register(`sertifikasi.${index}.institusi`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Amazon Web Services"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                    <input
                      {...register(`sertifikasi.${index}.tanggal`)}
                      type="month"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Credential <span className="text-gray-400 text-xs">(Opsional)</span></label>
                    <input
                      {...register(`sertifikasi.${index}.url`)}
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://credly.com/..."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Prestasi */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('prestasi')}
          className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100"
        >
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-600" />
            <h3 className="text-lg font-semibold text-gray-800">Prestasi</h3>
          </div>
          <span className="text-gray-500">{activeSections.prestasi ? '−' : '+'}</span>
        </button>
        
        {activeSections.prestasi && (
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-500">Opsional - Tambahkan prestasi atau penghargaan yang pernah diraih</p>
            <button
              type="button"
              onClick={addPrestasi}
              className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Prestasi
            </button>

            {(prestasi || []).map((achievement, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removePrestasi(index)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Prestasi *</label>
                    <input
                      {...register(`prestasi.${index}.nama`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: Juara 1 Hackathon Nasional"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Penyelenggara *</label>
                    <input
                      {...register(`prestasi.${index}.penyelenggara`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama organisasi penyelenggara"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                    <input
                      {...register(`prestasi.${index}.tanggal`)}
                      type="month"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi <span className="text-gray-400 text-xs">(Opsional)</span></label>
                  <textarea
                    {...register(`prestasi.${index}.deskripsi`)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsikan pencapaian Anda"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Section */}
      <div className="border-2 border-blue-200 rounded-lg p-6 bg-blue-50">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📋 Ringkasan CV</h3>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {/* Basic Info Summary */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">Informasi Dasar</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p><span className="text-gray-500">Nama:</span> <span className="font-medium">{data?.nama_lengkap || '-'}</span></p>
              <p><span className="text-gray-500">Email:</span> <span className="font-medium">{data?.email || '-'}</span></p>
              <p><span className="text-gray-500">Telepon:</span> <span className="font-medium">{data?.telepon || '-'}</span></p>
              <p><span className="text-gray-500">Posisi Target:</span> <span className="font-medium">{data?.posisi_target || '-'}</span></p>
            </div>
          </div>

          {/* Education Summary */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">🎓 Pendidikan ({data?.pendidikan?.length || 0})</h4>
            {data?.pendidikan?.slice(0, 2).map((edu, idx) => (
              <p key={idx} className="text-sm text-gray-600">
                • {edu.institusi} - {edu.jurusan} ({edu.jenjang})
              </p>
            ))}
            {data?.pendidikan?.length > 2 && (
              <p className="text-xs text-gray-400">+ {data.pendidikan.length - 2} lainnya</p>
            )}
          </div>

          {/* Skills Summary */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">💡 Keahlian</h4>
            <div className="flex flex-wrap gap-2">
              {data?.keahlian_teknis?.slice(0, 5).map((skill, idx) => (
                <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">{skill}</span>
              ))}
              {data?.keahlian_teknis?.length > 5 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">+{data.keahlian_teknis.length - 5}</span>
              )}
            </div>
          </div>

          {/* Experience Summary */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">💼 Pengalaman Kerja ({data?.pengalaman_kerja?.length || 0})</h4>
            {data?.pengalaman_kerja?.slice(0, 2).map((exp, idx) => (
              <p key={idx} className="text-sm text-gray-600">
                • {exp.posisi} at {exp.perusahaan}
              </p>
            ))}
          </div>

          {/* Projects Summary */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">🚀 Proyek ({data?.proyek?.length || 0})</h4>
            {data?.proyek?.slice(0, 2).map((proj, idx) => (
              <p key={idx} className="text-sm text-gray-600">
                • {proj.nama_proyek} - {proj.peran}
              </p>
            ))}
          </div>

          {/* Certifications & Achievements */}
          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-700 mb-2">🏆 Sertifikasi & Prestasi</h4>
            <p className="text-sm text-gray-600">
              Sertifikasi: {data?.sertifikasi?.length || 0} | Prestasi: {data?.prestasi?.length || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors"
        >
          Kembali
        </button>
        <button
          type="submit"
          className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          ✅ Simpan CV
        </button>
      </div>
    </form>
  );
};

export default Step4CertificationsReview;
