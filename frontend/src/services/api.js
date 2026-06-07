import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menambahkan Authorization header
api.interceptors.request.use(
  async (config) => {
    // Get token from localStorage
    const storedUser = localStorage.getItem('intervu_user');
    let token = null;
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        token = user.token || user.access_token;
      } catch (e) {
        console.error('Error parsing stored user:', e);
      }
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle error response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, redirect ke login
      localStorage.removeItem('intervu_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
