import React, { useState } from 'react';
import { Layout } from '../components/Layout';

export const DonationsPage = () => {
  const [selectedDonation, setSelectedDonation] = useState(null);
  const donations = [
    {
      id: 'TRX-89012',
      name: 'Maya Sinclair',
      org: 'Safe Paws Shelter',
      amount: '₱240.00',
      method: 'Maya',
      date: 'Apr 24, 2026'
    },
    {
      id: 'TRX-89011',
      name: 'Jonas Reed',
      org: 'Metro Rescue Team',
      amount: '₱85.00',
      method: 'GCash',
      date: 'Apr 23, 2026'
    },
    {
      id: 'TRX-89010',
      name: 'Annie Clarke',
      org: 'Hope for Strays',
      amount: '₱410.00',
      method: 'Card',
      date: 'Apr 22, 2026'
    },
    {
      id: 'TRX-89009',
      name: 'Carlos Mendez',
      org: 'City Care Network',
      amount: '₱120.00',
      method: 'GCash',
      date: 'Apr 21, 2026'
    },
    {
      id: 'TRX-89008',
      name: 'Jamie Ford',
      org: 'Paws & Hope Foundation',
      amount: '₱560.00',
      method: 'Bank',
      date: 'Apr 20, 2026'
    }
  ];

  return (
    <Layout title="Donations">
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#4b5548]">Donation Transactions</h2>
            <p className="mt-1 text-sm text-[#7a8476]">Total collected: ₱48,240.00</p>
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
              placeholder="Search by donor name or organization"
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">Method</span>
            <select className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none">
              <option>All</option>
              <option>GCash</option>
              <option>Card</option>
              <option>Bank</option>
              <option>Maya</option>
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
          <div className="grid grid-cols-[0.5fr_1.1fr_1.3fr_1.6fr_1.1fr_1fr_1fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
            <span>
              <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
            </span>
            <span>Transaction ID</span>
            <span>Donor</span>
            <span>Organization</span>
            <span>Method</span>
            <span>Date</span>
            <span className="text-right">Amount</span>
            <span className="text-center">Actions</span>
          </div>
          {donations.map((row, index) => (
            <div
              key={`${row.id}-${index}`}
              className="grid grid-cols-[0.5fr_1.1fr_1.3fr_1.6fr_1.1fr_1fr_1fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-4 text-sm text-[#5a6457] transition hover:bg-[#fafaf8]"
            >
              <span>
                <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
              </span>
              <span className="text-xs font-semibold text-[#9aa294]">{row.id}</span>
              <span className="font-medium text-[#4b5548]">{row.name}</span>
              <span className="text-sm text-[#7a8476]">{row.org}</span>
              <span className="inline-flex w-fit items-center rounded-full border border-[#e2e6dc] bg-[#fafaf8] px-3 py-1 text-xs font-semibold text-[#6c7669]">
                {row.method}
              </span>
              <span className="text-xs text-[#9aa294]">{row.date}</span>
              <span className="text-right font-semibold text-[#4b5548]">{row.amount}</span>
              <div className="flex items-center justify-center gap-2 text-[#77806d]">
                <button
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#e2e6dc]"
                  title="View transaction"
                  onClick={() => setSelectedDonation(row)}
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
          <span>Showing 1-5 of 1,026 transactions</span>
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
      {selectedDonation && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-4 py-6"
          onClick={() => setSelectedDonation(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div>
              <p className="text-sm font-semibold text-[#9aa294]">Transaction Details</p>
              <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedDonation.id}</h3>
              <p className="text-sm text-[#7a8476]">{selectedDonation.name}</p>
            </div>

            <div className="mt-6 grid gap-4 text-sm text-[#5a6457]">
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Organization</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.org}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Amount</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Payment Method</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">Date</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.date}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                className="rounded-full border border-[#e2e6dc] px-4 py-2 text-sm font-semibold text-[#6c7669]"
                onClick={() => setSelectedDonation(null)}
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