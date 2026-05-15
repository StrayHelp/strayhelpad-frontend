import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { fetchDashboardStats, fetchDashboardMonitoring, fetchDonations, fetchUsers } from '../services/adminService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';

function formatRelativeTime(timestamp) {
  if (!timestamp) {
    return '—';
  }

  const diffMs = Date.now() - new Date(timestamp).getTime();
  const diffMinutes = Math.max(Math.floor(diffMs / 60000), 0);

  if (diffMinutes < 1) {
    return 'just now';
  }
  if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes === 1 ? '' : 's'} ago`;
  }

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  }

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
}

export const DashboardPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [monitoring, setMonitoring] = useState(null);
  const [recentDonations, setRecentDonations] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsData, donationsData, usersData, monitoringData] = await Promise.all([
        fetchDashboardStats(),
        fetchDonations(),
        fetchUsers(),
        fetchDashboardMonitoring().catch(() => null)
      ]);

      setStats(statsData);
      setMonitoring(monitoringData);
      setRecentDonations(donationsData.slice(0, 4).map(d => ({
        donor: d.donor_name,
        org: d.organization_name || '—',
        amount: formatCurrency(d.amount, settings),
        method: d.payment_method ? tl(d.payment_method) : '—',
        date: formatDate(d.created_at, settings)
      })));
      setRecentUsers(usersData.slice(0, 4).map(u => ({
        name: u.name,
        role: u.role,
        meta: `${u.role} · ${formatDate(u.created_at, settings)}`,
        email: u.email,
        phone: '—',
        location: '—',
        joined: formatDate(u.created_at, settings),
        status: u.account_status || 'Active'
      })));
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load dashboard'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [settings?.system?.defaultLanguage, settings?.system?.timezone]);

  const summaryCards = [
    {
      label: tl('Total Users'),
      value: stats?.users || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M16 11a4 4 0 1 0-8 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M4 20a8 8 0 0 1 16 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="7" r="3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    },
    {
      label: tl('Total Donations'),
      value: stats?.donations || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <rect x="3" y="6" width="18" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="M3 10h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M7 15h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: tl('Reports Count'),
      value: stats?.reports || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M14 4v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 12h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 16h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    },
    {
      label: tl('Organizations'),
      value: stats?.organizations || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M3 20h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M5 20V8l7-4 7 4v12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    }
  ];

  return (
    <Layout title={t('pageDashboard', 'Dashboard')}>
      <div className="grid gap-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((stat) => (
            <div key={stat.label} className="card-md">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-[#7a8476]">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-[#4b5548]">{loading ? '...' : stat.value}</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6eadf] text-[#77806d]">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="card-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#4b5548]">{tl('Recent Donations')}</h2>
              <button className="btn-pill-muted">{tl('See all')}</button>
            </div>

            <div className="table-wrap">
              <div className="grid grid-cols-[1.4fr_1.6fr_0.9fr_0.9fr_1fr] items-center table-head">
                <span>{tl('Donor')}</span>
                <span>{tl('Organization')}</span>
                <span>{tl('Method')}</span>
                <span className="text-right pr-4">{tl('Amount')}</span>
                <span className="pl-4">{tl('Date')}</span>
              </div>
              {loading ? (
                <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading...')}</div>
              ) : recentDonations.length === 0 ? (
                <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No donations yet.')}</div>
              ) : recentDonations.map((row, index) => (
                <div key={`${row.donor}-${index}`} className="grid grid-cols-[1.4fr_1.6fr_0.9fr_0.9fr_1fr] items-center table-row-item">
                  <span className="font-semibold text-[#4b5548]">{row.donor}</span>
                  <span>{row.org}</span>
                  <span className="inline-flex w-fit items-center rounded-full border border-[#e2e6dc] bg-[#fafaf8] px-3 py-1 text-xs font-semibold text-[#6c7669]">
                    {row.method}
                  </span>
                  <span className="justify-self-end pr-4 font-semibold text-[#4b5548]">{row.amount}</span>
                  <span className="pl-4 text-xs text-[#9aa294]">{row.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="card-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#4b5548]">{tl('Recent Users')}</h2>
              <button className="btn-pill-muted">{tl('See all')}</button>
            </div>

            <div className="mt-4 space-y-4">
              {loading ? (
                <div className="text-center text-sm text-[#7a8476]">{tl('Loading...')}</div>
              ) : recentUsers.length === 0 ? (
                <div className="text-center text-sm text-[#7a8476]">{tl('No users yet.')}</div>
              ) : recentUsers.map((user, index) => (
                <div key={`${user.name}-${index}`} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-[#e6eadf]" />
                    <div>
                      <p className="text-sm font-semibold text-[#4b5548]">{user.name}</p>
                      <p className="text-xs text-[#9aa294]">{user.meta}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[#77806d]">
                    <button
                      className="icon-btn"
                      title={tl('View user')}
                      onClick={() => setSelectedUser(user)}
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                        <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card-lg">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-[#4b5548]">{tl('Logging & Monitoring')}</h2>
            <button className="btn-pill-muted">{tl('View logs')}</button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_1.8fr]">
            <div className="rounded-2xl border border-[#ebefe4] bg-[#f8faf5] p-4">
              <p className="text-xs font-semibold tracking-wide text-[#8f9789]">{monitoring?.auditSummary?.title || 'SECURE AUDIT LOGGING'}</p>
              <p className="mt-2 text-sm text-[#6f796b]">
                {monitoring?.auditSummary?.description || 'Transaction events, admin actions, and system changes are captured with tamper-evident hashing.'}
              </p>

              <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full border border-[#dde5d3] bg-white px-3 py-1 font-semibold text-[#6f796b]">
                  {`${tl('Retention')}: ${monitoring?.auditSummary?.retentionDays || 365} ${tl('days')}`}
                </span>
                <span className="rounded-full border border-[#dde5d3] bg-white px-3 py-1 font-semibold text-[#6f796b]">
                  {monitoring?.auditSummary?.encryption || 'AES-256 at rest'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {(monitoring?.events || []).map((event) => (
                <div key={event.id} className="flex items-start justify-between rounded-xl border border-[#edf1e8] bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#4b5548]">{event.title}</p>
                    <p className="text-xs text-[#97a08f]">{`${event.source} - ${formatRelativeTime(event.occurredAt)}`}</p>
                  </div>
                  <span className="rounded-full border border-[#e2e7da] bg-[#f7f9f3] px-3 py-1 text-xs font-semibold text-[#6f796b]">
                    {event.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-card max-w-lg" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">{tl('User Details')}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedUser.name}</h3>
                <p className="text-sm text-[#7a8476]">{selectedUser.role}</p>
              </div>
              <span className="badge-neutral">{selectedUser.status}</span>
            </div>

            <div className="mt-6 grid gap-4 text-sm text-[#5a6457]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#9aa294]">{tl('Email')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedUser.email}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[#9aa294]">{tl('Joined')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedUser.joined}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button type="button" className="btn-outline" onClick={() => setSelectedUser(null)}>
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
