import axios from 'axios'

export const api = axios.create({
  baseURL: '/api', // ✅ Proxy akan handle ini
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor untuk token (opsional)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})
