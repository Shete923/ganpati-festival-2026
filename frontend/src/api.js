import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_URL
  || (import.meta.env.PROD ? 'https://ganpati-festival-2026.onrender.com/api' : '/api');

const api = axios.create({ baseURL: apiBaseUrl });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('coordinatorToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
