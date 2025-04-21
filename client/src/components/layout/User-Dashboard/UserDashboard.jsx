import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const UserDashboardLayout = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-center font-bold text-lg border-b border-gray-700">
          User Dashboard
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <NavLink
            to="/user-dashboard/profile"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
            }
          >
            Profile
          </NavLink>
          <NavLink
            to="/user-dashboard/bookings"
            className={({ isActive }) =>
              `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
            }
          >
            My Bookings
          </NavLink>
          <NavLink
            to="/"
            className="block px-4 py-2 rounded hover:bg-gray-600"
          >
            Back to Website
          </NavLink>
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600 text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;
