import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input } from '../../UI';
import { Plus, Trash2 } from 'lucide-react';

export default function LanguageSkills() {
  const { state, addSkill, removeSkill, updateSkillLevel } = useCV();
  const skills = state.cvData.skills.filter(s => s.category === 'language');
  
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(null);

  const proficiencyLevels = [
    { value: 5, label: 'Native', desc: 'Bahasa ibu' },
    { value: 4, label: 'Fasih', desc: 'Lancar seperti native' },
    { value: 3, label: 'Profesional', desc: 'Mampu bekerja profesional' },
    { value: 2, label: 'Menengah', desc: 'Mampu komunikasi dasar' },
    { value: 1, label: 'Pemula', desc: 'Tingkat dasar' },
  ];

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      // Cek duplikat
      const exists = skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
      if (!exists) {
        addSkill({
          id: Date.now().toString(),
          name: newSkillName.trim(),
          category: 'language',
          subcategory: '',
          level: newSkillLevel, // Default null (opsional)
          yearsOfExperience: 0,
        });
        setNewSkillName('');
        setNewSkillLevel(null);
      }
    }
  };

  const getLevelLabel = (level) => {
    return proficiencyLevels.find(l => l.value === level) || { label: '-', desc: '' };
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">🌐</span> Bahasa
        </h2>
        <span className="text-sm font-medium text-purple-700 bg-purple-100 px-3 py-1 rounded-full">
          {skills.length} bahasa{skills.length !== 1 ? '' : ''}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        Masukkan bahasa yang Anda kuasai beserta tingkat kemahiran.
      </p>
      <p className="text-xs text-gray-500 italic mb-4">
        💡 Level bersifat opsional. Biarkan kosong jika Anda belum yakin.
      </p>

      {/* Form Tambah Bahasa */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          placeholder="Nama bahasa (contoh: Inggris, Mandarin, Jepang)"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          className="flex-1"
        />
        <Button 
          onClick={handleAddSkill} 
          variant="primary" 
          disabled={!newSkillName.trim()}
          className="whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Bahasa
        </Button>
      </div>

      {/* Display Languages - Layout Vertikal */}
      <div className="space-y-3">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <LanguageItem
              key={skill.id}
              skill={skill}
              onUpdateLevel={updateSkillLevel}
              onRemove={removeSkill}
              proficiencyLevels={proficiencyLevels}
              getLevelLabel={getLevelLabel}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-sm">Belum ada bahasa yang ditambahkan.</p>
            <p className="text-xs mt-1">Mulai tambahkan bahasa yang Anda kuasai di atas!</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Tips:</strong> Bahasa Indonesia biasanya dianggap sebagai Native untuk pelamar Indonesia. 
          Fokus tambahkan bahasa asing lainnya yang Anda kuasai.
        </p>
      </div>
    </Card>
  );
}

function LanguageItem({ skill, onUpdateLevel, onRemove, proficiencyLevels, getLevelLabel }) {
  const levelInfo = getLevelLabel(skill.level);

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 group hover:border-gray-300 transition-colors">
      
      {/* 1. BARIS ATAS: NAMA & TOMBOL HAPUS */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="font-semibold text-sm text-gray-800">{skill.name}</span>
        </div>
        <button 
          onClick={() => onRemove(skill.id)}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200"
          title="Hapus bahasa ini"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* 2. BARIS TENGAH: 5 RADIO BUTTON LEVEL */}
      <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3">
        {proficiencyLevels.map((level) => (
          <label key={level.value} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
            <input 
              type="radio" 
              name={`level-${skill.id}`} 
              value={level.value}
              checked={skill.level === level.value}
              onChange={() => onUpdateLevel(skill.id, level.value)}
              className="accent-purple-600 w-3.5 h-3.5"
            />
            <span className="text-gray-700">
              {level.label}
            </span>
          </label>
        ))}
      </div>

      {/* 3. BARIS BAWAH: VISUALISASI LEVEL (DINAMIS) */}
      <div className="mt-3">
        {skill.level ? ( // Jika level dipilih (truthy)
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${
                  skill.level === 5 ? 'bg-purple-600' :
                  skill.level === 4 ? 'bg-blue-500' :
                  skill.level === 3 ? 'bg-green-500' :
                  skill.level === 2 ? 'bg-orange-400' : 'bg-red-400'
                }`}
                style={{ width: `${(skill.level / 5) * 100}%` }}
              ></div>
            </div>
            <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${
              skill.level === 5 ? 'bg-purple-100 text-purple-700' :
              skill.level === 4 ? 'bg-blue-100 text-blue-700' :
              skill.level === 3 ? 'bg-green-100 text-green-700' :
              skill.level === 2 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
            }`}>
              {levelInfo.label} — {levelInfo.desc}
            </span>
          </div>
        ) : (
          // Jika level === null (falsy)
          <p className="text-xs text-gray-400 italic mt-1">💡 Opsional — biarkan kosong jika ragu</p>
        )}
      </div>

    </div>
  );
}
