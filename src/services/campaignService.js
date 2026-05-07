import api from './api';

// GET /api/campaigns
export async function fetchCampaigns() {
  const response = await api.get('/campaigns');
  return response.data.campaigns;
}

// GET /api/campaigns/:id
export async function fetchCampaignById(id) {
  const response = await api.get(`/campaigns/${id}`);
  return response.data;
}

// POST /api/campaigns (org only)
export async function createCampaign(data) {
  const response = await api.post('/campaigns', data);
  return response.data.campaign;
}

// POST /api/campaigns/updates (org only)
export async function postCampaignUpdate(formData) {
  const response = await api.post('/campaigns/updates', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.update;
}
