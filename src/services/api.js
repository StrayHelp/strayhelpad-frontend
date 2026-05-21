import axios from 'axios';

function normalizeApiBaseUrl(rawBaseUrl) {
  const fallback = 'http://localhost:5001/api';
  if (!rawBaseUrl || typeof rawBaseUrl !== 'string') {
    return fallback;
  }

  const trimmed = rawBaseUrl.trim();
  if (!trimmed) {
    return fallback;
  }

  const noTrailingSlash = trimmed.replace(/\/$/, '');
  if (noTrailingSlash.endsWith('/api')) {
    return noTrailingSlash;
  }

  return `${noTrailingSlash}/api`;
}

const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  timeout: Number(import.meta.env.VITE_API_TIMEOUT || 10000),
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;
  if (token) {
    config.headers = { ...config.headers, Authorization: `Bearer ${token}` };
  }
  return config;
});

export default api;
