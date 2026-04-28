import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-900 text-white transition-all duration-300 overflow-y-auto`}
      >
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center font-bold">
              SH
            </div>
            {sidebarOpen && (
              <span className="font-bold text-lg">StrayHelp</span>
            )}
          </div>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          <SidebarItem to="/" icon="📊" label="Dashboard" open={sidebarOpen} />
          <SidebarItem to="/users" icon="👥" label="Users" open={sidebarOpen} />
          <SidebarItem to="/reports" icon="📝" label="Reports" open={sidebarOpen} />
          <SidebarItem to="/donations" icon="💝" label="Donations" open={sidebarOpen} />
          <SidebarItem to="/organizations" icon="🏢" label="Organizations" open={sidebarOpen} />
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                ☰
              </button>
              {title && (
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {admin?.email}
                </p>
                <p className="text-xs text-gray-600">Administrator</p>
              </div>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

/* ---------------- Sidebar Item ---------------- */

interface SidebarItemProps {
  to: string;
  icon: string;
  label: string;
  open: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  to,
  icon,
  label,
  open,
}) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-lg transition text-sm ${
          isActive ? 'bg-gray-800 text-white' : 'hover:bg-gray-800 text-gray-300'
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {open && <span>{label}</span>}
    </NavLink>
  );
};