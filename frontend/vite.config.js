import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Izinkan akses dari jaringan luar
    port: 5173,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: '192.168.0.65', // Ganti dengan IP lokal Anda saat ini, atau gunakan '0.0.0.0' jika dinamis
      port: 5173,
      clientPort: 5173,
    },
  },
})