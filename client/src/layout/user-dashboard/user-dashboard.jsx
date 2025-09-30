import { NavLink, Outlet } from "react-router-dom";
import Signout from "@/apis/auth/signout.api";
import { User, CalendarDays, Home, LogOut } from "lucide-react";
import DashboardSidebar from "../_components/dashboard-sidebar/dashboard-sidebar";

const UserDashboardLayout = () => {
  // hooks
  const { handelLogout } = Signout();

  // Variables
  const navLinks = [
    { name: "Profile", path: "/user-dashboard/profile", icon: User },
    { name: "My Bookings", path: "/user-dashboard/bookings", icon: CalendarDays },
    { name: "Back to Website", path: "/", icon: Home },
  ];

  <div className="flex h-screen flex-col md:flex-row">
    <DashboardSidebar>
      {/* Links */}
      {navLinks.map(({ name, path, icon: Icon }, index) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 ${
              isActive
                ? "border-l-4 border-red-600 bg-red-50 font-bold text-red-600"
                : "font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
            }`
          }
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <Icon className="h-5 w-5 flex-shrink-0" />
          <span className="truncate">{name}</span>
        </NavLink>
      ))}

      {/* Logout */}
      <button
        onClick={handelLogout}
        className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-lg border-t border-gray-200 px-4 py-3 pt-4 text-left text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
      >
        <LogOut className="h-5 w-5 flex-shrink-0 rotate-180" />
        <span>Logout</span>
      </button>
    </DashboardSidebar>

    {/* Main Content */}
    <main className="mt-16 flex-1 bg-gray-50 p-4 md:mt-0 md:p-6">
      <Outlet />
    </main>
  </div>;
};

export default UserDashboardLayout;
