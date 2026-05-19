import React, { useState } from 'react';

export const PasswordResetModal = ({ isOpen, accountName, tempPassword, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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

        <div className="mt-6 rounded-lg border border-[#e2e6dc] bg-[#f5f7f3] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#7a8476]">Temporary Password</p>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 font-mono text-sm font-semibold text-[#2c3226]">{tempPassword}</code>
            <button
              onClick={copyToClipboard}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                copied
                  ? 'bg-green-100 text-green-700'
                  : 'bg-white text-[#5a6457] hover:bg-[#f0f1ee]'
              } border border-[#e2e6dc]`}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs text-amber-800">
            <span className="font-semibold">Note:</span> This password is displayed only once. Save it securely. The user must change it on first login.
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
