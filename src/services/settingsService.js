import api from './api';

// GET /api/settings
export async function getSettings() {
  const response = await api.get('/settings');
  return response.data;
}

// PUT /api/settings
export async function updateSettings(settings) {
  const response = await api.put('/settings', settings);
  return response.data;
}

// GET /api/settings/recycle-bin
export async function getRecycleBin() {
  const response = await api.get('/settings/recycle-bin');
  return response.data;
}

// POST /api/settings/recycle-bin/:itemType/:id/restore
export async function restoreRecycleBinItem(itemType, id) {
  const response = await api.post(`/settings/recycle-bin/${encodeURIComponent(itemType)}/${encodeURIComponent(id)}/restore`);
  return response.data;
}

// DELETE /api/settings/recycle-bin/:itemType/:id
export async function deleteRecycleBinItem(itemType, id) {
  const response = await api.delete(`/settings/recycle-bin/${encodeURIComponent(itemType)}/${encodeURIComponent(id)}`);
  return response.data;
}
