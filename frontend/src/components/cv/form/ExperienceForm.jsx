import { useState } from 'react';
import { useCV } from '../../../contexts/CVContext';
import { Card, Button, Input, Label, Textarea, Checkbox } from '../../UI';
import { Plus, Trash2 } from 'lucide-react';

export default function ExperienceForm() {
  const { state, addWorkExperience, removeWorkExperience } = useCV();
  const { workExperience } = state.cvData;

  const [editingId, setEditingId] = useState(null);
  const [newExp, setNewExp] = useState({
    position: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    currentlyWorking: false,
    jobType: 'full-time',
    description: '',
    achievements: [''],
    technologies: [],
  });

  const handleAddExperience = () => {
    if (newExp.position && newExp.company) {
      addWorkExperience({
        id: Date.now().toString(),
        ...newExp,
      });
      setNewExp({
        position: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        jobType: 'full-time',
        description: '',
        achievements: [''],
        technologies: [],
      });
      setEditingId(null);
    }
  };

  const handleAddAchievement = () => {
    setNewExp({
      ...newExp,
      achievements: [...newExp.achievements, ''],
    });
  };

  const handleRemoveAchievement = (index) => {
    setNewExp({
      ...newExp,
      achievements: newExp.achievements.filter((_, i) => i !== index),
    });
  };

  const handleUpdateAchievement = (index, value) => {
    const updated = [...newExp.achievements];
    updated[index] = value;
    setNewExp({ ...newExp, achievements: updated });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' });
  };

  const calculateDuration = (startDate, endDate, currentlyWorking) => {
    if (!startDate) return '';
    const start = new Date(startDate);
    const end = currentlyWorking ? new Date() : new Date(endDate);
    const years = end.getFullYear() - start.getFullYear();
    const months = end.getMonth() - start.getMonth();
    const totalMonths = years * 12 + months;

    if (totalMonths < 12) {
      return `${totalMonths} bulan`;
    } else if (totalMonths % 12 === 0) {
      return `${totalMonths / 12} tahun`;
    } else {
      const y = Math.floor(totalMonths / 12);
      const m = totalMonths % 12;
      return `${y} tahun ${m} bulan`;
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Pengalaman Kerja</h2>
        <Button onClick={() => setEditingId('new')} variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Pengalaman
        </Button>
      </div>

      {/* Form Tambah/Edit */}
      {editingId === 'new' && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
          <h3 className="font-medium text-gray-700">Tambah Pengalaman Baru</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Posisi/Jabatan *</Label>
              <Input
                placeholder="Software Engineer"
                value={newExp.position}
                onChange={(e) =>
                  setNewExp({ ...newExp, position: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Nama Perusahaan *</Label>
              <Input
                placeholder="PT Teknologi Indonesia"
                value={newExp.company}
                onChange={(e) =>
                  setNewExp({ ...newExp, company: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Lokasi</Label>
              <Input
                placeholder="Jakarta, Indonesia"
                value={newExp.location}
                onChange={(e) =>
                  setNewExp({ ...newExp, location: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Tanggal Mulai *</Label>
              <Input
                type="month"
                value={newExp.startDate}
                onChange={(e) =>
                  setNewExp({ ...newExp, startDate: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Tanggal Selesai</Label>
              <Input
                type="month"
                value={newExp.endDate}
                onChange={(e) =>
                  setNewExp({ ...newExp, endDate: e.target.value })
                }
                disabled={newExp.currentlyWorking}
              />
            </div>
          </div>

          <Checkbox
            label="Masih bekerja di sini"
            checked={newExp.currentlyWorking}
            onChange={(checked) =>
              setNewExp({ ...newExp, currentlyWorking: checked })
            }
          />

          <div>
            <Label>Tipe Pekerjaan</Label>
            <select
              value={newExp.jobType}
              onChange={(e) =>
                setNewExp({ ...newExp, jobType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>

          <div>
            <Label>Deskripsi Pekerjaan</Label>
            <Textarea
              placeholder="Deskripsikan tanggung jawab dan tugas Anda..."
              value={newExp.description}
              onChange={(e) =>
                setNewExp({ ...newExp, description: e.target.value })
              }
              rows={3}
            />
          </div>

          {/* Achievements */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Pencapaian (Gunakan metrik/angka)</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddAchievement}
              >
                <Plus className="w-3 h-3 mr-1" />
                Tambah
              </Button>
            </div>
            {newExp.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <span className="text-green-600">✓</span>
                <Input
                  placeholder={`Pencapaian ${index + 1}...`}
                  value={achievement}
                  onChange={(e) => handleUpdateAchievement(index, e.target.value)}
                />
                {newExp.achievements.length > 1 && (
                  <button
                    onClick={() => handleRemoveAchievement(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={handleAddExperience}>Simpan</Button>
            <Button
              variant="secondary"
              onClick={() => setEditingId(null)}
            >
              Batal
            </Button>
          </div>
        </div>
      )}

      {/* List Pengalaman */}
      <div className="space-y-4">
        {workExperience.map((exp, index) => (
          <div
            key={exp.id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                <p className="text-sm text-gray-600">{exp.company}</p>
                <p className="text-xs text-gray-500">
                  {exp.location} •{' '}
                  {formatDate(exp.startDate)} -{' '}
                  {exp.currentlyWorking
                    ? 'Sekarang'
                    : formatDate(exp.endDate)}{' '}
                  ({calculateDuration(exp.startDate, exp.endDate, exp.currentlyWorking)})
                </p>
              </div>
              <button
                onClick={() => removeWorkExperience(exp.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {exp.description && (
              <p className="text-sm text-gray-600 mt-2">{exp.description}</p>
            )}

            {exp.achievements && exp.achievements.length > 0 && (
              <ul className="mt-2 space-y-1">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {workExperience.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>Belum ada pengalaman kerja yang ditambahkan.</p>
            <p className="text-sm">Klik "Tambah Pengalaman" untuk memulai.</p>
          </div>
        )}
      </div>
    </Card>
  );
}
