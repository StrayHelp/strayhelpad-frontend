import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export const Layout = ({ children, title }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gray-900 text-white transition-all`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center font-bold">
              SH
            </div>
            {sidebarOpen && <span className="font-bold">StrayHelp</span>}
          </div>
        </div>

        <nav className="mt-6 space-y-2 px-2">
          <SidebarItem to="/"label="Dashboard" open={sidebarOpen} />
          <SidebarItem to="/users"label="Users" open={sidebarOpen} />
          <SidebarItem to="/reports"label="Reports" open={sidebarOpen} />
          <SidebarItem to="/donations"label="Donations" open={sidebarOpen} />
          <SidebarItem to="/organizations"label="Organizations" open={sidebarOpen} />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">

        {/* Header */}
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
            {title && <h1 className="text-xl font-bold">{title}</h1>}
          </div>

          <div className="text-sm text-gray-500">
            Admin Panel
          </div>
        </header>

        <main className="p-6 overflow-auto flex-1">
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
        `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
          isActive ? 'bg-gray-800' : 'hover:bg-gray-800'
        }`
      }
    >
      <span className="text-xl">{icon}</span>
      {open && <span>{label}</span>}
    </NavLink>
  );
};