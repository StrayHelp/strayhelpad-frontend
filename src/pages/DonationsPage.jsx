import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { fetchDonations } from '../services/adminService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';

export const DonationsPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDonations();
      setDonations(data.map((d) => ({
        id: d.id,
        name: d.donor_name,
        org: d.organization_name || '—',
        amount: formatCurrency(d.amount, settings),
        method: d.payment_method ? tl(d.payment_method) : '—',
        date: formatDate(d.created_at, settings)
      })));
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load donations'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [settings?.system?.defaultLanguage, settings?.system?.timezone]);

  return (
    <Layout title={t('pageDonations', 'Donations')}>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#4b5548]">{t('donationTransactions', 'Donation Transactions')}</h2>
            <p className="mt-1 text-sm text-[#7a8476]">{tl('Total:')} {donations.length} {tl('transactions')}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="rounded-full border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-semibold text-[#6c7669] shadow-sm">
              {tl('Export')}
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              placeholder={tl('Search by donor name or organization')}
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
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">{tl('Method')}</span>
            <select className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none">
              <option>{tl('All')}</option>
              <option>{tl('GCash')}</option>
              <option>{tl('Card')}</option>
              <option>{tl('Bank')}</option>
              <option>{tl('Maya')}</option>
            </select>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 text-sm text-[#5a6457] shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9aa294]">{tl('Date')}</span>
            <select className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none">
              <option>{tl('Any time')}</option>
              <option>{tl('Last 7 days')}</option>
              <option>{tl('Last 30 days')}</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
          <div className="grid grid-cols-[0.5fr_1.1fr_1.3fr_1.6fr_1.1fr_1fr_1fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
            <span>
              <input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" />
            </span>
            <span>{tl('Transaction ID')}</span>
            <span>{tl('Donor')}</span>
            <span>{tl('Organization')}</span>
            <span>{tl('Method')}</span>
            <span>{tl('Date')}</span>
            <span className="text-right">{tl('Amount')}</span>
            <span className="text-center">{tl('Actions')}</span>
          </div>
          {loading ? (
            <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading donations…')}</div>
          ) : donations.length === 0 ? (
            <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No donations found.')}</div>
          ) : donations.map((row, index) => (
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
                  title={tl('View transaction')}
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
          <span>{tl('Total:')} {donations.length} {tl('transactions')}</span>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              {tl('Prev')}
            </button>
            <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">1</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">2</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">3</button>
            <button className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669]">
              {tl('Next')}
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
              <p className="text-sm font-semibold text-[#9aa294]">{tl('Transaction Details')}</p>
              <h3 className="mt-2 text-xl font-semibold text-[#4b5548]">{selectedDonation.id}</h3>
              <p className="text-sm text-[#7a8476]">{selectedDonation.name}</p>
            </div>

            <div className="mt-6 grid gap-4 text-sm text-[#5a6457]">
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Organization')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.org}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Amount')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.amount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Payment Method')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.method}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#9aa294]">{tl('Date')}</span>
                <span className="font-semibold text-[#4b5548]">{selectedDonation.date}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end">
              <button
                type="button"
                className="rounded-full border border-[#e2e6dc] px-4 py-2 text-sm font-semibold text-[#6c7669]"
                onClick={() => setSelectedDonation(null)}
              >
                {tl('Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};