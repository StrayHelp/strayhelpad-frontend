import api from './api';

// POST /api/auth/login
export async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
}

// POST /api/auth/register
export async function register(data) {
  const response = await api.post('/auth/register', data);
  return response.data;
}
