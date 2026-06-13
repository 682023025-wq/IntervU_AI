import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Plus, Trash2, Wrench, Users, Globe, Sparkles } from 'lucide-react';

export default function SkillsForm() {
  const { state, addSkill, removeSkill, updateSkillLevel } = useCV();
  const allSkills = state.cvData.skills || [];

  const [activeForms, setActiveForms] = useState([]);
  const [feedback, setFeedback] = useState('');

  const showFeedback = (message) => {
    setFeedback(message);
    setTimeout(() => setFeedback(''), 3000);
  };

  const generateFormId = () => `skill-form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getInitialFormData = () => ({
    category: 'hard',
    name: '',
    level: null, // Default null (opsional)
  });

  // Konfigurasi 3 Kategori
  const skillCategories = [
    { 
      value: 'hard', 
      label: 'Hard Skill', 
      icon: Wrench, 
      color: 'blue',
      bgColor: 'bg-blue-100', 
      textColor: 'text-blue-700',
      placeholder: 'Contoh: JavaScript, Python, React',
      description: 'Keahlian teknis seperti bahasa pemrograman, framework, database, dan tools.'
    },
    { 
      value: 'soft', 
      label: 'Soft Skill', 
      icon: Users, 
      color: 'green',
      bgColor: 'bg-green-100', 
      textColor: 'text-green-700',
      placeholder: 'Contoh: Kepemimpinan, Komunikasi, Problem Solving',
      description: 'Keahlian interpersonal dan karakter seperti kerja tim, kepemimpinan, dll.'
    },
    { 
      value: 'language', 
      label: 'Bahasa', 
      icon: Globe, 
      color: 'purple',
      bgColor: 'bg-purple-100', 
      textColor: 'text-purple-700',
      placeholder: 'Contoh: Inggris, Mandarin, Jepang',
      description: 'Bahasa yang Anda kuasai beserta tingkat kemahiran.'
    },
  ];

  // Level untuk Hard & Soft Skill (4 level)
  const technicalLevels = [
    { value: 1, label: 'Pemula', desc: '0-2 tahun', color: 'bg-red-400', badge: 'bg-red-100 text-red-700' },
    { value: 2, label: 'Menengah', desc: '2-4 tahun', color: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700' },
    { value: 3, label: 'Lanjut', desc: '4-6 tahun', color: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
    { value: 4, label: 'Ahli', desc: '6+ tahun', color: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700' },
  ];

  // Level untuk Bahasa (5 level)
  const languageLevels = [
    { value: 1, label: 'Pemula', desc: 'Tingkat dasar', color: 'bg-red-400', badge: 'bg-red-100 text-red-700' },
    { value: 2, label: 'Menengah', desc: 'Komunikasi dasar', color: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700' },
    { value: 3, label: 'Profesional', desc: 'Bekerja profesional', color: 'bg-green-500', badge: 'bg-green-100 text-green-700' },
    { value: 4, label: 'Fasih', desc: 'Lancar seperti native', color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-700' },
    { value: 5, label: 'Native', desc: 'Bahasa ibu', color: 'bg-purple-600', badge: 'bg-purple-100 text-purple-700' },
  ];

  const handleAddForm = () => {
    const newForm = {
      id: generateFormId(),
      data: getInitialFormData()
    };
    setActiveForms(prev => [...prev, newForm]);

    setTimeout(() => {
      const element = document.getElementById(newForm.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handleRemoveForm = (id) => {
    setActiveForms(prev => prev.filter(f => f.id !== id));
  };

  const handleUpdateForm = (id, field, value) => {
    setActiveForms(prev => prev.map(f => {
      if (f.id === id) {
        return { ...f, data: { ...f.data, [field]: value } };
      }
      return f;
    }));
  };

  const handleSaveForm = (id) => {
    const form = activeForms.find(f => f.id === id);
    if (!form) return;

    const { name, category, level } = form.data;

    if (!name.trim()) {
      showFeedback('❌ Mohon isi nama skill.');
      return;
    }

    // Cek duplikasi
    const isDuplicate = allSkills.some(skill => 
      skill.name.toLowerCase() === name.toLowerCase() && skill.category === category
    );
    
    if (isDuplicate) {
      const catLabel = skillCategories.find(c => c.value === category)?.label;
      showFeedback(`❌ Skill "${name}" sudah ada dalam kategori ${catLabel}.`);
      return;
    }

    addSkill({
      id: `skill-${Date.now()}`,
      name: name.trim(),
      category,
      level: level, // Bisa null (opsional) atau 1-5
    });

    showFeedback(`✓ Skill "${name}" berhasil ditambahkan`);
    handleRemoveForm(id);
  };

  // Pisahkan skills berdasarkan kategori
  const filteredSkills = {
    hard: allSkills.filter(s => s.category === 'hard'),
    soft: allSkills.filter(s => s.category === 'soft'),
    language: allSkills.filter(s => s.category === 'language')
  };

  return (
    <div className="space-y-6 relative">

      {/* Feedback Toast */}
      {feedback && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 ${
          feedback.includes('❌') 
            ? 'bg-red-100 text-red-700 border border-red-200' 
            : 'bg-green-100 text-green-700 border border-green-200'
        }`}>
          {feedback}
        </div>
      )}

      {/* Header Utama */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Skill / Keahlian
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tambahkan kemampuan teknis, soft skill, dan bahasa yang Anda kuasai.
          </p>
        </div>
        <button
          onClick={handleAddForm}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-semibold text-sm active:scale-95 shadow-sm whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Skill
        </button>
      </div>

      {/* Area Form Dinamis */}
      <div className="space-y-4">
        {activeForms.map((form) => {
          const currentCategory = skillCategories.find(c => c.value === form.data.category);
          const levels = form.data.category === 'language' ? languageLevels : technicalLevels;
          
          return (
            <div
              key={form.id}
              id={form.id}
              className="bg-white p-4 sm:p-6 rounded-xl border-2 border-gray-200 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300"
            >
              {/* Header Form */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${currentCategory.bgColor} ${currentCategory.textColor}`}>
                    <currentCategory.icon className="w-3 h-3 inline mr-1" /> {currentCategory.label}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">Form Baru</span>
                </div>

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
                {/* Grid: Kategori & Nama Skill */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">Kategori</label>
                    <select
                      value={form.data.category}
                      onChange={(e) => handleUpdateForm(form.id, 'category', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      {skillCategories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-gray-700">
                      Nama {currentCategory.label} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder={currentCategory.placeholder}
                      value={form.data.name}
                      onChange={(e) => handleUpdateForm(form.id, 'name', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                {/* Level Mastery (Radio Buttons) */}
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <label className="text-sm font-semibold text-gray-700 mb-3 block">
                    Tingkat Penguasaan <span className="text-xs text-gray-500 font-normal">(Opsional)</span>
                  </label>
                  
                  {/* Radio Buttons */}
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
                    {levels.map((lvl) => (
                      <label key={lvl.value} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                        <input 
                          type="radio" 
                          name={`level-${form.id}`} 
                          value={lvl.value}
                          checked={form.data.level === lvl.value}
                          onChange={() => handleUpdateForm(form.id, 'level', lvl.value)}
                          className={`accent-${currentCategory.color}-600 w-3.5 h-3.5`}
                        />
                        <span className="text-gray-700">{lvl.label}</span>
                      </label>
                    ))}
                  </div>

                  {/* Visualisasi Level */}
                  {form.data.level ? (
                    <div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ease-out ${levels.find(l => l.value === form.data.level)?.color}`}
                          style={{ width: `${(form.data.level / levels.length) * 100}%` }}
                        ></div>
                      </div>
                      <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${levels.find(l => l.value === form.data.level)?.badge}`}>
                        {levels.find(l => l.value === form.data.level)?.label} — {levels.find(l => l.value === form.data.level)?.desc}
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic">💡 Opsional — biarkan kosong jika ragu</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* List Skills Tersimpan - 3 Section */}
      <div className="pt-4 border-t-2 border-dashed border-gray-200 space-y-8">
        {skillCategories.map(category => (
          <div key={category.value}>
            <h3 className="text-base font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <category.icon className={`w-5 h-5 text-${category.color}-600`} />
              {category.label} ({filteredSkills[category.value].length})
            </h3>

            {filteredSkills[category.value].length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <category.icon className={`w-10 h-10 mx-auto mb-3 text-gray-400`} />
                <p className="text-sm text-gray-600 font-medium">Belum ada {category.label.toLowerCase()}</p>
                <p className="text-xs text-gray-500 mt-1">Klik "Tambah Skill" untuk memulai</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSkills[category.value].map((skill) => {
                  const levels = category.value === 'language' ? languageLevels : technicalLevels;
                  return (
                    <SkillCard
                      key={skill.id}
                      skill={skill}
                      levels={levels}
                      categoryColor={category.color}
                      onRemove={removeSkill}
                      onUpdateLevel={updateSkillLevel}
                    />
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
        <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
          💡 Tips Pengisian:
        </h4>
        <ul className="text-xs text-blue-800 space-y-1.5 list-disc list-inside">
          <li><strong>Hard Skills</strong> adalah kemampuan teknis yang dapat diukur, seperti bahasa pemrograman, framework, database, dan tools.</li>
          <li><strong>Soft Skills</strong> adalah kemampuan interpersonal seperti komunikasi, kerja tim, kepemimpinan, dan problem solving.</li>
          <li><strong>Bahasa</strong> menunjukkan tingkat kemahiran bahasa asing yang Anda kuasai.</li>
          <li>Tingkat penguasaan bersifat <strong>opsional</strong> — lebih baik jujur daripada melebih-lebihkan.</li>
          <li>Untuk posisi <strong>Asisten Dosen</strong>, tonjolkan hard skill yang relevan dengan mata kuliah yang diajarkan.</li>
        </ul>
      </div>
    </div>
  );
}

// Komponen Kartu Skill (Digunakan untuk semua kategori)
function SkillCard({ skill, levels, categoryColor, onRemove, onUpdateLevel }) {
  const levelInfo = levels.find(l => l.value === skill.level);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group">
      
      {/* Header: Nama & Tombol Hapus */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">{skill.name}</h4>
        </div>
        <button 
          onClick={() => onRemove(skill.id)}
          className="flex-shrink-0 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200 active:scale-90"
          title="Hapus skill ini"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Radio Buttons Level */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
        {levels.map((lvl) => (
          <label key={lvl.value} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
            <input 
              type="radio" 
              name={`level-display-${skill.id}`} 
              value={lvl.value}
              checked={skill.level === lvl.value}
              onChange={() => onUpdateLevel?.(skill.id, lvl.value)}
              className={`accent-${categoryColor}-600 w-3.5 h-3.5`}
            />
            <span className="text-gray-700">{lvl.label}</span>
          </label>
        ))}
      </div>

      {/* Visualisasi Level */}
      {skill.level && levelInfo ? (
        <div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ease-out ${levelInfo.color}`}
              style={{ width: `${(skill.level / levels.length) * 100}%` }}
            ></div>
          </div>
          <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${levelInfo.badge}`}>
            {levelInfo.label} — {levelInfo.desc}
          </span>
        </div>
      ) : (
        <p className="text-xs text-gray-400 italic">💡 Level belum ditentukan</p>
      )}
    </div>
  );
}