import { NavLink, Outlet } from "react-router-dom";
import Signout from "@/apis/auth/signout.api";
import {
  Home,
  BarChart,
  LayoutList,
  Wrench,
  Building,
  DollarSign,
  CalendarDays,
  Ticket,
  Users,
  LogOut,
} from "lucide-react";
import DashboardSidebar from "../_components/dashboard-sidebar/dashboard-sidebar";

const AdminDashboardLayout = () => {
  // hooks
  const { handelLogout } = Signout();

  // Variables
  const navLinks = [
    { name: "Home", path: "/admin-dashboard/welcome", icon: Home },
    { name: "Analytics", path: "/admin-dashboard/analytics", icon: BarChart },
    {
      name: "Category Management",
      path: "/admin-dashboard/category-management",
      icon: LayoutList,
    },
    {
      name: "Service Management",
      path: "/admin-dashboard/service-management",
      icon: Wrench,
    },
    {
      name: "Studio Management",
      path: "/admin-dashboard/studio-management",
      icon: Building,
    },
    {
      name: "Price Management",
      path: "/admin-dashboard/price-management",
      icon: DollarSign,
    },
    {
      name: "Booking Management",
      path: "/admin-dashboard/booking-management",
      icon: CalendarDays,
    },
    {
      name: "Coupon Management",
      path: "/admin-dashboard/coupon-management",
      icon: Ticket,
    },
    {
      name: "User Management",
      path: "/admin-dashboard/user-management",
      icon: Users,
    },
    { name: "Back to Website", path: "/", icon: Home },
  ];

  return (
    <div className="flex h-screen">
      <DashboardSidebar>
        {/* Links */}
        {navLinks.map(({ name, path, icon: Icon }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
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

        {/* Logout */}
        <button
          onClick={handelLogout}
          className="flex items-center gap-2 w-full text-sm text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
        >
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

export default AdminDashboardLayout;
