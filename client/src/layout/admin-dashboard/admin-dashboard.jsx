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
  Blocks,
  Users,
  LogOut,
} from "lucide-react";
import DashboardSidebar from "../_components/dashboard-sidebar/dashboard-sidebar";

const AdminDashboardLayout = () => {
  // hooks
  const { handelLogout } = Signout();

  // Variables
  const navLinks = [
    { name: "Dashboard", path: "/admin-dashboard", icon: Home },
    // { name: "Analytics", path: "/admin-dashboard/analytics", icon: BarChart },
    {
      name: "Category",
      path: "/admin-dashboard/category",
      icon: LayoutList,
    },
    {
      name: "Service",
      path: "/admin-dashboard/service",
      icon: Wrench,
    },
    {
      name: "Addons",
      path: "/admin-dashboard/addons",
      icon: Blocks,
    },
    {
      name: "Studio",
      path: "/admin-dashboard/studio",
      icon: Building,
    },
    {
      name: "Price",
      path: "/admin-dashboard/price",
      icon: DollarSign,
    },
    {
      name: "Booking",
      path: "/admin-dashboard/booking",
      icon: CalendarDays,
    },
    {
      name: "Coupon",
      path: "/admin-dashboard/coupon",
      icon: Ticket,
    },
    {
      name: "Customers",
      path: "/admin-dashboard/users",
      icon: Users,
    },
    { name: "Back to Website", path: "/", icon: Home },
  ];

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar>
        {/* Links */}
        {navLinks.map(({ name, path, icon: Icon }, index) => (
          <NavLink
            key={name}
            end={path === "/admin-dashboard"}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 md:px-4 md:py-3 ${
                isActive
                  ? "border-l-4 border-red-600 bg-red-50 font-bold text-red-600"
                  : "font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              }`
            }
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <Icon className="h-4 w-4 flex-shrink-0 md:h-5 md:w-5" />
            <span className="truncate text-xs md:text-sm">{name}</span>
          </NavLink>
        ))}

        {/* Logout */}
        <button
          onClick={handelLogout}
          className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-lg border-t border-gray-200 px-3 py-2.5 pt-4 text-left text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 md:px-4 md:py-3 md:text-sm"
        >
          <LogOut className="h-4 w-4 flex-shrink-0 rotate-180 md:h-5 md:w-5" />
          <span>Logout</span>
        </button>
      </DashboardSidebar>

      {/* Main Content */}
      <main className="ml-0 flex-1 bg-gray-50 p-3 md:ml-72 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
