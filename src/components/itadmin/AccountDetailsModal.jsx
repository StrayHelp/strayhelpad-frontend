import React, { useState, useEffect } from 'react';

export const AccountDetailsModal = ({
  isOpen,
  account,
  onClose,
  onResetPassword,
  onStatusChange,
  isLoading = false
}) => {
  const [localAccount, setLocalAccount] = useState(account);

  useEffect(() => {
    if (account) {
      setLocalAccount(account);
    }
  }, [account]);

  if (!isOpen || !localAccount) return null;

  const isActive = localAccount.status === 'Active';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-auto p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-white bg-white shadow-xl my-8">
        <div className="sticky top-0 flex items-center justify-between border-b border-[#e2e6dc] bg-white px-6 py-4 rounded-t-2xl">
          <div>
            <h2 className="text-xl font-semibold text-[#2c3226]">Account Details</h2>
            <p className="mt-1 text-sm text-[#5a6457]">{localAccount.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9aa294] hover:text-[#5a6457]"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#7a8476]">Basic Information</h3>
            <div className="mt-4 space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#7a8476]">Full Name</label>
                <p className="mt-1 text-sm font-medium text-[#2c3226]">{localAccount.name}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#7a8476]">Account ID</label>
                <p className="mt-1 text-sm font-mono text-[#5a6457]">{localAccount.id}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#7a8476]">Email Address</label>
                <p className="mt-1 text-sm text-[#2c3226]">{localAccount.email}</p>
                <p className="mt-0.5 text-xs text-[#9aa294]">Email address cannot be changed by IT Admin.</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="border-t border-[#e2e6dc] pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#7a8476]">Account Status</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-[#e2e6dc] bg-[#f5f7f3] p-3">
                <div>
                  <p className="text-sm font-medium text-[#2c3226]">{isActive ? 'Active' : 'Suspended'}</p>
                  <p className="text-xs text-[#7a8476]">{isActive ? 'Account is active' : 'Account is suspended'}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {isActive ? '● Active' : '● Suspended'}
                </span>
              </div>
              <button
                onClick={() => onStatusChange(isActive ? 'Suspended' : 'Active')}
                disabled={isLoading}
                className={`w-full rounded-lg px-4 py-2.5 text-sm font-medium text-white transition ${
                  isActive
                    ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                    : 'bg-green-600 hover:bg-green-700 disabled:bg-green-400'
                } disabled:cursor-not-allowed`}
              >
                {isLoading ? '...' : isActive ? 'Suspend Account' : 'Activate Account'}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="border-t border-[#e2e6dc] pt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-[#7a8476]">Account Information</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7a8476]">Role</span>
                <span className="font-medium text-[#2c3226]">{localAccount.role || 'User'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8476]">Created</span>
                <span className="font-medium text-[#2c3226]">{localAccount.createdAt || '—'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7a8476]">Last Login</span>
                <span className="font-medium text-[#2c3226]">{localAccount.lastLogin || 'Never'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="sticky bottom-0 border-t border-[#e2e6dc] bg-white px-6 py-4 rounded-b-2xl">
          <button
            onClick={onResetPassword}
            disabled={isLoading}
            className="w-full rounded-lg border border-[#e2e6dc] bg-white px-4 py-2.5 text-sm font-medium text-[#5a6457] hover:bg-[#f5f7f3] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset Password
          </button>
        </div>
      </div>
    </div>
  );
};
