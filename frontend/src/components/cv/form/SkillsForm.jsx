import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Plus, Trash2, Wrench, Users, Globe, X } from 'lucide-react';

export default function SkillsForm() {
  const { state, addSkill, removeSkill } = useCV();
  const allSkills = state.cvData.skills || [];

  const [activeForms, setActiveForms] = useState([]);

  const generateFormId = () => `skill-form-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const getInitialFormData = () => ({
    category: 'hard', // Default ke hard skill
    name: '',
    level: 3, // Default ke Intermediate
  });

  const skillCategories = [
    { value: 'hard', label: 'Hard Skill', icon: Wrench, color: 'blue', bgColor: 'bg-blue-100', textColor: 'text-blue-700' },
    { value: 'soft', label: 'Soft Skill', icon: Users, color: 'green', bgColor: 'bg-green-100', textColor: 'text-green-700' },
    { value: 'language', label: 'Bahasa', icon: Globe, color: 'purple', bgColor: 'bg-purple-100', textColor: 'text-purple-700' },
  ];

  const levelLabels = {
    1: 'Pemula (Beginner)',
    2: 'Dasar (Elementary)',
    3: 'Menengah (Intermediate)',
    4: 'Mahir (Advanced)',
    5: 'Ahli (Expert)'
  };

  const levelColors = {
    1: 'bg-red-500',
    2: 'bg-orange-500',
    3: 'bg-yellow-500',
    4: 'bg-lime-500',
    5: 'bg-green-500'
  };

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
      alert('Mohon isi nama skill.');
      return;
    }

    // Cek duplikasi berdasarkan nama dan kategori
    const isDuplicate = allSkills.some(skill => skill.name.toLowerCase() === name.toLowerCase() && skill.category === category);
    if (isDuplicate) {
      alert(`Skill "${name}" sudah ada dalam kategori ${skillCategories.find(c => c.value === category)?.label}.`);
      return;
    }

    addSkill({
      id: `skill-${Date.now()}`,
      name: name.trim(),
      category,
      level: parseInt(level),
    });

    handleRemoveForm(id); // Hapus form setelah disimpan
  };

  // Pisahkan skills berdasarkan kategori
  const filteredSkills = {
    hard: allSkills.filter(s => s.category === 'hard'),
    soft: allSkills.filter(s => s.category === 'soft'),
    language: allSkills.filter(s => s.category === 'language')
  };

  return (
    <div className="space-y-6 relative">

      {/* Header Utama */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            Skills
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Tambahkan kemampuan Anda. Pilih antara Hard Skill, Soft Skill, atau Bahasa.
          </p>
        </div>
        <button
          onClick={handleAddForm}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium text-sm active:scale-95 shadow-sm whitespace-nowrap w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          Tambah Skill
        </button>
      </div>

      {/* Area Form Dinamis */}
      <div className="space-y-4">
        {activeForms.map((form) => {
          const currentCategory = skillCategories.find(c => c.value === form.data.category);
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
                    {React.createElement(currentCategory.icon, { className: "w-3 h-3 inline mr-1" })} {currentCategory.label}
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
                    <label className="text-sm font-medium text-gray-700">Nama Skill <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      placeholder={`Contoh: ${form.data.category === 'hard' ? 'JavaScript' : form.data.category === 'soft' ? 'Leadership' : 'Inggris'}`}
                      value={form.data.name}
                      onChange={(e) => handleUpdateForm(form.id, 'name', e.target.value)}
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Level: {levelLabels[form.data.level]}</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={form.data.level}
                    onChange={(e) => handleUpdateForm(form.id, 'level', e.target.value)}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 (Pemula)</span>
                    <span>5 (Ahli)</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* List Skills Tersimpan */}
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
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredSkills[category.value].map((skill) => (
                  <div
                    key={skill.id}
                    className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative group"
                  >
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                      title="Hapus skill ini"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="min-w-0">
                      <h4 className="font-bold text-gray-800 text-sm truncate">{skill.name}</h4>
                      <p className="text-xs text-gray-600">{levelLabels[skill.level]}</p>
                    </div>

                    <div className="mt-2.5">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${levelColors[skill.level]}`}
                          style={{ width: `${(skill.level / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
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
          <li><strong>Hard Skills</strong> adalah kemampuan teknis yang dapat diukur, seperti bahasa pemrograman, alat desain, dll.</li>
          <li><strong>Soft Skills</strong> adalah kemampuan interpersonal dan karakter, seperti komunikasi, kerja tim, kepemimpinan.</li>
          <li><strong>Bahasa</strong> digunakan untuk menunjukkan tingkat penguasaan bahasa.</li>
          <li>Gunakan slider untuk menyesuaikan tingkat keahlian Anda secara jujur.</li>
        </ul>
      </div>
    </div>
  );
}