import api from './api';

// POST /api/donations
export async function createDonation(data) {
  const response = await api.post('/donations', data);
  return response.data;
}

// GET /api/donations/payment-callback
export async function handlePaymentCallback(status, ref) {
  const response = await api.get(`/donations/payment-callback?status=${status}&ref=${ref}`);
  return response.data;
}
