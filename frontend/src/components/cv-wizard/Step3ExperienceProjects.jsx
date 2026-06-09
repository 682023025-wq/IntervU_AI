import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const Step3ExperienceProjects = ({ form, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = form;
  
  const pengalaman_kerja = watch('pengalaman_kerja') || [];
  const pengalaman_organisasi = watch('pengalaman_organisasi') || [];
  const proyek = watch('proyek') || [];

  const [newTechInputs, setNewTechInputs] = React.useState({});
  const [activeSections, setActiveSections] = React.useState({
    pengalaman_kerja: true,
    pengalaman_organisasi: false,
    proyek: false
  });

  const onSubmit = (data) => {
    onNext(data);
  };

  // Pengalaman Kerja handlers
  const addPengalamanKerja = () => {
    setValue('pengalaman_kerja', [
      ...pengalaman_kerja,
      { perusahaan: '', posisi: '', tanggal_mulai: '', tanggal_selesai: '', sedang_bekerja: false, deskripsi: [''] }
    ]);
  };

  const removePengalamanKerja = (index) => {
    const updated = pengalaman_kerja.filter((_, i) => i !== index);
    setValue('pengalaman_kerja', updated);
  };

  const addDeskripsiPoint = (expIndex) => {
    const updated = [...pengalaman_kerja];
    updated[expIndex].deskripsi = [...(updated[expIndex].deskripsi || []), ''];
    setValue('pengalaman_kerja', updated);
  };

  const removeDeskripsiPoint = (expIndex, pointIndex) => {
    const updated = [...pengalaman_kerja];
    updated[expIndex].deskripsi = updated[expIndex].deskripsi.filter((_, i) => i !== pointIndex);
    setValue('pengalaman_kerja', updated);
  };

  // Pengalaman Organisasi handlers
  const addPengalamanOrganisasi = () => {
    setValue('pengalaman_organisasi', [
      ...(pengalaman_organisasi || []),
      { nama_organisasi: '', posisi: '', tanggal_mulai: '', tanggal_selesai: '', masih_aktif: false, deskripsi: [''] }
    ]);
  };

  const removePengalamanOrganisasi = (index) => {
    const updated = (pengalaman_organisasi || []).filter((_, i) => i !== index);
    setValue('pengalaman_organisasi', updated);
  };

  // Proyek handlers
  const addProyek = () => {
    setValue('proyek', [
      ...(proyek || []),
      { nama_proyek: '', peran: '', tanggal: '', teknologi: [], deskripsi: '', url: '', pencapaian: '' }
    ]);
  };

  const removeProyek = (index) => {
    const updated = (proyek || []).filter((_, i) => i !== index);
    setValue('proyek', updated);
  };

  const addTeknologi = (projIndex, value) => {
    if (!value.trim()) return;
    const updated = [...(proyek || [])];
    const currentTech = updated[projIndex].teknologi || [];
    if (!currentTech.includes(value.trim())) {
      updated[projIndex].teknologi = [...currentTech, value.trim()];
      setValue('proyek', updated);
    }
    setNewTechInputs(prev => ({ ...prev, [projIndex]: '' }));
  };

  const removeTeknologi = (projIndex, techIndex) => {
    const updated = [...(proyek || [])];
    updated[projIndex].teknologi = updated[projIndex].teknologi.filter((_, i) => i !== techIndex);
    setValue('proyek', updated);
  };

  const handleTechKeyDown = (e, projIndex) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTeknologi(projIndex, e.target.value);
    }
  };

  const toggleSection = (section) => {
    setActiveSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pengalaman Kerja */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('pengalaman_kerja')}
          className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800">Pengalaman Kerja</h3>
          <span className="text-gray-500">{activeSections.pengalaman_kerja ? '−' : '+'}</span>
        </button>
        
        {activeSections.pengalaman_kerja && (
          <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Opsional - Tambahkan pengalaman kerja Anda</p>
              <button
                type="button"
                onClick={addPengalamanKerja}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Tambah Pengalaman
              </button>
            </div>

            {pengalaman_kerja.map((exp, expIndex) => (
              <div key={expIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removePengalamanKerja(expIndex)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Perusahaan *</label>
                    <input
                      {...register(`pengalaman_kerja.${expIndex}.perusahaan`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama perusahaan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posisi *</label>
                    <input
                      {...register(`pengalaman_kerja.${expIndex}.posisi`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Posisi/jabatan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                    <input
                      {...register(`pengalaman_kerja.${expIndex}.tanggal_mulai`)}
                      type="month"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Selesai <span className="text-gray-400 text-xs">(atau sedang bekerja)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        {...register(`pengalaman_kerja.${expIndex}.tanggal_selesai`)}
                        type="month"
                        disabled={watch(`pengalaman_kerja.${expIndex}.sedang_bekerja`)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                      />
                      <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                        <input
                          type="checkbox"
                          {...register(`pengalaman_kerja.${expIndex}.sedang_bekerja`)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setValue(`pengalaman_kerja.${expIndex}.sedang_bekerja`, checked);
                            if (checked) {
                              setValue(`pengalaman_kerja.${expIndex}.tanggal_selesai`, '');
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        Sekarang
                      </label>
                    </div>
                  </div>
                </div>

                {/* Deskripsi Bullet Points */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi Pekerjaan *</label>
                  {(exp.deskripsi || []).map((point, pointIndex) => (
                    <div key={pointIndex} className="flex gap-2 mb-2">
                      <span className="text-gray-400 py-2">•</span>
                      <input
                        {...register(`pengalaman_kerja.${expIndex}.deskripsi.${pointIndex}`)}
                        type="text"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="Deskripsikan tanggung jawab dan pencapaian Anda"
                      />
                      <button
                        type="button"
                        onClick={() => removeDeskripsiPoint(expIndex, pointIndex)}
                        className="p-2 text-red-500 hover:bg-red-100 rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addDeskripsiPoint(expIndex)}
                    className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Tambah poin
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pengalaman Organisasi */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('pengalaman_organisasi')}
          className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800">Pengalaman Organisasi</h3>
          <span className="text-gray-500">{activeSections.pengalaman_organisasi ? '−' : '+'}</span>
        </button>
        
        {activeSections.pengalaman_organisasi && (
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-500">Opsional - Tambahkan pengalaman organisasi/kepanitiaan</p>
            <button
              type="button"
              onClick={addPengalamanOrganisasi}
              className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Organisasi
            </button>

            {(pengalaman_organisasi || []).map((org, orgIndex) => (
              <div key={orgIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removePengalamanOrganisasi(orgIndex)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Organisasi *</label>
                    <input
                      {...register(`pengalaman_organisasi.${orgIndex}.nama_organisasi`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama organisasi"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Posisi *</label>
                    <input
                      {...register(`pengalaman_organisasi.${orgIndex}.posisi`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Posisi/jabatan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Mulai *</label>
                    <input
                      {...register(`pengalaman_organisasi.${orgIndex}.tanggal_mulai`)}
                      type="month"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Selesai <span className="text-gray-400 text-xs">(atau masih aktif)</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        {...register(`pengalaman_organisasi.${orgIndex}.tanggal_selesai`)}
                        type="month"
                        disabled={watch(`pengalaman_organisasi.${orgIndex}.masih_aktif`)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
                      />
                      <label className="flex items-center gap-1 text-sm text-gray-600 whitespace-nowrap">
                        <input
                          type="checkbox"
                          {...register(`pengalaman_organisasi.${orgIndex}.masih_aktif`)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setValue(`pengalaman_organisasi.${orgIndex}.masih_aktif`, checked);
                            if (checked) {
                              setValue(`pengalaman_organisasi.${orgIndex}.tanggal_selesai`, '');
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        Masih Aktif
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Deskripsi *</label>
                  <textarea
                    {...register(`pengalaman_organisasi.${orgIndex}.deskripsi.0`)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Deskripsikan peran dan kontribusi Anda"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Proyek */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => toggleSection('proyek')}
          className="w-full px-4 py-3 bg-gray-50 flex justify-between items-center hover:bg-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800">Proyek</h3>
          <span className="text-gray-500">{activeSections.proyek ? '−' : '+'}</span>
        </button>
        
        {activeSections.proyek && (
          <div className="p-4 space-y-4">
            <p className="text-sm text-gray-500">Opsional - Tambahkan proyek yang pernah Anda kerjakan</p>
            <button
              type="button"
              onClick={addProyek}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Tambah Proyek
            </button>

            {(proyek || []).map((proj, projIndex) => (
              <div key={projIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
                <button
                  type="button"
                  onClick={() => removeProyek(projIndex)}
                  className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nama Proyek *</label>
                    <input
                      {...register(`proyek.${projIndex}.nama_proyek`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Nama proyek"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Peran Anda *</label>
                    <input
                      {...register(`proyek.${projIndex}.peran`)}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Peran dalam proyek"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal *</label>
                    <input
                      {...register(`proyek.${projIndex}.tanggal`)}
                      type="month"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Proyek <span className="text-gray-400 text-xs">(Opsional)</span></label>
                    <input
                      {...register(`proyek.${projIndex}.url`)}
                      type="url"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://github.com/..."
                    />
                  </div>
                </div>

                {/* Teknologi Tags */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teknologi yang Digunakan</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newTechInputs[projIndex] || ''}
                      onChange={(e) => setNewTechInputs(prev => ({ ...prev, [projIndex]: e.target.value }))}
                      onKeyDown={(e) => handleTechKeyDown(e, projIndex)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Tambah teknologi (tekan Enter)"
                    />
                    <button
                      type="button"
                      onClick={() => addTeknologi(projIndex, newTechInputs[projIndex] || '')}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(proj.teknologi || []).map((tech, techIndex) => (
                      <span key={techIndex} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {tech}
                        <button type="button" onClick={() => removeTeknologi(projIndex, techIndex)} className="hover:text-purple-900">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi Proyek *</label>
                  <textarea
                    {...register(`proyek.${projIndex}.deskripsi`)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Jelaskan tujuan dan ruang lingkup proyek"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pencapaian <span className="text-gray-400 text-xs">(Opsional)</span></label>
                  <textarea
                    {...register(`proyek.${projIndex}.pencapaian`)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Hasil atau pencapaian dari proyek ini"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Lanjut ke Langkah 4
        </button>
      </div>
    </form>
  );
};

export default Step3ExperienceProjects;
