import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input, Label } from '../../UI';
import { Plus, Trash2, GraduationCap } from 'lucide-react';

export default function EducationForm() {
  const { state, addEducation, removeEducation } = useCV();
  const educations = state.cvData.education || [];
  
  const [newEducation, setNewEducation] = useState({
    level: 'S1',
    institution: '',
    major: '',
    location: '',
    startYear: '',
    endYear: '',
    gpa: '',
    predicate: '',
    relevantCourses: [],
    achievements: [],
  });

  const educationLevels = [
    { value: 'SD', label: 'SD (Sekolah Dasar)' },
    { value: 'SMP', label: 'SMP (Sekolah Menengah Pertama)' },
    { value: 'SMA', label: 'SMA/SMK (Sekolah Menengah Atas/Kejuruan)' },
    { value: 'D3', label: 'D3 (Diploma 3)' },
    { value: 'S1', label: 'S1 (Sarjana)' },
    { value: 'S2', label: 'S2 (Magister)' },
    { value: 'S3', label: 'S3 (Doktor)' },
  ];

  const predicates = [
    'Cumlaude',
    'Sangat Memuaskan',
    'Memuaskan',
    'Cukup',
  ];

  const handleAddEducation = () => {
    if (newEducation.institution && newEducation.major) {
      addEducation({
        id: Date.now().toString(),
        ...newEducation,
      });
      setNewEducation({
        level: 'S1',
        institution: '',
        major: '',
        location: '',
        startYear: '',
        endYear: '',
        gpa: '',
        predicate: '',
        relevantCourses: [],
        achievements: [],
      });
    }
  };

  const calculatePredicate = (gpa) => {
    const gpaNum = parseFloat(gpa);
    if (gpaNum >= 3.51) return 'Cumlaude';
    if (gpaNum >= 3.01) return 'Sangat Memuaskan';
    if (gpaNum >= 2.76) return 'Memuaskan';
    return 'Cukup';
  };

  const handleGPAChange = (e) => {
    const gpa = e.target.value;
    setNewEducation({
      ...newEducation,
      gpa,
      predicate: calculatePredicate(gpa),
    });
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <GraduationCap className="w-6 h-6" />
        Pendidikan
      </h2>
      <p className="text-sm text-gray-600 mb-6">
        Masukkan riwayat pendidikan Anda, minimal pendidikan terakhir.
      </p>

      {/* Form Tambah Pendidikan */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Jenjang Pendidikan</Label>
            <select
              value={newEducation.level}
              onChange={(e) => setNewEducation({ ...newEducation, level: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              {educationLevels.map(level => (
                <option key={level.value} value={level.value}>{level.label}</option>
              ))}
            </select>
          </div>

          <div>
            <Label>Nama Institusi *</Label>
            <Input
              placeholder="Contoh: Universitas Indonesia"
              value={newEducation.institution}
              onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
              maxLength={200}
            />
          </div>

          <div>
            <Label>Jurusan/Program Studi *</Label>
            <Input
              placeholder="Contoh: Sistem Informasi"
              value={newEducation.major}
              onChange={(e) => setNewEducation({ ...newEducation, major: e.target.value })}
              maxLength={150}
            />
          </div>

          <div>
            <Label>Lokasi *</Label>
            <Input
              placeholder="Contoh: Depok, Jawa Barat"
              value={newEducation.location}
              onChange={(e) => setNewEducation({ ...newEducation, location: e.target.value })}
            />
          </div>

          <div>
            <Label>Tahun Masuk *</Label>
            <Input
              type="number"
              placeholder="2019"
              value={newEducation.startYear}
              onChange={(e) => setNewEducation({ ...newEducation, startYear: e.target.value })}
              min="1990"
              max={new Date().getFullYear()}
            />
          </div>

          <div>
            <Label>Tahun Lulus *</Label>
            <Input
              type="number"
              placeholder="2023"
              value={newEducation.endYear}
              onChange={(e) => setNewEducation({ ...newEducation, endYear: e.target.value })}
              min={newEducation.startYear || "1990"}
              max={new Date().getFullYear() + 5}
            />
          </div>

          <div>
            <Label>IPK/GPA (Opsional)</Label>
            <Input
              type="number"
              step="0.01"
              placeholder="3.75"
              value={newEducation.gpa}
              onChange={handleGPAChange}
              min="0"
              max="4"
            />
            {newEducation.predicate && (
              <p className="text-xs text-green-600 mt-1">Predikat: {newEducation.predicate}</p>
            )}
          </div>
        </div>

        <Button onClick={handleAddEducation} disabled={!newEducation.institution || !newEducation.major}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pendidikan
        </Button>
      </div>

      {/* Display Pendidikan */}
      <div className="space-y-4">
        {educations.length > 0 ? (
          educations.map((edu) => (
            <div
              key={edu.id}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-1 bg-primary-100 text-primary-800 text-xs font-medium rounded">
                      {edu.level}
                    </span>
                    {edu.gpa && (
                      <span className="text-sm text-gray-600">
                        IPK: <strong>{edu.gpa}</strong>
                        {edu.predicate && ` (${edu.predicate})`}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">{edu.institution}</h3>
                  <p className="text-gray-600">{edu.major}</p>
                  <p className="text-sm text-gray-500">{edu.location} • {edu.startYear} - {edu.endYear}</p>
                </div>
                <button
                  onClick={() => removeEducation(edu.id)}
                  className="text-red-500 hover:text-red-700 p-2"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <GraduationCap className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p>Belum ada data pendidikan yang ditambahkan.</p>
            <p className="text-sm mt-1">Minimal masukkan pendidikan terakhir Anda.</p>
          </div>
        )}
      </div>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="text-sm font-semibold text-blue-900 mb-2">💡 Tips:</h4>
        <ul className="text-xs text-blue-800 space-y-1">
          <li>• Untuk fresh graduate, cantumkan mata kuliah relevan dan pencapaian akademik</li>
          <li>• IPK di atas 3.5 dapat meningkatkan peluang interview</li>
          <li>• Urutkan dari pendidikan terbaru (terakhir) ke terlama</li>
        </ul>
      </div>
    </Card>
  );
}
