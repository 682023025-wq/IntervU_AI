import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Basic profile data
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    telepon: '',
    posisi_target: '',
    bahasa_preferensi: 'id',
  });

  // CV Data
  const [cvData, setCvData] = useState({
    ringkasan_profesional: '',
    tautan_profesional: {
      linkedin: '',
      github: '',
      portfolio: '',
    },
    pendidikan: [],
    pengalaman_kerja: [],
    keahlian: [],
  });

  // Temporary state for new items
  const [newPendidikan, setNewPendidikan] = useState({
    institusi: '',
    jurusan: '',
    tahun_masuk: '',
    tahun_lulus: '',
  });

  const [newPengalaman, setNewPengalaman] = useState({
    perusahaan: '',
    posisi: '',
    durasi: '',
    deskripsi: '',
  });

  const [newKeahlian, setNewKeahlian] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profiles/me');
      const data = response.data;
      
      setFormData({
        nama_lengkap: data.nama_lengkap || '',
        email: data.email || '',
        telepon: data.telepon || '',
        posisi_target: data.posisi_target || '',
        bahasa_preferensi: data.bahasa_preferensi || 'id',
      });

      if (data.data_cv) {
        setCvData({
          ringkasan_profesional: data.data_cv.ringkasan_profesional || '',
          tautan_profesional: {
            linkedin: data.data_cv.tautan_profesional?.linkedin || '',
            github: data.data_cv.tautan_profesional?.github || '',
            portfolio: data.data_cv.tautan_profesional?.portfolio || '',
          },
          pendidikan: data.data_cv.pendididikan || [],
          pengalaman_kerja: data.data_cv.pengalaman_kerja || [],
          keahlian: data.data_cv.keahlian || [],
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Gagal memuat data profil');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCvInputChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({ ...prev, [name]: value }));
  };

  const handleTautanChange = (e) => {
    const { name, value } = e.target;
    setCvData(prev => ({
      ...prev,
      tautan_profesional: { ...prev.tautan_profesional, [name]: value }
    }));
  };

  const addPendidikan = () => {
    if (newPendidikan.institusi && newPendidikan.jurusan) {
      setCvData(prev => ({
        ...prev,
        pendidikan: [...prev.pendidikan, { ...newPendidikan }]
      }));
      setNewPendidikan({
        institusi: '',
        jurusan: '',
        tahun_masuk: '',
        tahun_lulus: '',
      });
    }
  };

  const removePendidikan = (index) => {
    setCvData(prev => ({
      ...prev,
      pendidikan: prev.pendidikan.filter((_, i) => i !== index)
    }));
  };

  const addPengalaman = () => {
    if (newPengalaman.perusahaan && newPengalaman.posisi) {
      setCvData(prev => ({
        ...prev,
        pengalaman_kerja: [...prev.pengalaman_kerja, { ...newPengalaman }]
      }));
      setNewPengalaman({
        perusahaan: '',
        posisi: '',
        durasi: '',
        deskripsi: '',
      });
    }
  };

  const removePengalaman = (index) => {
    setCvData(prev => ({
      ...prev,
      pengalaman_kerja: prev.pengalaman_kerja.filter((_, i) => i !== index)
    }));
  };

  const addKeahlian = () => {
    if (newKeahlian.trim()) {
      setCvData(prev => ({
        ...prev,
        keahlian: [...prev.keahlian, newKeahlian.trim()]
      }));
      setNewKeahlian('');
    }
  };

  const removeKeahlian = (index) => {
    setCvData(prev => ({
      ...prev,
      keahlian: prev.keahlian.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        ...formData,
        data_cv: cvData,
      };

      await api.put('/profiles/me', payload);
      setSuccess('Profil berhasil diperbarui!');
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError(error.response?.data?.detail || 'Gagal menyimpan profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Profil Saya</h1>
          <p className="text-slate-600">Kelola informasi pribadi dan data CV Anda</p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600">{success}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informasi Dasar */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Informasi Dasar</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Lengkap"
                name="nama_lengkap"
                value={formData.nama_lengkap}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                disabled
                className="bg-slate-50"
              />
              <Input
                label="Telepon"
                name="telepon"
                value={formData.telepon}
                onChange={handleInputChange}
                placeholder="+62..."
              />
              <Input
                label="Posisi Target"
                name="posisi_target"
                value={formData.posisi_target}
                onChange={handleInputChange}
                placeholder="Software Engineer, Data Analyst, dll."
              />
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Bahasa Preferensi
                </label>
                <select
                  name="bahasa_preferensi"
                  value={formData.bahasa_preferensi}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Ringkasan Profesional */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Ringkasan Profesional</h2>
            <TextArea
              label="Tentang Saya"
              name="ringkasan_profesional"
              value={cvData.ringkasan_profesional}
              onChange={handleCvInputChange}
              rows={4}
              placeholder="Ceritakan tentang latar belakang profesional Anda..."
            />
          </Card>

          {/* Tautan Profesional */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Tautan Profesional</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="LinkedIn"
                name="linkedin"
                value={cvData.tautan_profesional.linkedin}
                onChange={handleTautanChange}
                placeholder="https://linkedin.com/in/..."
              />
              <Input
                label="GitHub"
                name="github"
                value={cvData.tautan_profesional.github}
                onChange={handleTautanChange}
                placeholder="https://github.com/..."
              />
              <Input
                label="Portfolio"
                name="portfolio"
                value={cvData.tautan_profesional.portfolio}
                onChange={handleTautanChange}
                placeholder="https://..."
              />
            </div>
          </Card>

          {/* Pendidikan */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Pendidikan</h2>
            <div className="space-y-4 mb-4">
              {cvData.pendidikan.map((pend, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-800">{pend.institusi}</p>
                    <p className="text-sm text-slate-600">{pend.jurusan}</p>
                    <p className="text-xs text-slate-500">
                      {pend.tahun_masuk} - {pend.tahun_lulus || 'Sekarang'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePendidikan(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl">
              <Input
                label="Institusi"
                value={newPendidikan.institusi}
                onChange={(e) => setNewPendidikan(prev => ({ ...prev, institusi: e.target.value }))}
              />
              <Input
                label="Jurusan"
                value={newPendidikan.jurusan}
                onChange={(e) => setNewPendidikan(prev => ({ ...prev, jurusan: e.target.value }))}
              />
              <Input
                label="Tahun Masuk"
                value={newPendidikan.tahun_masuk}
                onChange={(e) => setNewPendidikan(prev => ({ ...prev, tahun_masuk: e.target.value }))}
                placeholder="2020"
              />
              <Input
                label="Tahun Lulus"
                value={newPendidikan.tahun_lulus}
                onChange={(e) => setNewPendidikan(prev => ({ ...prev, tahun_lulus: e.target.value }))}
                placeholder="2024"
              />
              <div className="md:col-span-2">
                <Button type="button" onClick={addPendidikan} variant="outline" size="sm" fullWidth>
                  + Tambah Pendidikan
                </Button>
              </div>
            </div>
          </Card>

          {/* Pengalaman Kerja */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Pengalaman Kerja</h2>
            <div className="space-y-4 mb-4">
              {cvData.pengalaman_kerja.map((peng, index) => (
                <div key={index} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                  <div>
                    <p className="font-medium text-slate-800">{peng.posisi}</p>
                    <p className="text-sm text-slate-600">{peng.perusahaan}</p>
                    <p className="text-xs text-slate-500">{peng.durasi}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removePengalaman(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            <div className="space-y-4 p-4 bg-slate-50 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Perusahaan"
                  value={newPengalaman.perusahaan}
                  onChange={(e) => setNewPengalaman(prev => ({ ...prev, perusahaan: e.target.value }))}
                />
                <Input
                  label="Posisi"
                  value={newPengalaman.posisi}
                  onChange={(e) => setNewPengalaman(prev => ({ ...prev, posisi: e.target.value }))}
                />
                <Input
                  label="Durasi"
                  value={newPengalaman.durasi}
                  onChange={(e) => setNewPengalaman(prev => ({ ...prev, durasi: e.target.value }))}
                  placeholder="Jan 2023 - Sekarang"
                />
              </div>
              <TextArea
                label="Deskripsi"
                value={newPengalaman.deskripsi}
                onChange={(e) => setNewPengalaman(prev => ({ ...prev, deskripsi: e.target.value }))}
                rows={3}
                placeholder="Jelaskan tanggung jawab dan pencapaian Anda..."
              />
              <Button type="button" onClick={addPengalaman} variant="outline" size="sm" fullWidth>
                + Tambah Pengalaman
              </Button>
            </div>
          </Card>

          {/* Keahlian */}
          <Card>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Keahlian</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {cvData.keahlian.map((keahlian, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-primary-light text-primary text-sm"
                >
                  {keahlian}
                  <button
                    type="button"
                    onClick={() => removeKeahlian(index)}
                    className="ml-2 text-primary hover:text-primary-hover"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newKeahlian}
                onChange={(e) => setNewKeahlian(e.target.value)}
                placeholder="Tambah keahlian baru..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeahlian())}
              />
              <Button type="button" onClick={addKeahlian} variant="outline">
                Tambah
              </Button>
            </div>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" loading={saving} size="lg" className="w-full sm:w-auto">
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
