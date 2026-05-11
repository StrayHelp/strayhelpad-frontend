import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  approveOrganization,
  deleteOrganization,
  fetchOrganizations,
  rejectOrganization,
  updateOrganizationStatus
} from '../services/adminService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';

export const OrganizationsPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [suspendConfirm, setSuspendConfirm] = useState(null);
  const [actionToast, setActionToast] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrganizations();
      setApplications(data.map((o) => {
        const normalizedStatus = o.status === 'Verified'
          ? 'Active'
          : o.status === 'Rejected'
            ? 'Suspended'
            : 'Pending';

        return {
          id: o.id,
          name: o.name,
          contactName: o.contact_name,
          contactEmail: o.contact_email,
          contactPhone: o.contact_phone || '—',
          location: o.location || '—',
          description: '',
          status: normalizedStatus,
          applied: formatDate(o.created_at, settings),
          documents: []
        };
      }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load organizations'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, [settings?.system?.defaultLanguage, settings?.system?.timezone]);

  const approvedOrganizations = applications.filter(a => a.status === 'Active');

  const statusStyles = {
    Pending: 'badge badge-pending',
    Active: 'badge badge-active',
    Suspended: 'badge badge-rejected'
  };

  const handleApprove = async (application) => {
    try {
      await approveOrganization(application.id);
      showActionToast(`✓ ${application.name} ${tl('approved')}`);
      await loadOrganizations();
      setSelectedApplication(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to approve organization'));
    }
  };

  const handleReject = async (application) => {
    try {
      await rejectOrganization(application.id, 'Rejected by admin review');
      showActionToast(`✓ ${application.name} ${tl('rejected')}`);
      await loadOrganizations();
      setSelectedApplication(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to reject organization'));
    }
  };

  const showActionToast = (message) => {
    setActionToast(message);
    setTimeout(() => setActionToast(''), 3000);
  };

  return (
    <Layout title={t('pageOrganizations', 'Organizations')}>
      {actionToast && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {actionToast}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-6">
        <div className="card-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="section-title">{t('orgApplications', 'Organization Applications')}</h2>
              <p className="section-subtitle">{tl('Total:')} {applications.length}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-outline">{tl('Export')}</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <input type="text" placeholder={tl('Search organization or email')} className="input-search" />
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
                <option>{tl('Pending')}</option>
                <option>{tl('Rejected')}</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <div className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_1fr_7rem] items-center gap-2 table-head">
              <span><input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" /></span>
              <span>{tl('Application ID')}</span>
              <span>{tl('Organization')}</span>
              <span>{tl('Contact Person')}</span>
              <span>{tl('Date Applied')}</span>
              <span>{tl('Status')}</span>
              <span className="text-center">{tl('Actions')}</span>
            </div>
            {loading ? (
              <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading organizations…')}</div>
            ) : applications.length === 0 ? (
              <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No applications found.')}</div>
            ) : applications.map((row, index) => (
              <div
                key={`${row.id}-${index}`}
                className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_1fr_7rem] items-center gap-2 table-row-item"
                onClick={() => setSelectedApplication(row)}
              >
                <span onClick={(event) => event.stopPropagation()}>
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
                </span>
                <span className="table-id">{row.id}</span>
                <span className="font-medium text-[#4b5548]">{row.name}</span>
                <div>
                  <p className="font-semibold text-[#4b5548]">{row.contactName}</p>
                  <p className="table-muted">{row.contactEmail}</p>
                </div>
                <span className="table-muted">{row.applied}</span>
                <span className={statusStyles[row.status] || 'badge badge-pending'}>{tl(row.status)}</span>
                <div className="flex items-center justify-center gap-2 text-[#77806d]" onClick={(event) => event.stopPropagation()}>
                  <button className="icon-btn" title={tl('View application')} onClick={() => setSelectedApplication(row)}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a8476]">
            <span>{tl('Total:')} {applications.length} {tl('applications')}</span>
          </div>
        </div>

        <div className="card-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="section-title">{t('approvedOrganizations', 'Approved Organizations')}</h2>
              <p className="section-subtitle">{tl('Total:')} {approvedOrganizations.length}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-outline">{tl('Export')}</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <input type="text" placeholder={tl('Search organization or email')} className="input-search" />
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
                <option>{tl('Suspended')}</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <div className="grid grid-cols-[0.5fr_1fr_1.6fr_2fr_1fr_1fr_7rem] items-center gap-2 table-head">
              <span><input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" /></span>
              <span>{tl('Org ID')}</span>
              <span>{tl('Organization')}</span>
              <span>{tl('Contact Person')}</span>
              <span>{tl('Status')}</span>
              <span>{tl('Approved Date')}</span>
              <span className="text-center">{tl('Actions')}</span>
            </div>
            {loading ? (
              <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading…')}</div>
            ) : approvedOrganizations.length === 0 ? (
              <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No approved organizations.')}</div>
            ) : approvedOrganizations.map((org, index) => (
              <div key={`${org.id}-${index}`} className="grid grid-cols-[0.5fr_1fr_1.6fr_2fr_1fr_1fr_7rem] items-center gap-2 table-row-item">
                <span><input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" /></span>
                <span className="table-id">{org.id}</span>
                <span className="font-medium text-[#4b5548]">{org.name}</span>
                <div>
                  <p className="font-semibold text-[#4b5548]">{org.contactName}</p>
                  <p className="table-muted">{org.contactEmail}</p>
                </div>
                <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${org.status === 'Active' ? 'bg-[#e8f3ea] text-[#2f7a43]' : 'bg-[#fbe9e9] text-[#b83a3a]'}`}>
                  {tl(org.status)}
                </span>
                <span className="table-muted">{org.applied}</span>
                <div className="flex items-center justify-center gap-2 text-[#77806d]">
                  <button className="icon-btn" title={org.status === 'Active' ? tl('Suspend organization') : tl('Activate organization')} onClick={() => setSuspendConfirm(org)}>
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M5 7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button className="icon-btn text-[#a25d5d]" title={tl('Delete organization')} onClick={() => setDeleteConfirm(org)}>
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
            <span>{tl('Total:')} {approvedOrganizations.length} {tl('approved organizations')}</span>
          </div>
        </div>
      </div>

      {selectedApplication && (
        <div className="modal-overlay" onClick={() => setSelectedApplication(null)}>
          <div className="modal-card max-w-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">{tl('Application Details')}</p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedApplication.name}</h3>
                <p className="text-sm text-[#7a8476]">{selectedApplication.location}</p>
              </div>
              <span className={statusStyles[selectedApplication.status] || 'badge badge-pending'}>{tl(selectedApplication.status)}</span>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-[#eef1e9] bg-[#fafaf8] p-4">
                <h4 className="text-sm font-semibold text-[#4b5548]">{tl('Organization Profile')}</h4>
                <p className="mt-3 text-sm leading-6 text-[#5a6457]">{selectedApplication.description || '—'}</p>
                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">{tl('Contact Person')}</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.contactName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">{tl('Email')}</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.contactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">{tl('Phone')}</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.contactPhone}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">{tl('Location')}</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.location}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eef1e9] p-4">
                <h4 className="text-sm font-semibold text-[#4b5548]">{tl('Uploaded Documents')}</h4>
                <div className="mt-4 space-y-3">
                  {selectedApplication.documents.length === 0 ? (
                    <p className="text-sm text-[#9aa294]">{tl('No documents submitted.')}</p>
                  ) : selectedApplication.documents.map((document) => (
                    <div key={document.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6eadf] bg-white px-3 py-3 text-sm text-[#5a6457]">
                      <div>
                        <p className="font-semibold text-[#4b5548]">{document.name}</p>
                        <p className="text-xs text-[#9aa294]">{document.type} · {document.size}</p>
                      </div>
                      <button type="button" className="btn-pill-outline-sm" onClick={() => setSelectedDocument(document)}>{tl('View')}</button>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button type="button" className="btn-pill-primary flex-1" onClick={() => handleApprove(selectedApplication)}>{tl('Accept')}</button>
                  <button type="button" className="btn-pill-danger flex-1" onClick={() => handleReject(selectedApplication)}>{tl('Reject')}</button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button type="button" className="btn-outline" onClick={() => setSelectedApplication(null)}>{tl('Close')}</button>
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Delete organization?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('This action cannot be undone.')}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('Organization:')}</span> {deleteConfirm.name} ({deleteConfirm.id})
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" className="btn-secondary flex-1" onClick={() => setDeleteConfirm(null)}>{tl('Cancel')}</button>
              <button
                type="button"
                className="btn-pill-danger flex-1"
                onClick={async () => {
                  try {
                    await deleteOrganization(deleteConfirm.id);
                    showActionToast(`✓ ${tl('Organization moved to recycle bin')}`);
                    await loadOrganizations();
                    setDeleteConfirm(null);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || tl('Unable to delete organization'));
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{suspendConfirm.status === 'Active' ? tl('Suspend organization?') : tl('Activate organization?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('You can change this status again later.')}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('Organization:')}</span> {suspendConfirm.name} ({suspendConfirm.id})
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" className="btn-secondary flex-1" onClick={() => setSuspendConfirm(null)}>{tl('Cancel')}</button>
              <button
                type="button"
                className="btn-pill-primary flex-1"
                onClick={async () => {
                  try {
                    const nextStatus = suspendConfirm.status === 'Active' ? 'Suspended' : 'Active';
                    await updateOrganizationStatus(suspendConfirm.id, nextStatus);
                    showActionToast(`✓ ${tl('Organization')} ${nextStatus === 'Suspended' ? tl('suspended') : tl('activated')}`);
                    await loadOrganizations();
                    setSuspendConfirm(null);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || tl('Unable to update organization status'));
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
