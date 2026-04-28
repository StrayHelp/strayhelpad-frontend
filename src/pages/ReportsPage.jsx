import React from 'react';
import { Layout } from '../components/Layout';

export const ReportsPage = () => {
  return (
    <Layout title="Reports">

      <div className="bg-white p-6 rounded-lg shadow">

        <h2 className="text-xl font-semibold mb-4">
          Reports
        </h2>

        <div className="text-center text-gray-500 py-10">
          No reports available yet
        </div>

        {/* Optional structure hint (no data) */}
        <div className="mt-6 text-sm text-gray-400">
          Reports marked as ACTIVE will appear here
        </div>

      </div>

    </Layout>
  );
};