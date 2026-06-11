import { useState } from 'react'
import '../styles/global.css'

export default function Login({ onLogin }) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleGoogleLogin = () => {
    setIsLoading(true)
    // Mock login - will be implemented with backend later
    setTimeout(() => {
      setIsLoading(false)
      onLogin()
    }, 1000)
  }
  
  return (
    <div className="container" style={{maxWidth: '480px', padding: '2rem 1rem', background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #E0E7FF 100%)'}}>
      {/* Logo and Title */}
      <div className="text-center mb-3" style={{marginTop: '2rem'}}>
        <h1 className="logo" style={{fontSize: '2rem', marginBottom: '0.5rem'}}>IntervU AI</h1>
        <p className="text-sub" style={{fontSize: '0.95rem', lineHeight: '1.5'}}>
          Platform simulasi wawancara kerja berbasis AI untuk membantu Anda meraih pekerjaan impian.
        </p>
      </div>

      {/* Login Card */}
      <div className="card" style={{padding: '2rem', marginTop: '2rem', borderRadius: '1rem'}}>
        {/* Google Login Button */}
        <button
          className="btn btn-google"
          onClick={handleGoogleLogin}
          disabled={isLoading}
          style={{marginBottom: '1.5rem'}}
        >
          {isLoading ? (
            <div className="flex items-center">
              <div style={{width: '20px', height: '20px', marginRight: '0.75rem', animation: 'spin 1s linear infinite', borderRadius: '50%', border: '2px solid #D1D5DB', borderTopColor: '#4F46E5'}} />
              <span>Memproses...</span>
            </div>
          ) : (
            <div className="flex items-center">
              <svg style={{width: '24px', height: '24px', marginRight: '0.75rem'}} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Masuk dengan Google</span>
            </div>
          )}
        </button>

        {/* Divider */}
        <div className="relative mb-3" style={{position: 'relative', marginBottom: '1.5rem'}}>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center'}}>
            <div style={{width: '100%', borderTop: '1px solid #E5E7EB'}}></div>
          </div>
          <div style={{position: 'relative', display: 'flex', justifyContent: 'center'}}>
            <span style={{padding: '0 1rem', background: 'white', color: '#6B7280', fontSize: '0.875rem'}}>atau</span>
          </div>
        </div>

        {/* Create Account Button */}
        <div className="text-center mb-3" style={{marginBottom: '1.5rem'}}>
          <p className="text-sub" style={{marginBottom: '1rem', fontSize: '0.95rem'}}>Belum punya akun?</p>
          <button
            className="btn btn-primary"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <div className="flex items-center justify-center">
              <svg style={{width: '20px', height: '20px', marginRight: '0.5rem'}} viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Buat Akun Baru (Google)</span>
            </div>
          </button>
        </div>

        {/* Terms and Conditions */}
        <p className="text-sub" style={{fontSize: '0.75rem', textAlign: 'center', lineHeight: '1.6', color: '#6B7280'}}>
          Dengan melanjutkan, Anda menyetujui{' '}
          <a href="#" className="text-primary" style={{color: '#4F46E5', textDecoration: 'underline'}}>
            Syarat & Ketentuan
          </a>{' '}
          serta{' '}
          <a href="#" className="text-primary" style={{color: '#4F46E5', textDecoration: 'underline'}}>
            Kebijakan Privasi
          </a>{' '}
          kami.
        </p>
      </div>

      {/* Footer */}
      <div className="text-center mt-3" style={{marginTop: '2rem', marginBottom: '1rem'}}>
        <p className="text-sub" style={{fontSize: '0.875rem', color: '#6B7280'}}>
          © 2024 IntervU AI. All rights reserved.
        </p>
      </div>
    </div>
  )
}
