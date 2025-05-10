import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Signout from '../../../apis/auth/signout.api';

const AdminDashboardLayout = () => {
  const navigate = useNavigate()
  // const { signout } = Signout()
  const { handelLogout } = Signout()

  const navigationLinks = [
    { path: '/admin-dashboard/welcome', name: 'Home' },
    { path: '/admin-dashboard/analytics', name: 'Analytics' },
    { path: '/admin-dashboard/category-management', name: 'Category Management' },
    { path: '/admin-dashboard/service-management', name: 'Service Management' },
    { path: '/admin-dashboard/studio-management', name: 'Studio Management' },
    { path: '/admin-dashboard/price-management', name: 'Price Management' },
    { path: '/admin-dashboard/booking-management', name: 'Booking Management' },
    { path: '/', name: 'Back to Website' },
  ];

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <div className="p-4 text-center font-bold text-lg border-b border-gray-700">
          Admin Dashboard
        </div>

        {/* Navigation links */}
        <nav className="flex-1 p-4 space-y-2">
          {navigationLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block px-4 py-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-600'}`
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Logout button */}
          <button
            onClick={handelLogout}
            className="block w-full text-left px-4 py-2 rounded hover:bg-gray-600 text-white"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
