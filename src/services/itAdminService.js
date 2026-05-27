import api from './api';

function mapRoleLabel(role) {
  switch (role) {
    case 'org':
      return 'Organization';
    case 'donor':
      return 'Donor';
    case 'admin':
    case 'super_admin':
      return 'Super Admin';
    case 'it_admin':
      return 'IT Admin';
    default:
      return role ? role.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) : 'User';
  }
}

function mapAccountType(role) {
  return role === 'org' ? 'organization' : 'user';
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function mapAccount(account) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: mapRoleLabel(account.role),
    rawRole: account.role,
    accountType: mapAccountType(account.role),
    status: account.account_status,
    joined: formatDate(account.created_at),
    createdAt: formatDateTime(account.created_at),
    createdAtRaw: account.created_at,
    lastLogin: 'Never',
    lastLoginRaw: null,
    phone: account.contact_number || '—',
    location: 'Philippines'
  };
}

function mapAuditLog(log) {
  return {
    ...log,
    timestamp: new Date(log.timestamp)
  };
}

export async function fetchAccounts(page = 1, limit = 10, search = '', filters = {}) {
  const params = {
    page,
    limit
  };

  if (search) params.search = search;
  if (filters.status) params.status = filters.status;
  if (filters.role) params.role = filters.role;
  if (filters.accountType) params.accountType = filters.accountType;

  const response = await api.get('/admin/accounts', { params });
  const accounts = (response.data.accounts || []).map(mapAccount);
  const pagination = response.data.pagination || {};

  return {
    accounts,
    total: pagination.total || 0,
    page: pagination.page || page,
    limit: pagination.limit || limit,
    pages: Math.ceil((pagination.total || 0) / (pagination.limit || limit || 1))
  };
}

export async function fetchAccountDetails(accountId) {
  const response = await api.get(`/admin/accounts/${accountId}`);
  return mapAccount(response.data.account || {});
}

export async function updateAccountEmail(accountId, newEmail) {
  const response = await api.patch(`/admin/accounts/${accountId}/email`, { email: newEmail });
  return mapAccount(response.data.account || {});
}

export async function resetAccountPassword(accountId) {
  const response = await api.post(`/admin/accounts/${accountId}/reset-password`);
  return {
    success: true,
    email: response.data.account?.email,
    message: response.data.message
  };
}

export async function updateAccountStatus(accountId, status) {
  const response = await api.patch(`/admin/accounts/${accountId}/status`, { status });
  return mapAccount(response.data.account || {});
}

export async function fetchITAdminAuditLogs(page = 1, limit = 100, search = '', action = '') {
  const params = { page, limit };
  if (search) params.search = search;
  if (action) params.action = action;

  const response = await api.get('/admin/audit-logs', { params });
  const logs = (response.data.logs || []).map(mapAuditLog);
  const pagination = response.data.pagination || {};

  return {
    logs,
    total: pagination.total || 0,
    page: pagination.page || page,
    limit: pagination.limit || limit,
    pages: Math.ceil((pagination.total || 0) / (pagination.limit || limit || 1))
  };
}

export async function fetchITAdminDashboard() {
  const response = await api.get('/admin/accounts/stats');
  return response.data.stats || {};
}
