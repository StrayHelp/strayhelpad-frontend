import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { deleteUser, fetchUsers, updateUserStatus } from '../services/adminService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';
import { exportToXlsx } from '../utils/exportXlsx';

export const UsersPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [suspendConfirm, setSuspendConfirm] = useState(null);
  const [suspendReason, setSuspendReason] = useState('');
  const [suspendCustomReason, setSuspendCustomReason] = useState('');
  const [actionToast, setActionToast] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
        joined: formatDate(user.created_at, settings),
        rawJoined: user.created_at
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

  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = !search || [u.id, u.name, u.email, u.role, u.status]
      .some(v => String(v ?? '').toLowerCase().includes(q));
    const matchStatus = !statusFilter || u.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) =>
    new Date(b.rawJoined || 0) - new Date(a.rawJoined || 0)
  );
  const totalPages = Math.max(1, Math.ceil(sortedUsers.length / ITEMS_PER_PAGE));
  const pageUsers = sortedUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <Layout title={t('pageUsers', 'Users')} searchValue={search} onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}>
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
            <button
              className="rounded-full border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-semibold text-[#6c7669] shadow-sm"
              onClick={() => exportToXlsx(users, 'users_export.xlsx', [
                { label: 'User ID',    key: 'id' },
                { label: 'Name',       key: 'name' },
                { label: 'Email',      key: 'email' },
                { label: 'Role',       key: 'role' },
                { label: 'Status',     key: 'status' },
                { label: 'Date Joined',key: 'joined' },
              ])}
            >
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
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
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
            <select
              className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none border-0 appearance-none"
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">{tl('All')}</option>
              <option value="Active">{tl('Active')}</option>
              <option value="Suspended">{tl('Suspended')}</option>
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
          ) : filteredUsers.length === 0 ? (
            <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No users found.')}</div>
          ) : pageUsers.map((user, index) => (
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
                  title={tl('Archive user')}
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
          <span>{tl('Showing')} {pageUsers.length} {tl('of')} {filteredUsers.length} {tl('users')} &bull; {tl('Page')} {currentPage} {tl('of')} {totalPages}</span>
          <div className="flex items-center gap-2">
            <button
              className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            >
              {tl('Prev')}
            </button>
            <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">{currentPage}</button>
            <button
              className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            >
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Archive user?')}</h3>
                <p className="text-sm text-[#9aa294]">The user will be moved to the Archive page. You can restore them at any time from Settings → Archive.</p>
              </div>
            </div>

            <div className="mt-4 px-6 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('User:')}</span> {deleteConfirm.name} ({deleteConfirm.id})
            </div>

            <div className="mt-6 px-6 pb-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => setDeleteConfirm(null)}
              >
                {tl('Cancel')}
              </button>
              <button
                type="button"
                className="btn-danger flex-1"
                onClick={async () => {
                  try {
                    await deleteUser(deleteConfirm.id);
                    showActionToast(`✓ ${tl('User moved to archive')}`);
                    await loadUsers();
                    setDeleteConfirm(null);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || tl('Failed to delete user'));
                  }
                }}
              >
                {tl('Archive')}
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

            <div className="mt-4 px-6 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('User:')}</span> {suspendConfirm.name} ({suspendConfirm.id})
            </div>

            {suspendConfirm.status === 'Active' && (
              <div className="mt-4 px-6">
                <p className="mb-2 text-sm font-semibold text-[#4b5548]">{tl('Reason for suspension')} <span className="text-red-500">*</span></p>
                <div className="flex flex-wrap gap-2">
                  {['Violation of Terms of Service', 'Fraudulent Activity', 'Abusive Behavior', 'Other'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition outline-none focus:outline-none ${
                        suspendReason === r
                          ? 'border-[#77806d] bg-[#77806d] text-white'
                          : 'border-[#e2e6dc] bg-white text-[#6c7669] hover:bg-[#f5f7f3]'
                      }`}
                      onClick={() => { setSuspendReason(r); if (r !== 'Other') setSuspendCustomReason(''); }}
                    >
                      {tl(r)}
                    </button>
                  ))}
                </div>
                {suspendReason === 'Other' && (
                  <textarea
                    className="mt-3 w-full rounded-xl border border-[#e2e6dc] px-3 py-2 text-sm text-[#5a6457] placeholder:text-[#9aa294] focus:outline-none focus:ring-1 focus:ring-[#77806d]"
                    rows={3}
                    placeholder={tl('Enter custom reason…')}
                    value={suspendCustomReason}
                    onChange={e => setSuspendCustomReason(e.target.value)}
                  />
                )}
              </div>
            )}

            <div className="mt-6 px-6 pb-6 flex gap-3">
              <button
                type="button"
                className="btn-secondary flex-1"
                onClick={() => { setSuspendConfirm(null); setSuspendReason(''); setSuspendCustomReason(''); }}
              >
                {tl('Cancel')}
              </button>
              <button
                type="button"
                className={`flex-1 ${suspendConfirm.status === 'Active' ? 'btn-danger' : 'btn-primary'}`}
                disabled={suspendConfirm.status === 'Active' && (!suspendReason || (suspendReason === 'Other' && !suspendCustomReason.trim()))}
                onClick={async () => {
                  try {
                    const nextStatus = suspendConfirm.status === 'Active' ? 'Suspended' : 'Active';
                    const reason = nextStatus === 'Suspended'
                      ? (suspendReason === 'Other' ? suspendCustomReason.trim() : suspendReason)
                      : undefined;
                    await updateUserStatus(suspendConfirm.id, nextStatus, reason);
                    showActionToast(`✓ ${tl('User')} ${nextStatus === 'Suspended' ? tl('suspended') : tl('activated')}`);
                    await loadUsers();
                    setSuspendConfirm(null);
                    setSuspendReason('');
                    setSuspendCustomReason('');
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