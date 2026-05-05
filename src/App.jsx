import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { ReportsPage } from './pages/ReportsPage';
import { DonationsPage } from './pages/DonationsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { SettingsPage } from './pages/SettingsPage';

import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={(
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        )} />
        <Route path="/users" element={(
          <RequireAuth>
            <UsersPage />
          </RequireAuth>
        )} />
        <Route path="/reports" element={(
          <RequireAuth>
            <ReportsPage />
          </RequireAuth>
        )} />
        <Route path="/donations" element={(
          <RequireAuth>
            <DonationsPage />
          </RequireAuth>
        )} />
        <Route path="/organizations" element={(
          <RequireAuth>
            <OrganizationsPage />
          </RequireAuth>
        )} />
        <Route path="/settings" element={(
          <RequireAuth>
            <SettingsPage />
          </RequireAuth>
        )} />

        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </Router>
  );
}

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const adminName = typeof window !== 'undefined'
    ? window.localStorage.getItem('adminName')
    : null;

  if (!adminName) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default App;