import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // PENTING: Izinkan akses dari IP eksternal/LAN
    port: 5173,
    strictPort: true, // Pastikan menggunakan port 5173
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // Gunakan 127.0.0.1 untuk localhost backend
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Opsional: Jika masih ada masalah CORS saat build
  preview: {
    host: '0.0.0.0',
    port: 5173
  }
})