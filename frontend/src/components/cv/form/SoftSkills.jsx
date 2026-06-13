import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input } from '../../UI';
import { Plus, Trash2 } from 'lucide-react';

export default function SoftSkills() {
  const { state, addSkill, removeSkill, updateSkillLevel } = useCV();
  const skills = state.cvData.skills.filter(s => s.category === 'soft');
  
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillSubcategory, setNewSkillSubcategory] = useState('Communication');

  const subcategories = [
    'Communication',
    'Leadership',
    'Problem Solving',
    'Teamwork',
    'Lainnya'
  ];

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      // Cek duplikat
      const exists = skills.some(s => s.name.toLowerCase() === newSkillName.trim().toLowerCase());
      if (!exists) {
        addSkill({
          id: Date.now().toString(),
          name: newSkillName.trim(),
          category: 'soft',
          subcategory: newSkillSubcategory,
          level: null, // Default null (opsional)
          yearsOfExperience: 0,
        });
        setNewSkillName('');
      }
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const subcat = skill.subcategory || 'Umum';
    if (!acc[subcat]) {
      acc[subcat] = [];
    }
    acc[subcat].push(skill);
    return acc;
  }, {});

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span className="text-2xl">🤝</span> Soft Skills
        </h2>
        <span className="text-sm font-medium text-green-700 bg-green-100 px-3 py-1 rounded-full">
          {skills.length} skill{skills.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      <p className="text-sm text-gray-600 mb-2">
        Masukkan keahlian interpersonal Anda seperti komunikasi, kepemimpinan, dan kerja sama tim.
      </p>
      <p className="text-xs text-gray-500 italic mb-4">
        💡 Level bersifat opsional. Biarkan kosong jika Anda belum yakin.
      </p>

      {/* Form Tambah Skill */}
      <div className="flex flex-col md:flex-row gap-3 mb-6">
        <Input
          placeholder="Nama soft skill (contoh: Leadership, Communication)"
          value={newSkillName}
          onChange={(e) => setNewSkillName(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          className="flex-1"
        />
        <select
          value={newSkillSubcategory}
          onChange={(e) => setNewSkillSubcategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {subcategories.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
        <Button 
          onClick={handleAddSkill} 
          variant="primary" 
          disabled={!newSkillName.trim()}
          className="whitespace-nowrap"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Skill
        </Button>
      </div>

      {/* Display Skills by Subcategory - Layout Vertikal */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([subcategory, categorySkills]) => (
          <div key={subcategory}>
            <h3 className="text-sm font-medium text-gray-600 mb-3 pb-2 border-b border-gray-200">
              {subcategory}
            </h3>
            <div className="space-y-3">
              {categorySkills.map((skill) => (
                <SkillItem
                  key={skill.id}
                  skill={skill}
                  onUpdateLevel={updateSkillLevel}
                  onRemove={removeSkill}
                />
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-sm">Belum ada soft skill yang ditambahkan.</p>
            <p className="text-xs mt-1">Mulai tambahkan soft skill Anda di atas!</p>
          </div>
        )}
      </div>
    </Card>
  );
}

function SkillItem({ skill, onUpdateLevel, onRemove }) {
  const levelConfig = {
    1: { width: 25, bar: 'bg-red-400', badge: 'bg-red-100 text-red-700', label: 'Beginner' },
    2: { width: 50, bar: 'bg-orange-400', badge: 'bg-orange-100 text-orange-700', label: 'Intermediate' },
    3: { width: 75, bar: 'bg-green-500', badge: 'bg-green-100 text-green-700', label: 'Advanced' },
    4: { width: 100, bar: 'bg-blue-600', badge: 'bg-blue-100 text-blue-700', label: 'Expert' },
  };

  const config = levelConfig[skill.level];

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 group hover:border-gray-300 transition-colors">
      
      {/* 1. BARIS ATAS: NAMA & TOMBOL HAPUS */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className="font-semibold text-sm text-gray-800">{skill.name}</span>
          {skill.subcategory && (
            <span className="ml-2 text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
              {skill.subcategory}
            </span>
          )}
        </div>
        <button 
          onClick={() => onRemove(skill.id)}
          className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-full transition-all duration-200"
          title="Hapus skill ini"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* 2. BARIS TENGAH: 4 RADIO BUTTON LEVEL */}
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {[1, 2, 3, 4].map((val) => (
          <label key={val} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
            <input 
              type="radio" 
              name={`level-${skill.id}`} 
              value={val}
              checked={skill.level === val}
              onChange={() => onUpdateLevel(skill.id, val)}
              className="accent-blue-600 w-3.5 h-3.5"
            />
            <span className="text-gray-700">
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'][val - 1]}
            </span>
          </label>
        ))}
      </div>

      {/* 3. BARIS BAWAH: VISUALISASI LEVEL (DINAMIS) */}
      <div className="mt-3">
        {skill.level ? ( // Jika level 1, 2, 3, atau 4 (truthy)
          <div>
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ease-out ${config.bar}`}
                style={{ width: `${config.width}%` }}
              ></div>
            </div>
            <span className={`inline-block mt-1.5 text-[10px] font-medium px-2 py-0.5 rounded-full ${config.badge}`}>
              {config.label}
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
