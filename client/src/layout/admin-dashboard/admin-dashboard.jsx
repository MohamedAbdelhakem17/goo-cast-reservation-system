import Signout from "@/apis/auth/signout.api";
import { LanguageSwitcher } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import useAdminDashboardRoutes from "@/hooks/use-admin-dashboard-routes";
import { LogOut } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import DashboardSidebar from "../_components/dashboard-sidebar/dashboard-sidebar";
import AdminSidebarSection from "./_components/admin-sidebar-section";

const AdminDashboardLayout = ({ userRole }) => {
  // Translation
  const { t, lng, changeLanguage } = useLocalization();

  // Navigation
  const location = useLocation();

  // Mutation
  const { handelLogout } = Signout();

  // Hooks
  const sections = useAdminDashboardRoutes();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <DashboardSidebar>
        {/* Display Links */}
        {sections
          .filter((section) => section.roles.includes(userRole))
          .map((section) => (
            <AdminSidebarSection
              key={section.name}
              section={section}
              location={location}
            />
          ))}

        {/* Change Language action */}
        <div className="flex items-center justify-start py-1">
          <LanguageSwitcher lng={lng} changeLanguage={changeLanguage} />
        </div>

        {/* Logout Action */}
        <button
          onClick={handelLogout}
          className="mt-4 flex w-full cursor-pointer items-center gap-3 rounded-lg border-t border-gray-200 px-3 py-2.5 pt-4 text-left text-xs font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600 md:px-4 md:py-3 md:text-sm"
        >
          {/* Icon */}
          <LogOut className="h-4 w-4 flex-shrink-0 rotate-180 md:h-5 md:w-5" />

          {/* Label */}
          <span>{t("logout")}</span>
        </button>
      </DashboardSidebar>

      {/* Dashboard content */}
      <main className="ml-0 flex-1 p-3 md:ms-72 md:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
