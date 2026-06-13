import { useState, useRef } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Plus, Trash2, GraduationCap, X } from 'lucide-react';

export default function EducationForm() {
  const { state, addEducation, removeEducation } = useCV();
  const educations = state.cvData.education || [];
  
  // State untuk menampung form-form yang sedang aktif (belum disimpan)
  const [activeForms, setActiveForms] = useState([]);

  const generateFormId = () => `edu-form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getInitialFormData = () => ({
    level: 'S1',
    institution: '',
    major: '',
    location: '',
    startYear: '',
    endYear: '',
    gpa: '',
    predicate: '',
    relevantCourses: [],
    achievements: [],
    courseInput: '',
    achievementInput: ''
  });

  const educationLevels = [
    { value: 'SD', label: 'SD (Sekolah Dasar)' },
    { value: 'SMP', label: 'SMP (Sekolah Menengah Pertama)' },
    { value: 'SMA', label: 'SMA/SMK (Sekolah Menengah Atas/Kejuruan)' },
    { value: 'D3', label: 'D3 (Diploma 3)' },
    { value: 'S1', label: 'S1 (Sarjana)' },
    { value: 'S2', label: 'S2 (Magister)' },
    { value: 'S3', label: 'S3 (Doktor)' },
  ];

  const calculatePredicate = (gpa) => {
    const gpaNum = parseFloat(gpa);
    if (isNaN(gpaNum)) return '';
    if (gpaNum >= 3.51) return 'Cumlaude';
    if (gpaNum >= 3.01) return 'Sangat Memuaskan';
    if (gpaNum >= 2.76) return 'Memuaskan';
    return 'Cukup';
  };

  // 1. Handle Klik Tombol "Tambah Pendidikan" (Generate Form Baru)
  const handleAddForm = () => {
    const newForm = {
      id: generateFormId(),
      data: getInitialFormData()
    };
    setActiveForms(prev => [...prev, newForm]);
    
    // Scroll halus ke form baru
    setTimeout(() => {
      const element = document.getElementById(newForm.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  // 2. Handle Hapus Form yang belum disimpan
  const handleRemoveForm = (id) => {
    setActiveForms(prev => prev.filter(f => f.id !== id));
  };

  // 3. Handle Update Field Biasa
  const handleUpdateForm = (id, field, value) => {
    setActiveForms(prev => prev.map(f => {
      if (f.id === id) {
        let newData = { ...f.data, [field]: value };
        // Auto-calculate predicate jika yang diubah adalah GPA
        if (field === 'gpa') {
          newData.predicate = calculatePredicate(value);
        }
        return { ...f, data: newData };
      }
      return f;
    }));
  };

  // 4. Handle Tambah Tag (Mata Kuliah / Pencapaian)
  const handleAddTag = (id, field, inputField) => {
    setActiveForms(prev => prev.map(f => {
      if (f.id === id) {
        const inputValue = f.data[inputField].trim();
        if (inputValue && !f.data[field].includes(inputValue)) {
          return {
            ...f,
            data: {
              ...f.data,
              [field]: [...f.data[field], inputValue],
              [inputField]: '' // Reset input setelah ditambah
            }
          };
        }
      }
      return f;
    }));
  };

  // 5. Handle Hapus Tag
  const handleRemoveTag = (id, field, tagToRemove) => {
    setActiveForms(prev => prev.map(f => {
      if (f.id === id) {
        return {
          ...f,
          data: {
            ...f.data,
            [field]: f.data[field].filter(tag => tag !== tagToRemove)
          }
        };
      }
      return f;
    }));
  };

  // 6. Handle Simpan Form ke Context
  const handleSaveForm = (id) => {
    const form = activeForms.find(f => f.id === id);
    if (!form) return;

    const { courseInput, achievementInput, ...dataToSave } = form.data;

    if (!dataToSave.institution || !dataToSave.major || !dataToSave.startYear || !dataToSave.endYear) {
      alert('Mohon lengkapi field yang wajib diisi (*)');
      return;
    }
    if (parseInt(dataToSave.endYear) < parseInt(dataToSave.startYear)) {
      alert('Tahun lulus tidak boleh lebih kecil dari tahun masuk');
      return;
    }

    addEducation({
      id: `edu-${Date.now()}`,
      ...dataToSave,
    });

    // Hapus form dari activeForms setelah berhasil disimpan
    handleRemoveForm(id);
  };

  const sortedEducations = [...educations].sort((a, b) => parseInt(b.endYear) - parseInt(a.endYear));

  return (
    <div className="space-y-6 relative">
      
      {/* ========================================== */}
      {/* 1. HEADER UTAMA: Judul & Deskripsi (Kiri) + Tombol Tambah (Kanan) */}
      {/* ========================================== */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-blue-600" />
            Pendidikan
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Masukkan riwayat pendidikan Anda, minimal pendidikan terakhir.
          </p>
        </div>
        <button 
          onClick={handleAddForm}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium text-sm active:scale-95 shadow-sm whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Pendidikan
        </button>
      </div>

      {/* ========================================== */}
      {/* 2. AREA FORM DINAMIS (MULTI-GENERATE) */}
      {/* ========================================== */}
      <div className="space-y-4">
        {activeForms.map((form) => (
          <div 
            key={form.id} 
            id={form.id}
            className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
          >
            {/* HEADER FORM: Badge Kiri, Tombol Aksi Kanan Atas */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                  🎓 Riwayat Pendidikan
                </span>
                <span className="text-xs text-gray-500 font-medium">Form Baru</span>
              </div>
              
              {/* TOMBOL HAPUS & SIMPAN DI POJOK KANAN ATAS */}
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button 
                  onClick={() => handleRemoveForm(form.id)} 
                  className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                  title="Hapus form ini"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Hapus</span>
                </button>
                
                <button 
                  onClick={() => handleSaveForm(form.id)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm active:scale-95 shadow-sm flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  Simpan
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {/* Grid Layout Input */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Jenjang Pendidikan</label>
                  <select
                    value={form.data.level}
                    onChange={(e) => handleUpdateForm(form.id, 'level', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    {educationLevels.map(level => (
                      <option key={level.value} value={level.value}>{level.label}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Nama Institusi <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: Universitas Kristen Satya Wacana"
                    value={form.data.institution}
                    onChange={(e) => handleUpdateForm(form.id, 'institution', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Jurusan/Program Studi <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    placeholder="Contoh: Sistem Informasi"
                    value={form.data.major}
                    onChange={(e) => handleUpdateForm(form.id, 'major', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Lokasi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Salatiga, Jawa Tengah"
                    value={form.data.location}
                    onChange={(e) => handleUpdateForm(form.id, 'location', e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Tahun Masuk <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="2019"
                    value={form.data.startYear}
                    onChange={(e) => handleUpdateForm(form.id, 'startYear', e.target.value)}
                    min="1990"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Tahun Lulus <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    placeholder="2023"
                    value={form.data.endYear}
                    onChange={(e) => handleUpdateForm(form.id, 'endYear', e.target.value)}
                    min={form.data.startYear || "1990"}
                    max={new Date().getFullYear() + 5}
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">IPK/GPA (Opsional)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="3.75"
                    value={form.data.gpa}
                    onChange={(e) => handleUpdateForm(form.id, 'gpa', e.target.value)}
                    min="0"
                    max="4.00"
                    className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {form.data.predicate && (
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded-full w-fit mt-1">
                      Predikat: {form.data.predicate}
                    </span>
                  )}
                </div>
              </div>

              {/* Input Tag: Mata Kuliah Relevan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Mata Kuliah Relevan (Opsional)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.data.relevantCourses.map((course, idx) => (
                    <span key={idx} className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      {course}
                      <button onClick={() => handleRemoveTag(form.id, 'relevantCourses', course)} className="hover:text-blue-900 hover:bg-blue-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: Basis Data Lanjut, Teknologi Web"
                    value={form.data.courseInput}
                    onChange={(e) => handleUpdateForm(form.id, 'courseInput', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(form.id, 'relevantCourses', 'courseInput');
                      }
                    }}
                    className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddTag(form.id, 'relevantCourses', 'courseInput')}
                    className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>
              </div>

              {/* Input Tag: Pencapaian Akademik */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Pencapaian Akademik (Opsional)</label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {form.data.achievements.map((achieve, idx) => (
                    <span key={idx} className="bg-yellow-100 text-yellow-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      {achieve}
                      <button onClick={() => handleRemoveTag(form.id, 'achievements', achieve)} className="hover:text-yellow-900 hover:bg-yellow-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: Beasiswa Unggulan, Dean's List Semester 4"
                    value={form.data.achievementInput}
                    onChange={(e) => handleUpdateForm(form.id, 'achievementInput', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(form.id, 'achievements', 'achievementInput');
                      }
                    }}
                    className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button 
                    type="button"
                    onClick={() => handleAddTag(form.id, 'achievements', 'achievementInput')}
                    className="px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 whitespace-nowrap"
                  >
                    <Plus className="w-4 h-4" /> Tambah
                  </button>
                </div>
              </div>
              
              {/* TOMBOL BAWAH SUDAH DIHAPUS, DIPINDAH KE ATAS */}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================== */}
      {/* 3. LIST PENDIDIKAN (HASIL SIMPAN) */}
      {/* ========================================== */}
      <div className="pt-4 border-t-2 border-dashed border-gray-200">
        <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span>📋</span> Riwayat Pendidikan Tersimpan ({sortedEducations.length})
        </h3>
        
        {sortedEducations.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm sm:text-base text-gray-600 font-medium">Belum ada data pendidikan</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Klik tombol "Tambah Pendidikan" di atas untuk memulai.</p>
          </div>
        ) : (
          sortedEducations.map((edu) => (
            <div
              key={edu.id}
              className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow relative group"
            >
              {/* Badge Jenjang di Kiri Atas */}
              <span className="absolute -top-2.5 left-3 sm:left-4 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full border-2 border-white bg-blue-100 text-blue-700">
                🎓 {edu.level}
              </span>

              {/* Tombol Hapus di Kanan Atas (Untuk data yang sudah tersimpan) */}
              <button
                onClick={() => removeEducation(edu.id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all duration-200 active:scale-90"
                title="Hapus data ini"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <div className="flex-1 min-w-0 mt-2 pr-8">
                <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{edu.institution}</h4>
                <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">{edu.major}</p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 mb-3">
                <span className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1 font-medium">
                  📍 {edu.location || 'Lokasi tidak diisi'} • 📅 {edu.startYear} - {edu.endYear}
                </span>
                {edu.gpa && (
                  <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    IPK: {edu.gpa}
                  </span>
                )}
                {edu.predicate && (
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {edu.predicate}
                  </span>
                )}
              </div>

              {(edu.relevantCourses?.length > 0 || edu.achievements?.length > 0) && (
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-3">
                  {edu.relevantCourses?.length > 0 && (
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5">Mata Kuliah Relevan:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {edu.relevantCourses.map((course, idx) => (
                          <span key={idx} className="bg-blue-50 text-blue-700 text-[10px] sm:text-xs font-medium px-2 sm:px-2.5 py-1 rounded-md break-words">
                            {course}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {edu.achievements?.length > 0 && (
                    <div>
                      <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-1.5">Pencapaian:</p>
                      <ul className="list-disc list-inside text-[10px] sm:text-xs text-gray-700 space-y-1">
                        {edu.achievements.map((achieve, idx) => (
                          <li key={idx} className="break-words">{achieve}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. INFO BOX */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          💡 Tips Pengisian:
        </h4>
        <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside">
          <li>Untuk <strong>fresh graduate</strong>, sangat disarankan mengisi "Mata Kuliah Relevan" dan "Pencapaian Akademik".</li>
          <li>IPK di atas 3.50 secara otomatis akan terdeteksi sebagai <strong>Cumlaude</strong>.</li>
        </ul>
      </div>
    </div>
  );
}