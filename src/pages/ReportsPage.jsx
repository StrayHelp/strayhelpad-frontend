import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export const ReportsPage = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const reports = [
    {
      id: 'RPT-2041',
      user: 'Maya Sinclair',
      title: 'Injured dog near market',
      description: 'Found a limping dog near the central market entrance. Needs immediate help.',
      category: 'Rescue',
      date: 'Apr 24, 2026',
      status: 'Active'
    },
    {
      id: 'RPT-2040',
      user: 'Jonas Reed',
      title: 'Abandoned kitten',
      description: 'Small kitten left near the community park benches. No collar spotted.',
      category: 'Found Stray',
      date: 'Apr 23, 2026',
      status: 'Flagged'
    },
    {
      id: 'RPT-2039',
      user: 'Annie Clarke',
      title: 'Lost pet near Riverside',
      description: 'Missing brown shih tzu, last seen near Riverside walkway. Please help.',
      category: 'Lost Pet',
      date: 'Apr 22, 2026',
      status: 'Active'
    },
    {
      id: 'RPT-2038',
      user: 'Carlos Mendez',
      title: 'Stray pack spotted',
      description: 'Group of 4 strays roaming near the depot. Some appear injured.',
      category: 'Rescue',
      date: 'Apr 21, 2026',
      status: 'Active'
    },
    {
      id: 'RPT-2037',
      user: 'Jamie Ford',
      title: 'Possible abuse report',
      description: 'Witnessed rough handling of a dog near Elm Street. Needs investigation.',
      category: 'Rescue',
      date: 'Apr 20, 2026',
      status: 'Flagged'
    }
  ];

  return (
    <Layout title="Reports">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#4b5548]">Reports Overview</h2>
            <p className="mt-1 text-sm text-[#7a8476]">Total reports: 392</p>
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
              placeholder="Search by title, description, or user"
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
              <option>Active</option>
              <option>Flagged</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 text-sm text-[#5a6457] shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">Date</span>
            <select className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none">
              <option>Any time</option>
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
          <div className="grid grid-cols-[0.5fr_1fr_1.4fr_2.4fr_1.1fr_1.1fr_1fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
            <span>
              <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
            </span>
            <span>Report ID</span>
            <span>User</span>
            <span>Report</span>
            <span>Category</span>
            <span>Date Posted</span>
            <span>Status</span>
            <span className="text-center">Actions</span>
          </div>
          {reports.map((report, index) => (
            <div
              key={`${report.id}-${index}`}
              className="grid grid-cols-[0.5fr_1fr_1.4fr_2.4fr_1.1fr_1.1fr_1fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-4 text-sm text-[#5a6457] transition hover:bg-[#fafaf8]"
            >
              <span>
                <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
              </span>
              <span className="text-xs font-semibold text-[#9aa294]">{report.id}</span>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#e6eadf]" />
                <div>
                  <p className="font-semibold text-[#4b5548]">{report.user}</p>
                  <p className="text-xs text-[#9aa294]">User</p>
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
              <span className="text-xs text-[#9aa294]">{report.date}</span>
              <span
                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                  report.status === 'Active'
                    ? 'bg-[#e8f3ea] text-[#2f7a43]'
                    : 'bg-[#fbe9e9] text-[#b83a3a]'
                }`}
              >
                {report.status}
              </span>
              <div className="flex items-center justify-center gap-2 text-[#77806d]">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e6dc]"
                  title="View report"
                  onClick={() => setSelectedReport(report)}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6-10-6-10-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <button className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e6dc] text-[#a25d5d]" title="Delete report">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M4 7h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                    <path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="1.6" />
                    <path d="M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a8476]">
          <span>Showing 1-5 of 392 reports</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              Prev
            </button>
            <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">1</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">2</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">3</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              Next
            </button>
          </div>
        </div>
      </div>
      {selectedReport && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={() => setSelectedReport(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-[#9aa294]">Report Details</p>
                <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedReport.title}</h3>
                <p className="text-sm text-[#7a8476]">Reported by {selectedReport.user}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-[#eef1e9] bg-[#fafaf8] p-4 text-sm text-[#5a6457]">
              {selectedReport.description}
            </div>

            <div className="mt-6 grid gap-4 text-sm text-[#5a6457]">
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Report ID</span>
                <span className="font-semibold text-[#4b5548]">{selectedReport.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Category</span>
                <span className="font-semibold text-[#4b5548]">{selectedReport.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Date Posted</span>
                <span className="font-semibold text-[#4b5548]">{selectedReport.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Status</span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                    selectedReport.status === 'Active'
                      ? 'bg-[#e8f3ea] text-[#2f7a43]'
                      : 'bg-[#fbe9e9] text-[#b83a3a]'
                  }`}
                >
                  {selectedReport.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                className="rounded-full border border-[#e2e6dc] px-4 py-2 text-sm font-semibold text-[#6c7669]"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};
