import React from 'react';
import { Layout } from '../components/Layout';

export const DonationsPage: React.FC = () => {
  const dummyDonations = [
    { id: 1, donor: 'Anna Cruz', amount: 500, date: '2026-04-01' },
    { id: 2, donor: 'John Lim', amount: 1200, date: '2026-04-10' },
    { id: 3, donor: 'Sarah Lee', amount: 300, date: '2026-04-18' },
  ];

  const total = dummyDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <Layout title="Donations">
      {/* Summary Card */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-green-700">
          Total Donations
        </h2>
        <p className="text-3xl font-bold text-green-800 mt-2">
          ₱{total}
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Donation Records</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Donor</th>
              <th>Amount</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {dummyDonations.map((d) => (
              <tr key={d.id} className="border-b">
                <td className="p-3">{d.donor}</td>
                <td>₱{d.amount}</td>
                <td>{d.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};