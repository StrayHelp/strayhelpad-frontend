import React, { useEffect, useState } from 'react';
import { ITAdminLayout } from '../components/ITAdminLayout';
import { fetchITAdminDashboard } from '../services/itAdminService';
import { useSettingsContext } from '../context/SettingsContext';
import { useI18n } from '../hooks/useI18n';

export const ITAdminDashboardPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchITAdminDashboard();
      setStats(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load dashboard'));
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      label: tl('Total Accounts'),
      value: stats?.totalAccounts || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M17 21H3v-2a6 6 0 0 1 12 0v2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M23 21v-2a6 6 0 0 0-9-5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    },
    {
      label: tl('User Accounts'),
      value: stats?.totalUserAccounts || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: 'text-blue-600'
    },
    {
      label: tl('Organization Accounts'),
      value: stats?.totalOrganizationAccounts || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <path d="M3 9l3-3h12l3 3v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 13v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15 13v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 9v-2h6v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      color: 'text-green-600'
    },
    {
      label: tl('Active Accounts'),
      value: stats?.activeAccounts || 0,
      icon: (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    }
  ];

  return (
    <ITAdminLayout title={t('pageITAdminDashboard', 'Dashboard')}>
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card, idx) => (
          <div key={idx} className="rounded-2xl border border-white bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#7a8476]">{card.label}</p>
                {loading ? (
                  <div className="mt-2 h-8 w-16 animate-pulse rounded bg-[#e2e6dc]" />
                ) : (
                  <p className="mt-2 text-3xl font-bold text-[#2c3226]">{card.value}</p>
                )}
              </div>
              <div className="rounded-2xl bg-[#f5f7f3] p-3 text-[#77806d]">{card.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Account Status Overview */}
      <div className="mt-8 rounded-2xl border border-white bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#2c3226]">{tl('Account Status Overview')}</h2>
        
        {loading ? (
          <div className="mt-6 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-4 animate-pulse rounded bg-[#e2e6dc]" />
            ))}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7a8476]">{tl('Active Accounts')}</span>
                <span className="font-semibold text-[#2c3226]">{stats?.activeAccounts || 0}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e2e6dc]">
                <div 
                  className="h-full bg-green-500 transition-all"
                  style={{ width: stats?.totalAccounts > 0 ? `${(stats?.activeAccounts / stats?.totalAccounts) * 100}%` : '0%' }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#7a8476]">{tl('Suspended Accounts')}</span>
                <span className="font-semibold text-[#2c3226]">{stats?.suspendedAccounts || 0}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e2e6dc]">
                <div 
                  className="h-full bg-red-500 transition-all"
                  style={{ width: stats?.totalAccounts > 0 ? `${(stats?.suspendedAccounts / stats?.totalAccounts) * 100}%` : '0%' }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 rounded-2xl border border-white bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[#2c3226]">{tl('Quick Actions')}</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <a
            href="/it-admin/accounts"
            className="rounded-lg border border-[#e2e6dc] bg-white px-4 py-3 text-center text-sm font-semibold text-[#77806d] hover:bg-[#f5f7f3]"
          >
            {tl('Manage Accounts')}
          </a>
          <a
            href="/it-admin/accounts"
            className="rounded-lg border border-[#e2e6dc] bg-white px-4 py-3 text-center text-sm font-semibold text-[#77806d] hover:bg-[#f5f7f3]"
          >
            {tl('View Audit Log')}
          </a>
        </div>
      </div>
    </ITAdminLayout>
  );
};
