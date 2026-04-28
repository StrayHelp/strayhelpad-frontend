import React from 'react';
import { Layout } from '../components/Layout';

export const OrganizationsPage = () => {
  return (
    <Layout title="Organizations">

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          Organizations
        </h2>

        <div className="text-center text-gray-500 py-10">
          No organizations available yet
        </div>

      </div>

    </Layout>
  );
};