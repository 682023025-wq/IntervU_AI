import { useState, useContext } from 'react';
import { CVContext } from '../../../contexts/CVContext';

// Konfigurasi kategori
const categoryConfig = {
  professional: { 
    color: 'bg-blue-100 text-blue-700', 
    label: 'Profesional',
    icon: '💼'
  },
  organization: { 
    color: 'bg-purple-100 text-purple-700', 
    label: 'Organisasi',
    icon: '🏛️'
  },
  competition: { 
    color: 'bg-yellow-100 text-yellow-700', 
    label: 'Lomba',
    icon: '🏆'
  },
  teaching: { 
    color: 'bg-green-100 text-green-700', 
    label: 'Mengajar',
    icon: '👨‍🏫'
  },
  volunteer: { 
    color: 'bg-pink-100 text-pink-700', 
    label: 'Volunteer',
    icon: '🤝'
  }
};

// Component untuk kartu pengalaman
function ExperienceCard({ item, onRemove }) {
  const displayPeriod = item.isOngoing 
    ? `${item.periodStart} - Sekarang` 
    : `${item.periodStart} - ${item.periodEnd}`;

  const config = categoryConfig[item.category] || categoryConfig.professional;

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow relative group">
      
      {/* 1. Badge Kategori */}
      <span className={`absolute -top-2.5 left-4 text-[10px] font-bold px-2.5 py-1 rounded-full border-2 border-white ${config.color}`}>
        {config.icon} {config.label}
      </span>

      {/* 2. Baris Atas: Judul & Tombol Hapus */}
      <div className="flex justify-between items-start mt-2">
        <div>
          <h4 className="font-bold text-gray-800 text-base">{item.role}</h4>
          <p className="text-sm text-gray-600 font-medium">{item.company}</p>
        </div>
        <button 
          onClick={() => onRemove(item.id)}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all duration-200"
          title="Hapus pengalaman ini"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* 3. Baris Kedua: Periode & Badge Tambahan */}
      <div className="flex flex-wrap items-center gap-2 mt-2 mb-3">
        <span className="text-xs text-gray-500 flex items-center gap-1 font-medium">
          📅 {displayPeriod}
        </span>
        {item.isOngoing && (
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Aktif
          </span>
        )}
        {item.extraInfo?.rank && (
          <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            🏆 {item.extraInfo.rank}
          </span>
        )}
        {item.extraInfo?.scale && (
          <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            🌐 {item.extraInfo.scale}
          </span>
        )}
        {item.extraInfo?.menteeCount && (
          <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
            👥 {item.extraInfo.menteeCount} Mentee
          </span>
        )}
      </div>

      {/* 4. Baris Ketiga: Deskripsi */}
      {item.description ? (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 mb-3">
          {item.description.split('\n').map((line, idx) => (
            <li key={idx}>{line.replace(/^- /, '').trim()}</li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 italic mb-3">Tidak ada deskripsi tambahan.</p>
      )}

      {/* 5. Baris Keempat: Tags Skill */}
      {item.skills && item.skills.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 pt-3 border-t border-gray-100">
          {item.skills.map((skill, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-md">
              {skill}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Component utama form pengalaman dinamis
export default function ExperienceFormDynamic() {
  const { state, dispatch } = useContext(CVContext);
  const experiences = state.experiences || [];
  
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  
  // State untuk form input
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    periodStart: '',
    periodEnd: '',
    isOngoing: false,
    description: '',
    skills: [],
    extraInfo: {}
  });
  
  const [skillInput, setSkillInput] = useState('');

  // Filter experiences berdasarkan kategori
  const filteredExperiences = activeFilter === 'all' 
    ? experiences 
    : experiences.filter(exp => exp.category === activeFilter);

  // Sort by latest (periode mulai terbaru di atas)
  const sortedExperiences = [...filteredExperiences].sort((a, b) => {
    // Simple sorting based on periodStart text
    return b.periodStart.localeCompare(a.periodStart);
  });

  // Handle tambah pengalaman baru
  const handleAddExperience = () => {
    if (!selectedCategory || !formData.role || !formData.company || !formData.periodStart) {
      alert('Mohon lengkapi field yang wajib diisi (*)');
      return;
    }

    if (!formData.isOngoing && !formData.periodEnd) {
      alert('Mohon isi periode selesai atau centang "Masih berlangsung"');
      return;
    }

    const newExperience = {
      id: `exp-${Date.now()}`,
      category: selectedCategory,
      role: formData.role,
      company: formData.company,
      periodStart: formData.periodStart,
      periodEnd: formData.isOngoing ? 'Sekarang' : formData.periodEnd,
      isOngoing: formData.isOngoing,
      description: formData.description,
      skills: formData.skills,
      extraInfo: formData.extraInfo
    };

    dispatch({
      type: 'ADD_EXPERIENCE',
      payload: newExperience
    });

    // Reset form
    resetForm();
    setShowForm(false);
  };

  // Handle hapus pengalaman
  const handleRemoveExperience = (id) => {
    dispatch({
      type: 'REMOVE_EXPERIENCE',
      payload: id
    });
  };

  // Reset form
  const resetForm = () => {
    setSelectedCategory('');
    setFormData({
      role: '',
      company: '',
      periodStart: '',
      periodEnd: '',
      isOngoing: false,
      description: '',
      skills: [],
      extraInfo: {}
    });
    setSkillInput('');
  };

  // Handle input skill dengan Enter
  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!formData.skills.includes(skillInput.trim())) {
        setFormData({
          ...formData,
          skills: [...formData.skills, skillInput.trim()]
        });
      }
      setSkillInput('');
    }
  };

  // Remove skill dari list
  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  // Update extraInfo berdasarkan kategori
  const updateExtraInfo = (key, value) => {
    setFormData({
      ...formData,
      extraInfo: {
        ...formData.extraInfo,
        [key]: value
      }
    });
  };

  // Render form field tambahan berdasarkan kategori
  const renderExtraFields = () => {
    switch (selectedCategory) {
      case 'competition':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Peringkat/Kategori (Opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Juara 1, Finalis, Semi Finalis"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.extraInfo.rank || ''}
              onChange={(e) => updateExtraInfo('rank', e.target.value)}
            />
          </div>
        );
      
      case 'teaching':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Peserta/Mentee (Opsional)
            </label>
            <input
              type="number"
              placeholder="Contoh: 30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.extraInfo.menteeCount || ''}
              onChange={(e) => updateExtraInfo('menteeCount', e.target.value)}
            />
          </div>
        );
      
      case 'organization':
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skala Organisasi (Opsional)
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.extraInfo.scale || ''}
              onChange={(e) => updateExtraInfo('scale', e.target.value)}
            >
              <option value="">Pilih skala</option>
              <option value="Kampus">Kampus</option>
              <option value="Regional">Regional</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800">Pengalaman</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm active:scale-95"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Tambah Pengalaman
        </button>
      </div>

      {/* Filter Tabs - Scrollable on Mobile */}
      {experiences.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2 border-b border-gray-200 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Semua ({experiences.length})
          </button>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const count = experiences.filter(exp => exp.category === key).length;
            if (count === 0) return null;
            return (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  activeFilter === key
                    ? config.color + ' ring-2 ring-offset-1 ring-current'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {config.icon} {config.label} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Form Modal/Accordion - Mobile Optimized */}
      {showForm && (
        <div className="bg-gray-50 p-4 sm:p-6 rounded-xl border border-gray-200">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            {selectedCategory ? 'Isi Detail Pengalaman' : 'Pilih Jenis Pengalaman'}
          </h3>

          {/* Langkah 1: Pilih Kategori - Grid 2 cols on mobile */}
          {!selectedCategory ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`p-3 sm:p-4 rounded-xl border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all text-left active:scale-95 ${
                    selectedCategory === key ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="text-xl sm:text-2xl mb-1 sm:mb-2">{config.icon}</div>
                  <div className="font-semibold text-gray-800 text-xs sm:text-sm">{config.label}</div>
                </button>
              ))}
            </div>
          ) : (
            /* Langkah 2: Form Input */
            <div className="space-y-4">
              {/* Kembali ke pilihan kategori */}
              <button
                onClick={() => setSelectedCategory('')}
                className="text-sm text-gray-600 hover:text-gray-800 flex items-center gap-1"
              >
                ← Kembali ke pilihan kategori
              </button>

              {/* Field Umum */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Posisi/Jabatan *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Software Engineer"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nama Instansi/Perusahaan/Acara *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: PT. Teknologi Indonesia"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periode Mulai *
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Jan 2023 atau 2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={formData.periodStart}
                    onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periode Selesai
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Des 2023 atau 2023"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    value={formData.isOngoing ? 'Sekarang' : formData.periodEnd}
                    onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
                    disabled={formData.isOngoing}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isOngoing"
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  checked={formData.isOngoing}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    isOngoing: e.target.checked,
                    periodEnd: e.target.checked ? 'Sekarang' : ''
                  })}
                />
                <label htmlFor="isOngoing" className="text-sm text-gray-700">
                  Masih berlangsung
                </label>
              </div>

              {/* Field Tambahan Berdasarkan Kategori */}
              {renderExtraFields()}

              {/* Deskripsi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi/Pencapaian (Opsional)
                </label>
                <textarea
                  placeholder="Contoh:&#10;- Membimbing 30 mahasiswa&#10;- Membuat modul praktikum"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Gunakan tanda "-" untuk membuat list</p>
              </div>

              {/* Tech Stack/Skill */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tech Stack/Skill (Opsional)
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-100 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="hover:text-blue-900"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="Ketik skill dan tekan Enter"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                />
              </div>

              {/* Tombol Aksi */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleAddExperience}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Simpan Pengalaman
                </button>
                <button
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List Pengalaman */}
      <div className="space-y-3">
        {sortedExperiences.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-600 font-medium">Belum ada pengalaman</p>
            <p className="text-sm text-gray-500">Klik tombol "Tambah Pengalaman" untuk memulai</p>
          </div>
        ) : (
          sortedExperiences.map((item) => (
            <ExperienceCard
              key={item.id}
              item={item}
              onRemove={handleRemoveExperience}
            />
          ))
        )}
      </div>
    </div>
  );
}
