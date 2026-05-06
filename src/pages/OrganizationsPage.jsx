import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export const OrganizationsPage = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [suspendConfirm, setSuspendConfirm] = useState(null);
  const [actionToast, setActionToast] = useState('');

  const applications = [
    {
      id: 'ORG-2041',
      name: 'Safe Paws Shelter',
      contactName: 'A. Gomez',
      contactEmail: 'anna.gomez@safepaws.org',
      contactPhone: '+63 912 345 6789',
      location: 'Cebu City, Philippines',
      description: 'A non-profit shelter focused on rescuing, rehabilitating, and rehoming stray animals.',
      status: 'Pending',
      applied: 'Apr 24, 2026',
      documents: [
        { name: 'Business permit', type: 'PDF', size: '1.2 MB' },
        { name: 'Valid ID', type: 'Image', size: '640 KB' },
        { name: 'Proof of legitimacy', type: 'PDF', size: '980 KB' }
      ]
    },
    {
      id: 'ORG-2039',
      name: 'Hope for Strays',
      contactName: 'L. Wang',
      contactEmail: 'lisa.wang@hopeforstrays.ph',
      contactPhone: '+63 908 778 1122',
      location: 'Makati City, Philippines',
      description: 'Community organization providing medical support, adoptions, and stray tracking assistance.',
      status: 'Pending',
      applied: 'Apr 22, 2026',
      documents: [
        { name: 'Business permit', type: 'PDF', size: '1.3 MB' },
        { name: 'Valid ID', type: 'Image', size: '710 KB' },
        { name: 'Proof of legitimacy', type: 'PDF', size: '920 KB' }
      ]
    },
    {
      id: 'ORG-2038',
      name: 'City Care Network',
      contactName: 'T. Singh',
      contactEmail: 'tara.singh@citycare.net',
      contactPhone: '+63 930 123 9090',
      location: 'Davao City, Philippines',
      description: 'Local animal care network managing rescue referrals, temporary shelters, and donations.',
      status: 'Rejected',
      applied: 'Apr 21, 2026',
      documents: [
        { name: 'Business permit', type: 'PDF', size: '1.1 MB' },
        { name: 'Valid ID', type: 'Image', size: '610 KB' },
        { name: 'Proof of legitimacy', type: 'PDF', size: '890 KB' }
      ]
    },
    {
      id: 'ORG-2037',
      name: 'Paws & Hope Foundation',
      contactName: 'M. Alvarez',
      contactEmail: 'marco.alvarez@pawshope.org',
      contactPhone: '+63 905 456 7788',
      location: 'Pasig City, Philippines',
      description: 'Animal welfare foundation supporting rescue intake, foster placement, and donation distribution.',
      status: 'Pending',
      applied: 'Apr 20, 2026',
      documents: [
        { name: 'Business permit', type: 'PDF', size: '1.4 MB' },
        { name: 'Valid ID', type: 'Image', size: '700 KB' },
        { name: 'Proof of legitimacy', type: 'PDF', size: '950 KB' }
      ]
    }
  ];

  const approvedOrganizations = [
    {
      id: 'ORG-1804',
      name: 'Metro Rescue Team',
      contactName: 'J. Carter',
      contactEmail: 'joseph.carter@metrorescue.org',
      status: 'Active',
      approved: 'Apr 26, 2026'
    },
    {
      id: 'ORG-1803',
      name: 'Safe Paws Shelter',
      contactName: 'A. Gomez',
      contactEmail: 'anna.gomez@safepaws.org',
      status: 'Active',
      approved: 'Apr 25, 2026'
    },
    {
      id: 'ORG-1802',
      name: 'Hope for Strays',
      contactName: 'L. Wang',
      contactEmail: 'lisa.wang@hopeforstrays.ph',
      status: 'Suspended',
      approved: 'Apr 22, 2026'
    }
  ];

  const statusStyles = {
    Pending: 'badge badge-pending',
    Approved: 'badge badge-active',
    Rejected: 'badge badge-rejected'
  };

  const handleApprove = (application) => {
    window.alert(`Approved ${application.name}`);
    setSelectedApplication(null);
  };

  const handleReject = (application) => {
    window.alert(`Rejected ${application.name}`);
    setSelectedApplication(null);
  };

  const showActionToast = (message) => {
    setActionToast(message);
    setTimeout(() => setActionToast(''), 3000);
  };

  return (
    <Layout title="Organizations">
      {actionToast && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {actionToast}
        </div>
      )}
      <div className="space-y-6">
        <div className="card-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="section-title">Organization Applications</h2>
              <p className="section-subtitle">Total: 65</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-outline">
                Export
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search organization or email"
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
              <span className="filter-label">Status</span>
              <select className="filter-select">
                <option>All</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <div className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_1fr_7rem] items-center gap-2 table-head">
              <span>
                <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
              </span>
              <span>Application ID</span>
              <span>Organization</span>
              <span>Contact Person</span>
              <span>Date Applied</span>
              <span>Status</span>
              <span className="text-center">Actions</span>
            </div>
            {applications.map((row, index) => (
              <div
                key={`${row.id}-${index}`}
                className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_1fr_7rem] items-center gap-2 table-row"
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
                <span className={statusStyles[row.status]}>
                  {row.status}
                </span>
                <div className="flex items-center justify-center gap-2 text-[#77806d]" onClick={(event) => event.stopPropagation()}>
                  <button
                    className="icon-btn"
                    title="View application"
                    onClick={() => setSelectedApplication(row)}
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

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a8476]">
            <span>Showing 1-5 of 65 applications</span>
            <div className="flex items-center gap-2">
              <button className="btn-page">Prev</button>
              <button className="btn-page-active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page">3</button>
              <button className="btn-page">Next</button>
            </div>
          </div>
        </div>

        <div className="card-lg">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="section-title">Approved Organizations</h2>
              <p className="section-subtitle">Total: 28</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button className="btn-outline">
                Export
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                placeholder="Search organization or email"
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
              <span className="filter-label">Status</span>
              <select className="filter-select">
                <option>All</option>
                <option>Active</option>
                <option>Suspended</option>
              </select>
            </div>
          </div>

          <div className="table-wrap">
            <div className="grid grid-cols-[0.5fr_1fr_1.6fr_2fr_1fr_1fr_7rem] items-center gap-2 table-head">
              <span>
                <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
              </span>
              <span>Org ID</span>
              <span>Organization</span>
              <span>Contact Person</span>
              <span>Status</span>
              <span>Approved Date</span>
              <span className="text-center">Actions</span>
            </div>
            {approvedOrganizations.map((org, index) => (
              <div
                key={`${org.id}-${index}`}
                className="grid grid-cols-[0.5fr_1fr_1.6fr_2fr_1fr_1fr_7rem] items-center gap-2 table-row"
              >
                <span>
                  <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
                </span>
                <span className="table-id">{org.id}</span>
                <span className="font-medium text-[#4b5548]">{org.name}</span>
                <div>
                  <p className="font-semibold text-[#4b5548]">{org.contactName}</p>
                  <p className="table-muted">{org.contactEmail}</p>
                </div>
                <span
                  className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    org.status === 'Active'
                      ? 'bg-[#e8f3ea] text-[#2f7a43]'
                      : 'bg-[#fbe9e9] text-[#b83a3a]'
                  }`}
                >
                  {org.status}
                </span>
                <span className="table-muted">{org.approved}</span>
                <div className="flex items-center justify-center gap-2 text-[#77806d]">
                  <button
                    className="icon-btn"
                    title={org.status === 'Active' ? 'Suspend organization' : 'Activate organization'}
                    onClick={() => setSuspendConfirm(org)}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                      <path d="M12 2v20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M5 7h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    </svg>
                  </button>
                  <button
                    className="icon-btn text-[#a25d5d]"
                    title="Delete organization"
                    onClick={() => setDeleteConfirm(org)}
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
            <span>Showing 1-3 of 28 approved organizations</span>
            <div className="flex items-center gap-2">
              <button className="btn-page">Prev</button>
              <button className="btn-page-active">1</button>
              <button className="btn-page">2</button>
              <button className="btn-page">Next</button>
            </div>
          </div>
        </div>
      </div>

      {selectedApplication && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="modal-card max-w-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">Application Details</p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedApplication.name}</h3>
                <p className="text-sm text-[#7a8476]">{selectedApplication.location}</p>
              </div>
              <span className={statusStyles[selectedApplication.status]}>
                {selectedApplication.status}
              </span>
            </div>

            <div className="mt-5 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-[#eef1e9] bg-[#fafaf8] p-4">
                <h4 className="text-sm font-semibold text-[#4b5548]">Organization Profile</h4>
                <p className="mt-3 text-sm leading-6 text-[#5a6457]">{selectedApplication.description}</p>

                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">Contact Person</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.contactName}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">Email</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.contactEmail}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">Phone</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.contactPhone}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#9aa294]">Location</span>
                    <span className="font-semibold text-[#4b5548]">{selectedApplication.location}</span>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-[#eef1e9] p-4">
                <h4 className="text-sm font-semibold text-[#4b5548]">Uploaded Documents</h4>
                <div className="mt-4 space-y-3">
                  {selectedApplication.documents.map((document) => (
                    <div key={document.name} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#e6eadf] bg-white px-3 py-3 text-sm text-[#5a6457]">
                      <div>
                        <p className="font-semibold text-[#4b5548]">{document.name}</p>
                        <p className="text-xs text-[#9aa294]">{document.type} · {document.size}</p>
                      </div>
                      <button
                        type="button"
                        className="btn-pill-outline-sm"
                        onClick={() => setSelectedDocument(document)}
                      >
                        View
                      </button>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <button
                    type="button"
                    className="btn-pill-primary flex-1"
                    onClick={() => handleApprove(selectedApplication)}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="btn-pill-danger flex-1"
                    onClick={() => handleReject(selectedApplication)}
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                className="btn-outline"
                onClick={() => setSelectedApplication(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDocument && (
        <div
          className="modal-overlay z-40 bg-black/50"
          onClick={() => setSelectedDocument(null)}
        >
          <div
            className="modal-card max-w-lg"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">Document Preview</p>
                <h3 className="mt-2 text-lg font-semibold text-[#4b5548]">{selectedDocument.name}</h3>
                <p className="text-xs text-[#9aa294]">{selectedDocument.type} · {selectedDocument.size}</p>
              </div>
              <button
                type="button"
                className="btn-pill-outline-sm"
                onClick={() => setSelectedDocument(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-5 rounded-2xl border border-dashed border-[#e2e6dc] bg-[#fafaf8] p-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#77806d] shadow-sm">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 13h8" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M8 17h5" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </div>
                <p className="text-sm font-semibold text-[#4b5548]">Document ready to view</p>
                <p className="text-xs text-[#9aa294]">Preview placeholder for uploaded file.</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                className="btn-pill-primary flex-1"
              >
                Open Document
              </button>
              <button
                type="button"
                className="btn-outline flex-1"
                onClick={() => setSelectedDocument(null)}
              >
                Back
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
                <h3 className="text-lg font-semibold text-[#4b5548]">Delete organization?</h3>
                <p className="text-sm text-[#9aa294]">This action cannot be undone.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">Organization:</span> {deleteConfirm.name} ({deleteConfirm.id})
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
                  showActionToast('✓ Organization deleted');
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
                  {suspendConfirm.status === 'Active' ? 'Suspend organization?' : 'Activate organization?'}
                </h3>
                <p className="text-sm text-[#9aa294]">You can change this status again later.</p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-[#f0f2ec] bg-[#fafaf8] px-4 py-3 text-sm text-[#5a6457]">
              <span className="font-semibold text-[#4b5548]">Organization:</span> {suspendConfirm.name} ({suspendConfirm.id})
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
                  showActionToast(`✓ Organization ${nextAction}`);
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