import React from 'react';
import { Plus, Trash2, X } from 'lucide-react';

const Step2EducationSkills = ({ form, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue, getValues } = form;
  
  const pendidikan = watch('pendidikan') || [];
  const keahlian_teknis = watch('keahlian_teknis') || [];
  const keahlian_non_teknis = watch('keahlian_non_teknis') || [];
  const bahasa = watch('bahasa') || [];

  const [newSkillInputs, setNewSkillInputs] = React.useState({
    teknis: '',
    non_teknis: '',
    bahasa: ''
  });

  const onSubmit = (data) => {
    onNext(data);
  };

  // Pendidikan handlers
  const addPendidikan = () => {
    setValue('pendidikan', [
      ...pendidikan,
      { institusi: '', jurusan: '', jenjang: 'S1', tahun_masuk: '', tahun_lulus: '', ipk: '', prestasi: '' }
    ]);
  };

  const removePendidikan = (index) => {
    const updated = pendidikan.filter((_, i) => i !== index);
    setValue('pendidikan', updated);
  };

  // Skill handlers
  const addSkill = (type, value) => {
    if (!value.trim()) return;
    const currentSkills = type === 'teknis' ? keahlian_teknis : type === 'non_teknis' ? keahlian_non_teknis : bahasa;
    if (!currentSkills.includes(value.trim())) {
      const updated = [...currentSkills, value.trim()];
      if (type === 'teknis') setValue('keahlian_teknis', updated);
      else if (type === 'non_teknis') setValue('keahlian_non_teknis', updated);
      else setValue('bahasa', updated);
    }
    setNewSkillInputs(prev => ({ ...prev, [type]: '' }));
  };

  const removeSkill = (type, index) => {
    const currentSkills = type === 'teknis' ? keahlian_teknis : type === 'non_teknis' ? keahlian_non_teknis : bahasa;
    const updated = currentSkills.filter((_, i) => i !== index);
    if (type === 'teknis') setValue('keahlian_teknis', updated);
    else if (type === 'non_teknis') setValue('keahlian_non_teknis', updated);
    else setValue('bahasa', updated);
  };

  const handleSkillKeyDown = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill(type, e.target.value);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Pendidikan Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">
            Pendidikan <span className="text-red-500">*</span>
          </h3>
          <button
            type="button"
            onClick={addPendidikan}
            className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Pendidikan
          </button>
        </div>

        {errors.pendidikan && (
          <p className="mb-2 text-sm text-red-500">{errors.pendidikan.message}</p>
        )}

        <div className="space-y-4">
          {pendidikan.map((edu, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 relative">
              <button
                type="button"
                onClick={() => removePendidikan(index)}
                className="absolute top-2 right-2 p-1 text-red-500 hover:bg-red-100 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Institusi <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`pendidikan.${index}.institusi`)}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.pendidikan?.[index]?.institusi ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Contoh: Universitas Indonesia"
                  />
                  {errors.pendidikan?.[index]?.institusi && (
                    <p className="text-xs text-red-500 mt-1">{errors.pendidikan[index].institusi.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jurusan <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register(`pendidikan.${index}.jurusan`)}
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.pendidikan?.[index]?.jurusan ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Contoh: Teknik Informatika"
                  />
                  {errors.pendidikan?.[index]?.jurusan && (
                    <p className="text-xs text-red-500 mt-1">{errors.pendidikan[index].jurusan.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jenjang <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register(`pendidikan.${index}.jenjang`)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.pendidikan?.[index]?.jenjang ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="SMA">SMA</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun Masuk <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`pendidikan.${index}.tahun_masuk`)}
                      type="text"
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.pendidikan?.[index]?.tahun_masuk ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="2020"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tahun Lulus <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register(`pendidikan.${index}.tahun_lulus`)}
                      type="text"
                      maxLength={4}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.pendidikan?.[index]?.tahun_lulus ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="2024"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IPK <span className="text-gray-400 text-xs">(Opsional)</span>
                  </label>
                  <input
                    {...register(`pendidikan.${index}.ipk`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="3.75"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prestasi <span className="text-gray-400 text-xs">(Opsional)</span>
                  </label>
                  <input
                    {...register(`pendidikan.${index}.prestasi`)}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Cum Laude, Dean's List"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Keahlian Section */}
      <div className="space-y-6">
        <h3 className="text-lg font-semibold text-gray-800">Keahlian</h3>

        {/* Keahlian Teknis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keahlian Teknis <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkillInputs.teknis}
              onChange={(e) => setNewSkillInputs(prev => ({ ...prev, teknis: e.target.value }))}
              onKeyDown={(e) => handleSkillKeyDown(e, 'teknis')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tambah keahlian (tekan Enter)"
            />
            <button
              type="button"
              onClick={() => addSkill('teknis', newSkillInputs.teknis)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keahlian_teknis.map((skill, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {skill}
                <button type="button" onClick={() => removeSkill('teknis', index)} className="hover:text-blue-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.keahlian_teknis && <p className="text-sm text-red-500 mt-1">{errors.keahlian_teknis.message}</p>}
        </div>

        {/* Keahlian Non-Teknis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Keahlian Non-Teknis <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkillInputs.non_teknis}
              onChange={(e) => setNewSkillInputs(prev => ({ ...prev, non_teknis: e.target.value }))}
              onKeyDown={(e) => handleSkillKeyDown(e, 'non_teknis')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tambah keahlian (tekan Enter)"
            />
            <button
              type="button"
              onClick={() => addSkill('non_teknis', newSkillInputs.non_teknis)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {keahlian_non_teknis.map((skill, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {skill}
                <button type="button" onClick={() => removeSkill('non_teknis', index)} className="hover:text-green-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.keahlian_non_teknis && <p className="text-sm text-red-500 mt-1">{errors.keahlian_non_teknis.message}</p>}
        </div>

        {/* Bahasa */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bahasa <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSkillInputs.bahasa}
              onChange={(e) => setNewSkillInputs(prev => ({ ...prev, bahasa: e.target.value }))}
              onKeyDown={(e) => handleSkillKeyDown(e, 'bahasa')}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Tambah bahasa (tekan Enter)"
            />
            <button
              type="button"
              onClick={() => addSkill('bahasa', newSkillInputs.bahasa)}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {bahasa.map((lang, index) => (
              <span key={index} className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                {lang}
                <button type="button" onClick={() => removeSkill('bahasa', index)} className="hover:text-purple-900">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          {errors.bahasa && <p className="text-sm text-red-500 mt-1">{errors.bahasa.message}</p>}
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
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg transition-colors"
        >
          Lanjut ke Langkah 3
        </button>
      </div>
    </form>
  );
};

export default Step2EducationSkills;
