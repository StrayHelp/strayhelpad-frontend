// Mock Data Generator for IT Admin System
// This provides realistic test data for the entire UI

const generateMockAccounts = () => {
  const statuses = ['Active', 'Suspended'];
  const roles = ['User', 'Organization Admin', 'Volunteer', 'Donor'];
  const accountTypes = ['user', 'organization'];
  
  const firstNames = ['John', 'Jane', 'Robert', 'Maria', 'Michael', 'Sarah', 'David', 'Emily', 'James', 'Jessica', 'William', 'Anna', 'Charles', 'Lisa', 'Daniel'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];
  const orgNames = ['StrayHelp Foundation', 'Animal Care NGO', 'Pet Rescue Center', 'Humane Society', 'Wildlife Alliance', 'Hope for Strays', 'Pawsitive Change', 'Community Shelter', 'Dogs United', 'Cats & Companions'];
  
  const accounts = [];
  const now = new Date();
  
  for (let i = 1; i <= 45; i++) {
    const accountType = accountTypes[Math.floor(Math.random() * accountTypes.length)];
    let name, email;
    
    if (accountType === 'user') {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      name = `${firstName} ${lastName}`;
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@email.com`;
    } else {
      name = orgNames[Math.floor(Math.random() * orgNames.length)];
      email = `${name.toLowerCase().replace(/\s+/g, '_').replace(/[&]/g, 'and')}${i}@org.com`;
    }
    
    const createdDate = new Date(now.getTime() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const lastLoginDate = Math.random() > 0.3 ? new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000) : null;
    
    accounts.push({
      id: `acc_${String(i).padStart(5, '0')}`,
      name,
      email,
      accountType,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joined: createdDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      createdAt: createdDate.toISOString(),
      lastLogin: lastLoginDate ? lastLoginDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'Never',
      lastLoginRaw: lastLoginDate?.toISOString() || null,
      phone: `+63${Math.floor(Math.random() * 9000000000 + 1000000000)}`,
      location: 'Philippines'
    });
  }
  
  return accounts;
};

const generateMockAuditLogs = () => {
  const actions = [
    { action: 'Account Suspended', icon: 'warning', color: 'bg-red-100 text-red-700' },
    { action: 'Password Reset', icon: 'lock', color: 'bg-yellow-100 text-yellow-700' },
    { action: 'Email Updated', icon: 'envelope', color: 'bg-blue-100 text-blue-700' },
    { action: 'Account Activated', icon: 'check', color: 'bg-green-100 text-green-700' }
  ];
  
  const firstNames = ['John', 'Jane', 'Robert', 'Maria', 'Michael', 'Sarah'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia'];
  
  const logs = [];
  const now = new Date();
  
  for (let i = 0; i < 20; i++) {
    const actionObj = actions[Math.floor(Math.random() * actions.length)];
    const accountFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const accountLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const adminFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const adminLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    let details = '';
    if (actionObj.action === 'Account Suspended') {
      details = 'Account manually suspended due to suspicious activity';
    } else if (actionObj.action === 'Password Reset') {
      details = 'Temporary password generated';
    } else if (actionObj.action === 'Email Updated') {
      details = `Email changed from old.${accountFirstName.toLowerCase()}@email.com to new.${accountFirstName.toLowerCase()}@email.com`;
    } else if (actionObj.action === 'Account Activated') {
      details = 'Account reactivated';
    }
    
    const timestamp = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    
    logs.push({
      id: i + 1,
      action: actionObj.action,
      account: `${accountFirstName} ${accountLastName}`,
      performedBy: `${adminFirstName.toLowerCase()}.${adminLastName.toLowerCase()}@strayhelp.com`,
      timestamp,
      details,
      color: actionObj.color
    });
  }
  
  return logs.sort((a, b) => b.timestamp - a.timestamp);
};

export const mockData = {
  accounts: generateMockAccounts(),
  auditLogs: generateMockAuditLogs(),
  
  // Test credentials
  testCredentials: [
    { email: 'itadmin@strayhelp.com', password: 'password123', role: 'it-admin', name: 'IT Admin' },
    { email: 'superadmin@strayhelp.com', password: 'password123', role: 'super-admin', name: 'Super Admin' },
    { email: 'test@strayhelp.com', password: 'password123', role: 'it-admin', name: 'Test Admin' }
  ]
};

// Mock localStorage for persistence during testing
export class MockStorage {
  constructor() {
    this.data = {};
  }

  setItem(key, value) {
    this.data[key] = String(value);
  }

  getItem(key) {
    return this.data[key] || null;
  }

  removeItem(key) {
    delete this.data[key];
  }

  clear() {
    this.data = {};
  }
}

// Helper to find account by ID
export const findAccountById = (id) => {
  return mockData.accounts.find(acc => acc.id === id);
};

// Helper to update account
export const updateAccountInMock = (id, updates) => {
  const account = findAccountById(id);
  if (account) {
    Object.assign(account, updates);
  }
  return account;
};

// Helper to generate temporary password
export const generateTempPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper to add audit log
export const addAuditLog = (action, account, performedBy, details) => {
  const log = {
    id: mockData.auditLogs.length + 1,
    action,
    account,
    performedBy,
    timestamp: new Date(),
    details,
    color: 'bg-gray-100 text-gray-700'
  };
  mockData.auditLogs.unshift(log);
  return log;
};

// Helper functions for dashboard stats
export const getAccountStats = () => {
  const totalAccounts = mockData.accounts.length;
  const activeAccounts = mockData.accounts.filter(a => a.status === 'Active').length;
  const suspendedAccounts = mockData.accounts.filter(a => a.status === 'Suspended').length;
  const recentChanges = mockData.auditLogs.slice(0, 10).length;

  // Separate stats for users and organizations
  const userAccounts = mockData.accounts.filter(a => a.accountType === 'user');
  const organizationAccounts = mockData.accounts.filter(a => a.accountType === 'organization');

  return {
    totalAccounts,
    activeAccounts,
    suspendedAccounts,
    recentChanges,
    // User stats
    totalUserAccounts: userAccounts.length,
    activeUserAccounts: userAccounts.filter(a => a.status === 'Active').length,
    suspendedUserAccounts: userAccounts.filter(a => a.status === 'Suspended').length,
    // Organization stats
    totalOrganizationAccounts: organizationAccounts.length,
    activeOrganizationAccounts: organizationAccounts.filter(a => a.status === 'Active').length,
    suspendedOrganizationAccounts: organizationAccounts.filter(a => a.status === 'Suspended').length
  };
};
