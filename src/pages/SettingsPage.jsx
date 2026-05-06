import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [restoreConfirm, setRestoreConfirm] = useState(null);
  const [recycleToast, setRecycleToast] = useState('');

  // Profile Settings
  const [profileData, setProfileData] = useState({
    adminName: 'Admin User',
    email: 'admin@strayhelp.com',
    profilePicture: null,
    showChangePassword: false,
  });
  const [profileChanges, setProfileChanges] = useState({});

  // System Settings
  const [systemData, setSystemData] = useState({
    appName: 'StrayHelp',
    defaultLanguage: 'en',
    timezone: 'Asia/Manila',
    enableNotifications: true,
  });
  const [systemChanges, setSystemChanges] = useState({});

  // User Management Settings
  const [userMgmtData, setUserMgmtData] = useState({
    allowRegistration: true,
    enableVerification: true,
    autoSuspend: false,
  });
  const [userMgmtChanges, setUserMgmtChanges] = useState({});

  // Organization (KYC) Settings
  const [orgData, setOrgData] = useState({
    requiredDocs: {
      businessPermit: true,
      validId: true,
      proofLegitimacy: true,
    },
    requireManualApproval: true,
    reviewGuidelines: 'Organizations must provide complete documentation for verification.',
  });
  const [orgChanges, setOrgChanges] = useState({});

  // Donation Settings
  const [donationData, setDonationData] = useState({
    enableDonations: true,
    paymentMethods: {
      gcash: true,
      bankTransfer: true,
      card: true,
    },
    minimumAmount: '10.00',
  });
  const [donationChanges, setDonationChanges] = useState({});

  // Security Settings
  const [securityData, setSecurityData] = useState({
    showChangePassword: false,
    enable2FA: false,
    sessionTimeout: '30',
  });
  const [securityChanges, setSecurityChanges] = useState({});

  const deletedUsers = [
    {
      id: 'USR-0942',
      name: 'Lina Porter',
      email: 'lina.porter@strayhelp.org',
      deleted: 'Apr 30, 2026'
    },
    {
      id: 'USR-0931',
      name: 'Gavin Cruz',
      email: 'gavin.cruz@strayhelp.org',
      deleted: 'Apr 27, 2026'
    }
  ];

  const deletedOrganizations = [
    {
      id: 'ORG-1720',
      name: 'Northside Rescue',
      contactEmail: 'hello@northsiderescue.org',
      deleted: 'Apr 29, 2026'
    },
    {
      id: 'ORG-1714',
      name: 'Care & Paws PH',
      contactEmail: 'admin@careandpaws.ph',
      deleted: 'Apr 26, 2026'
    }
  ];

  const deletedReports = [
    {
      id: 'RPT-1908',
      title: 'Injured dog near terminal',
      category: 'Rescue',
      deleted: 'Apr 28, 2026'
    },
    {
      id: 'RPT-1903',
      title: 'Abandoned kitten box',
      category: 'Found Stray',
      deleted: 'Apr 25, 2026'
    }
  ];

  const deletedDonationDrives = [
    {
      id: 'DRV-1402',
      title: 'Emergency Food Kits',
      organization: 'Safe Paws Shelter',
      deleted: 'Apr 29, 2026'
    },
    {
      id: 'DRV-1396',
      title: 'Spay & Neuter Fund',
      organization: 'Metro Rescue Team',
      deleted: 'Apr 26, 2026'
    }
  ];

  // Handlers
  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
    setProfileChanges(prev => ({ ...prev, [field]: true }));
  };

  const handleSystemChange = (field, value) => {
    setSystemData(prev => ({ ...prev, [field]: value }));
    setSystemChanges(prev => ({ ...prev, [field]: true }));
  };

  const handleUserMgmtChange = (field, value) => {
    setUserMgmtData(prev => ({ ...prev, [field]: value }));
    setUserMgmtChanges(prev => ({ ...prev, [field]: true }));
  };

  const handleOrgChange = (field, value) => {
    setOrgData(prev => {
      if (field.startsWith('requiredDocs.')) {
        const docField = field.split('.')[1];
        return {
          ...prev,
          requiredDocs: { ...prev.requiredDocs, [docField]: value }
        };
      }
      return { ...prev, [field]: value };
    });
    setOrgChanges(prev => ({ ...prev, [field]: true }));
  };

  const handleDonationChange = (field, value) => {
    setDonationData(prev => {
      if (field.startsWith('paymentMethods.')) {
        const methodField = field.split('.')[1];
        return {
          ...prev,
          paymentMethods: { ...prev.paymentMethods, [methodField]: value }
        };
      }
      return { ...prev, [field]: value };
    });
    setDonationChanges(prev => ({ ...prev, [field]: true }));
  };

  const handleSecurityChange = (field, value) => {
    setSecurityData(prev => ({ ...prev, [field]: value }));
    setSecurityChanges(prev => ({ ...prev, [field]: true }));
  };

  const showSuccess = () => {
    setSuccessMessage('✓ Settings saved successfully');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const showRecycleToast = (message) => {
    setRecycleToast(message);
    setTimeout(() => setRecycleToast(''), 3000);
  };

  const handleSave = (tab, changes, resetChanges) => {
    if (Object.values(changes).some(v => v)) {
      setConfirmAction({ tab, resetChanges });
      setShowConfirmation(true);
    }
  };

  const confirmSave = () => {
    if (confirmAction) {
      confirmAction.resetChanges();
      showSuccess();
    }
    setShowConfirmation(false);
    setConfirmAction(null);
  };

  const openDeleteConfirm = (item) => {
    setDeleteConfirm(item);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm(null);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      showRecycleToast(`✓ ${deleteConfirm.type} deleted forever`);
    }
    setDeleteConfirm(null);
  };

  const openRestoreConfirm = (item) => {
    setRestoreConfirm(item);
  };

  const closeRestoreConfirm = () => {
    setRestoreConfirm(null);
  };

  const confirmRestore = () => {
    if (restoreConfirm) {
      showRecycleToast(`✓ ${restoreConfirm.type} restored`);
    }
    setRestoreConfirm(null);
  };

  // Tabs Configuration
  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'profile' },
    { id: 'system', label: 'System', icon: 'system' },
    { id: 'users', label: 'Users', icon: 'users' },
    { id: 'organization', label: 'Organization', icon: 'organization' },
    { id: 'donation', label: 'Donations', icon: 'donations' },
    { id: 'security', label: 'Security', icon: 'security' },
    { id: 'recycle', label: 'Recycle Bin', icon: 'deleted' },
  ];

  return (
    <Layout title="Settings">
      <div className="max-w-6xl">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {successMessage}
          </div>
        )}

        {recycleToast && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {recycleToast}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-8 overflow-x-auto border-b border-[#e2e6dc]">
          <div className="flex gap-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 transition ${
                  activeTab === tab.id
                    ? 'border-[#77806d] text-[#77806d]'
                    : 'border-transparent text-[#9aa294] hover:text-[#6c7669]'
                }`}
              >
                <TabIcon type={tab.icon} />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <SettingSection title="Profile Settings" description="Manage your admin profile information">
              <div className="space-y-4">
                {/* Profile Picture */}
                <div>
                  <label className="form-label">Profile Picture</label>
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-full bg-[#e6eadf]" />
                    <button
                      type="button"
                      className="btn-secondary flex items-center gap-2"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Upload Picture
                    </button>
                  </div>
                </div>

                {/* Admin Name */}
                <div>
                  <label className="form-label">Admin Name</label>
                  <input
                    type="text"
                    value={profileData.adminName}
                    onChange={(e) => handleProfileChange('adminName', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Change Password Button */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleProfileChange('showChangePassword', !profileData.showChangePassword)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </button>
                  {profileData.showChangePassword && (
                    <div className="mt-3 space-y-3 rounded-lg bg-[#f9faf8] p-4">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="form-input text-sm"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="form-input text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Confirm password"
                        className="form-input text-sm"
                      />
                    </div>
                  )}
                </div>
              </div>
            </SettingSection>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('profile', profileChanges, () => setProfileChanges({}))}
                disabled={!Object.values(profileChanges).some(v => v)}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <SettingSection title="System Settings" description="Configure application-wide settings">
              <div className="space-y-4">
                {/* App Name */}
                <div>
                  <label className="form-label">Application Name</label>
                  <input
                    type="text"
                    value={systemData.appName}
                    onChange={(e) => handleSystemChange('appName', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Default Language */}
                <div>
                  <label className="form-label">Default Language</label>
                  <select
                    value={systemData.defaultLanguage}
                    onChange={(e) => handleSystemChange('defaultLanguage', e.target.value)}
                    className="form-select"
                  >
                    <option value="en">English</option>
                    <option value="fil">Filipino</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label className="form-label">Timezone</label>
                  <select
                    value={systemData.timezone}
                    onChange={(e) => handleSystemChange('timezone', e.target.value)}
                    className="form-select"
                  >
                    <option value="Asia/Manila">Asia/Manila (UTC+8)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                    <option value="Asia/Bangkok">Asia/Bangkok (UTC+7)</option>
                  </select>
                </div>

                {/* Enable Notifications */}
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#4b5548]">Enable Notifications</label>
                  <Toggle
                    checked={systemData.enableNotifications}
                    onChange={(checked) => handleSystemChange('enableNotifications', checked)}
                  />
                </div>
              </div>
            </SettingSection>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('system', systemChanges, () => setSystemChanges({}))}
                disabled={!Object.values(systemChanges).some(v => v)}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* User Management Settings */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <SettingSection title="User Management Settings" description="Control user registration and verification processes">
              <div className="space-y-4">
                {/* Allow Registration */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">Allow User Registration</p>
                    <p className="text-xs text-[#9aa294]">Enable or disable new user sign-ups</p>
                  </div>
                  <Toggle
                    checked={userMgmtData.allowRegistration}
                    onChange={(checked) => handleUserMgmtChange('allowRegistration', checked)}
                  />
                </div>

                {/* Enable Verification */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">Enable Account Verification</p>
                    <p className="text-xs text-[#9aa294]">Require email verification for new accounts</p>
                  </div>
                  <Toggle
                    checked={userMgmtData.enableVerification}
                    onChange={(checked) => handleUserMgmtChange('enableVerification', checked)}
                  />
                </div>

                {/* Auto-suspend */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">Auto-suspend Flagged Users</p>
                    <p className="text-xs text-[#9aa294]">Automatically suspend users with multiple reports</p>
                  </div>
                  <Toggle
                    checked={userMgmtData.autoSuspend}
                    onChange={(checked) => handleUserMgmtChange('autoSuspend', checked)}
                  />
                </div>
              </div>
            </SettingSection>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('users', userMgmtChanges, () => setUserMgmtChanges({}))}
                disabled={!Object.values(userMgmtChanges).some(v => v)}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Organization (KYC) Settings */}
        {activeTab === 'organization' && (
          <div className="space-y-6">
            <SettingSection title="Organization (KYC) Settings" description="Configure KYC requirements for organization verification">
              <div className="space-y-6">
                {/* Required Documents */}
                <div>
                  <h4 className="mb-4 font-medium text-[#4b5548]">Required Documents</h4>
                  <div className="space-y-3">
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">Business Permit</label>
                      <Toggle
                        checked={orgData.requiredDocs.businessPermit}
                        onChange={(checked) => handleOrgChange('requiredDocs.businessPermit', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">Valid ID</label>
                      <Toggle
                        checked={orgData.requiredDocs.validId}
                        onChange={(checked) => handleOrgChange('requiredDocs.validId', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">Proof of Legitimacy</label>
                      <Toggle
                        checked={orgData.requiredDocs.proofLegitimacy}
                        onChange={(checked) => handleOrgChange('requiredDocs.proofLegitimacy', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Manual Approval */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">Require Manual Approval</p>
                    <p className="text-xs text-[#9aa294]">All KYC submissions require admin review</p>
                  </div>
                  <Toggle
                    checked={orgData.requireManualApproval}
                    onChange={(checked) => handleOrgChange('requireManualApproval', checked)}
                  />
                </div>

                {/* Review Guidelines */}
                <div>
                  <label className="form-label">Review Guidelines (Optional)</label>
                  <textarea
                    value={orgData.reviewGuidelines}
                    onChange={(e) => handleOrgChange('reviewGuidelines', e.target.value)}
                    rows="4"
                    className="form-textarea"
                  />
                </div>
              </div>
            </SettingSection>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('organization', orgChanges, () => setOrgChanges({}))}
                disabled={!Object.values(orgChanges).some(v => v)}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Donation Settings */}
        {activeTab === 'donation' && (
          <div className="space-y-6">
            <SettingSection title="Donation Settings" description="Configure donation features and payment methods">
              <div className="space-y-6">
                {/* Enable Donations */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">Enable Donations</p>
                    <p className="text-xs text-[#9aa294]">Allow users to make donations</p>
                  </div>
                  <Toggle
                    checked={donationData.enableDonations}
                    onChange={(checked) => handleDonationChange('enableDonations', checked)}
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="mb-4 font-medium text-[#4b5548]">Supported Payment Methods</h4>
                  <div className="space-y-3">
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">GCash</label>
                      <Toggle
                        checked={donationData.paymentMethods.gcash}
                        onChange={(checked) => handleDonationChange('paymentMethods.gcash', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">Bank Transfer</label>
                      <Toggle
                        checked={donationData.paymentMethods.bankTransfer}
                        onChange={(checked) => handleDonationChange('paymentMethods.bankTransfer', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">Card</label>
                      <Toggle
                        checked={donationData.paymentMethods.card}
                        onChange={(checked) => handleDonationChange('paymentMethods.card', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Donation */}
                <div>
                  <label className="form-label">Minimum Donation Amount (₱)</label>
                  <input
                    type="number"
                    value={donationData.minimumAmount}
                    onChange={(e) => handleDonationChange('minimumAmount', e.target.value)}
                    step="0.01"
                    min="0"
                    className="form-input"
                  />
                </div>
              </div>
            </SettingSection>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('donation', donationChanges, () => setDonationChanges({}))}
                disabled={!Object.values(donationChanges).some(v => v)}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <SettingSection title="Security Settings" description="Manage password and security preferences">
              <div className="space-y-4">
                {/* Change Password */}
                <div>
                  <button
                    type="button"
                    onClick={() => handleSecurityChange('showChangePassword', !securityData.showChangePassword)}
                    className="btn-secondary flex items-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Change Password
                  </button>
                  {securityData.showChangePassword && (
                    <div className="mt-3 space-y-3 rounded-lg bg-[#f9faf8] p-4">
                      <input
                        type="password"
                        placeholder="Current password"
                        className="form-input text-sm"
                      />
                      <input
                        type="password"
                        placeholder="New password"
                        className="form-input text-sm"
                      />
                      <input
                        type="password"
                        placeholder="Confirm password"
                        className="form-input text-sm"
                      />
                    </div>
                  )}
                </div>

                {/* 2FA */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">Two-Factor Authentication</p>
                    <p className="text-xs text-[#9aa294]">Add an extra layer of security</p>
                  </div>
                  <Toggle
                    checked={securityData.enable2FA}
                    onChange={(checked) => handleSecurityChange('enable2FA', checked)}
                  />
                </div>

                {/* Session Timeout */}
                <div>
                  <label className="form-label">Session Timeout (minutes)</label>
                  <input
                    type="number"
                    value={securityData.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    min="5"
                    max="1440"
                    className="form-input"
                  />
                  <p className="mt-1 text-xs text-[#9aa294]">Automatically log out after this period of inactivity</p>
                </div>
              </div>
            </SettingSection>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('security', securityChanges, () => setSecurityChanges({}))}
                disabled={!Object.values(securityChanges).some(v => v)}
                className="btn-primary"
              >
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* Deleted Accounts */}
        {activeTab === 'recycle' && (
          <div className="space-y-6">
            <SettingSection title="Recycle Bin" description="Manage deleted users, organizations, and reports">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#4b5548]">Deleted Users</h4>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">Total: 12</span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6eadf]">
                    <div className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                      <span>User ID</span>
                      <span>Profile</span>
                      <span>Type</span>
                      <span>Date Deleted</span>
                      <span className="pr-2 text-right">Actions</span>
                    </div>
                    {deletedUsers.map((user, index) => (
                      <div
                        key={`${user.id}-${index}`}
                        className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-3 text-sm text-[#5a6457]"
                      >
                        <span className="text-xs font-semibold text-[#9aa294]">{user.id}</span>
                        <div>
                          <p className="font-semibold text-[#4b5548]">{user.name}</p>
                          <p className="text-xs text-[#9aa294]">{user.email}</p>
                        </div>
                        <span className="text-xs text-[#9aa294]">User</span>
                        <span className="text-xs text-[#9aa294]">{user.deleted}</span>
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <button
                            className="btn-outline px-3 py-1 text-xs"
                            onClick={() => openRestoreConfirm({
                              type: 'User',
                              name: user.name,
                              id: user.id
                            })}
                          >
                            Restore
                          </button>
                          <button
                            className="btn-outline px-3 py-1 text-xs text-[#a25d5d]"
                            onClick={() => openDeleteConfirm({
                              type: 'User',
                              name: user.name,
                              id: user.id
                            })}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#4b5548]">Deleted Organizations</h4>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">Total: 6</span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6eadf]">
                    <div className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                      <span>Org ID</span>
                      <span>Organization</span>
                      <span>Type</span>
                      <span>Date Deleted</span>
                      <span className="pr-2 text-right">Actions</span>
                    </div>
                    {deletedOrganizations.map((org, index) => (
                      <div
                        key={`${org.id}-${index}`}
                        className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-3 text-sm text-[#5a6457]"
                      >
                        <span className="text-xs font-semibold text-[#9aa294]">{org.id}</span>
                        <div>
                          <p className="font-semibold text-[#4b5548]">{org.name}</p>
                          <p className="text-xs text-[#9aa294]">{org.contactEmail}</p>
                        </div>
                        <span className="text-xs text-[#9aa294]">Organization</span>
                        <span className="text-xs text-[#9aa294]">{org.deleted}</span>
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <button
                            className="btn-outline px-3 py-1 text-xs"
                            onClick={() => openRestoreConfirm({
                              type: 'Organization',
                              name: org.name,
                              id: org.id
                            })}
                          >
                            Restore
                          </button>
                          <button
                            className="btn-outline px-3 py-1 text-xs text-[#a25d5d]"
                            onClick={() => openDeleteConfirm({
                              type: 'Organization',
                              name: org.name,
                              id: org.id
                            })}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#4b5548]">Deleted Reports</h4>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">Total: 9</span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6eadf]">
                    <div className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                      <span>Report ID</span>
                      <span>Report</span>
                      <span>Category</span>
                      <span>Date Deleted</span>
                      <span className="pr-2 text-right">Actions</span>
                    </div>
                    {deletedReports.map((report, index) => (
                      <div
                        key={`${report.id}-${index}`}
                        className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-3 text-sm text-[#5a6457]"
                      >
                        <span className="text-xs font-semibold text-[#9aa294]">{report.id}</span>
                        <p className="font-semibold text-[#4b5548]">{report.title}</p>
                        <span className="text-xs text-[#9aa294]">{report.category}</span>
                        <span className="text-xs text-[#9aa294]">{report.deleted}</span>
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <button
                            className="btn-outline px-3 py-1 text-xs"
                            onClick={() => openRestoreConfirm({
                              type: 'Report',
                              name: report.title,
                              id: report.id
                            })}
                          >
                            Restore
                          </button>
                          <button
                            className="btn-outline px-3 py-1 text-xs text-[#a25d5d]"
                            onClick={() => openDeleteConfirm({
                              type: 'Report',
                              name: report.title,
                              id: report.id
                            })}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#4b5548]">Deleted Donation Drives</h4>
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">Total: 5</span>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6eadf]">
                    <div className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                      <span>Drive ID</span>
                      <span>Donation Drive</span>
                      <span>Type</span>
                      <span>Date Deleted</span>
                      <span className="pr-2 text-right">Actions</span>
                    </div>
                    {deletedDonationDrives.map((drive, index) => (
                      <div
                        key={`${drive.id}-${index}`}
                        className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-3 text-sm text-[#5a6457]"
                      >
                        <span className="text-xs font-semibold text-[#9aa294]">{drive.id}</span>
                        <div>
                          <p className="font-semibold text-[#4b5548]">{drive.title}</p>
                          <p className="text-xs text-[#9aa294]">{drive.organization}</p>
                        </div>
                        <span className="text-xs text-[#9aa294]">Donation drive</span>
                        <span className="text-xs text-[#9aa294]">{drive.deleted}</span>
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <button
                            className="btn-outline px-3 py-1 text-xs"
                            onClick={() => openRestoreConfirm({
                              type: 'Donation drive',
                              name: drive.title,
                              id: drive.id
                            })}
                          >
                            Restore
                          </button>
                          <button
                            className="btn-outline px-3 py-1 text-xs text-[#a25d5d]"
                            onClick={() => openDeleteConfirm({
                              type: 'Donation drive',
                              name: drive.title,
                              id: drive.id
                            })}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SettingSection>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="rounded-2xl border border-[#e2e6dc] bg-white p-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#4b5548]">Confirm Changes</h3>
            </div>
            <p className="mt-2 text-sm text-[#9aa294]">Are you sure you want to save these changes?</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="btn-secondary flex items-center justify-center gap-2 flex-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Cancel
              </button>
              <button
                onClick={confirmSave}
                className="btn-primary flex items-center justify-center gap-2 flex-1"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fbe9e9] text-[#b83a3a]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 9v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M12 17h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#4b5548]">Delete forever?</h3>
                <p className="text-sm text-[#9aa294]">This action cannot be undone.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{deleteConfirm.type}:</span> {deleteConfirm.name} ({deleteConfirm.id})
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={closeDeleteConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-pill-danger flex-1"
                onClick={confirmDelete}
              >
                Delete forever
              </button>
            </div>
          </div>
        </div>
      )}

      {restoreConfirm && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f3ea] text-[#2f7a43]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M3 12a9 9 0 1 0 3-6.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M3 4v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#4b5548]">Restore account?</h3>
                <p className="text-sm text-[#9aa294]">This will return the item to its active list.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{restoreConfirm.type}:</span> {restoreConfirm.name} ({restoreConfirm.id})
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={closeRestoreConfirm}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-pill-primary flex-1"
                onClick={confirmRestore}
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// Toggle Component
const Toggle = ({ checked, onChange }) => {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
        checked ? 'bg-[#77806d]' : 'bg-[#e2e6dc]'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
          checked ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );
};

// Settings Section Component
const SettingSection = ({ title, description, children }) => {
  return (
    <div className="settings-section">
      <h3 className="text-lg font-semibold text-[#4b5548]">{title}</h3>
      <p className="mt-1 text-sm text-[#9aa294]">{description}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
};

// Tab Icon Component
const TabIcon = ({ type }) => {
  const iconProps = {
    className: 'h-5 w-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24'
  };

  switch (type) {
    case 'profile':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      );
    case 'system':
      return (
        <svg {...iconProps} aria-hidden="true">
          <circle cx="12" cy="12" r="1" />
          <path d="M12 1v6m0 6v4" />
          <path d="M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h4" />
          <path d="M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24M1 12h6m6 0h4" />
        </svg>
      );
    case 'users':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case 'organization':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      );
    case 'donations':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      );
    case 'security':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      );
    case 'deleted':
      return (
        <svg {...iconProps} aria-hidden="true">
          <path d="M9 3h6" />
          <path d="M10 8v8" />
          <path d="M14 8v8" />
          <path d="M4 6h16" />
          <path d="M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
        </svg>
      );
    default:
      return null;
  }
};
