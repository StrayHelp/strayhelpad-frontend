import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { deleteUser, fetchUsers, updateUserStatus } from '../services/adminService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';

export const UsersPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [suspendConfirm, setSuspendConfirm] = useState(null);
  const [actionToast, setActionToast] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchUsers();
      setUsers(data.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.account_status || 'Active',
        joined: formatDate(user.created_at, settings)
      })));
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load users'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [settings?.system?.defaultLanguage, settings?.system?.timezone]);

  const showActionToast = (message) => {
    setActionToast(message);
    setTimeout(() => setActionToast(''), 3000);
  };

  return (
    <Layout title={t('pageUsers', 'Users')}>
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
            <h2 className="text-2xl font-semibold text-[#4b5548]">{t('usersDirectory', 'User Directory')}</h2>
            <p className="mt-1 text-sm text-[#7a8476]">{tl('Total users')}: {users.length}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-semibold text-[#6c7669] shadow-sm">
              {tl('Export')}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={tl('Search by name or email')}
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">{tl('Status')}</span>
            <select className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none">
              <option>{tl('All')}</option>
              <option>{tl('Active')}</option>
              <option>{tl('Suspended')}</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
          <div className="grid grid-cols-[0.5fr_1fr_2.4fr_1fr_1.2fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
            <span>
              <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
            </span>
            <span>{tl('User ID')}</span>
            <span>{tl('Profile')}</span>
            <span>{tl('Status')}</span>
            <span>{tl('Date Joined')}</span>
            <span className="text-center">{tl('Actions')}</span>
          </div>
          {loading ? (
            <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading users…')}</div>
          ) : users.length === 0 ? (
            <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No users found.')}</div>
          ) : users.map((user, index) => (
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
                {tl(user.status)}
              </span>
              <span className="text-xs text-[#9aa294]">{user.joined}</span>
              <div className="flex items-center justify-center gap-2 text-[#77806d]">
                <button
                  className="icon-btn"
                  title={user.status === 'Active' ? tl('Suspend user') : tl('Activate user')}
                  onClick={() => setSuspendConfirm(user)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M5 7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </button>
                <button
                  className="icon-btn text-[#a25d5d]"
                  title={tl('Delete user')}
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
          <span>{tl('Total:')} {users.length} {tl('users')}</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              {tl('Prev')}
            </button>
            <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">1</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">2</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">3</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              {tl('Next')}
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Delete user?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('This action cannot be undone.')}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('User:')}</span> {deleteConfirm.name} ({deleteConfirm.id})
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                {tl('Cancel')}
              </button>
              <button
                type="button"
                className="btn-pill-danger flex-1"
                onClick={async () => {
                  try {
                    await deleteUser(deleteConfirm.id);
                    showActionToast(`✓ ${tl('User moved to recycle bin')}`);
                    await loadUsers();
                    setDeleteConfirm(null);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || tl('Failed to delete user'));
                  }
                }}
              >
                {tl('Delete')}
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
                  {suspendConfirm.status === 'Active' ? tl('Suspend user?') : tl('Activate user?')}
                </h3>
                <p className="text-sm text-[#9aa294]">{tl('You can change this status again later.')}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('User:')}</span> {suspendConfirm.name} ({suspendConfirm.id})
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setSuspendConfirm(null)}
              >
                {tl('Cancel')}
              </button>
              <button
                type="button"
                className="btn-pill-primary flex-1"
                onClick={async () => {
                  try {
                    const nextStatus = suspendConfirm.status === 'Active' ? 'Suspended' : 'Active';
                    await updateUserStatus(suspendConfirm.id, nextStatus);
                    showActionToast(`✓ ${tl('User')} ${nextStatus === 'Suspended' ? tl('suspended') : tl('activated')}`);
                    await loadUsers();
                    setSuspendConfirm(null);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || tl('Failed to update user status'));
                  }
                }}
              >
                {suspendConfirm.status === 'Active' ? tl('Suspend') : tl('Activate')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};