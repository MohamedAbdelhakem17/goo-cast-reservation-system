import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminDashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className="fixed md:static w-64 bg-gray-800 text-white flex flex-col transform md:translate-x-0 transition-transform duration-300 z-50"
      >
        <div className="p-4 text-center font-bold text-lg border-b border-gray-700">
          Admin Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/admin-dashboard/welcome"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
            }
          >
            Welcome
          </NavLink>
          <NavLink
            to="/admin-dashboard/studio-management"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
            }
          >
            Studio Management
          </NavLink>
          <NavLink
            to="/admin-dashboard/price-management"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
            }
          >
            Price Management
          </NavLink>
          <NavLink
            to="/admin-dashboard/service-management"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
            }
          >
            Service Management
          </NavLink>
          <NavLink
            to="/"
            className="block px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Website
          </NavLink>
          <button
            onClick={() => console.log('Logout')}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600 text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto ml-0 md:ml-64">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
