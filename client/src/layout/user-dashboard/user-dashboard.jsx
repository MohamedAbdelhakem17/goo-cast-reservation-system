import { NavLink, Outlet } from 'react-router-dom';
import Signout from '@/apis/auth/signout.api';
import {
  User,
  CalendarDays,
  Home,
  LogOut,
} from "lucide-react";
import DashboardSidebar from '../_components/dashboard-sidebar/dashboard-sidebar';

const UserDashboardLayout = () => {
  // hooks
  const { handelLogout } = Signout();

  // Variables
  const navLinks = [
    { name: "Profile", path: "/user-dashboard/profile", icon: User },
    { name: "My Bookings", path: "/user-dashboard/bookings", icon: CalendarDays },
    { name: "Back to Website", path: "/", icon: Home },
  ];

  return (
    <div className="flex h-screen">
      <DashboardSidebar>
        {/* Links */}
        {navLinks.map(({ name, path, icon: Icon }) => (
          // Link
          <NavLink key={name} to={path} className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-normal text-sm
      ${isActive
              ? "bg-red-100 text-red-600"
              : "text-gray-700 hover:bg-gray-100"
            }`
          }
          >
            <Icon className="w-4 h-4" />
            {name}
          </NavLink>
        ))}

        {/* Logout button */}
        <button onClick={handelLogout}
          className="flex items-center gap-2 w-full text-sm text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
          <LogOut className="w-4 h-4 rotate-180" />
          Logout
        </button>
      </DashboardSidebar>

      {/* Main Content */}
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default UserDashboardLayout;