import React, { useEffect, useState } from 'react';
import { ITAdminLayout } from '../components/ITAdminLayout';
import { fetchITAdminAuditLogs } from '../services/itAdminService';
import { useI18n } from '../hooks/useI18n';

export const ITAdminAuditLogPage = () => {
  const { tl } = useI18n();
  const [auditLogs, setAuditLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchITAdminAuditLogs(1, 200);
      setAuditLogs(data.logs || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load audit logs'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let filtered = [...auditLogs];

    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter(log =>
        log.account.toLowerCase().includes(searchLower) ||
        log.performedBy.toLowerCase().includes(searchLower) ||
        log.details.toLowerCase().includes(searchLower)
      );
    }

    // Action filter
    if (actionFilter) {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    setFilteredLogs(filtered);
  }, [auditLogs, searchQuery, actionFilter]);

  const formatTime = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getActionColor = (action) => {
    if (action.includes('Suspended')) return 'bg-red-100 text-red-700';
    if (action.includes('Password')) return 'bg-yellow-100 text-yellow-700';
    if (action.includes('Email')) return 'bg-blue-100 text-blue-700';
    if (action.includes('Activated')) return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <ITAdminLayout title={tl('Audit Log')} searchValue={searchQuery} onSearchChange={(v) => setSearchQuery(v)}>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-[#2c3226]">{tl('Audit Log')}</h2>
          <p className="mt-1 text-sm text-[#7a8476]">{tl('Track all administrative actions and account changes')}</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[250px]">
            <input
              type="text"
              placeholder={tl('Search logs')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 pl-10 text-sm text-[#5a6457] placeholder:text-[#9aa294] shadow-sm"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa294]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                <path d="m20 20-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 text-sm text-[#5a6457] shadow-sm focus:outline-none appearance-none"
          >
            <option value="">{tl('All Actions')}</option>
            <option value="Account Suspended">{tl('Account Suspended')}</option>
            <option value="Password Reset">{tl('Password Reset')}</option>
            <option value="Email Updated">{tl('Email Updated')}</option>
            <option value="Account Activated">{tl('Account Activated')}</option>
          </select>
        </div>

        {/* Timeline */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-lg bg-[#e2e6dc]" />
            ))}
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-[#7a8476]">{tl('No audit logs found')}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLogs.map((log) => (
              <div key={log.id} className="flex gap-4 border-l-2 border-[#e2e6dc] pl-4 pb-4">
                <div className="mt-1 flex-shrink-0">
                  <div className={`inline-flex rounded-full p-2 ${getActionColor(log.action)}`}>
                    {log.action.includes('Suspended') && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="2" rx="1" fill="currentColor" />
                      </svg>
                    )}
                    {log.action.includes('Password') && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {log.action.includes('Email') && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                        <path d="M2 6l10 7.5L22 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {log.action.includes('Activated') && (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#2c3226]">{log.action}</h3>
                      <p className="mt-1 text-sm text-[#5a6457]">{log.details}</p>
                      <div className="mt-2 flex flex-wrap gap-4 text-xs text-[#7a8476]">
                        <span><strong>Account:</strong> {log.account}</span>
                        <span><strong>By:</strong> {log.performedBy}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[#9aa294]">{formatTime(log.timestamp)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ITAdminLayout>
  );
};
