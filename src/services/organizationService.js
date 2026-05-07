import api from './api';

// GET /api/organizations/me (org only)
export async function fetchOrgProfile() {
  const response = await api.get('/organizations/me');
  return response.data.profile;
}

// PUT /api/organizations/me (org only)
export async function updateOrgProfile(data) {
  const response = await api.put('/organizations/me', data);
  return response.data;
}
