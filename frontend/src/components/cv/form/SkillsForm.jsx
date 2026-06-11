import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input, Label, Textarea } from '../../UI';
import { Plus, Trash2 } from 'lucide-react';

export default function SkillsForm() {
  const { state, addSkill, removeSkill, updateSkills } = useCV();
  const { skills } = state.cvData;

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'technical',
    level: 1,
  });

  const skillCategories = [
    {
      name: 'Technical Skills',
      subcategories: [
        'Programming Languages',
        'Frameworks',
        'Database',
        'Tools',
        'Cloud & DevOps',
      ],
    },
    {
      name: 'Soft Skills',
      subcategories: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork'],
    },
    { name: 'Bahasa', subcategories: [] },
  ];

  const handleAddSkill = () => {
    if (newSkill.name) {
      addSkill({
        id: Date.now().toString(),
        ...newSkill,
      });
      setNewSkill({ name: '', category: 'technical', level: 1 });
    }
  };

  const getLevelLabel = (level) => {
    const labels = {
      1: 'Beginner',
      2: 'Intermediate',
      3: 'Advanced',
      4: 'Expert',
    };
    return labels[level];
  };

  const getStars = (level) => '⭐'.repeat(level);

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">Skill / Keahlian</h2>

      {/* Form Tambah Skill */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <Input
          placeholder="Nama skill (contoh: React, Python)"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
        />
        <select
          value={newSkill.category}
          onChange={(e) =>
            setNewSkill({ ...newSkill, category: e.target.value })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="technical">Technical Skills</option>
          <option value="soft">Soft Skills</option>
          <option value="language">Bahasa</option>
        </select>
        <select
          value={newSkill.level}
          onChange={(e) =>
            setNewSkill({ ...newSkill, level: parseInt(e.target.value) })
          }
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value={1}>⭐ Beginner</option>
          <option value={2}>⭐⭐ Intermediate</option>
          <option value={3}>⭐⭐⭐ Advanced</option>
          <option value={4}>⭐⭐⭐⭐ Expert</option>
        </select>
        <Button onClick={handleAddSkill} variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Tambah
        </Button>
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Minimum 5 skill (3 technical + 2 soft skills) - Saat ini:{' '}
        {skills.length} skill
      </p>

      {/* Display Skills by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSkills).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
              {category === 'technical'
                ? 'Technical Skills'
                : category === 'soft'
                ? 'Soft Skills'
                : 'Bahasa'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center gap-2 px-3 py-2 bg-primary-50 border border-primary-200 rounded-full"
                >
                  <span className="text-sm font-medium">{skill.name}</span>
                  <span className="text-xs text-gray-500">
                    {getStars(skill.level)}
                  </span>
                  <button
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
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
        <h4 className="text-sm font-medium text-gray-700 mb-2">
          Level Mastery:
        </h4>
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
