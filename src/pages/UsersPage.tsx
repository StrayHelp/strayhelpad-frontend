import React from 'react';
import { Layout } from '../components/Layout';

export const UsersPage: React.FC = () => {
  const dummyUsers = [
    { id: 1, name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'Admin' },
    { id: 2, name: 'Maria Santos', email: 'maria@example.com', role: 'User' },
    { id: 3, name: 'Pedro Reyes', email: 'pedro@example.com', role: 'Moderator' },
  ];

  return (
    <Layout title="Users">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">User Management</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="p-3">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {dummyUsers.map((user) => (
              <tr key={user.id} className="border-b">
                <td className="p-3">{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                    Active
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};