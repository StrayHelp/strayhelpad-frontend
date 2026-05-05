import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export const OrganizationsPage = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);

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
      id: 'ORG-2040',
      name: 'Metro Rescue Team',
      contactName: 'J. Carter',
      contactEmail: 'joseph.carter@metrorescue.org',
      contactPhone: '+63 917 222 3344',
      location: 'Quezon City, Philippines',
      description: 'Volunteer rescue group coordinating feeding, fostering, and emergency response for strays.',
      status: 'Approved',
      applied: 'Apr 23, 2026',
      documents: [
        { name: 'Business permit', type: 'PDF', size: '1.0 MB' },
        { name: 'Valid ID', type: 'Image', size: '520 KB' },
        { name: 'Proof of legitimacy', type: 'PDF', size: '870 KB' }
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

  const statusStyles = {
    Pending: 'bg-[#f8efd1] text-[#9a7a1f]',
    Approved: 'bg-[#e8f3ea] text-[#2f7a43]',
    Rejected: 'bg-[#fbe9e9] text-[#b83a3a]'
  };

  const handleApprove = (application) => {
    window.alert(`Approved ${application.name}`);
    setSelectedApplication(null);
  };

  const handleReject = (application) => {
    window.alert(`Rejected ${application.name}`);
    setSelectedApplication(null);
  };

  return (
    <Layout title="Organizations">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#4b5548]">Organization Applications</h2>
            <p className="mt-1 text-sm text-[#7a8476]">Total: 65</p>
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
              placeholder="Search organization or email"
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
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
          <div className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_1fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
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
              className="grid grid-cols-[0.5fr_1fr_1.5fr_2fr_1fr_1fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-4 text-sm text-[#5a6457] transition hover:bg-[#fafaf8]"
              onClick={() => setSelectedApplication(row)}
            >
              <span onClick={(event) => event.stopPropagation()}>
                <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
              </span>
              <span className="text-xs font-semibold text-[#9aa294]">{row.id}</span>
              <span className="font-medium text-[#4b5548]">{row.name}</span>
              <div>
                <p className="font-semibold text-[#4b5548]">{row.contactName}</p>
                <p className="text-xs text-[#9aa294]">{row.contactEmail}</p>
              </div>
              <span className="text-xs text-[#9aa294]">{row.applied}</span>
              <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>
                {row.status}
              </span>
              <div className="flex items-center justify-center gap-2 text-[#77806d]" onClick={(event) => event.stopPropagation()}>
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e6dc] transition hover:bg-[#f3f5ef]"
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
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">Prev</button>
            <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">1</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">2</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">3</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">Next</button>
          </div>
        </div>
      </div>

      {selectedApplication && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={() => setSelectedApplication(null)}
        >
          <div
            className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">Application Details</p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedApplication.name}</h3>
                <p className="text-sm text-[#7a8476]">{selectedApplication.location}</p>
              </div>
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[selectedApplication.status]}`}>
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
                        className="rounded-full border border-[#e2e6dc] px-3 py-1 text-xs font-semibold text-[#6c7669] transition hover:bg-[#f3f5ef]"
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
                    className="flex-1 rounded-full bg-[#77806d] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
                    onClick={() => handleApprove(selectedApplication)}
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    className="flex-1 rounded-full border border-[#e2e6dc] px-4 py-2 text-sm font-semibold text-[#a25d5d] transition hover:bg-[#fbe9e9]"
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
                className="rounded-full border border-[#e2e6dc] px-4 py-2 text-sm font-semibold text-[#6c7669] transition hover:bg-[#f3f5ef]"
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
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 py-6"
          onClick={() => setSelectedDocument(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
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
                className="rounded-full border border-[#e2e6dc] px-3 py-1 text-xs font-semibold text-[#6c7669] transition hover:bg-[#f3f5ef]"
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
                className="flex-1 rounded-full bg-[#77806d] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-95"
              >
                Open Document
              </button>
              <button
                type="button"
                className="flex-1 rounded-full border border-[#e2e6dc] px-4 py-2 text-sm font-semibold text-[#6c7669] transition hover:bg-[#f3f5ef]"
                onClick={() => setSelectedDocument(null)}
              >
                Back
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};