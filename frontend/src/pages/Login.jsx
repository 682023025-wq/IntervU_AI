import { useState } from 'react'
import { Chrome } from 'lucide-react'
import { Button } from '../components/UI'

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-primary-100 px-4">
      <div className="w-full max-w-md">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-2">IntervU AI</h1>
          <p className="text-gray-600">
            Platform simulasi wawancara kerja berbasis AI untuk membantu Anda meraih pekerjaan impian.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {/* Google Login Button */}
          <Button
            variant="google"
            size="lg"
            className="w-full mb-6"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="w-5 h-5 mr-3 animate-spin rounded-full border-2 border-gray-300 border-t-primary-600" />
                <span>Memproses...</span>
              </div>
            ) : (
              <div className="flex items-center">
                <Chrome className="w-6 h-6 mr-3" />
                <span>Masuk dengan Google</span>
              </div>
            )}
          </Button>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500">atau</span>
            </div>
          </div>

          {/* Create Account Button */}
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">Belum punya akun?</p>
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <div className="flex items-center justify-center">
                <Chrome className="w-5 h-5 mr-2" />
                <span>Buat Akun Baru (Google)</span>
              </div>
            </Button>
          </div>

          {/* Terms and Conditions */}
          <p className="text-xs text-gray-500 text-center leading-relaxed">
            Dengan melanjutkan, Anda menyetujui{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Syarat & Ketentuan
            </a>{' '}
            serta{' '}
            <a href="#" className="text-primary-600 hover:underline">
              Kebijakan Privasi
            </a>{' '}
            kami.
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 IntervU AI. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}