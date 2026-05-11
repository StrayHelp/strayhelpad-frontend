import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { fetchReports } from '../services/adminService';
import { deleteReport } from '../services/reportService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';

export const ReportsPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [selectedReport, setSelectedReport] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [actionToast, setActionToast] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReports();
      setReports(data.map((r) => ({
        id: r.id,
        user: r.reporter_name,
        title: r.description?.slice(0, 40) || '—',
        description: r.description,
        category: tl('Rescue'),
        date: formatDate(r.created_at, settings),
        status: r.status
      })));
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load reports'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [settings?.system?.defaultLanguage, settings?.system?.timezone]);

  const showActionToast = (message) => {
    setActionToast(message);
    setTimeout(() => setActionToast(''), 3000);
  };

  return (
    <Layout title={t('pageReports', 'Reports')}>
      {actionToast && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {actionToast}
        </div>
      )}
      <div className="card-lg">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="section-title">{t('reportsOverview', 'Reports Overview')}</h2>
            <p className="section-subtitle">{tl('Total reports')}: {reports.length}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="btn-outline">
              {tl('Export')}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={tl('Search by title, description, or user')}
              className="input-search"
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa294]">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" stroke="currentColor" strokeWidth="1.6" />
                <path d="m20 20-3.4-3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <div className="filter-pill">
            <span className="filter-label">{tl('Status')}</span>
            <select className="filter-select">
              <option>{tl('All')}</option>
              <option>{tl('Active')}</option>
              <option>{tl('Flagged')}</option>
            </select>
          </div>
          <div className="filter-pill">
            <span className="filter-label">{tl('Date')}</span>
            <select className="filter-select">
              <option>{tl('Any time')}</option>
              <option>{tl('Last 7 days')}</option>
              <option>{tl('Last 30 days')}</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="table-wrap">
          <div className="grid grid-cols-[0.5fr_1fr_1.4fr_2.4fr_1.1fr_1.1fr_1fr_7rem] items-center gap-2 table-head">
            <span>
              <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
            </span>
            <span>{tl('Report ID')}</span>
            <span>{tl('User')}</span>
            <span>{tl('Report')}</span>
            <span>{tl('Category')}</span>
            <span>{tl('Date Posted')}</span>
            <span>{tl('Status')}</span>
            <span className="text-center">{tl('Actions')}</span>
          </div>
          {loading ? (
            <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading reports…')}</div>
          ) : reports.length === 0 ? (
            <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No reports found.')}</div>
          ) : reports.map((report, index) => (
            <div
              key={`${report.id}-${index}`}
              className="grid grid-cols-[0.5fr_1fr_1.4fr_2.4fr_1.1fr_1.1fr_1fr_7rem] items-center gap-2 table-row-item"
            >
              <span>
                <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
              </span>
              <span className="table-id">{report.id}</span>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#e6eadf]" />
                <div>
                  <p className="font-semibold text-[#4b5548]">{report.user}</p>
                  <p className="table-muted">{tl('User')}</p>
                </div>
              </div>
              <button
                type="button"
                className="text-left"
                onClick={() => setSelectedReport(report)}
              >
                <p className="font-semibold text-[#4b5548]">{report.title}</p>
                <p className="text-xs text-[#9aa294] line-clamp-1">{report.description}</p>
              </button>
              <span className="text-sm text-[#7a8476]">{report.category}</span>
              <span className="table-muted">{report.date}</span>
              <span
                className={`badge ${report.status === 'Active' ? 'badge-active' : 'badge-flagged'}`}
              >
                {tl(report.status)}
              </span>
              <div className="flex items-center justify-center gap-2 text-[#77806d]">
                <button
                  className="icon-btn"
                  title={tl('View report')}
                  onClick={() => setSelectedReport(report)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <button
                  className="icon-btn text-[#a25d5d]"
                  title={tl('Delete report')}
                  onClick={() => setDeleteConfirm(report)}
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
          <span>{tl('Total:')} {reports.length} {tl('reports')}</span>
          <div className="flex items-center gap-2">
            <button className="btn-page">
              {tl('Prev')}
            </button>
            <button className="btn-page-active">1</button>
            <button className="btn-page">2</button>
            <button className="btn-page">3</button>
            <button className="btn-page">
              {tl('Next')}
            </button>
          </div>
        </div>
      </div>
      {selectedReport && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="modal-card max-w-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">{tl('Report Details')}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedReport.title}</h3>
                <p className="text-sm text-[#7a8476]">{tl('Reported by')} {selectedReport.user}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#eef1e9] bg-[#fafaf8] p-4 text-sm text-[#5a6457]">
              {selectedReport.description}
            </div>

            <div className="mt-6 grid gap-4 text-sm text-[#5a6457]">
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Report ID')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedReport.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Category')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedReport.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Date Posted')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedReport.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Status')}</span>
                <span
                  className={`badge ${selectedReport.status === 'Active' ? 'badge-active' : 'badge-flagged'}`}
                >
                  {tl(selectedReport.status)}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                className={selectedReport.status === 'Flagged' ? 'btn-outline mr-3' : 'btn-pill-danger mr-3'}
                onClick={() => {
                  const action = selectedReport.status === 'Flagged' ? 'unflagged' : 'flagged';
                  showActionToast(`✓ ${tl('Report')} ${tl(action)}`);
                  setSelectedReport(null);
                }}
              >
                {selectedReport.status === 'Flagged' ? tl('Unflag Report') : tl('Flag Report')}
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setSelectedReport(null)}
              >
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Delete report?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('This action cannot be undone.')}</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('Report:')}</span> {deleteConfirm.title} ({deleteConfirm.id})
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
                    await deleteReport(deleteConfirm.id);
                    showActionToast(`✓ ${tl('Report moved to recycle bin')}`);
                    await load();
                    setDeleteConfirm(null);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || tl('Unable to delete report'));
                  }
                }}
              >
                {tl('Delete')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
