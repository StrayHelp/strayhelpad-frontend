import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import {
  approveOrganization,
  deleteOrganization,
  fetchOrganizations,
  rejectOrganization,
  updateOrganizationStatus
} from '../services/adminService';
import { fetchPendingKyc } from '../services/kycService';
import { exportToXlsx } from '../utils/exportXlsx';
import { useSettingsContext } from '../context/SettingsContext';
import { formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';

const toTitleLabel = (value) => String(value)
  .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
  .replace(/[_-]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .replace(/^./, (match) => match.toUpperCase());

const getUploadsOrigin = () => {
  const explicitOrigin = String(import.meta.env.VITE_UPLOADS_ORIGIN || '').trim();
  if (explicitOrigin) {
    return explicitOrigin.replace(/\/+$/, '');
  }

  const apiBaseUrl = String(import.meta.env.VITE_API_BASE_URL || '').trim();
  if (apiBaseUrl) {
    try {
      return new URL(apiBaseUrl).origin;
    } catch {
      // Fall through to local default when API base URL is invalid.
    }
  }

  return `${window.location.protocol}//${window.location.hostname}:5000`;
};

const resolveDocumentUrl = (rawUrl) => {
  if (!rawUrl) {
    return '';
  }

  const cleaned = String(rawUrl).trim().replace(/^this\./, '');
  const hasFileExtension = /\.[a-z0-9]{2,6}(\?|#|$)/i.test(cleaned);

  if (/^https?:\/\//i.test(cleaned)) {
    try {
      const absoluteUrl = new URL(cleaned);
      if (absoluteUrl.pathname.startsWith('/uploads/')) {
        const baseOrigin = getUploadsOrigin();
        return `${baseOrigin}${absoluteUrl.pathname}${absoluteUrl.search}${absoluteUrl.hash}`;
      }
    } catch {
      // Ignore parse failures and return original value.
    }
    return cleaned;
  }

  if (/^\/\//.test(cleaned)) {
    return `${window.location.protocol}${cleaned}`;
  }

  if (cleaned.startsWith('/uploads') || cleaned.startsWith('uploads/')) {
    const baseOrigin = getUploadsOrigin();
    const uploadsPath = cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
    return `${baseOrigin}${uploadsPath}`;
  }

  if (!cleaned.includes('/') && hasFileExtension) {
    const baseOrigin = getUploadsOrigin();
    return `${baseOrigin}/uploads/${cleaned}`;
  }

  return cleaned;
};

const getDocumentUrl = (document) => {
  if (typeof document === 'string') {
    return resolveDocumentUrl(document);
  }

  return resolveDocumentUrl(document?.url || document?.file_url || document?.path || document?.link || document?.src || '');
};

const getDocumentName = (document, index, fallbackLabel = '') => {
  if (typeof document === 'string') {
    const cleanedUrl = getDocumentUrl(document);
    const fileName = decodeURIComponent(cleanedUrl.split('/').pop() || fallbackLabel || `Document ${index + 1}`);
    const originalNameMatch = fileName.match(/-\d{10,}-(.+)$/);
    return originalNameMatch ? originalNameMatch[1] : fileName;
  }

  const providedName = document?.name || document?.title || document?.label || fallbackLabel;

  if (providedName) {
    const originalNameMatch = String(providedName).match(/-\d{10,}-(.+)$/);
    return originalNameMatch ? originalNameMatch[1] : providedName;
  }

  const fallbackUrl = getDocumentUrl(document);
  if (fallbackUrl) {
    const fallbackFileName = decodeURIComponent(fallbackUrl.split('/').pop() || fallbackLabel || `Document ${index + 1}`);
    const originalNameMatch = fallbackFileName.match(/-\d{10,}-(.+)$/);
    return originalNameMatch ? originalNameMatch[1] : fallbackFileName;
  }

  return fallbackLabel || `Document ${index + 1}`;
};

const getDocumentType = (document, documentName) => {
  if (typeof document === 'object' && document?.type) {
    return document.type;
  }

  const sourceName = documentName || getDocumentUrl(document);
  const extension = sourceName.split('.').pop()?.toLowerCase();

  if (extension === 'jpg' || extension === 'jpeg' || extension === 'png' || extension === 'gif' || extension === 'webp') {
    return 'Image';
  }

  if (extension === 'pdf') {
    return 'PDF';
  }

  return 'File';
};

const normalizeDocument = (document, index, fallbackLabel = '') => {
  const url = getDocumentUrl(document);
  const name = getDocumentName(document, index, fallbackLabel);

  return {
    name,
    type: getDocumentType(document, name),
    size: typeof document === 'object' ? (document?.size || document?.fileSize || '') : '',
    url
  };
};

const isImageDocument = (documentUrl) => /\.(png|jpe?g|gif|webp|bmp|svg)(\?|#|$)/i.test(documentUrl || '');

const isPdfDocument = (documentUrl) => /\.pdf(\?|#|$)/i.test(documentUrl || '');

const isDocumentLikeValue = (value) => {
  if (typeof value === 'string') {
    const normalized = value.trim();
    return /(https?:\/\/|^\/uploads|^uploads\/|^this\.https?:\/\/|\.[a-z0-9]{2,6}(\?|#|$))/i.test(normalized);
  }

  if (value && typeof value === 'object') {
    return Boolean(value.url || value.file_url || value.path || value.link || value.src);
  }

  return false;
};

const parseMaybeJson = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const trimmed = value.trim();
  if (!(trimmed.startsWith('{') || trimmed.startsWith('['))) {
    return value;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
};

const collectDocumentEntries = (source, prefix = '') => {
  const parsed = parseMaybeJson(source);

  if (Array.isArray(parsed)) {
    return parsed.flatMap((item, index) => collectDocumentEntries(item, prefix || `Document ${index + 1}`));
  }

  if (parsed && typeof parsed === 'object') {
    const nestedEntries = Object.entries(parsed).flatMap(([key, value]) => {
      const nextPrefix = prefix ? `${prefix} ${toTitleLabel(key)}` : toTitleLabel(key);
      return collectDocumentEntries(value, nextPrefix);
    });

    // If object has no extractable nested document fields, treat the object itself as a document node.
    if (nestedEntries.length === 0 && isDocumentLikeValue(parsed)) {
      return [{ document: parsed, fallbackLabel: prefix }];
    }

    return nestedEntries;
  }

  if (isDocumentLikeValue(parsed)) {
    return [{ document: parsed, fallbackLabel: prefix }];
  }

  return [];
};

const toDocumentList = (documents) => {
  return collectDocumentEntries(documents)
    .map(({ document, fallbackLabel }, index) => ({ document, fallbackLabel, index }));
};

const getOrganizationDocumentSources = (organization) => {
  const sources = [
    organization?.documents,
    organization?.kycDocuments,
    organization?.kyc_documents,
    organization?.submittedDocuments,
    organization?.submitted_documents,
    organization?.kyc,
    organization?.kycData,
    organization?.kyc_data
  ].filter(Boolean);

  const rootDocumentLikeEntries = Object.entries(organization || {}).filter(([key, value]) => {
    if (!value) {
      return false;
    }

    const matchesDocumentKey = /(document|permit|authorization|letter|valid.?id|proof|legitimacy|certificate|registration|kyc)/i.test(key);
    return matchesDocumentKey && (isDocumentLikeValue(value) || (typeof value === 'string' && value.trim().startsWith('{')) || (typeof value === 'object'));
  });

  if (rootDocumentLikeEntries.length > 0) {
    sources.push(Object.fromEntries(rootDocumentLikeEntries));
  }

  return sources;
};

const toComparableId = (value) => {
  if (value === null || value === undefined) {
    return '';
  }

  return String(value).trim();
};

const findMatchingKycRecord = (organization, kycRecords) => {
  const organizationIds = [
    organization?.id,
    organization?.organizationId,
    organization?.organization_id,
    organization?.orgId,
    organization?.org_id
  ].map(toComparableId).filter(Boolean);

  return (kycRecords || []).find((record) => {
    const recordIds = [
      record?.organizationId,
      record?.organization_id,
      record?.orgId,
      record?.org_id,
      record?.organization?.id,
      record?.org?.id,
      record?.organization
    ].map(toComparableId).filter(Boolean);

    return recordIds.some((recordId) => organizationIds.includes(recordId));
  }) || null;
};

export const OrganizationsPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [suspendConfirm, setSuspendConfirm] = useState(null);
  const [actionToast, setActionToast] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('');
  const [approvedSearch, setApprovedSearch] = useState('');
  const [approvedStatusFilter, setApprovedStatusFilter] = useState('');
  const [suspendReason, setSuspendReason] = useState('');

  const loadOrganizations = async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, pendingKycRecords] = await Promise.all([
        fetchOrganizations(),
        fetchPendingKyc().catch(() => [])
      ]);

      setApplications(data.map((o) => {
        const normalizedStatus =
          o.status === 'Verified' ? 'Active'
          : o.status === 'Suspended' ? 'Suspended'
          : o.status === 'Rejected' ? 'Rejected'
          : 'Pending';

        const relatedKycRecord = findMatchingKycRecord(o, pendingKycRecords);
        const normalizedDocuments = [o, relatedKycRecord]
          .filter(Boolean)
          .flatMap((source) => getOrganizationDocumentSources(source))
          .flatMap((source) => toDocumentList(source))
          .map(({ document, fallbackLabel, index }) => normalizeDocument(document, index, fallbackLabel))
          .filter((document) => document.url)
          .filter((document, index, all) => all.findIndex((candidate) => candidate.url === document.url) === index);

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
          documents: normalizedDocuments
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

  const pendingApplications = applications.filter(a => a.status !== 'Active');
  const approvedOrganizations = applications.filter(a => a.status === 'Active');

  const filteredApplications = pendingApplications.filter(a => {
    const q = appSearch.toLowerCase();
    const matchSearch = !appSearch || a.name?.toLowerCase().includes(q) || a.contactEmail?.toLowerCase().includes(q);
    const matchStatus = !appStatusFilter || a.status === appStatusFilter;
    return matchSearch && matchStatus;
  });

  const filteredApproved = approvedOrganizations.filter(a => {
    const q = approvedSearch.toLowerCase();
    const matchSearch = !approvedSearch || a.name?.toLowerCase().includes(q) || a.contactEmail?.toLowerCase().includes(q);
    const matchStatus = !approvedStatusFilter || a.status === approvedStatusFilter;
    return matchSearch && matchStatus;
  });

  const statusStyles = {
    Pending: 'badge badge-pending',
    Active: 'badge badge-active',
    Suspended: 'badge badge-rejected',
    Rejected: 'badge badge-flagged'
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

  const handleReject = async (application, reason) => {
    try {
      await rejectOrganization(application.id, reason);
      showActionToast(`✓ ${application.name} ${tl('rejected')}`);
      await loadOrganizations();
      setSelectedApplication(null);
      setShowRejectForm(false);
      setRejectReason('');
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
              <p className="section-subtitle">{tl('Total:')} {pendingApplications.length}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-outline" onClick={() => exportToXlsx(filteredApplications, 'organizations_export.xlsx', [
                { label: 'ID',             key: 'id' },
                { label: 'Organization',   key: 'name' },
                { label: 'Contact Person', key: 'contactName' },
                { label: 'Email',          key: 'contactEmail' },
                { label: 'Phone',          key: 'contactPhone' },
                { label: 'Status',         key: 'status' },
                { label: 'Date Applied',   key: 'applied' },
              ])}>{tl('Export')}</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder={tl('Search organization or email')}
                value={appSearch}
                onChange={e => setAppSearch(e.target.value)}
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
              <select
                className="filter-select"
                value={appStatusFilter}
                onChange={e => setAppStatusFilter(e.target.value)}
              >
                <option value="">{tl('All')}</option>
                <option value="Pending">{tl('Pending')}</option>
                <option value="Suspended">{tl('Rejected')}</option>
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
            ) : filteredApplications.length === 0 ? (
              <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No applications found.')}</div>
            ) : filteredApplications.map((row, index) => (
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
            <span>{tl('Showing')} {filteredApplications.length} {tl('of')} {pendingApplications.length} {tl('applications')}</span>
          </div>
        </div>

        <div className="card-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="section-title">{t('approvedOrganizations', 'Approved Organizations')}</h2>
              <p className="section-subtitle">{tl('Total:')} {approvedOrganizations.length}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-outline" onClick={() => exportToXlsx(filteredApproved, 'organizations_approved_export.xlsx', [
                { label: 'ID',             key: 'id' },
                { label: 'Organization',   key: 'name' },
                { label: 'Contact Person', key: 'contactName' },
                { label: 'Email',          key: 'contactEmail' },
                { label: 'Phone',          key: 'contactPhone' },
                { label: 'Status',         key: 'status' },
                { label: 'Approved Date',  key: 'applied' },
              ])}>{tl('Export')}</button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder={tl('Search organization or email')}
                value={approvedSearch}
                onChange={e => setApprovedSearch(e.target.value)}
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
              <select
                className="filter-select"
                value={approvedStatusFilter}
                onChange={e => setApprovedStatusFilter(e.target.value)}
              >
                <option value="">{tl('All')}</option>
                <option value="Active">{tl('Active')}</option>
                <option value="Suspended">{tl('Suspended')}</option>
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
            ) : filteredApproved.length === 0 ? (
              <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No approved organizations.')}</div>
            ) : filteredApproved.map((org, index) => (
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
                  <button className="icon-btn text-[#a25d5d]" title={tl('Archive organization')} onClick={() => setDeleteConfirm(org)}>
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
            <span>{tl('Showing')} {filteredApproved.length} {tl('of')} {approvedOrganizations.length} {tl('approved organizations')}</span>
          </div>
        </div>
      </div>

      {selectedApplication && (
        <div className="modal-overlay" onClick={() => {
          setSelectedApplication(null);
          setPreviewDocument(null);
          setShowRejectForm(false);
          setRejectReason('');
        }}>
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
                    <div key={`${document.name}-${document.url}`} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6eadf] bg-white px-3 py-3 text-sm text-[#5a6457]">
                      <div>
                        <p className="font-semibold text-[#4b5548]">{document.name}</p>
                        <p className="text-xs text-[#9aa294]">{document.type}{document.size ? ` · ${document.size}` : ''}</p>
                      </div>
                      <button
                        type="button"
                        className="btn-pill-outline-sm"
                        onClick={() => setPreviewDocument(document)}
                      >
                        {tl('View')}
                      </button>
                    </div>
                  ))}
                </div>


                {!showRejectForm ? (
                  <div className="mt-5 flex items-center gap-3">
                    <button type="button" className="btn-pill-primary flex-1" onClick={() => handleApprove(selectedApplication)}>{tl('Accept')}</button>
                    <button type="button" className="btn-pill-danger flex-1" onClick={() => setShowRejectForm(true)}>{tl('Reject')}</button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    <label className="block text-sm font-semibold text-[#4b5548]">{tl('Reason for Rejection')} <span className="text-red-500">*</span></label>
                    <textarea
                      rows={3}
                      className="w-full rounded-xl border border-[#e2e6dc] bg-white px-3 py-2 text-sm text-[#5a6457] placeholder:text-[#9aa294] focus:border-[#6b8f71] focus:outline-none"
                      placeholder={tl('e.g. Missing government ID, blurry shelter photo...')}
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                    />
                    {rejectReason.trim().length > 0 && rejectReason.trim().length < 5 && (
                      <p className="text-xs text-red-500">{tl('Reason must be at least 5 characters.')}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <button type="button" className="btn-outline flex-1" onClick={() => { setShowRejectForm(false); setRejectReason(''); }}>{tl('Cancel')}</button>
                      <button
                        type="button"
                        className="btn-pill-danger flex-1"
                        disabled={rejectReason.trim().length < 5}
                        onClick={() => handleReject(selectedApplication, rejectReason.trim())}
                      >
                        {tl('Confirm Rejection')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                className="btn-outline"
                onClick={() => {
                  setSelectedApplication(null);
                  setPreviewDocument(null);
                  setShowRejectForm(false);
                  setRejectReason('');
                }}
              >
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {previewDocument && (
        <div className="modal-overlay" onClick={() => setPreviewDocument(null)}>
          <div className="modal-card max-w-4xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#4b5548]">{previewDocument.name}</h3>
                <p className="text-xs text-[#9aa294]">{previewDocument.type}</p>
              </div>
              <div className="flex items-center gap-2">
                <a href={previewDocument.url} target="_blank" rel="noreferrer" className="btn-pill-outline-sm">{tl('Open in new tab')}</a>
                <button type="button" className="btn-outline" onClick={() => setPreviewDocument(null)}>{tl('Close')}</button>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#e6eadf] bg-[#fafaf8] p-3">
              {isImageDocument(previewDocument.url) ? (
                <div className="bg-white rounded-lg overflow-hidden">
                  <img
                    src={previewDocument.url}
                    alt={previewDocument.name}
                    crossOrigin="anonymous"
                    className="max-h-[70vh] w-full rounded-lg object-contain bg-white"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.parentElement) {
                        e.target.parentElement.innerHTML = `<div class="flex flex-col items-center justify-center min-h-[220px] bg-white px-6 py-10 text-center"><p class="text-sm font-semibold text-[#4b5548]">Failed to load image</p><p class="mt-2 text-xs text-[#9aa294] break-all">${previewDocument.url}</p><a href="${previewDocument.url}" target="_blank" rel="noreferrer" class="mt-3">Open in browser</a></div>`;
                      }
                    }}
                  />
                </div>
              ) : isPdfDocument(previewDocument.url) ? (
                <div>
                  <iframe
                    title={previewDocument.name}
                    src={previewDocument.url}
                    className="h-[70vh] w-full rounded-lg border border-[#e6eadf] bg-white"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      if (e.target.parentElement) {
                        e.target.parentElement.innerHTML = `<div class="flex flex-col items-center justify-center min-h-[220px] bg-white px-6 py-10 text-center"><p class="text-sm font-semibold text-[#4b5548]">Failed to load PDF</p><p class="mt-2 text-xs text-[#9aa294] break-all">${previewDocument.url}</p><a href="${previewDocument.url}" target="_blank" rel="noreferrer" class="mt-3">Open in browser</a></div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border border-dashed border-[#d7decf] bg-white px-6 text-center">
                  <p className="text-sm font-semibold text-[#4b5548]">{tl('Preview is not available for this file type.')}</p>
                  <p className="mt-2 text-xs text-[#9aa294] break-all">URL: {previewDocument.url}</p>
                  <a href={previewDocument.url} target="_blank" rel="noreferrer" className="mt-3 btn-pill-outline-sm">{tl('Open file')}</a>
                </div>
              )}
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{tl('Archive organization?')}</h3>
                <p className="text-sm text-[#9aa294]">The organization will be moved to the Archive page. You can restore it at any time from Settings → Archive.</p>
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
                    showActionToast(`✓ ${tl('Organization moved to archive')}`);
                    await loadOrganizations();
                    setDeleteConfirm(null);
                  } catch (err) {
                    setError(err.response?.data?.message || err.message || tl('Unable to delete organization'));
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
                <h3 className="text-lg font-semibold text-[#4b5548]">{suspendConfirm.status === 'Active' ? tl('Suspend organization?') : tl('Activate organization?')}</h3>
                <p className="text-sm text-[#9aa294]">{tl('You can change this status again later.')}</p>
              </div>
            </div>
            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">{tl('Organization:')}</span> {suspendConfirm.name} ({suspendConfirm.id})
            </div>
            {suspendConfirm.status === 'Active' && (
              <div className="mt-3">
                <label className="text-xs font-semibold text-[#7a8476]">{tl('Reason for suspension')} <span className="text-[#9aa294]">({tl('optional')})</span></label>
                <textarea
                  placeholder={tl('Enter reason for suspension...')}
                  value={suspendReason}
                  onChange={e => setSuspendReason(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#e2e6dc] px-3 py-2 text-sm text-[#5a6457] focus:outline-none focus:ring-1 focus:ring-[#77806d]"
                  rows={3}
                  maxLength={1000}
                />
              </div>
            )}
            <div className="mt-6 flex gap-3">
              <button type="button" className="btn-secondary flex-1" onClick={() => { setSuspendConfirm(null); setSuspendReason(''); }}>{tl('Cancel')}</button>
              <button
                type="button"
                className="btn-pill-primary flex-1"
                onClick={async () => {
                  try {
                    const nextStatus = suspendConfirm.status === 'Active' ? 'Suspended' : 'Active';
                    await updateOrganizationStatus(suspendConfirm.id, nextStatus, nextStatus === 'Suspended' ? suspendReason : undefined);
                    showActionToast(`✓ ${tl('Organization')} ${nextStatus === 'Suspended' ? tl('suspended') : tl('activated')}`);
                    await loadOrganizations();
                    setSuspendConfirm(null);
                    setSuspendReason('');
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
