import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import strayHelpLogo from '../assets/StrayHelp-Logo-1.png';
import { useSettingsContext } from '../context/SettingsContext';
import { useI18n } from '../hooks/useI18n';
import api from '../services/api';

export const ITAdminLayout = ({ children, title, searchValue, onSearchChange }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const { settings } = useSettingsContext();
  const { t, tl } = useI18n();
  const appName = settings?.system?.appName || 'StrayHelp';
  const adminName = typeof window !== 'undefined'
    ? window.localStorage.getItem('adminName') || settings?.profile?.adminName || tl('Admin User')
    : tl('Admin User');
  const adminEmail = typeof window !== 'undefined'
    ? window.localStorage.getItem('adminEmail') || settings?.profile?.email || 'admin@strayhelp.com'
    : 'admin@strayhelp.com';
  const profilePicture = settings?.profile?.profilePicture || null;

  const handleLogout = async () => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('authToken') : null;

    if (token) {
      try {
        await api.post('/auth/logout');
      } catch {
        try {
          await api.post('/auth-otp/logout');
        } catch {
          // Ignore logout API failures and continue local sign-out.
        }
      }
    }

    window.localStorage.removeItem('adminName');
    window.localStorage.removeItem('adminEmail');
    window.localStorage.removeItem('authToken');
    window.localStorage.removeItem('adminRole');
    setProfileOpen(false);
    navigate('/login');
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#fafaf8] via-[#f4f6f2] to-[#f8f8f4]">
      <aside
        className={`fixed inset-y-0 left-0 z-20 hidden border-r border-white/10 bg-[#77806d] text-white transition-all duration-300 lg:flex ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <div className="flex h-full w-full flex-col">
          <div className="flex items-baseline gap-2 px-6 py-6">
            <img src={strayHelpLogo} alt="StrayHelp logo" className="h-8 w-auto align-middle object-contain" />
            {sidebarOpen && <span className="text-xl font-semibold leading-none tracking-tight">{appName}</span>}
          </div>

          <nav className="mt-2 space-y-1 px-3">
            <SidebarItem 
              to="/it-admin/dashboard" 
              label={t('navDashboard', 'Dashboard')} 
              open={sidebarOpen} 
              icon={<SidebarIcon type="dashboard" />} 
            />
            <SidebarItem 
              to="/it-admin/accounts" 
              label={t('navAccounts', 'Accounts')} 
              open={sidebarOpen} 
              icon={<SidebarIcon type="users" />} 
            />
            <SidebarItem 
              to="/it-admin/audit" 
              label={t('navAuditLog', 'Audit Log')} 
              open={sidebarOpen} 
              icon={<SidebarIcon type="reports" />} 
            />
          </nav>

          <div className="mt-auto px-6 pb-6" />
        </div>
      </aside>

      <div className={`flex min-h-screen flex-col ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}>
        <header className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/40 bg-white/70 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              className="rounded-lg border border-[#e2e6dc] bg-white px-2.5 py-2 text-[#6c7669] shadow-sm"
              type="button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {title && <h1 className="text-xl font-semibold text-[#4b5548]">{title}</h1>}
          </div>

          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="relative hidden w-full max-w-md lg:block">
              <input
                type="text"
                placeholder={t('searchHere', 'Search here')}
                className="w-full rounded-full border border-[#e2e6dc] bg-white px-4 py-2.5 pl-10 text-sm text-[#5a6457] placeholder:text-[#9aa294] shadow-sm"
                value={searchValue ?? ''}
                onChange={e => onSearchChange?.(e.target.value)}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9aa294]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="m20 20-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <button className="hidden rounded-full border border-[#e2e6dc] bg-white p-2 text-[#6c7669] shadow-sm lg:inline-flex" type="button">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 rounded-full border border-[#e2e6dc] bg-white px-4 py-2 text-sm font-medium text-[#5a6457] shadow-sm hover:bg-[#f5f7f3]"
              >
                {profilePicture ? (
                  <img src={profilePicture} alt={adminName} className="h-5 w-5 rounded-full object-cover" />
                ) : (
                  <div className="h-5 w-5 rounded-full bg-[#77806d]" />
                )}
                <span className="hidden sm:inline">{adminName}</span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-[#e2e6dc] bg-white shadow-lg">
                  <div className="border-b border-[#e2e6dc] px-4 py-3">
                    <p className="text-sm font-semibold text-[#2c3226]">{adminName}</p>
                    <p className="text-xs text-[#7a8476]">{adminEmail}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    {t('logout', 'Logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

const SidebarItem = ({ to, label, open, icon }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
        isActive
          ? 'bg-white/15 text-white'
          : 'text-white/80 hover:bg-white/10 hover:text-white'
      }`
    }
  >
    <div className="flex-shrink-0">{icon}</div>
    {open && <span>{label}</span>}
  </NavLink>
);

const SidebarIcon = ({ type }) => {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    users: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M17 20H3v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M23 20v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    reports: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };
  return icons[type] || null;
};
