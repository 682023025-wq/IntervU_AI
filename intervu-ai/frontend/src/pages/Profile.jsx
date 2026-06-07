import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';

// Profile page with CV management
const Profile = () => {
  const { user, signOut, updateProfile } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    bio: '',
    skills: [],
    experiences: [],
    educations: [],
  });
  
  const [skillInput, setSkillInput] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  // Load user data on mount
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        email: user.email || '',
        full_name: user.user_metadata?.full_name || '',
      }));
    }
  }, [user]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Add skill
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  // Remove skill
  const handleRemoveSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill),
    }));
  };

  // Add experience
  const handleAddExperience = () => {
    setFormData(prev => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        { id: Date.now(), position: '', company: '', start_date: '', end_date: '', description: '' },
      ],
    }));
  };

  // Update experience
  const handleUpdateExperience = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  // Remove experience
  const handleRemoveExperience = (id) => {
    setFormData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id),
    }));
  };

  // Add education
  const handleAddEducation = () => {
    setFormData(prev => ({
      ...prev,
      educations: [
        ...prev.educations,
        { id: Date.now(), institution: '', degree: '', field: '', start_date: '', end_date: '' },
      ],
    }));
  };

  // Update education
  const handleUpdateEducation = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.map(edu =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  // Remove education
  const handleRemoveEducation = (id) => {
    setFormData(prev => ({
      ...prev,
      educations: prev.educations.filter(edu => edu.id !== id),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        id: user.id,
        ...formData,
      });
      alert('Profil berhasil disimpan!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Terjadi kesalahan saat menyimpan profil.');
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Generate CV JSON preview
  const cvData = {
    personal_info: {
      name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      bio: formData.bio,
    },
    skills: formData.skills,
    experiences: formData.experiences.map(({ id, ...rest }) => rest),
    educations: formData.educations.map(({ id, ...rest }) => rest),
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Profil Saya</h1>
            <p className="text-slate-600 mt-1">Kelola informasi profil dan CV Anda</p>
          </div>
          <Button variant="secondary" onClick={handleLogout}>
            Keluar
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card>
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Informasi Pribadi</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Nama Lengkap"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap"
                />
                
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled
                  className="bg-slate-100"
                />
                
                <Input
                  label="Telepon"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+62..."
                />
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Ceritakan tentang diri Anda..."
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Keahlian
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                      placeholder="Tambahkan keahlian"
                      className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button type="button" onClick={handleAddSkill}>Tambah</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-primary-100 text-primary px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="hover:text-primary-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <Button type="submit" className="w-full">Simpan Profil</Button>
              </form>
            </Card>

            {/* Experiences */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Pengalaman Kerja</h2>
                <Button size="sm" onClick={handleAddExperience}>+ Tambah</Button>
              </div>
              <div className="space-y-4">
                {formData.experiences.map((exp) => (
                  <div key={exp.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Posisi"
                        value={exp.position}
                        onChange={(e) => handleUpdateExperience(exp.id, 'position', e.target.value)}
                      />
                      <Input
                        placeholder="Perusahaan"
                        value={exp.company}
                        onChange={(e) => handleUpdateExperience(exp.id, 'company', e.target.value)}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        type="date"
                        value={exp.start_date}
                        onChange={(e) => handleUpdateExperience(exp.id, 'start_date', e.target.value)}
                      />
                      <Input
                        type="date"
                        value={exp.end_date}
                        onChange={(e) => handleUpdateExperience(exp.id, 'end_date', e.target.value)}
                      />
                    </div>
                    <textarea
                      placeholder="Deskripsi pekerjaan..."
                      value={exp.description}
                      onChange={(e) => handleUpdateExperience(exp.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Educations */}
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-800">Pendidikan</h2>
                <Button size="sm" onClick={handleAddEducation}>+ Tambah</Button>
              </div>
              <div className="space-y-4">
                {formData.educations.map((edu) => (
                  <div key={edu.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        placeholder="Institusi"
                        value={edu.institution}
                        onChange={(e) => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                      />
                      <Input
                        placeholder="Gelar"
                        value={edu.degree}
                        onChange={(e) => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                      />
                    </div>
                    <Input
                      placeholder="Bidang Studi"
                      value={edu.field}
                      onChange={(e) => handleUpdateEducation(edu.id, 'field', e.target.value)}
                    />
                    <div className="grid md:grid-cols-2 gap-3">
                      <Input
                        type="date"
                        value={edu.start_date}
                        onChange={(e) => handleUpdateEducation(edu.id, 'start_date', e.target.value)}
                      />
                      <Input
                        type="date"
                        value={edu.end_date}
                        onChange={(e) => handleUpdateEducation(edu.id, 'end_date', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Preview Panel */}
          <div className="space-y-4">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-800">Preview CV</h3>
                <Button size="sm" onClick={() => setShowPreview(!showPreview)}>
                  {showPreview ? 'Sembunyikan' : 'Tampilkan'}
                </Button>
              </div>
              {showPreview && (
                <pre className="bg-slate-100 p-4 rounded-lg text-xs overflow-auto max-h-96">
                  {JSON.stringify(cvData, null, 2)}
                </pre>
              )}
            </Card>

            <Card>
              <h3 className="font-semibold text-slate-800 mb-2">Siap untuk wawancara?</h3>
              <p className="text-sm text-slate-600 mb-4">
                Pastikan profil Anda sudah lengkap sebelum memulai wawancara.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/interview')}
              >
                Mulai Wawancara
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
