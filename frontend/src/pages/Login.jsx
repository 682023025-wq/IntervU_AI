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
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 py-6 sm:py-8" style={{ background: 'linear-gradient(135deg, #F3F4F6 0%, #FFFFFF 50%, #E0E7FF 100%)'}}>
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">IntervU AI</h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            Platform simulasi wawancara kerja berbasis AI untuk membantu Anda meraih pekerjaan impian.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg p-5 sm:p-6 md:p-8">
          {/* Google Login Button */}
          <button
            className="w-full bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-gray-700 font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 mb-5 sm:mb-6 active:scale-[0.98]"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div style={{width: '18px', height: '18px', marginRight: '0.5rem', animation: 'spin 1s linear infinite', borderRadius: '50%', border: '2px solid #D1D5DB', borderTopColor: '#4F46E5'}} />
                <span className="text-sm sm:text-base">Memproses...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <svg style={{width: '20px', height: '20px', marginRight: '0.5rem'}} viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm sm:text-base font-medium">Masuk dengan Google</span>
              </div>
            )}
          </button>

          {/* Divider */}
          <div className="relative mb-5 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-gray-500 text-xs sm:text-sm font-medium">atau</span>
            </div>
          </div>

          {/* Create Account Button */}
          <div className="text-center mb-5 sm:mb-6">
            <p className="text-sm text-gray-600 mb-3 sm:mb-4">Belum punya akun?</p>
            <button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 sm:py-3.5 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 sm:gap-3 active:scale-[0.98] shadow-md hover:shadow-lg"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <svg style={{width: '18px', height: '18px'}} viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm sm:text-base font-medium">Buat Akun Baru (Google)</span>
            </button>
          </div>

          {/* Terms and Conditions */}
          <p className="text-xs text-gray-500 text-center leading-relaxed px-2">
            Dengan melanjutkan, Anda menyetujui{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-600/30">
              Syarat & Ketentuan
            </a>{' '}
            serta{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium underline decoration-blue-600/30">
              Kebijakan Privasi
            </a>{' '}
            kami.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-gray-500">
            © 2024 IntervU AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
