// ============ MOCK DATA ONLY - NO API CALLS ============
import {
  mockData,
  findAccountById,
  updateAccountInMock,
  generateTempPassword,
  addAuditLog,
  getAccountStats
} from './mockData';

// Simulates API delay for realistic feel
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

// GET /api/it-admin/accounts
export async function fetchAccounts(page = 1, limit = 10, search = '', filters = {}) {
  await simulateDelay();
  
  let filtered = [...mockData.accounts];
  
  // Apply search filter
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(acc =>
      acc.name.toLowerCase().includes(searchLower) ||
      acc.email.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply status filter
  if (filters.status) {
    filtered = filtered.filter(acc => acc.status === filters.status);
  }
  
  // Apply role filter
  if (filters.role) {
    filtered = filtered.filter(acc => acc.role === filters.role);
  }
  
  // Apply account type filter
  if (filters.accountType) {
    filtered = filtered.filter(acc => acc.accountType === filters.accountType);
  }
  
  // Pagination
  const total = filtered.length;
  const startIdx = (page - 1) * limit;
  const accounts = filtered.slice(startIdx, startIdx + limit);
  
  return {
    accounts,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

// GET /api/it-admin/accounts/:id
export async function fetchAccountDetails(accountId) {
  await simulateDelay();
  const account = findAccountById(accountId);
  
  if (!account) {
    throw new Error('Account not found');
  }
  
  return account;
}

// PUT /api/it-admin/accounts/:id/email
export async function updateAccountEmail(accountId, newEmail) {
  await simulateDelay();
  
  const account = findAccountById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }
  
  const oldEmail = account.email;
  updateAccountInMock(accountId, { email: newEmail });
  
  // Add audit log
  addAuditLog(
    'Email Updated',
    account.name,
    window.localStorage.getItem('adminEmail') || 'admin@strayhelp.com',
    `Email changed from ${oldEmail} to ${newEmail}`
  );
  
  return account;
}

// POST /api/it-admin/accounts/:id/reset-password
export async function resetAccountPassword(accountId) {
  await simulateDelay();
  
  const account = findAccountById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }
  
  const tempPassword = generateTempPassword();
  
  // Add audit log
  addAuditLog(
    'Password Reset',
    account.name,
    window.localStorage.getItem('adminEmail') || 'admin@strayhelp.com',
    'Temporary password generated'
  );
  
  return {
    success: true,
    tempPassword,
    message: 'Password reset successful. A temporary password has been generated.'
  };
}

// PUT /api/it-admin/accounts/:id/status
export async function updateAccountStatus(accountId, status) {
  await simulateDelay();
  
  const account = findAccountById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }
  
  const oldStatus = account.status;
  updateAccountInMock(accountId, { status });
  
  // Add audit log
  addAuditLog(
    status === 'Active' ? 'Account Activated' : 'Account Suspended',
    account.name,
    window.localStorage.getItem('adminEmail') || 'admin@strayhelp.com',
    `Account ${status === 'Active' ? 'activated' : 'suspended'}`
  );
  
  return account;
}

// GET /api/it-admin/accounts/:id/audit
export async function fetchAccountAudit(accountId, page = 1, limit = 20) {
  await simulateDelay();
  
  const account = findAccountById(accountId);
  if (!account) {
    throw new Error('Account not found');
  }
  
  // Filter logs for this account
  let filtered = mockData.auditLogs.filter(log => log.account === account.name);
  
  // Pagination
  const total = filtered.length;
  const startIdx = (page - 1) * limit;
  const logs = filtered.slice(startIdx, startIdx + limit);
  
  return {
    logs,
    total,
    page,
    limit,
    pages: Math.ceil(total / limit)
  };
}

// GET /api/it-admin/dashboard
export async function fetchITAdminDashboard() {
  await simulateDelay();
  return getAccountStats();
}
