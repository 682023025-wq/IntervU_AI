import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input } from '../../UI';
import { Plus, Trash2 } from 'lucide-react';

export default function LanguageSkills() {
  const { state, addSkill, removeSkill } = useCV();
  const skills = state.cvData.skills.filter(s => s.category === 'language');
  
  const [newSkill, setNewSkill] = useState({
    name: '',
    subcategory: '',
    level: 3, // Default Professional Working Proficiency
  });

  const proficiencyLevels = [
    { value: 5, label: 'Native', desc: 'Bahasa ibu' },
    { value: 4, label: 'Fluent', desc: 'Lancar seperti native' },
    { value: 3, label: 'Professional Working Proficiency', desc: 'Mampu bekerja profesional' },
    { value: 2, label: 'Limited Working Proficiency', desc: 'Mampu komunikasi dasar' },
    { value: 1, label: 'Elementary', desc: 'Pemula' },
  ];

  const handleAddSkill = () => {
    if (newSkill.name) {
      addSkill({
        id: Date.now().toString(),
        name: newSkill.name,
        category: 'language',
        subcategory: '',
        level: newSkill.level,
        yearsOfExperience: 0,
      });
      setNewSkill({ name: '', subcategory: '', level: 3 });
    }
  };

  const getLevelLabel = (level) => {
    return proficiencyLevels.find(l => l.value === level) || proficiencyLevels[2];
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <span className="text-2xl">🌐</span> Bahasa
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Masukkan bahasa yang Anda kuasai beserta tingkat kemahiran.
      </p>

      {/* Form Tambah Bahasa */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6">
        <Input
          placeholder="Nama bahasa (contoh: English, Mandarin, Jepang)"
          value={newSkill.name}
          onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
          className="md:col-span-2"
        />
        <select
          value={newSkill.level}
          onChange={(e) => setNewSkill({ ...newSkill, level: parseInt(e.target.value) })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          {proficiencyLevels.map(level => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>
        <Button onClick={handleAddSkill} variant="outline" disabled={!newSkill.name} className="md:col-span-4">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Bahasa
        </Button>
      </div>

      {/* Display Languages */}
      <div className="space-y-3">
        {skills.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bahasa
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tingkat Kemahiran
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sertifikasi (Opsional)
                  </th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {skills.map((skill) => {
                  const levelInfo = getLevelLabel(skill.level);
                  return (
                    <tr key={skill.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {skill.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{levelInfo.label}</div>
                        <div className="text-xs text-gray-500">{levelInfo.desc}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Input
                          placeholder="Contoh: TOEFL 550, IELTS 6.5, HSK 2"
                          className="text-sm w-48"
                          value={skill.certification || ''}
                          onChange={(e) => {
                            const updatedSkills = state.cvData.skills.map(s =>
                              s.id === skill.id ? { ...s, certification: e.target.value } : s
                            );
                            // Note: Need to implement updateSkill in context
                          }}
                        />
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button
                          onClick={() => removeSkill(skill.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
            <p>Belum ada bahasa yang ditambahkan.</p>
            <p className="text-sm mt-1">Indonesia (Native) akan ditambahkan secara otomatis.</p>
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
