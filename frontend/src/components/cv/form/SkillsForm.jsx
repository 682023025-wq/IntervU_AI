import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input, Label } from '../../UI';
import { Plus, Trash2, Star } from 'lucide-react';

export default function SkillsForm() {
  const { state, addSkill, removeSkill, updateSkills } = useCV();
  const { skills } = state.cvData;
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'technical',
    subcategory: '',
    level: 1,
    yearsOfExperience: 0,
  });

  const skillCategories = [
    {
      name: 'Technical Skills',
      value: 'technical',
      subcategories: [
        'Programming Languages',
        'Frameworks',
        'Database',
        'Tools',
        'Cloud & DevOps',
        'Lainnya'
      ],
    },
    {
      name: 'Soft Skills',
      value: 'soft',
      subcategories: [
        'Communication',
        'Leadership',
        'Problem Solving',
        'Teamwork',
        'Lainnya'
      ],
    },
    { 
      name: 'Bahasa', 
      value: 'language', 
      subcategories: [] 
    },
  ];

  const handleAddSkill = () => {
    if (newSkill.name) {
      addSkill({
        id: Date.now().toString(),
        ...newSkill,
      });
      setNewSkill({ name: '', category: 'technical', subcategory: '', level: 1, yearsOfExperience: 0 });
    }
  };

  const getLevelLabel = (level) => {
    const labels = {
      1: { text: 'Beginner', years: '0-2 tahun', stars: 1 },
      2: { text: 'Intermediate', years: '2-4 tahun', stars: 2 },
      3: { text: 'Advanced', years: '4-6 tahun', stars: 3 },
      4: { text: 'Expert', years: '6+ tahun', stars: 4 },
    };
    return labels[level];
  };

  const renderStars = (level) => {
    const levelInfo = getLevelLabel(level);
    return '⭐'.repeat(levelInfo.stars);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = {};
    }
    const subcat = skill.subcategory || 'Umum';
    if (!acc[skill.category][subcat]) {
      acc[skill.category][subcat] = [];
    }
    acc[skill.category][subcat].push(skill);
    return acc;
  }, {});

  const technicalCount = skills.filter(s => s.category === 'technical').length;
  const softCount = skills.filter(s => s.category === 'soft').length;
  const meetsMinimum = skills.length >= 5 && technicalCount >= 3 && softCount >= 2;

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Skill / Keahlian</h2>

      {/* Validasi Minimum */}
      <div className={`mb-6 p-4 rounded-lg ${meetsMinimum ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{meetsMinimum ? '✅' : '⚠️'}</span>
          <div>
            <p className={`text-sm font-medium ${meetsMinimum ? 'text-green-800' : 'text-yellow-800'}`}>
              {meetsMinimum ? '✓ Persyaratan skill terpenuhi' : 'Persyaratan minimum belum terpenuhi'}
            </p>
            <p className={`text-xs ${meetsMinimum ? 'text-green-600' : 'text-yellow-600'}`}>
              Minimum 5 skill (3 technical + 2 soft skills) - Saat ini: {skills.length} skill 
              ({technicalCount} technical, {softCount} soft)
            </p>
          </div>
        </div>
      </div>

      {/* Form Tambah Skill */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        <Input
          placeholder="Nama skill (contoh: React, Python)"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          className="md:col-span-1"
        />
        <select
          value={newSkill.category}
          onChange={(e) => {
            const cat = e.target.value;
            setNewSkill({ 
              ...newSkill, 
              category: cat,
              subcategory: cat === 'language' ? '' : skillCategories.find(c => c.value === cat)?.subcategories[0] || ''
            });
          }}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="technical">Technical Skills</option>
          <option value="soft">Soft Skills</option>
          <option value="language">Bahasa</option>
        </select>
        {newSkill.category !== 'language' && (
          <select
            value={newSkill.subcategory}
            onChange={(e) => setNewSkill({ ...newSkill, subcategory: e.target.value })}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {skillCategories
              .find(c => c.value === newSkill.category)
              ?.subcategories.map(sub => (
                <option key={sub} value={sub}>{sub}</option>
              ))}
          </select>
        )}
        <select
          value={newSkill.level}
          onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value={1}>⭐ Beginner (0-2 thn)</option>
          <option value={2}>⭐⭐ Intermediate (2-4 thn)</option>
          <option value={3}>⭐⭐⭐ Advanced (4-6 thn)</option>
          <option value={4}>⭐⭐⭐⭐ Expert (6+ thn)</option>
        </select>
        <Button onClick={handleAddSkill} variant="outline" disabled={!newSkill.name}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah
        </Button>
      </div>

      {/* Display Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, subcats]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              {category === 'technical' ? 'Technical Skills' : category === 'soft' ? 'Soft Skills' : 'Bahasa'}
            </h3>
            <div className="space-y-4">
              {Object.entries(subcats).map(([subcategory, categorySkills]) => (
                <div key={subcategory}>
                  {subcategory !== 'Umum' && (
                    <p className="text-xs font-medium text-gray-500 mb-2">{subcategory}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {categorySkills.map((skill) => (
                      <div
                        key={skill.id}
                        className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-full"
                      >
                        <span className="text-sm font-medium">{skill.name}</span>
                        <span className="text-xs text-gray-500">
                          {renderStars(skill.level)}
                        </span>
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Hapus"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {skills.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada skill yang ditambahkan.</p>
            <p className="text-sm">Mulai tambahkan skill Anda di atas.</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Level Mastery:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
          <div className="flex items-center gap-1">
            <span>⭐</span> Beginner (0-2 tahun)
          </div>
          <div className="flex items-center gap-1">
            <span>⭐⭐</span> Intermediate (2-4 tahun)
          </div>
          <div className="flex items-center gap-1">
            <span>⭐⭐⭐</span> Advanced (4-6 tahun)
          </div>
          <div className="flex items-center gap-1">
            <span>⭐⭐⭐⭐</span> Expert (6+ tahun)
          </div>
        </div>
      </div>
    </Card>
  );
}
