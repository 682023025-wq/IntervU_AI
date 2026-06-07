import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary-500">IntervU AI</div>
            <div className="space-x-4">
              <Link to="/login" className="text-gray-600 hover:text-primary-500 transition-colors">
                Login
              </Link>
              <Button size="sm" variant="primary">Mulai Sekarang</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <h1 className="text-5xl sm:text-6xl font-bold text-slate-800 mb-6 animate-fade-in">
              Selamat Datang di{' '}
              <span className="text-primary-500">IntervU AI</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Simulasi Wawancara Kerja Berbasis AI yang Membantu Anda Siap Menghadapi Interview Sebenarnya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/interview">
                <Button size="lg" variant="primary" fullWidth className="sm:w-auto">
                  Mulai Wawancara
                </Button>
              </Link>
              <Button size="lg" variant="outline" fullWidth className="sm:w-auto">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>

          {/* Features Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
              Kenapa IntervU AI?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card hoverable className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">AI Cerdas</h3>
                <p className="text-gray-600">
                  Pertanyaan interview yang dipersonalisasi berdasarkan posisi dan pengalaman Anda
                </p>
              </Card>

              <Card hoverable className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Video Interview</h3>
                <p className="text-gray-600">
                  Latihan dengan simulasi video call seperti interview sebenarnya
                </p>
              </Card>

              <Card hoverable className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Feedback Real-time</h3>
                <p className="text-gray-600">
                  Dapatkan analisis dan saran perbaikan langsung setelah setiap sesi
                </p>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 IntervU AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
