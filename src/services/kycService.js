import api from './api';

// POST /api/kyc/upload (org only)
export async function uploadKyc(formData) {
  const response = await api.post('/kyc/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data.kyc;
}

// PUT /api/kyc/verify (admin only)
export async function verifyKyc(kycId, status) {
  const response = await api.put('/kyc/verify', { kycId, status });
  return response.data.kyc;
}

// GET /api/kyc/pending (admin only)
export async function fetchPendingKyc() {
  const response = await api.get('/kyc/pending');
  return response.data.records;
}
