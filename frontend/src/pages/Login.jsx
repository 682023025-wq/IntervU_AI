import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const { signInWithName, loading, user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [error, setError] = useState(null);
  
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      
      if (!name || name.trim() === '') {
        setError('Masukkan nama Anda');
        return;
      }
      
      await signInWithName(name.trim());
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Gagal masuk. Silakan coba lagi.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-primary-light p-4">
      <Card className="w-full max-w-md" padding="p-8">
        {/* Logo */}
        <div className="mb-6 text-center">
          <div className="w-16 h-16 mx-auto bg-primary rounded-2xl flex items-center justify-center mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">IntervU AI</h1>
          <p className="text-slate-600">Simulasi Wawancara Berbasis AI</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Nama
            </label>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama Anda"
              disabled={loading}
              required
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            fullWidth
            size="lg"
          >
            Masuk
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-slate-500 mt-6 text-center">
          Masukkan nama Anda untuk memulai simulasi wawancara
        </p>
      </Card>
    </div>
  );
};

export default Login;
