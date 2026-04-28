import React from 'react';
import { Layout } from '../components/Layout';

export const UsersPage = () => {
  return (
    <Layout title="Users">

      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-xl font-semibold mb-4">
          User Management
        </h2>

        <div className="text-gray-500 py-10 text-center">
          No users available yet
        </div>

      </div>

    </Layout>
  );
};