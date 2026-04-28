import React from 'react';
import { Layout } from '../components/Layout';

export const OrganizationsPage: React.FC = () => {
  const dummyOrgs = [
    { id: 1, name: 'Stray Rescue PH', status: 'Active', members: 12 },
    { id: 2, name: 'Animal Care Org', status: 'Pending', members: 5 },
    { id: 3, name: 'Pet Shelter Manila', status: 'Active', members: 20 },
  ];

  return (
    <Layout title="Organizations">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Organizations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dummyOrgs.map((org) => (
            <div key={org.id} className="border rounded-lg p-4">
              <h3 className="font-semibold text-lg">{org.name}</h3>

              <p className="text-sm text-gray-600 mt-1">
                Members: {org.members}
              </p>

              <span
                className={`inline-block mt-3 px-2 py-1 text-xs rounded ${
                  org.status === 'Active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {org.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};