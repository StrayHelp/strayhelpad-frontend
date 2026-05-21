import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { ReportsPage } from './pages/ReportsPage';
import { DonationsPage } from './pages/DonationsPage';
import { AdoptionsPage } from './pages/AdoptionsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ITAdminDashboardPage } from './pages/ITAdminDashboardPage';
import { ITAdminAccountsPage } from './pages/ITAdminAccountsPage';
import { ITAdminAuditLogPage } from './pages/ITAdminAuditLogPage';

import './index.css';
import './App.css';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <Routes>

          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={(
            <RequireAuth allowedRoles={['super-admin']}>
              <DashboardPage />
            </RequireAuth>
          )} />
          <Route path="/users" element={(
            <RequireAuth allowedRoles={['super-admin']}>
              <UsersPage />
            </RequireAuth>
          )} />
          <Route path="/reports" element={(
            <RequireAuth allowedRoles={['super-admin']}>
              <ReportsPage />
            </RequireAuth>
          )} />
          <Route path="/donations" element={(
            <RequireAuth allowedRoles={['super-admin']}>
              <DonationsPage />
            </RequireAuth>
          )} />
          <Route path="/adoptions" element={(
            <RequireAuth allowedRoles={['super-admin']}>
              <AdoptionsPage />
            </RequireAuth>
          )} />
          <Route path="/organizations" element={(
            <RequireAuth allowedRoles={['super-admin']}>
              <OrganizationsPage />
            </RequireAuth>
          )} />
          <Route path="/settings" element={(
            <RequireAuth allowedRoles={['super-admin']}>
              <SettingsPage />
            </RequireAuth>
          )} />

          {/* IT Admin Routes */}
          <Route path="/it-admin/dashboard" element={(
            <RequireAuth allowedRoles={['it-admin']}>
              <ITAdminDashboardPage />
            </RequireAuth>
          )} />
          <Route path="/it-admin/accounts" element={(
            <RequireAuth allowedRoles={['it-admin']}>
              <ITAdminAccountsPage />
            </RequireAuth>
          )} />
          <Route path="/it-admin/audit" element={(
            <RequireAuth allowedRoles={['it-admin']}>
              <ITAdminAuditLogPage />
            </RequireAuth>
          )} />

          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </Router>
    </SettingsProvider>
  );
}

const RequireAuth = ({ children, allowedRoles = [] }) => {
  const location = useLocation();
  const adminName = typeof window !== 'undefined'
    ? window.localStorage.getItem('adminName')
    : null;
  const adminRole = typeof window !== 'undefined'
    ? window.localStorage.getItem('adminRole') || 'super-admin'
    : 'super-admin';

  if (!adminName) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(adminRole)) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default App;