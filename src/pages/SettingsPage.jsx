import React, { useRef, useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { useSettingsContext } from '../context/SettingsContext';
import {
  getRecycleBin,
  restoreRecycleBinItem,
  deleteRecycleBinItem,
  updatePassword
} from '../services/settingsService';
import { useI18n } from '../hooks/useI18n';
import { exportToXlsx } from '../utils/exportXlsx';

export const SettingsPage = () => {
  const { t, tl } = useI18n();
  const {
    settings: contextSettings,
    loading: contextLoading,
    updateSettings: contextUpdateSettings,
    loadSettings
  } = useSettingsContext();
  const [activeTab, setActiveTab] = useState('profile');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [restoreConfirm, setRestoreConfirm] = useState(null);
  const [recycleToast, setRecycleToast] = useState('');
  const [recycleLoading, setRecycleLoading] = useState(false);
  const [recycleError, setRecycleError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const profileFileInputRef = useRef(null);
  const [recycleBinData, setRecycleBinData] = useState({
    users: [],
    organizations: [],
    reports: [],
    donationDrives: []
  });

  // Profile Settings
  const [profileData, setProfileData] = useState({
    adminName: 'Admin User',
    email: 'admin@strayhelp.com',
    profilePicture: null,
    showChangePassword: false,
  });
  const [profilePasswordData, setProfilePasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
  const [securityPasswordData, setSecurityPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [securityChanges, setSecurityChanges] = useState({});

  // Initialize from context settings
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    if (contextSettings) {
      const loginEmail = typeof window !== 'undefined' ? window.localStorage.getItem('adminEmail') : '';
      if (contextSettings.profile) {
        setProfileData((prev) => ({
          ...prev,
          ...contextSettings.profile,
          email: (loginEmail && String(loginEmail).trim()) || contextSettings.profile.email || prev.email,
          adminName: contextSettings.profile.adminName && String(contextSettings.profile.adminName).trim().length > 0
            ? contextSettings.profile.adminName
            : prev.adminName
        }));
      }
      if (contextSettings.system) setSystemData((prev) => ({ ...prev, ...contextSettings.system }));
      if (contextSettings.userManagement) setUserMgmtData((prev) => ({ ...prev, ...contextSettings.userManagement }));
      if (contextSettings.organization) setOrgData((prev) => ({ ...prev, ...contextSettings.organization }));
      if (contextSettings.donation) setDonationData((prev) => ({ ...prev, ...contextSettings.donation }));
      if (contextSettings.security) setSecurityData(prev => ({ ...prev, ...contextSettings.security }));
    }
  }, [contextSettings]);

  useEffect(() => {
    if (contextSettings?.system?.defaultLanguage) {
      document.documentElement.lang = contextSettings.system.defaultLanguage;
    }
  }, [contextSettings?.system?.defaultLanguage]);

  const loadRecycleBin = async () => {
    try {
      setRecycleLoading(true);
      setRecycleError('');
      const data = await getRecycleBin();
      setRecycleBinData(data.recycleBin || {
        users: [],
        organizations: [],
        reports: [],
        donationDrives: []
      });
    } catch (error) {
      setRecycleError(error?.response?.data?.message || error.message || tl('Failed to load archive'));
    } finally {
      setRecycleLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'recycle') {
      loadRecycleBin();
    }
  }, [activeTab]);

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
    setSuccessMessage(`✓ ${tl('Settings saved successfully')}`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleProfilePictureUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      handleProfileChange('profilePicture', reader.result);
    };
    reader.readAsDataURL(file);
  };

  const maybeUpdatePassword = async (passwordData, onSuccess) => {
    const currentPassword = String(passwordData.currentPassword || '').trim();
    const newPassword = String(passwordData.newPassword || '').trim();
    const confirmPassword = String(passwordData.confirmPassword || '').trim();

    if (!currentPassword && !newPassword && !confirmPassword) {
      return;
    }

    if (!currentPassword || !newPassword || !confirmPassword) {
      throw new Error(tl('Please fill out current, new, and confirm password fields.'));
    }
    if (newPassword.length < 8) {
      throw new Error(tl('New password must be at least 8 characters long.'));
    }
    if (newPassword !== confirmPassword) {
      throw new Error(tl('New password and confirm password do not match.'));
    }

    await updatePassword(currentPassword, newPassword);
    onSuccess();
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

  const confirmSave = async () => {
    if (confirmAction) {
      try {
        setPasswordError('');
        setPasswordSuccess('');
        const settingsUpdate = {};
        if (confirmAction.tab === 'profile') {
          settingsUpdate.profile = {
            ...profileData,
            email: String(profileData.email || '').trim(),
            adminName: String(profileData.adminName || '').trim()
          };
        }
        if (confirmAction.tab === 'system') settingsUpdate.system = systemData;
        if (confirmAction.tab === 'users') settingsUpdate.userManagement = userMgmtData;
        if (confirmAction.tab === 'organization') settingsUpdate.organization = orgData;
        if (confirmAction.tab === 'donation') settingsUpdate.donation = donationData;
        if (confirmAction.tab === 'security') settingsUpdate.security = securityData;

        await contextUpdateSettings(settingsUpdate);

        if (confirmAction.tab === 'profile') {
          window.localStorage.setItem('adminName', settingsUpdate.profile.adminName || 'Admin User');
          window.localStorage.setItem('adminEmail', settingsUpdate.profile.email || 'admin@strayhelp.com');
          await maybeUpdatePassword(profilePasswordData, () => {
            setProfilePasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordSuccess(`✓ ${tl('Password updated successfully')}`);
            setTimeout(() => setPasswordSuccess(''), 3000);
          });
        }

        if (confirmAction.tab === 'security') {
          await maybeUpdatePassword(securityPasswordData, () => {
            setSecurityPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setPasswordSuccess(`✓ ${tl('Password updated successfully')}`);
            setTimeout(() => setPasswordSuccess(''), 3000);
          });
        }

        confirmAction.resetChanges();
        showSuccess();
      } catch (error) {
        console.error('Failed to save settings:', error);
        setPasswordError(error?.response?.data?.message || error.message || tl('Failed to update password'));
        setSuccessMessage(`✗ ${tl('Failed to save settings')}`);
        setTimeout(() => setSuccessMessage(''), 3000);
      }
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
    if (!deleteConfirm) {
      return;
    }

    const doDelete = async () => {
      try {
        setRecycleError('');
        const response = await deleteRecycleBinItem(deleteConfirm.itemTypeKey, deleteConfirm.id);
        if (response.recycleBin) {
          setRecycleBinData(response.recycleBin);
        }
        showRecycleToast(`✓ ${tl(deleteConfirm.type)} ${tl('deleted forever')}`);
      } catch (error) {
        setRecycleError(error?.response?.data?.message || error.message || tl('Failed to delete archive item'));
      } finally {
        setDeleteConfirm(null);
      }
    };

    doDelete();
  };

  const openRestoreConfirm = (item) => {
    setRestoreConfirm(item);
  };

  const closeRestoreConfirm = () => {
    setRestoreConfirm(null);
  };

  const confirmRestore = () => {
    if (!restoreConfirm) {
      return;
    }

    const doRestore = async () => {
      try {
        setRecycleError('');
        const response = await restoreRecycleBinItem(restoreConfirm.itemTypeKey, restoreConfirm.id);
        if (response.recycleBin) {
          setRecycleBinData(response.recycleBin);
        }
        showRecycleToast(`✓ ${tl(restoreConfirm.type)} ${tl('restored')}`);
      } catch (error) {
        setRecycleError(error?.response?.data?.message || error.message || tl('Failed to restore archive item'));
      } finally {
        setRestoreConfirm(null);
      }
    };

    doRestore();
  };

  // Tabs Configuration
  const tabs = [
    { id: 'profile', label: t('settingsTabProfile', 'Profile'), icon: 'profile' },
    { id: 'system', label: t('settingsTabSystem', 'System'), icon: 'system' },
    { id: 'users', label: t('settingsTabUsers', 'Users'), icon: 'users' },
    { id: 'organization', label: t('settingsTabOrganization', 'Organization'), icon: 'organization' },
    { id: 'donation', label: t('settingsTabDonations', 'Donations'), icon: 'donations' },
    { id: 'security', label: t('settingsTabSecurity', 'Security'), icon: 'security' },
    { id: 'recycle', label: t('settingsTabRecycle', 'Archive'), icon: 'deleted' },
  ];

  return (
    <Layout title={t('pageSettings', 'Settings')}>
      {contextLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-[#9aa294]">{t('settingsLoading', 'Loading settings...')}</div>
        </div>
      ) : (
      <>
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

        {passwordSuccess && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {passwordSuccess}
          </div>
        )}

        {passwordError && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {passwordError}
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
            <SettingSection title={tl('Profile Settings')} description={tl('Manage your admin profile information')}>
              <div className="space-y-4">
                {/* Profile Picture */}
                <div>
                  <label className="form-label">{tl('Profile Picture')}</label>
                  <div className="flex items-center gap-4">
                    {profileData.profilePicture ? (
                      <img src={profileData.profilePicture} alt="Admin profile" className="h-16 w-16 rounded-full object-cover" />
                    ) : (
                      <div className="h-16 w-16 rounded-full bg-[#e6eadf]" />
                    )}
                    <button
                      type="button"
                      className="btn-secondary flex items-center gap-2"
                      onClick={() => profileFileInputRef.current?.click()}
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {tl('Upload Picture')}
                    </button>
                    <input
                      ref={profileFileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePictureUpload}
                    />
                  </div>
                </div>

                {/* Admin Name */}
                <div>
                  <label className="form-label">{tl('Admin Name')}</label>
                  <input
                    type="text"
                    value={profileData.adminName}
                    onChange={(e) => handleProfileChange('adminName', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="form-label">{tl('Email Address')}</label>
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
                    {tl('Change Password')}
                  </button>
                  {profileData.showChangePassword && (
                    <div className="mt-3 space-y-3 rounded-lg bg-[#f9faf8] p-4">
                      <input
                        type="password"
                        placeholder={tl('Current password')}
                        className="form-input text-sm"
                        value={profilePasswordData.currentPassword}
                        onChange={(e) => setProfilePasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <input
                        type="password"
                        placeholder={tl('New password')}
                        className="form-input text-sm"
                        value={profilePasswordData.newPassword}
                        onChange={(e) => setProfilePasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                      <input
                        type="password"
                        placeholder={tl('Confirm password')}
                        className="form-input text-sm"
                        value={profilePasswordData.confirmPassword}
                        onChange={(e) => setProfilePasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
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
                disabled={
                  !Object.values(profileChanges).some(v => v) &&
                  !profilePasswordData.currentPassword &&
                  !profilePasswordData.newPassword &&
                  !profilePasswordData.confirmPassword
                }
                className="btn-primary"
              >
                {tl('Save Changes')}
              </button>
            </div>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            <SettingSection title={tl('System Settings')} description={tl('Configure application-wide settings')}>
              <div className="space-y-4">
                {/* App Name */}
                <div>
                  <label className="form-label">{tl('Application Name')}</label>
                  <input
                    type="text"
                    value={systemData.appName}
                    onChange={(e) => handleSystemChange('appName', e.target.value)}
                    className="form-input"
                  />
                </div>

                {/* Default Language */}
                <div>
                  <label className="form-label">{tl('Default Language')}</label>
                  <select
                    value={systemData.defaultLanguage}
                    onChange={(e) => handleSystemChange('defaultLanguage', e.target.value)}
                    className="form-select"
                  >
                    <option value="en">{tl('English')}</option>
                    <option value="fil">{tl('Filipino')}</option>
                    <option value="es">{tl('Spanish')}</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label className="form-label">{tl('Timezone')}</label>
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
                  <label className="text-sm font-medium text-[#4b5548]">{tl('Enable Notifications')}</label>
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
                {tl('Save Changes')}
              </button>
            </div>
          </div>
        )}

        {/* User Management Settings */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <SettingSection title={tl('User Management Settings')} description={tl('Control user registration and verification processes')}>
              <div className="space-y-4">
                {/* Allow Registration */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">{tl('Allow User Registration')}</p>
                    <p className="text-xs text-[#9aa294]">{tl('Enable or disable new user sign-ups')}</p>
                  </div>
                  <Toggle
                    checked={userMgmtData.allowRegistration}
                    onChange={(checked) => handleUserMgmtChange('allowRegistration', checked)}
                  />
                </div>

                {/* Enable Verification */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">{tl('Enable Account Verification')}</p>
                    <p className="text-xs text-[#9aa294]">{tl('Require email verification for new accounts')}</p>
                  </div>
                  <Toggle
                    checked={userMgmtData.enableVerification}
                    onChange={(checked) => handleUserMgmtChange('enableVerification', checked)}
                  />
                </div>

                {/* Auto-suspend */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">{tl('Auto-suspend Flagged Users')}</p>
                    <p className="text-xs text-[#9aa294]">{tl('Automatically suspend users with multiple reports')}</p>
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
                {tl('Save Changes')}
              </button>
            </div>
          </div>
        )}

        {/* Organization (KYC) Settings */}
        {activeTab === 'organization' && (
          <div className="space-y-6">
            <SettingSection title={tl('Organization (KYC) Settings')} description={tl('Configure KYC requirements for organization verification')}>
              <div className="space-y-6">
                {/* Required Documents */}
                <div>
                  <h4 className="mb-4 font-medium text-[#4b5548]">{tl('Required Documents')}</h4>
                  <div className="space-y-3">
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">{tl('Business Permit')}</label>
                      <Toggle
                        checked={orgData.requiredDocs.businessPermit}
                        onChange={(checked) => handleOrgChange('requiredDocs.businessPermit', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">{tl('Valid ID')}</label>
                      <Toggle
                        checked={orgData.requiredDocs.validId}
                        onChange={(checked) => handleOrgChange('requiredDocs.validId', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">{tl('Proof of Legitimacy')}</label>
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
                    <p className="font-medium text-[#4b5548]">{tl('Require Manual Approval')}</p>
                    <p className="text-xs text-[#9aa294]">{tl('All KYC submissions require admin review')}</p>
                  </div>
                  <Toggle
                    checked={orgData.requireManualApproval}
                    onChange={(checked) => handleOrgChange('requireManualApproval', checked)}
                  />
                </div>

                {/* Review Guidelines */}
                <div>
                  <label className="form-label">{tl('Review Guidelines (Optional)')}</label>
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
                {tl('Save Changes')}
              </button>
            </div>
          </div>
        )}

        {/* Donation Settings */}
        {activeTab === 'donation' && (
          <div className="space-y-6">
            <SettingSection title={tl('Donation Settings')} description={tl('Configure donation features and payment methods')}>
              <div className="space-y-6">
                {/* Enable Donations */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">{tl('Enable Donations')}</p>
                    <p className="text-xs text-[#9aa294]">{tl('Allow users to make donations')}</p>
                  </div>
                  <Toggle
                    checked={donationData.enableDonations}
                    onChange={(checked) => handleDonationChange('enableDonations', checked)}
                  />
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="mb-4 font-medium text-[#4b5548]">{tl('Supported Payment Methods')}</h4>
                  <div className="space-y-3">
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">{tl('GCash')}</label>
                      <Toggle
                        checked={donationData.paymentMethods.gcash}
                        onChange={(checked) => handleDonationChange('paymentMethods.gcash', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">{tl('Bank Transfer')}</label>
                      <Toggle
                        checked={donationData.paymentMethods.bankTransfer}
                        onChange={(checked) => handleDonationChange('paymentMethods.bankTransfer', checked)}
                      />
                    </div>
                    <div className="toggle-card">
                      <label className="text-sm font-medium text-[#4b5548]">{tl('Card')}</label>
                      <Toggle
                        checked={donationData.paymentMethods.card}
                        onChange={(checked) => handleDonationChange('paymentMethods.card', checked)}
                      />
                    </div>
                  </div>
                </div>

                {/* Minimum Donation */}
                <div>
                  <label className="form-label">{tl('Minimum Donation Amount (P)')}</label>
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
                {tl('Save Changes')}
              </button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <SettingSection title={tl('Security Settings')} description={tl('Manage password and security preferences')}>
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
                    {tl('Change Password')}
                  </button>
                  {securityData.showChangePassword && (
                    <div className="mt-3 space-y-3 rounded-lg bg-[#f9faf8] p-4">
                      <input
                        type="password"
                        placeholder={tl('Current password')}
                        className="form-input text-sm"
                        value={securityPasswordData.currentPassword}
                        onChange={(e) => setSecurityPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      />
                      <input
                        type="password"
                        placeholder={tl('New password')}
                        className="form-input text-sm"
                        value={securityPasswordData.newPassword}
                        onChange={(e) => setSecurityPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                      />
                      <input
                        type="password"
                        placeholder={tl('Confirm password')}
                        className="form-input text-sm"
                        value={securityPasswordData.confirmPassword}
                        onChange={(e) => setSecurityPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      />
                    </div>
                  )}
                </div>

                {/* 2FA */}
                <div className="toggle-card">
                  <div>
                    <p className="font-medium text-[#4b5548]">{tl('Two-Factor Authentication')}</p>
                    <p className="text-xs text-[#9aa294]">{tl('Add an extra layer of security')}</p>
                  </div>
                  <Toggle
                    checked={securityData.enable2FA}
                    onChange={(checked) => handleSecurityChange('enable2FA', checked)}
                  />
                </div>

                {/* Session Timeout */}
                <div>
                  <label className="form-label">{tl('Session Timeout (minutes)')}</label>
                  <input
                    type="number"
                    value={securityData.sessionTimeout}
                    onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                    min="5"
                    max="1440"
                    className="form-input"
                  />
                  <p className="mt-1 text-xs text-[#9aa294]">{tl('Automatically log out after this period of inactivity')}</p>
                </div>
              </div>
            </SettingSection>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={() => handleSave('security', securityChanges, () => setSecurityChanges({}))}
                disabled={
                  !Object.values(securityChanges).some(v => v) &&
                  !securityPasswordData.currentPassword &&
                  !securityPasswordData.newPassword &&
                  !securityPasswordData.confirmPassword
                }
                className="btn-primary"
              >
                {tl('Save Changes')}
              </button>
            </div>
          </div>
        )}

        {/* Deleted Accounts */}
        {activeTab === 'recycle' && (
          <div className="space-y-6">
            <SettingSection title={tl('Archive')} description={tl('Manage archived users, organizations, and reports')}>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#4b5548]">{tl('Archived Users')}</h4>
                    <div className="flex items-center gap-3">
                      <button className="rounded-full border border-[#e2e6dc] bg-white px-3 py-1 text-xs font-semibold text-[#6c7669]" onClick={() => exportToXlsx(recycleBinData.users, 'archived_users_export.xlsx', [{ label: 'ID', key: 'id' }, { label: 'Name', key: 'name' }, { label: 'Email', key: 'email' }, { label: 'Date Archived', key: 'deleted' }])}>{tl('Export')}</button>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">{tl('Total:')} {recycleBinData.users.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6eadf]">
                    <div className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                      <span>{tl('User ID')}</span>
                      <span>{tl('Profile')}</span>
                      <span>{tl('Type')}</span>
                      <span>{tl('Date Archived')}</span>
                      <span className="pr-2 text-right">{tl('Actions')}</span>
                    </div>
                    {recycleBinData.users.map((user, index) => (
                      <div
                        key={`${user.id}-${index}`}
                        className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-3 text-sm text-[#5a6457]"
                      >
                        <span className="text-xs font-semibold text-[#9aa294]">{user.id}</span>
                        <div>
                          <p className="font-semibold text-[#4b5548]">{user.name}</p>
                          <p className="text-xs text-[#9aa294]">{user.email}</p>
                        </div>
                        <span className="text-xs text-[#9aa294]">{tl('User')}</span>
                        <span className="text-xs text-[#9aa294]">{user.deleted}</span>
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <button
                            className="btn-outline px-3 py-1 text-xs"
                            onClick={() => openRestoreConfirm({
                              type: 'User',
                              name: user.name,
                              id: user.id,
                              itemTypeKey: 'users'
                            })}
                          >
                            {tl('Restore')}
                          </button>
                          <button
                            className="btn-outline px-3 py-1 text-xs text-[#a25d5d]"
                            onClick={() => openDeleteConfirm({
                              type: 'User',
                              name: user.name,
                              id: user.id,
                              itemTypeKey: 'users'
                            })}
                          >
                            {tl('Delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#4b5548]">{tl('Archived Organizations')}</h4>
                    <div className="flex items-center gap-3">
                      <button className="rounded-full border border-[#e2e6dc] bg-white px-3 py-1 text-xs font-semibold text-[#6c7669]" onClick={() => exportToXlsx(recycleBinData.organizations, 'archived_organizations_export.xlsx', [{ label: 'ID', key: 'id' }, { label: 'Name', key: 'name' }, { label: 'Date Archived', key: 'deleted' }])}>{tl('Export')}</button>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">{tl('Total:')} {recycleBinData.organizations.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6eadf]">
                    <div className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                      <span>{tl('Org ID')}</span>
                      <span>{tl('Organization')}</span>
                      <span>{tl('Type')}</span>
                      <span>{tl('Date Archived')}</span>
                      <span className="pr-2 text-right">{tl('Actions')}</span>
                    </div>
                    {recycleBinData.organizations.map((org, index) => (
                      <div
                        key={`${org.id}-${index}`}
                        className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-3 text-sm text-[#5a6457]"
                      >
                        <span className="text-xs font-semibold text-[#9aa294]">{org.id}</span>
                        <div>
                          <p className="font-semibold text-[#4b5548]">{org.name}</p>
                          <p className="text-xs text-[#9aa294]">{org.contactEmail}</p>
                        </div>
                        <span className="text-xs text-[#9aa294]">{tl('Organization')}</span>
                        <span className="text-xs text-[#9aa294]">{org.deleted}</span>
                        <div className="flex items-center justify-end gap-2 pr-2">
                          <button
                            className="btn-outline px-3 py-1 text-xs"
                            onClick={() => openRestoreConfirm({
                              type: 'Organization',
                              name: org.name,
                              id: org.id,
                              itemTypeKey: 'organizations'
                            })}
                          >
                            {tl('Restore')}
                          </button>
                          <button
                            className="btn-outline px-3 py-1 text-xs text-[#a25d5d]"
                            onClick={() => openDeleteConfirm({
                              type: 'Organization',
                              name: org.name,
                              id: org.id,
                              itemTypeKey: 'organizations'
                            })}
                          >
                            {tl('Delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-[#4b5548]">{tl('Archived Reports')}</h4>
                    <div className="flex items-center gap-3">
                      <button className="rounded-full border border-[#e2e6dc] bg-white px-3 py-1 text-xs font-semibold text-[#6c7669]" onClick={() => exportToXlsx(recycleBinData.reports, 'archived_reports_export.xlsx', [{ label: 'ID', key: 'id' }, { label: 'Report', key: 'title' }, { label: 'Category', key: 'category' }, { label: 'Date Archived', key: 'deleted' }])}>{tl('Export')}</button>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">{tl('Total:')} {recycleBinData.reports.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 overflow-hidden rounded-2xl border border-[#e6eadf]">
                    <div className="grid grid-cols-[1fr_2.2fr_1.2fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                      <span>{tl('Report ID')}</span>
                      <span>{tl('Report')}</span>
                      <span>{tl('Category')}</span>
                      <span>{tl('Date Archived')}</span>
                      <span className="pr-2 text-right">{tl('Actions')}</span>
                    </div>
                    {recycleBinData.reports.map((report, index) => (
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
                              id: report.id,
                              itemTypeKey: 'reports'
                            })}
                          >
                            {tl('Restore')}
                          </button>
                          <button
                            className="btn-outline px-3 py-1 text-xs text-[#a25d5d]"
                            onClick={() => openDeleteConfirm({
                              type: 'Report',
                              name: report.title,
                              id: report.id,
                              itemTypeKey: 'reports'
                            })}
                          >
                            {tl('Delete')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {recycleLoading && (
                  <p className="text-sm text-[#7a8476]">{tl('Loading archive...')}</p>
                )}

                {recycleError && (
                  <p className="text-sm text-[#b83a3a]">{recycleError}</p>
                )}

                {recycleToast && (
                  <p className="text-sm text-[#2f7a43]">{recycleToast}</p>
                )}
              </div>
            </SettingSection>
          </div>
        )}
      </div>

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
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Delete forever?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('This action cannot be undone.')}</p>
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
                {tl('Cancel')}
              </button>
              <button
                type="button"
                className="btn-pill-danger flex-1"
                onClick={confirmDelete}
              >
                {tl('Delete forever')}
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Restore account?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('This will return the item to its active list.')}</p>
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
                {tl('Cancel')}
              </button>
              <button
                type="button"
                className="btn-pill-primary flex-1"
                onClick={confirmRestore}
              >
                {tl('Restore')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef1e9] text-[#77806d]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 5v14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Save changes?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('This will update the saved settings for this section.')}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('Section:')}</span> {confirmAction?.tab}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => {
                  setShowConfirmation(false);
                  setConfirmAction(null);
                }}
              >
                {tl('Cancel')}
              </button>
              <button
                type="button"
                className="btn-pill-primary flex-1"
                onClick={confirmSave}
              >
                {tl('Save')}
              </button>
            </div>
          </div>
        </div>
      )}
      </>
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
