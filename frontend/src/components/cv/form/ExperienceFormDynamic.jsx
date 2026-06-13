import { useState, useContext } from 'react';
import { CVContext } from '../../../contexts/CVContext';

// Konfigurasi kategori
const categoryConfig = {
  professional: { color: 'bg-blue-100 text-blue-700', label: 'Profesional', icon: '💼' },
  organization: { color: 'bg-purple-100 text-purple-700', label: 'Organisasi', icon: '🏛️' },
  competition: { color: 'bg-yellow-100 text-yellow-700', label: 'Lomba', icon: '🏆' },
  teaching: { color: 'bg-green-100 text-green-700', label: 'Mengajar', icon: '👨‍🏫' },
  project: { color: 'bg-indigo-100 text-indigo-700', label: 'Proyek', icon: '🚀' }
};

// Component Kartu Pengalaman (Hasil Simpan)
function ExperienceCard({ item, onRemove }) {
  const config = categoryConfig[item.category] || categoryConfig.professional;
  
  // Logika tampilan waktu
  let displayTime = item.isOngoing ? `${item.periodStart} - Sekarang` : `${item.periodStart} - ${item.periodEnd}`;
  if (item.category === 'competition' && item.extraInfo?.eventDate) {
    displayTime = item.extraInfo.eventDate;
  }

  return (
    <div className="bg-white p-3 sm:p-4 rounded-xl border border-gray-200 shadow-sm mb-3 hover:shadow-md transition-shadow relative group">
      <span className={`absolute -top-2.5 left-3 sm:left-4 text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full border-2 border-white ${config.color}`}>
        {config.icon} {config.label}
      </span>

      <div className="flex justify-between items-start gap-2 mt-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">
            {item.category === 'project' ? item.role : item.company}
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 font-medium truncate">
            {item.category === 'project' ? (item.extraInfo?.projectType || 'Proyek') : item.role}
          </p>
        </div>
        <button onClick={() => onRemove(item.id)} className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-full transition-all duration-200 active:scale-90" title="Hapus">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Badges Informasi Tambahan */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-2 mb-3">
        <span className="text-[11px] sm:text-xs text-gray-500 flex items-center gap-1 font-medium">📅 {displayTime}</span>
        
        {item.extraInfo?.location && <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full">📍 {item.extraInfo.location}</span>}
        {item.extraInfo?.jobType && <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">💼 {item.extraInfo.jobType}</span>}
        {item.extraInfo?.level && <span className="bg-purple-100 text-purple-700 text-[10px] font-bold px-2 py-0.5 rounded-full">🌐 {item.extraInfo.level}</span>}
        {item.extraInfo?.organizer && <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded-full">🎯 {item.extraInfo.organizer}</span>}
        {item.extraInfo?.rank && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full">🏆 {item.extraInfo.rank}</span>}
        {item.extraInfo?.subject && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">📚 {item.extraInfo.subject}</span>}
        {item.extraInfo?.teachingType && <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">👨‍🏫 {item.extraInfo.teachingType}</span>}
        {item.extraInfo?.projectType && <span className="bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full">📁 {item.extraInfo.projectType}</span>}
      </div>

      {/* Render Multiple Links khusus untuk Proyek */}
      {item.category === 'project' && item.projectLinks && item.projectLinks.length > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
          {item.projectLinks.map((link, idx) => (
            <a key={idx} href={link} target="_blank" rel="noopener noreferrer" className="bg-indigo-50 text-indigo-700 text-[10px] sm:text-xs font-medium px-2.5 py-1 rounded-md hover:bg-indigo-100 transition-colors flex items-center gap-1 break-all">
              🔗 {link.replace(/^https?:\/\//, '').replace(/^www\./, '')}
            </a>
          ))}
        </div>
      )}

      {item.description ? (
        <ul className="list-disc list-inside text-xs sm:text-sm text-gray-700 space-y-1 mb-3">
          {item.description.split('\n').map((line, idx) => <li key={idx} className="break-words">{line.replace(/^- /, '').trim()}</li>)}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 italic mb-3">Tidak ada deskripsi tambahan.</p>
      )}
    </div>
  );
}

// Component Utama
export default function ExperienceFormDynamic() {
  const { state, dispatch } = useContext(CVContext);
  const experiences = state.experiences || [];
  const [activeForms, setActiveForms] = useState([]);

  const generateFormId = () => `form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getInitialFormData = () => ({
    role: '', company: '', periodStart: '', periodEnd: '', isOngoing: false, description: '',
    projectLinks: [], projectLinkInput: '',
    extraInfo: { location: '', jobType: '', level: '', organizer: '', rank: '', eventDate: '', subject: '', teachingType: '', projectType: '' }
  });

  const handleAddForm = (category) => {
    const newForm = { id: generateFormId(), category, data: getInitialFormData() };
    setActiveForms(prev => [...prev, newForm]);
    setTimeout(() => document.getElementById(newForm.id)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  };

  const handleRemoveForm = (id) => setActiveForms(prev => prev.filter(f => f.id !== id));
  
  const handleUpdateForm = (id, field, value) => {
    setActiveForms(prev => prev.map(f => f.id === id ? { ...f, data: { ...f.data, [field]: value } } : f));
  };
  
  const handleUpdateExtraInfo = (id, key, value) => {
    setActiveForms(prev => prev.map(f => f.id === id ? { ...f, data: { ...f.data, extraInfo: { ...f.data.extraInfo, [key]: value } } } : f));
  };

  // Fungsi khusus untuk menambah link proyek
  const handleAddProjectLink = (id, e) => {
    if (e) e.preventDefault();
    const form = activeForms.find(f => f.id === id);
    if (form && form.data.projectLinkInput.trim()) {
      const newLinks = [...form.data.projectLinks, form.data.projectLinkInput.trim()];
      handleUpdateForm(id, 'projectLinks', newLinks);
      handleUpdateForm(id, 'projectLinkInput', '');
    }
  };

  const handleRemoveProjectLink = (id, linkToRemove) => {
    const form = activeForms.find(f => f.id === id);
    if (form) {
      handleUpdateForm(id, 'projectLinks', form.data.projectLinks.filter(link => link !== linkToRemove));
    }
  };

  const handleSaveForm = (id) => {
    const form = activeForms.find(f => f.id === id);
    if (!form) return;

    if (!form.data.company || (!form.data.periodStart && form.category !== 'competition')) {
      alert('Mohon lengkapi field nama dan waktu (*)');
      return;
    }
    if (form.category !== 'competition' && !form.data.isOngoing && !form.data.periodEnd) {
      alert('Mohon isi waktu selesai atau centang "Masih berlangsung"');
      return;
    }

    // Bersihkan projectLinkInput sebelum disimpan agar tidak masuk ke data final
    const { projectLinkInput, ...cleanData } = form.data;

    dispatch({
      type: 'ADD_EXPERIENCE',
      payload: {
        id: `exp-${Date.now()}`,
        category: form.category,
        ...cleanData,
        periodEnd: cleanData.isOngoing ? 'Sekarang' : cleanData.periodEnd,
      }
    });
    handleRemoveForm(id);
  };

  const handleRemoveExperience = (id) => dispatch({ type: 'REMOVE_EXPERIENCE', payload: id });
  const sortedExperiences = [...experiences].sort((a, b) => b.periodStart.localeCompare(a.periodStart));

  // ==========================================
  // RENDER FIELD SPESIFIK (LAYOUT GRID)
  // ==========================================
  const renderCategorySpecificFields = (form) => {
    const { category, data, id } = form;

    // 1. PROFESIONAL
    if (category === 'professional') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nama Perusahaan <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: PT Teknologi Indonesia" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.company} onChange={(e) => handleUpdateForm(id, 'company', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Jabatan / Departemen <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: Software Engineer / IT Dept" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.role} onChange={(e) => handleUpdateForm(id, 'role', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Lokasi</label>
            <input type="text" placeholder="Contoh: Jakarta, Indonesia" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.extraInfo.location} onChange={(e) => handleUpdateExtraInfo(id, 'location', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tipe Pekerjaan</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={data.extraInfo.jobType} onChange={(e) => handleUpdateExtraInfo(id, 'jobType', e.target.value)}>
              <option value="">Pilih tipe</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship / Magang</option>
              <option value="Freelance">Freelance</option>
            </select>
          </div>
        </div>
      );
    }

    // 2. ORGANISASI
    if (category === 'organization') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Nama Organisasi <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: Himpunan Mahasiswa Sistem Informasi" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.company} onChange={(e) => handleUpdateForm(id, 'company', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Jabatan <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: Ketua Divisi Acara" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.role} onChange={(e) => handleUpdateForm(id, 'role', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tingkat</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={data.extraInfo.level} onChange={(e) => handleUpdateExtraInfo(id, 'level', e.target.value)}>
              <option value="">Pilih tingkat</option>
              <option value="Kampus">Kampus</option>
              <option value="Regional">Regional</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>
        </div>
      );
    }

    // 3. LOMBA
    if (category === 'competition') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Nama Lomba <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: National Hackathon 2024" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.company} onChange={(e) => handleUpdateForm(id, 'company', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Penyelenggara</label>
            <input type="text" placeholder="Contoh: Dicoding x Google" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.extraInfo.organizer} onChange={(e) => handleUpdateExtraInfo(id, 'organizer', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Peringkat</label>
            <input type="text" placeholder="Contoh: Juara 1, Finalis, Top 10" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.extraInfo.rank} onChange={(e) => handleUpdateExtraInfo(id, 'rank', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tingkat</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={data.extraInfo.level} onChange={(e) => handleUpdateExtraInfo(id, 'level', e.target.value)}>
              <option value="">Pilih tingkat</option>
              <option value="Lokal">Lokal / Kampus</option>
              <option value="Regional">Regional</option>
              <option value="Nasional">Nasional</option>
              <option value="Internasional">Internasional</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tanggal Event</label>
            <input type="text" placeholder="Contoh: 15-17 Sept 2023" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.extraInfo.eventDate} onChange={(e) => handleUpdateExtraInfo(id, 'eventDate', e.target.value)} />
          </div>
        </div>
      );
    }

    // 4. MENGAJAR
    if (category === 'teaching') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Mata Kuliah / Topik <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: Pemrograman Berorientasi Objek (PBO)" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.extraInfo.subject} onChange={(e) => handleUpdateExtraInfo(id, 'subject', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Institusi <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: Universitas Kristen Satya Wacana" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.company} onChange={(e) => handleUpdateForm(id, 'company', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Tipe Pengajaran</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={data.extraInfo.teachingType} onChange={(e) => handleUpdateExtraInfo(id, 'teachingType', e.target.value)}>
              <option value="">Pilih tipe</option>
              <option value="Asisten Dosen">Asisten Dosen</option>
              <option value="Tutor">Tutor</option>
              <option value="Mentor">Mentor</option>
              <option value="Fasilitator">Fasilitator</option>
              <option value="Trainer">Trainer</option>
            </select>
          </div>
        </div>
      );
    }

    // 5. PROYEK
    if (category === 'project') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nama Proyek <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Contoh: Sistem Informasi Perpustakaan" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" value={data.role} onChange={(e) => handleUpdateForm(id, 'role', e.target.value)} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Tipe Proyek</label>
            <select className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={data.extraInfo.projectType} onChange={(e) => handleUpdateExtraInfo(id, 'projectType', e.target.value)}>
              <option value="">Pilih tipe</option>
              <option value="Pribadi">Pribadi (Personal)</option>
              <option value="Kampus">Tugas / Proyek Kampus</option>
              <option value="Freelance">Freelance</option>
              <option value="Open Source">Open Source</option>
            </select>
          </div>
          
          {/* Input Multiple Link */}
          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">Link (GitHub, Website, Portofolio)</label>
            
            {/* Tampilkan link yang sudah ada sebagai tag */}
            {data.projectLinks.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {data.projectLinks.map((link, idx) => (
                  <span key={idx} className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                    {link}
                    <button onClick={() => handleRemoveProjectLink(id, link)} className="hover:text-indigo-900 hover:bg-indigo-200 rounded-full w-4 h-4 flex items-center justify-center transition-colors">×</button>
                  </span>
                ))}
              </div>
            )}
            
            {/* Input dan Tombol Tambah */}
            <form onSubmit={(e) => handleAddProjectLink(id, e)} className="flex gap-2">
              <input 
                type="url" 
                placeholder="https://github.com/..." 
                className="flex-1 px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                value={data.projectLinkInput} 
                onChange={(e) => handleUpdateForm(id, 'projectLinkInput', e.target.value)} 
              />
              <button 
                type="submit" 
                className="px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1 whitespace-nowrap"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                Tambah
              </button>
            </form>
            <p className="text-xs text-gray-500">💡 Tekan Enter atau tombol "Tambah" untuk menambah link</p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6 relative">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800">Pengalaman</h2>
      
      {/* BOX KATEGORI STATIC (STICKY) */}
      <div className="sticky top-2 z-20 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-5 rounded-xl border-2 border-blue-200 shadow-md backdrop-blur-sm bg-opacity-95">
        <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <span>📌</span> Pilih kategori, lalu klik "+" untuk menambah form
        </h3>
        <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-5 gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {Object.entries(categoryConfig).map(([key, config]) => (
            <button key={key} onClick={() => handleAddForm(key)} className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border-2 border-white bg-white hover:border-blue-400 hover:bg-blue-50 transition-all active:scale-95 group shadow-sm flex-shrink-0 w-28 sm:w-auto snap-center">
              <span className="text-2xl sm:text-3xl mb-2 group-hover:scale-110 transition-transform">{config.icon}</span>
              <span className="font-semibold text-gray-800 text-xs sm:text-sm text-center leading-tight mb-2">{config.label}</span>
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-white group-hover:bg-blue-700 transition-colors shadow-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* AREA FORM DINAMIS */}
      <div className="space-y-4">
        {activeForms.map((form) => (
          <div key={form.id} id={form.id} className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${categoryConfig[form.category].color}`}>
                  {categoryConfig[form.category].icon} {categoryConfig[form.category].label}
                </span>
                <span className="text-xs text-gray-500 font-medium">Form Baru</span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button onClick={() => handleRemoveForm(form.id)} className="text-sm text-red-600 hover:text-red-800 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-medium" title="Hapus form ini">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  <span className="hidden sm:inline">Hapus</span>
                </button>
                <button onClick={() => handleSaveForm(form.id)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold text-sm active:scale-95 shadow-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                  Simpan
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              {/* Render Field Spesifik (Sudah menggunakan Grid Layout) */}
              {renderCategorySpecificFields(form)}

              {/* FIELD UMUM: Periode Waktu (Kecuali Lomba) */}
              {form.category !== 'competition' && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <span className="text-sm font-semibold text-gray-700 mb-3 block">Periode Waktu</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600">Mulai <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Contoh: 2022 atau Jan 2023" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white" value={form.data.periodStart} onChange={(e) => handleUpdateForm(form.id, 'periodStart', e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-gray-600">Selesai <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Contoh: 2023 atau Des 2023" className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none disabled:bg-gray-100 disabled:text-gray-500 bg-white" value={form.data.isOngoing ? 'Sekarang' : form.data.periodEnd} onChange={(e) => handleUpdateForm(form.id, 'periodEnd', e.target.value)} disabled={form.data.isOngoing} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer mt-3 select-none">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" checked={form.data.isOngoing} onChange={(e) => handleUpdateForm(form.id, 'isOngoing', e.target.checked)} />
                    <span className="text-sm text-gray-700">Masih berlangsung</span>
                  </label>
                </div>
              )}

              {/* FIELD UMUM: Deskripsi / Pencapaian */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">
                  {form.category === 'professional' ? 'Pencapaian (Gunakan angka/metrik)' :
                   form.category === 'organization' ? 'Deskripsi Tugas atau Pencapaian' :
                   form.category === 'competition' ? 'Deskripsi Lomba' :
                   form.category === 'teaching' ? 'Deskripsi Kegiatan' :
                   'Deskripsi Proyek'}
                </label>
                <textarea 
                  placeholder={
                    form.category === 'professional' ? "Contoh:\n- Meningkatkan performa API sebesar 40%\n- Menangani 100K+ pengguna harian" :
                    form.category === 'organization' ? "Contoh:\n- Memimpin tim beranggotakan 15 orang\n- Mengelola anggaran sebesar Rp 150 juta" :
                    form.category === 'competition' ? "Contoh:\n- Mengembangkan aplikasi deteksi stunting berbasis AI" :
                    form.category === 'teaching' ? "Contoh:\n- Membimbing 30 mahasiswa dalam sesi praktikum\n- Menyusun modul dan soal latihan" :
                    "Contoh:\n- Membangun fitur autentikasi dan dashboard\n- Melakukan deployment menggunakan Vercel dan Supabase"
                  } 
                  rows="3" 
                  className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  value={form.data.description} 
                  onChange={(e) => handleUpdateForm(form.id, 'description', e.target.value)} 
                />
                <p className="text-xs text-gray-500">💡 Gunakan tanda "-" di awal kalimat untuk membuat daftar (list)</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* LIST PENGALAMAN (HASIL SIMPAN) */}
      <div className="pt-4 border-t-2 border-dashed border-gray-200">
        <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <span>📋</span> Pengalaman Tersimpan ({sortedExperiences.length})
        </h3>
        {sortedExperiences.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-sm sm:text-base text-gray-600 font-medium">Belum ada pengalaman tersimpan</p>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">Gunakan tombol "+" di kategori atas untuk menambah</p>
          </div>
        ) : (
          sortedExperiences.map((item) => <ExperienceCard key={item.id} item={item} onRemove={handleRemoveExperience} />)
        )}
      </div>
    </div>
  );
}