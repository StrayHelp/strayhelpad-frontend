import api from './api';

// GET /api/admin/dashboard
export async function fetchDashboardStats() {
  const response = await api.get('/admin/dashboard');
  const s = response.data.stats;
  return {
    users: s.usersTotal,
    donations: s.paidDonations,
    reports: s.pendingReports,
    organizations: s.openCampaigns
  };
}

// GET /api/admin/users
export async function fetchUsers() {
  const response = await api.get('/admin/users');
  return response.data.users;
}

// GET /api/admin/organizations
export async function fetchOrganizations() {
  const response = await api.get('/admin/organizations');
  return response.data.organizations;
}

// GET /api/admin/donations
export async function fetchDonations() {
  const response = await api.get('/admin/donations');
  return response.data.donations;
}

// GET /api/reports (used by admin)
export async function fetchReports() {
  const response = await api.get('/reports');
  return response.data.reports;
}
