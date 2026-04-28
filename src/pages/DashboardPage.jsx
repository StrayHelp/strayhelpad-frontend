import React from 'react';
import { Layout } from '../components/Layout';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
  return (
    <Layout title="Dashboard">
      
      {/* Metric placeholders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Users</h3>
          <p className="text-gray-400 mt-2">No data available yet</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Reports</h3>
          <p className="text-gray-400 mt-2">No data available yet</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-600">Donations</h3>
          <p className="text-gray-400 mt-2">No data available yet</p>
        </div>

      </div>

      {/* Charts removed (frontend-only rule) */}

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <Link to="/reports" className="p-4 border rounded hover:bg-gray-50">
            Review Reports
          </Link>

          <Link to="/users" className="p-4 border rounded hover:bg-gray-50">
            Manage Users
          </Link>

          <Link to="/donations" className="p-4 border rounded hover:bg-gray-50">
            View Donations
          </Link>

          <Link to="/organizations" className="p-4 border rounded hover:bg-gray-50">
            Organizations
          </Link>

        </div>
      </div>

    </Layout>
  );
};