import React from 'react';

export const PasswordResetModal = ({ isOpen, accountName, accountEmail, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-md rounded-2xl border border-white bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#2c3226]">Password Reset Successful</h2>
            <p className="mt-1 text-sm text-[#5a6457]">Account: <span className="font-medium">{accountName}</span></p>
          </div>
          <button
            onClick={onClose}
            className="text-[#9aa294] hover:text-[#5a6457]"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-green-800">Temporary password sent</p>
              <p className="mt-1 text-sm text-green-700">
                A temporary password has been sent to{' '}
                <span className="font-semibold">{accountEmail || 'the account email address'}</span>.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Note:</span> The user must check their inbox and change their password after first login.
          </p>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-[#77806d] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#66715b]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
