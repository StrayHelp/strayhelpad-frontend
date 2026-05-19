import React from 'react';

export const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative m-4 w-full max-w-md rounded-2xl border border-white bg-white p-6 shadow-xl">
        <h2 className="text-xl font-semibold text-[#2c3226]">{title}</h2>
        <p className="mt-3 text-sm text-[#5a6457]">{message}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 rounded-lg border border-[#e2e6dc] bg-white px-4 py-2.5 text-sm font-medium text-[#5a6457] hover:bg-[#f5f7f3] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition ${
              isDangerous
                ? 'bg-red-600 hover:bg-red-700 disabled:bg-red-400'
                : 'bg-[#77806d] hover:bg-[#66715b] disabled:bg-[#9aa294]'
            } disabled:cursor-not-allowed`}
          >
            {isLoading ? '...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
