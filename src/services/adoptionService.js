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

// GET /api/admin/adoption/posts (preferred) or fallback to org listings
export async function fetchAdminAdoptionPosts() {
  try {
    const response = await api.get('/admin/adoption/posts');
    return response.data.posts || response.data.adoptions || [];
  } catch (error) {
    if (error?.response?.status && error.response.status !== 404) {
      throw error;
    }

    try {
      return await fetchAdoptionListings();
    } catch {
      return [];
    }
  }
}

// GET /api/admin/adoption/applications (preferred) or fallback to listing-embedded applications
export async function fetchAdminAdoptionApplications() {
  try {
    const response = await api.get('/admin/adoption/applications');
    return response.data.applications || [];
  } catch (error) {
    if (error?.response?.status && error.response.status !== 404) {
      throw error;
    }

    try {
      const listings = await fetchAdoptionListings();
      return listings.flatMap((listing) => (
        (listing.applications || []).map((application) => ({
          ...application,
          listing
        }))
      ));
    } catch {
      return [];
    }
  }
}

// PUT /api/admin/adoption/posts/:id/archive
export async function archiveAdoptionPost(postId) {
  const response = await api.put(`/admin/adoption/posts/${encodeURIComponent(postId)}/archive`);
  return response.data.post || response.data.adoption || null;
}
