import api from './api';

// GET /api/admin/dashboard
export async function fetchDashboardStats() {
  const response = await api.get('/admin/dashboard');
  const s = response.data.stats;
  return {
    users: s.usersTotal,
    donations: s.paidDonations,
    reports: s.activeReports ?? s.pendingReports ?? 0,
    organizations: s.totalOrganizations ?? s.openCampaigns ?? 0
  };
}

// GET /api/admin/dashboard/monitoring
export async function fetchDashboardMonitoring() {
  const response = await api.get('/admin/dashboard/monitoring');
  return response.data.monitoring;
}

// GET /api/admin/users
export async function fetchUsers() {
  const response = await api.get('/admin/users');
  return response.data.users;
}

// PUT /api/admin/users/:id/status
export async function updateUserStatus(userId, status, reason) {
  const response = await api.put(`/admin/users/${encodeURIComponent(userId)}/status`, { status, reason: reason || undefined });
  return response.data.user;
}

// DELETE /api/admin/users/:id
export async function deleteUser(userId) {
  const response = await api.delete(`/admin/users/${encodeURIComponent(userId)}`);
  return response.data.user;
}

// GET /api/admin/organizations
export async function fetchOrganizations() {
  const response = await api.get('/admin/organizations');
  return response.data.organizations;
}

// PUT /api/admin/organizations/:id/status
export async function updateOrganizationStatus(organizationId, status, reason) {
  const response = await api.put(`/admin/organizations/${encodeURIComponent(organizationId)}/status`, { status, reason: reason || undefined });
  return response.data.organization;
}

// DELETE /api/admin/organizations/:id
export async function deleteOrganization(organizationId) {
  const response = await api.delete(`/admin/organizations/${encodeURIComponent(organizationId)}`);
  return response.data.organization;
}

// POST /api/onboarding/:orgId/approve
export async function approveOrganization(organizationId, notes = '') {
  const response = await api.post(`/onboarding/${encodeURIComponent(organizationId)}/approve`, { notes });
  return response.data.organization;
}

// POST /api/onboarding/:orgId/reject
export async function rejectOrganization(organizationId, reason = 'Rejected by admin') {
  const response = await api.post(`/onboarding/${encodeURIComponent(organizationId)}/reject`, { reason });
  return response.data.organization;
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

// GET /api/admin/ledger
export async function fetchTransactionLedger() {
  const response = await api.get('/admin/ledger');
  return response.data.ledger;
}

// GET /api/admin/audit-logs
export async function fetchAdminAuditLogs({ page = 1, limit = 10, search = '', action = '' } = {}) {
  const params = { page, limit };
  if (search) params.search = search;
  if (action) params.action = action;
  const response = await api.get('/admin/audit-logs', { params });
  return {
    logs: response.data.logs || [],
    pagination: response.data.pagination || { page: 1, limit: 10, total: 0 }
  };
}

// DELETE /api/admin/audit-logs
export async function clearAuditLogs() {
  const response = await api.delete('/admin/audit-logs');
  return response.data;
}
