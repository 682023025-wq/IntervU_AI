import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSesi: 0,
    sesiSelesai: 0,
    skorRataRata: 0,
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/profiles/me');
      setProfile(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/sessions');
      const sessions = response.data;
      const selesai = sessions.filter(s => s.status === 'selesai');
      const avgSkor = selesai.length > 0
        ? Math.round(selesai.reduce((acc, s) => acc + (s.skor_akhir || 0), 0) / selesai.length)
        : 0;
      
      setStats({
        totalSesi: sessions.length,
        sesiSelesai: selesai.length,
        skorRataRata: avgSkor,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
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
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-slate-200 px-4 py-3 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-800">IntervU AI</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 hidden sm:block">
              Halo, {profile?.nama_lengkap || user?.name}!
            </span>
            <Button variant="outline" size="sm" onClick={signOut}>
              Keluar
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">
            Dashboard
          </h1>
          <p className="text-slate-600">
            Siap untuk meningkatkan keterampilan wawancara Anda?
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card className="text-center">
            <p className="text-3xl font-bold text-primary">{stats.totalSesi}</p>
            <p className="text-sm text-slate-600 mt-1">Total Sesi</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-primary">{stats.sesiSelesai}</p>
            <p className="text-sm text-slate-600 mt-1">Sesi Selesai</p>
          </Card>
          <Card className="text-center">
            <p className="text-3xl font-bold text-primary">{stats.skorRataRata}</p>
            <p className="text-sm text-slate-600 mt-1">Skor Rata-rata</p>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Start Interview */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" padding="p-0">
            <Link to="/interview/new" className="block p-6">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Mulai Wawancara Baru</h3>
              <p className="text-slate-600 mb-4">
                Latihan wawancara dengan AI dalam mode teks, audio, atau video.
              </p>
              <Button variant="primary" fullWidth>
                Mulai Sekarang
              </Button>
            </Link>
          </Card>

          {/* Recommendations */}
          <Card className="hover:shadow-md transition-shadow cursor-pointer" padding="p-0">
            <Link to="/recommendations" className="block p-6">
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Lihat Rekomendasi Karir</h3>
              <p className="text-slate-600 mb-4">
                Temukan posisi dan perusahaan yang cocok dengan profil Anda.
              </p>
              <Button variant="outline" fullWidth>
                Lihat Rekomendasi
              </Button>
            </Link>
          </Card>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Menu Lainnya</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link to="/profile" className="block">
              <Card className="text-center hover:shadow-md transition-shadow">
                <svg className="w-6 h-6 mx-auto text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <p className="text-sm text-slate-700">Profil</p>
              </Card>
            </Link>
            <Link to="/sessions" className="block">
              <Card className="text-center hover:shadow-md transition-shadow">
                <svg className="w-6 h-6 mx-auto text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-slate-700">Riwayat</p>
              </Card>
            </Link>
            <Link to="/jobs" className="block">
              <Card className="text-center hover:shadow-md transition-shadow">
                <svg className="w-6 h-6 mx-auto text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="text-sm text-slate-700">Lowongan</p>
              </Card>
            </Link>
            <Link to="/cv-suggestions" className="block">
              <Card className="text-center hover:shadow-md transition-shadow">
                <svg className="w-6 h-6 mx-auto text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-sm text-slate-700">Saran CV</p>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
