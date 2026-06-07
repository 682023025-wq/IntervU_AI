import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

// Home page - Landing page with hero section
const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">IntervU AI</div>
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="secondary">Login</Button>
            </Link>
            <Link to="/login">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Selamat Datang di{' '}
            <span className="text-primary">IntervU AI</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            Platform simulasi wawancara berbasis AI yang akan membantu Anda 
            mempersiapkan diri untuk menghadapi wawancara kerja dengan lebih percaya diri.
            Dapatkan feedback instan dan tingkatkan keterampilan wawancara Anda.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto">
                Mulai Wawancara Sekarang
              </Button>
            </Link>
            <Link to="#features">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="mt-32 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">AI-Powered</h3>
            <p className="text-slate-600">
              Teknologi AI canggih yang menganalisis jawaban Anda dan memberikan feedback yang konstruktif.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Real-time</h3>
            <p className="text-slate-600">
              Wawancara langsung dengan respons instan, seolah-olah berbicara dengan interviewer sungguhan.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">Personalized</h3>
            <p className="text-slate-600">
              Pertanyaan yang disesuaikan dengan profil dan posisi yang Anda targetkan.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2024 IntervU AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
