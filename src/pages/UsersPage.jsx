import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export const UsersPage = () => {
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [suspendConfirm, setSuspendConfirm] = useState(null);
  const [actionToast, setActionToast] = useState('');
  const users = [
    {
      id: 'USR-1024',
      name: 'Maya Sinclair',
      email: 'maya.sinclair@strayhelp.org',
      status: 'Active',
      joined: 'Apr 18, 2026'
    },
    {
      id: 'USR-1023',
      name: 'Jonas Reed',
      email: 'jonas.reed@strayhelp.org',
      status: 'Suspended',
      joined: 'Apr 16, 2026'
    },
    {
      id: 'USR-1022',
      name: 'Annie Clarke',
      email: 'annie.clarke@strayhelp.org',
      status: 'Active',
      joined: 'Apr 14, 2026'
    },
    {
      id: 'USR-1021',
      name: 'Carlos Mendez',
      email: 'carlos.mendez@strayhelp.org',
      status: 'Active',
      joined: 'Apr 12, 2026'
    },
    {
      id: 'USR-1020',
      name: 'Jamie Ford',
      email: 'jamie.ford@strayhelp.org',
      status: 'Suspended',
      joined: 'Apr 10, 2026'
    }
  ];

  const showActionToast = (message) => {
    setActionToast(message);
    setTimeout(() => setActionToast(''), 3000);
  };

  return (
    <Layout title="Users">
      {actionToast && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {actionToast}
        </div>
      )}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#4b5548]">User Directory</h2>
            <p className="mt-1 text-sm text-[#7a8476]">Total users: 1,284</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-semibold text-[#6c7669] shadow-sm">
              Export
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder="Search by name or email"
              className="w-full rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 pl-10 text-sm text-[#5a6457] placeholder:text-[#9aa294] shadow-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa294]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="m20 20-3.4-3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 text-sm text-[#5a6457] shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">Status</span>
            <select className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none">
              <option>All</option>
              <option>Active</option>
              <option>Suspended</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
          <div className="grid grid-cols-[0.5fr_1fr_2.4fr_1fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
            <span>
              <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
            </span>
            <span>User ID</span>
            <span>Profile</span>
            <span>Status</span>
            <span>Date Joined</span>
            <span className="text-center">Actions</span>
          </div>
          {users.map((user, index) => (
            <div
              key={`${user.id}-${index}`}
              className="grid grid-cols-[0.5fr_1fr_2.4fr_1fr_1.2fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-4 text-sm text-[#5a6457] transition hover:bg-[#fafaf8]"
            >
              <span>
                <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
              </span>
              <span className="text-xs font-semibold text-[#9aa294]">{user.id}</span>
              <div className="flex items-center gap-3 text-left">
                <div className="h-9 w-9 rounded-full bg-[#e6eadf]" />
                <div>
                  <p className="font-semibold text-[#4b5548]">{user.name}</p>
                  <p className="text-xs text-[#9aa294]">{user.email}</p>
                </div>
              </div>
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  user.status === 'Active'
                    ? 'bg-[#e8f3ea] text-[#2f7a43]'
                    : 'bg-[#fbe9e9] text-[#b83a3a]'
                }`}
              >
                {user.status}
              </span>
              <span className="text-xs text-[#9aa294]">{user.joined}</span>
              <div className="flex items-center justify-center gap-2 text-[#77806d]">
                <button
                  className="icon-btn"
                  title={user.status === 'Active' ? 'Suspend user' : 'Activate user'}
                  onClick={() => setSuspendConfirm(user)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M5 7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  className="icon-btn text-[#a25d5d]"
                  title="Delete user"
                  onClick={() => setDeleteConfirm(user)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M10 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M14 11v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a8476]">
          <span>Showing 1-5 of 1,284 users</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              Prev
            </button>
            <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">1</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">2</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">3</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              Next
            </button>
          </div>
        </div>
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
                <h3 className="text-lg font-semibold text-[#4b5548]">Delete user?</h3>
                <p className="text-sm text-[#9aa294]">This action cannot be undone.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">User:</span> {deleteConfirm.name} ({deleteConfirm.id})
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-pill-danger flex-1"
                onClick={() => {
                  showActionToast('✓ User deleted');
                  setDeleteConfirm(null);
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      {suspendConfirm && (
        <div className="modal-overlay">
          <div className="modal-card max-w-md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f8efd1] text-[#9a7a1f]">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 8v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <path d="M12 16h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#4b5548]">
                  {suspendConfirm.status === 'Active' ? 'Suspend user?' : 'Activate user?'}
                </h3>
                <p className="text-sm text-[#9aa294]">You can change this status again later.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">User:</span> {suspendConfirm.name} ({suspendConfirm.id})
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setSuspendConfirm(null)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn-pill-primary flex-1"
                onClick={() => {
                  const nextAction = suspendConfirm.status === 'Active' ? 'suspended' : 'activated';
                  showActionToast(`✓ User ${nextAction}`);
                  setSuspendConfirm(null);
                }}
              >
                {suspendConfirm.status === 'Active' ? 'Suspend' : 'Activate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};