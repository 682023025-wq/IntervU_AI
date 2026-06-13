import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input } from '../../UI';
import { Plus, Trash2 } from 'lucide-react';

export default function SoftSkills() {
  const { state, addSkill, removeSkill } = useCV();
  const skills = state.cvData.skills.filter(s => s.category === 'soft');
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    subcategory: 'Communication',
    level: 1,
  });

  const subcategories = [
    'Communication',
    'Leadership',
    'Problem Solving',
    'Teamwork',
    'Lainnya'
  ];

  const handleAddSkill = () => {
    if (newSkill.name) {
      addSkill({
        id: Date.now().toString(),
        name: newSkill.name,
        category: 'soft',
        subcategory: newSkill.subcategory,
        level: newSkill.level,
        yearsOfExperience: 0,
      });
      setNewSkill({ name: '', subcategory: 'Communication', level: 1 });
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
    const subcat = skill.subcategory || 'Umum';
    if (!acc[subcat]) {
      acc[subcat] = [];
    }
    acc[subcat].push(skill);
    return acc;
  }, {});

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🤝</span> Soft Skills
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Masukkan keahlian interpersonal Anda seperti komunikasi, kepemimpinan, dan kerja sama tim.
      </p>

      {/* Form Tambah Skill */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <Input
          placeholder="Nama soft skill (contoh: Leadership, Communication)"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          className="md:col-span-2"
        />
        <select
          value={newSkill.subcategory}
          onChange={(e) => setNewSkill({ ...newSkill, subcategory: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {subcategories.map(sub => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
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
        <Button onClick={handleAddSkill} variant="outline" disabled={!newSkill.name} className="md:col-span-4">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Soft Skill
        </Button>
      </div>

      {/* Display Skills by Subcategory */}
      <div className="space-y-4">
        {Object.entries(groupedSkills).map(([subcategory, categorySkills]) => (
          <div key={subcategory}>
            <h3 className="text-sm font-medium text-gray-600 mb-2">{subcategory}</h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-full"
                >
                  <span className="text-sm font-medium text-green-900">{skill.name}</span>
                  <span className="text-xs text-gray-600">
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

        {skills.length === 0 && (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <p>Belum ada soft skill yang ditambahkan.</p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Level Mastery:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-600">
          <div>⭐ Beginner (0-2 tahun)</div>
          <div>⭐⭐ Intermediate (2-4 tahun)</div>
          <div>⭐⭐⭐ Advanced (4-6 tahun)</div>
          <div>⭐⭐⭐⭐ Expert (6+ tahun)</div>
        </div>
      </div>
    </Card>
  );
}
