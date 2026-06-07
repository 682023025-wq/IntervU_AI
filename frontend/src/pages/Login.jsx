import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const Login = () => {
  const { signInWithEmail, loading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Check for error from URL params (e.g., expired link)
  useEffect(() => {
    const errorCode = searchParams.get('error_code');
    const errorDescription = searchParams.get('error_description');
    
    if (errorCode === 'otp_expired' || errorCode === 'invalid_otp') {
      setError('Link login telah kadaluarsa atau tidak valid. Silakan masukkan email Anda lagi untuk mendapatkan link baru.');
      // Clear the URL params
      window.history.replaceState({}, document.title, '/login');
    } else if (errorDescription) {
      setError(decodeURIComponent(errorDescription));
      window.history.replaceState({}, document.title, '/login');
    }
  }, [searchParams]);
  
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      setSuccess(false);
      
      if (!email || !email.includes('@')) {
        setError('Masukkan email yang valid');
        return;
      }
      
      await signInWithEmail(email);
      setSuccess(true);
    } catch (err) {
      setError('Gagal mengirim link login. Silakan coba lagi.');
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

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-sm text-green-600">Link login telah dikirim ke email Anda. Silakan cek inbox dan klik link untuk masuk.</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleEmailLogin}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Email
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              disabled={loading || success}
              required
            />
          </div>

          <Button
            type="submit"
            loading={loading}
            disabled={success}
            fullWidth
            size="lg"
          >
            {success ? 'Link Terkirim' : 'Masuk dengan Email'}
          </Button>
        </form>

        {/* Footer */}
        <p className="text-xs text-slate-500 mt-6 text-center">
          Kami akan mengirimkan link login ajaib ke email Anda
        </p>
      </Card>
    </div>
  );
};

export default Login;
