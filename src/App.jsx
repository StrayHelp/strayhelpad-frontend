import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { UsersPage } from './pages/UsersPage';
import { ReportsPage } from './pages/ReportsPage';
import { DonationsPage } from './pages/DonationsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/login" element={<LoginPage />} />

        <Route path="/" element={<DashboardPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/donations" element={<DonationsPage />} />
        <Route path="/organizations" element={<OrganizationsPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;