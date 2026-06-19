import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import strayHelpLogo from '../assets/StrayHelp-Logo-1.png';
import { useSettingsContext } from '../context/SettingsContext';
import { useI18n } from '../hooks/useI18n';
import api from '../services/api';

export const Layout = ({ children, title, searchValue, onSearchChange }) => {
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
            <SidebarItem to="/dashboard" label={t('navDashboard', 'Dashboard')} open={sidebarOpen} icon={<SidebarIcon type="dashboard" />} />
            <SidebarItem to="/users" label={t('navUsers', 'Users')} open={sidebarOpen} icon={<SidebarIcon type="users" />} />
            <SidebarItem to="/reports" label={t('navReports', 'Reports')} open={sidebarOpen} icon={<SidebarIcon type="reports" />} />
            <SidebarItem to="/donations" label={t('navDonations', 'Donations')} open={sidebarOpen} icon={<SidebarIcon type="donations" />} />
            <SidebarItem to="/adoptions" label={t('navAdoptions', 'Adoptions')} open={sidebarOpen} icon={<SidebarIcon type="adoptions" />} />
            <SidebarItem to="/organizations" label={t('navOrganizations', 'Organizations')} open={sidebarOpen} icon={<SidebarIcon type="organizations" />} />
            <SidebarItem to="/settings" label={t('navSettings', 'Settings')} open={sidebarOpen} icon={<SidebarIcon type="settings" />} />
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
              ☰
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
                  <path d="M11 18a7 7 0 1 1 0-14 7 7 0 0 1 0 14Z" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m20 20-3.4-3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            <button className="hidden rounded-full border border-[#e2e6dc] bg-white p-2 text-[#6c7669] shadow-sm lg:inline-flex" type="button">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                <path d="M15 17h5l-1.4-1.4A2 2 0 0 1 18 14.2V11a6 6 0 1 0-12 0v3.2c0 .5-.2 1-.6 1.4L4 17h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M9.5 19a2.5 2.5 0 0 0 5 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm"
                onClick={() => setProfileOpen((open) => !open)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                {profilePicture ? (
                  <img src={profilePicture} alt="Admin profile" className="h-9 w-9 rounded-full object-cover" />
                ) : (
                  <div className="h-9 w-9 rounded-full bg-[#e6eadf]" />
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-[#4b5548]">{adminName}</p>
                  <p className="text-xs text-[#9aa294]">{adminEmail}</p>
                </div>
              </button>

              {profileOpen && (
                <div
                  role="menu"
                  className="absolute right-0 mt-3 w-44 rounded-2xl border border-[#e2e6dc] bg-white p-2 text-sm text-[#4b5548] shadow-lg"
                >
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleLogout}
                    className="w-full rounded-xl px-3 py-2 text-left transition hover:bg-[#f3f5ef]"
                  >
                    {t('logout', 'Logout')}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

/* Sidebar Item */
const SidebarItem = ({ to, icon, label, open }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
          isActive ? 'bg-white/20 text-white' : 'text-white/80 hover:bg-white/10'
        }`
      }
    >
      <span className="text-lg">{icon}</span>
      {open && <span>{label}</span>}
    </NavLink>
  );
};

const SidebarIcon = ({ type }) => {
  const commonProps = {
    className: 'h-5 w-5',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  switch (type) {
    case 'dashboard':
      return (
        <svg viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="2" />
          <rect x="14" y="3" width="7" height="7" rx="2" />
          <rect x="3" y="14" width="7" height="7" rx="2" />
          <rect x="14" y="14" width="7" height="7" rx="2" />
        </svg>
      );
    case 'users':
      return (
        <svg viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
          <path d="M16 11a4 4 0 1 0-8 0" />
          <path d="M4 20a8 8 0 0 1 16 0" />
          <circle cx="12" cy="7" r="3" />
        </svg>
      );
    case 'reports':
      return (
        <svg viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
          <path d="M6 4h9l3 3v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
          <path d="M14 4v4h4" />
          <path d="M8 13h8" />
          <path d="M8 17h6" />
        </svg>
      );
    case 'donations':
      return (
        <svg viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
          <path d="M12 21s-6-4.6-8.5-7.5A5 5 0 0 1 12 6a5 5 0 0 1 8.5 7.5C18 16.4 12 21 12 21Z" />
        </svg>
      );
    case 'organizations':
      return (
        <svg viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
          <path d="M3 20h18" />
          <path d="M5 20V8l7-4 7 4v12" />
          <path d="M9 20v-6h6v6" />
        </svg>
      );
    case 'adoptions':
      return (
        <svg viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
          <path d="M12 21s-6.5-4.6-8.7-7.7A5.1 5.1 0 0 1 12 6a5.1 5.1 0 0 1 8.7 7.3C18.5 16.4 12 21 12 21Z" />
          <path d="M12 10.2v4.8" />
          <path d="M9.6 12.6h4.8" />
        </svg>
      );
    case 'settings':
    default:
      return (
        <svg viewBox="0 0 24 24" {...commonProps} aria-hidden="true">
          <path d="M12 15a3 3 0 1 0-3-3" />
          <path d="M19.4 15a7.5 7.5 0 0 0 .1-2l2-1.2-2-3.4-2.2.6a7.6 7.6 0 0 0-1.6-.9L14 4h-4l-.7 2.9c-.6.2-1.1.5-1.6.9l-2.2-.6-2 3.4 2 1.2a7.5 7.5 0 0 0 0 2l-2 1.2 2 3.4 2.2-.6c.5.4 1 .7 1.6.9L10 20h4l.7-2.9c.6-.2 1.1-.5 1.6-.9l2.2.6 2-3.4-2-1.2Z" />
        </svg>
      );
  }
};