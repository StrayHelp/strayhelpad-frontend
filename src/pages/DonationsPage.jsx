import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { fetchDonations, fetchTransactionLedger } from '../services/adminService';
import { useSettingsContext } from '../context/SettingsContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { useI18n } from '../hooks/useI18n';
import { exportToXlsx } from '../utils/exportXlsx';

export const DonationsPage = () => {
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const [activeTab, setActiveTab] = useState('donations');
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [donations, setDonations] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [donSearch, setDonSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [ledgerSearch, setLedgerSearch] = useState('');
  const [donPage, setDonPage] = useState(1);
  const [ledgerPage, setLedgerPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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

  const loadLedger = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchTransactionLedger();
      setLedger(data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || tl('Unable to load ledger'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'donations') {
      load();
    } else {
      loadLedger();
    }
  }, [activeTab, settings?.system?.defaultLanguage, settings?.system?.timezone]);

  const filteredDonations = donations.filter(d => {
    const q = donSearch.toLowerCase();
    const matchSearch = !donSearch || [d.id, d.name, d.org, d.method, d.amount, d.date]
      .some(v => String(v ?? '').toLowerCase().includes(q));
    const matchMethod = !methodFilter || d.method?.toLowerCase().includes(methodFilter.toLowerCase());
    return matchSearch && matchMethod;
  });

  const filteredLedger = ledgerSearch
    ? ledger.filter(row => {
        const q = ledgerSearch.toLowerCase();
        return [row.donor_name, row.campaign_title, row.payment_method, String(row.amount ?? '')]
          .some(v => String(v ?? '').toLowerCase().includes(q));
      })
    : ledger;

  const donTotalPages = Math.max(1, Math.ceil(filteredDonations.length / ITEMS_PER_PAGE));
  const pageDonations = filteredDonations.slice((donPage - 1) * ITEMS_PER_PAGE, donPage * ITEMS_PER_PAGE);
  const ledgerTotalPages = Math.max(1, Math.ceil(filteredLedger.length / ITEMS_PER_PAGE));
  const pageLedger = filteredLedger.slice((ledgerPage - 1) * ITEMS_PER_PAGE, ledgerPage * ITEMS_PER_PAGE);

  return (
    <Layout title={t('pageDonations', 'Donations')}>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-[#4b5548]">{t('donationTransactions', 'Donation Transactions')}</h2>
            <p className="mt-1 text-sm text-[#7a8476]">
              {activeTab === 'donations'
                ? `${tl('Total:')} ${donations.length} ${tl('transactions')}`
                : `${tl('Total:')} ${ledger.length} ${tl('ledger entries')}`}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-semibold text-[#6c7669] shadow-sm"
              onClick={() => {
                if (activeTab === 'donations') {
                  exportToXlsx(donations, 'donation_transactions_export.xlsx', [
                    { label: 'Transaction ID', key: 'id' },
                    { label: 'Donor',          key: 'name' },
                    { label: 'Organization',   key: 'org' },
                    { label: 'Method',         key: 'method' },
                    { label: 'Date',           key: 'date' },
                    { label: 'Amount',         key: 'amount' },
                  ]);
                } else {
                  exportToXlsx(ledger, 'ledger_transactions_export.xlsx', [
                    { label: 'Donor',     key: 'donor_name' },
                    { label: 'Campaign',  key: row => row.campaign_title || '—' },
                    { label: 'Method',    key: row => row.payment_method || '—' },
                    { label: 'Amount',    key: row => Number(row.amount || 0) },
                    { label: 'Status',    key: row => {
                      if (row.payload?.idempotent) return 'Duplicate';
                      const ps = row.payload?.paymentStatus || row.payload?.payment_status || '';
                      return (ps === 'Paid' || String(ps).toUpperCase() === 'PAID' || row.payload?.event === 'BACKFILL') ? 'Success' : 'Failed';
                    }},
                    { label: 'Timestamp', key: row => row.timestamp ? new Date(row.timestamp).toLocaleString() : '—' },
                  ]);
                }
              }}
            >
              {tl('Export')}
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="mt-4 flex gap-1 rounded-xl border border-[#e2e6dc] bg-[#f5f7f3] p-1 w-fit">
          <button
            onClick={() => setActiveTab('donations')}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${activeTab === 'donations' ? 'bg-white text-[#4b5548] shadow-sm' : 'text-[#7a8476] hover:text-[#4b5548]'}`}
          >
            {tl('Donations')}
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`rounded-lg px-4 py-1.5 text-sm font-semibold transition ${activeTab === 'ledger' ? 'bg-white text-[#4b5548] shadow-sm' : 'text-[#7a8476] hover:text-[#4b5548]'}`}
          >
            {tl('Transaction Ledger')}
          </button>
        </div>

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {activeTab === 'donations' && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder={tl('Search by donor name or organization')}
                  className="w-full rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 pl-10 text-sm text-[#5a6457] placeholder:text-[#9aa294] shadow-sm"
                  value={donSearch}
                  onChange={e => { setDonSearch(e.target.value); setDonPage(1); }}
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
                <select
                  className="bg-transparent text-sm font-medium text-[#4b5548] focus:outline-none"
                  value={methodFilter}
                  onChange={e => { setMethodFilter(e.target.value); setDonPage(1); }}
                >
                  <option value="">{tl('All')}</option>
                  <option value="ewallet">{tl('Ewallet')}</option>
                  <option value="card">{tl('Card')}</option>
                </select>
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
              <div className="grid grid-cols-[0.5fr_1.1fr_1.3fr_1.6fr_1.1fr_1fr_1fr_7rem] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                <span><input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" /></span>
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
              ) : filteredDonations.length === 0 ? (
                <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No donations found.')}</div>
              ) : pageDonations.map((row, index) => (
                <div
                  key={`${row.id}-${index}`}
                  className="grid grid-cols-[0.5fr_1.1fr_1.3fr_1.6fr_1.1fr_1fr_1fr_7rem] items-center gap-2 border-t border-[#f0f2ec] px-4 py-4 text-sm text-[#5a6457] transition hover:bg-[#fafaf8]"
                >
                  <span><input type="checkbox" className="h-4 w-4 rounded border-[#d9dfd3]" /></span>
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
              <span>{tl('Showing')} {pageDonations.length} {tl('of')} {filteredDonations.length} {tl('transactions')} &bull; {tl('Page')} {donPage} {tl('of')} {donTotalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
                  disabled={donPage === 1}
                  onClick={() => setDonPage(p => p - 1)}
                >
                  {tl('Prev')}
                </button>
                <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">{donPage}</button>
                <button
                  className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
                  disabled={donPage === donTotalPages}
                  onClick={() => setDonPage(p => p + 1)}
                >
                  {tl('Next')}
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'ledger' && (
          <>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <div className="relative w-full max-w-md">
                <input
                  type="text"
                  placeholder={tl('Search by donor, campaign, method, or amount')}
                  className="w-full rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 pl-10 text-sm text-[#5a6457] placeholder:text-[#9aa294] shadow-sm"
                  value={ledgerSearch}
                  onChange={e => { setLedgerSearch(e.target.value); setLedgerPage(1); }}
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa294]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" stroke="currentColor" strokeWidth="1.6" />
                    <path d="m20 20-3.4-3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                </span>
              </div>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-[#e6eadf]">
              <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.5fr] items-center gap-2 bg-[#f1f3ee] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#7a8476]">
                <span>{tl('Donor')}</span>
                <span>{tl('Campaign')}</span>
                <span>{tl('Method')}</span>
                <span className="text-right">{tl('Amount')}</span>
                <span>{tl('Status')}</span>
                <span>{tl('Timestamp')}</span>
              </div>
              {loading ? (
                <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('Loading ledger…')}</div>
              ) : filteredLedger.length === 0 ? (
                <div className="border-t border-[#f0f2ec] px-4 py-10 text-center text-sm text-[#7a8476]">{tl('No ledger entries found.')}</div>
              ) : pageLedger.map((row) => {
                const isIdempotent = row.payload?.idempotent === true;
                const paymentStatus = row.payload?.paymentStatus || row.payload?.payment_status || '';
                const event = row.payload?.event || '';
                let statusLabel, statusClass;
                if (isIdempotent) {
                  statusLabel = 'Duplicate';
                  statusClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                } else if (paymentStatus === 'Paid' || String(paymentStatus).toUpperCase() === 'PAID' || event === 'BACKFILL') {
                  statusLabel = 'Success';
                  statusClass = 'bg-green-50 text-green-700 border-green-200';
                } else {
                  statusLabel = 'Failed';
                  statusClass = 'bg-red-50 text-red-700 border-red-200';
                }
                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr_1.5fr] items-center gap-2 border-t border-[#f0f2ec] px-4 py-3 text-sm text-[#5a6457] transition hover:bg-[#fafaf8]"
                  >
                    <span className="font-medium text-[#4b5548] truncate">{row.donor_name}</span>
                    <span className="text-xs text-[#7a8476] truncate">{row.campaign_title || '—'}</span>
                    <span className="text-xs text-[#7a8476]">{row.payment_method || '—'}</span>
                    <span className="text-right font-semibold text-[#4b5548]">
                      ₱{Number(row.amount || 0).toLocaleString()}
                    </span>
                    <span>
                      <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${statusClass}`}>
                        {statusLabel}
                      </span>
                    </span>
                    <span className="text-xs text-[#9aa294]">
                      {row.timestamp ? new Date(row.timestamp).toLocaleString() : '—'}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#7a8476]">
              <span>{tl('Showing')} {pageLedger.length} {tl('of')} {filteredLedger.length} {tl('ledger entries')} &bull; {tl('Page')} {ledgerPage} {tl('of')} {ledgerTotalPages}</span>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
                  disabled={ledgerPage === 1}
                  onClick={() => setLedgerPage(p => p - 1)}
                >
                  {tl('Prev')}
                </button>
                <button className="rounded-full bg-[#77806d] px-3 py-1 text-sm font-semibold text-white">{ledgerPage}</button>
                <button
                  className="rounded-full border border-[#e2e6dc] px-3 py-1 text-sm font-semibold text-[#6c7669] disabled:opacity-40"
                  disabled={ledgerPage === ledgerTotalPages}
                  onClick={() => setLedgerPage(p => p + 1)}
                >
                  {tl('Next')}
                </button>
              </div>
            </div>
          </>
        )}
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