import api from './api';

// GET /api/adoption/listings
export async function fetchAdoptionListings() {
  const response = await api.get('/adoption/listings');
  return response.data.listings;
}

// POST /api/adoption/listings (org only)
export async function createAdoptionListing(data) {
  const response = await api.post('/adoption/listings', data);
  return response.data.listing;
}

// POST /api/adoption/apply (donor only)
export async function applyForAdoption(listingId, message) {
  const response = await api.post('/adoption/apply', { listingId, message });
  return response.data.application;
}

// PUT /api/adoption/approve (org/admin only)
export async function approveAdoption(applicationId, status) {
  const response = await api.put('/adoption/approve', { applicationId, status });
  return response.data.application;
}
