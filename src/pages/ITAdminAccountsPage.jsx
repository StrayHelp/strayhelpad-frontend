import React, { useEffect, useState, useCallback } from 'react';
import { ITAdminLayout } from '../components/ITAdminLayout';
import { ConfirmationDialog } from '../components/itadmin/ConfirmationDialog';
import { PasswordResetModal } from '../components/itadmin/PasswordResetModal';
import { AccountDetailsModal } from '../components/itadmin/AccountDetailsModal';
import { Toast } from '../components/itadmin/Toast';
import { StatusBadge } from '../components/itadmin/StatusBadge';
import {
  fetchAccounts,
  fetchAccountDetails,
  resetAccountPassword,
  updateAccountStatus,
  updateAccountEmail
} from '../services/itAdminService';
import { useI18n } from '../hooks/useI18n';

export const ITAdminAccountsPage = () => {
  const { tl } = useI18n();
  
  // State Management
  const [accounts, setAccounts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [accountTypeFilter, setAccountTypeFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // Modal States
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [tempPassword, setTempPassword] = useState('');
  
  // Confirmation Dialog States
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    type: null,
    accountId: null,
    accountName: null,
    isLoading: false
  });

  const loadAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAccounts(pagination.page, pagination.limit, searchQuery, {
        status: statusFilter,
        accountType: accountTypeFilter
      });
      setAccounts(data.accounts || []);
      setPagination(prev => ({
        ...prev,
        total: data.total || 0
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load accounts'));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, accountTypeFilter, tl]);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleViewDetails = async (account) => {
    try {
      const details = await fetchAccountDetails(account.id);
      setSelectedAccount(details);
      setShowDetailsModal(true);
    } catch (err) {
      showToast(tl('Failed to load account details'), 'error');
    }
  };

  const handleStatusChange = (accountId, accountName) => {
    const account = accounts.find(a => a.id === accountId);
    const newStatus = account?.status === 'Active' ? 'Suspended' : 'Active';
    
    setConfirmDialog({
      isOpen: true,
      type: 'status',
      accountId,
      accountName,
      newStatus,
      isLoading: false
    });
  };

  const handlePasswordReset = (accountId, accountName) => {
    setConfirmDialog({
      isOpen: true,
      type: 'password',
      accountId,
      accountName,
      isLoading: false
    });
  };

  const confirmAction = async () => {
    setConfirmDialog(prev => ({ ...prev, isLoading: true }));
    
    try {
      if (confirmDialog.type === 'status') {
        await updateAccountStatus(confirmDialog.accountId, confirmDialog.newStatus);
        await loadAccounts();
        showToast(`Account ${confirmDialog.newStatus === 'Active' ? 'activated' : 'suspended'} successfully`);
      } else if (confirmDialog.type === 'password') {
        const result = await resetAccountPassword(confirmDialog.accountId);
        setTempPassword(result.tempPassword);
        setShowPasswordModal(true);
        showToast('Password reset successful');
      }
    } catch (err) {
      showToast(err.response?.data?.message || tl('Action failed'), 'error');
    } finally {
      setConfirmDialog(prev => ({ ...prev, isOpen: false, isLoading: false }));
    }
  };

  const handleUpdateEmail = async (newEmail) => {
    if (!selectedAccount) return;
    
    try {
      await updateAccountEmail(selectedAccount.id, newEmail);
      setSelectedAccount(prev => ({ ...prev, email: newEmail }));
      await loadAccounts();
      showToast('Email updated successfully');
    } catch (err) {
      showToast(err.response?.data?.message || tl('Failed to update email'), 'error');
    }
  };

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedAccount) return;
    
    try {
      await updateAccountStatus(selectedAccount.id, newStatus);
      setSelectedAccount(prev => ({ ...prev, status: newStatus }));
      await loadAccounts();
      showToast(`Account ${newStatus === 'Active' ? 'activated' : 'suspended'} successfully`);
    } catch (err) {
      showToast(err.response?.data?.message || tl('Failed to update status'), 'error');
    }
  };

  const handleResetPassword = () => {
    if (selectedAccount) {
      setShowDetailsModal(false);
      handlePasswordReset(selectedAccount.id, selectedAccount.name);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <ITAdminLayout title={tl('Account Management')}>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {toast && (
        <div className="mb-6">
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#2c3226]">{tl('Account Directory')}</h2>
            <p className="mt-1 text-sm text-[#7a8476]">
              {tl('Total accounts')}: {pagination.total}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-semibold text-[#6c7669] shadow-sm hover:bg-[#f5f7f3]">
              {tl('Export')}
            </button>
          </div>
        </div>

        {/* Account Type Tabs */}
        <div className="mt-6 flex gap-2 border-b border-[#e2e6dc]">
          <button
            onClick={() => {
              setAccountTypeFilter('');
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`px-4 py-3 font-medium transition relative ${
              accountTypeFilter === ''
                ? 'text-[#77806d]'
                : 'text-[#9aa294] hover:text-[#7a8476]'
            }`}
          >
            {tl('All Accounts')}
            {accountTypeFilter === '' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#77806d]" />
            )}
          </button>
          <button
            onClick={() => {
              setAccountTypeFilter('user');
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition relative ${
              accountTypeFilter === 'user'
                ? 'text-[#77806d]'
                : 'text-[#9aa294] hover:text-[#7a8476]'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
              <path d="M6 20c0-2.666 2.686-5 6-5s6 2.334 6 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {tl('User Accounts')}
            {accountTypeFilter === 'user' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#77806d]" />
            )}
          </button>
          <button
            onClick={() => {
              setAccountTypeFilter('organization');
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition relative ${
              accountTypeFilter === 'organization'
                ? 'text-[#77806d]'
                : 'text-[#9aa294] hover:text-[#7a8476]'
            }`}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <rect x="3" y="4" width="8" height="16" rx="1" stroke="currentColor" strokeWidth="2" />
              <rect x="13" y="9" width="8" height="11" rx="1" stroke="currentColor" strokeWidth="2" />
              <line x1="7" y1="13" x2="7" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {tl('Organization Accounts')}
            {accountTypeFilter === 'organization' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#77806d]" />
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={tl('Search by name or email')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="w-full rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 pl-10 text-sm text-[#5a6457] placeholder:text-[#9aa294] shadow-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa294]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 text-sm text-[#5a6457] shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">{tl('Status')}</span>
            <select 
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="bg-transparent text-sm font-medium text-[#2c3226] focus:outline-none"
            >
              <option value="">{tl('All')}</option>
              <option value="Active">{tl('Active')}</option>
              <option value="Suspended">{tl('Suspended')}</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
          <div className="grid grid-cols-[1fr_2fr_1.5fr_1.2fr_1.2fr_5rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
            <span>{tl('Name')}</span>
            <span>{tl('Email')}</span>
            <span>{tl('Role')}</span>
            <span>{tl('Joined')}</span>
            <span>{tl('Status')}</span>
            <span className="text-right">{tl('Actions')}</span>
          </div>

          {loading ? (
            <div className="space-y-1 px-4 py-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded bg-[#e2e6dc]" />
              ))}
            </div>
          ) : accounts.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-[#7a8476]">{tl('No accounts found')}</p>
            </div>
          ) : (
            <div>
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className="grid grid-cols-[1fr_2fr_1.5fr_1.2fr_1.2fr_5rem] items-center gap-2 border-t border-[#e6eadf] px-4 py-3 hover:bg-[#f9faf8] transition"
                >
                  <span className="text-sm font-medium text-[#2c3226]">{account.name}</span>
                  <span className="text-sm text-[#5a6457]">{account.email}</span>
                  <span className="text-sm text-[#5a6457]">{account.role || 'User'}</span>
                  <span className="text-sm text-[#7a8476]">{account.joined || '—'}</span>
                  <div>
                    <StatusBadge status={account.status} size="sm" />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleViewDetails(account)}
                      className="text-[#77806d] hover:text-[#66715b] rounded px-2 py-1 text-xs font-medium hover:bg-[#f0f1ee]"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                        <circle cx="12" cy="5" r="1" fill="currentColor" />
                        <circle cx="12" cy="12" r="1" fill="currentColor" />
                        <circle cx="12" cy="19" r="1" fill="currentColor" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-[#7a8476]">
              {tl('Page')} {pagination.page} {tl('of')} {totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="rounded-lg border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-medium text-[#5a6457] hover:bg-[#f5f7f3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tl('Previous')}
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
                disabled={pagination.page === totalPages}
                className="rounded-lg border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-medium text-[#5a6457] hover:bg-[#f5f7f3] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {tl('Next')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AccountDetailsModal
        isOpen={showDetailsModal}
        account={selectedAccount}
        onClose={() => setShowDetailsModal(false)}
        onUpdateEmail={handleUpdateEmail}
        onResetPassword={handleResetPassword}
        onStatusChange={handleUpdateStatus}
      />

      <PasswordResetModal
        isOpen={showPasswordModal}
        accountName={selectedAccount?.name}
        tempPassword={tempPassword}
        onClose={() => {
          setShowPasswordModal(false);
          setTempPassword('');
        }}
      />

      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        title={
          confirmDialog.type === 'status'
            ? confirmDialog.newStatus === 'Active'
              ? tl('Activate Account')
              : tl('Suspend Account')
            : tl('Reset Password')
        }
        message={
          confirmDialog.type === 'status'
            ? `Are you sure you want to ${confirmDialog.newStatus === 'Active' ? 'activate' : 'suspend'} ${confirmDialog.accountName}?`
            : `Generate a temporary password for ${confirmDialog.accountName}? They will be required to change it on their next login.`
        }
        confirmText={confirmDialog.type === 'status' ? 'Confirm' : 'Reset Password'}
        isDangerous={confirmDialog.type === 'status' && confirmDialog.newStatus === 'Suspended'}
        onConfirm={confirmAction}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        isLoading={confirmDialog.isLoading}
      />
    </ITAdminLayout>
  );
};
