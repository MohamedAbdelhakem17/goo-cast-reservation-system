import AdminDashboardLayout from "@/layout/admin-dashboard/admin-dashboard";
import { Navigate, Route } from "react-router-dom";

import ProtectedRoute from "./protected-route";

import { lazy } from "react";
import hasPermission from "../../utils/access-roles";

import SYSTEM_ROLES from "../../utils/constant/system-roles.constant";
import { useAuth } from "./../../context/Auth-Context/AuthContext";

// Authentication admin
const Dashboard = lazy(
  () => import("@/features/admin-dashboard/pages/dashboard/dashboard"),
);

const StudioManagement = lazy(
  () => import("@/features/admin-dashboard/pages/studio-management/studio-management"),
);

const AddStudio = lazy(
  () =>
    import("@/features/admin-dashboard/pages/studio-management/add-studio/add-studio"),
);

const PriceManagement = lazy(
  () => import("@/features/admin-dashboard/pages/price-management/price-management"),
);
const ServiceManagement = lazy(
  () => import("@/features/admin-dashboard/pages/service-management/service-management"),
);

const AddService = lazy(
  () =>
    import("@/features/admin-dashboard/pages/service-management/add-service/add-service"),
);

const AddonsManagement = lazy(
  () => import("@/features/admin-dashboard/pages/addons-management/addons-management"),
);

const AddAddons = lazy(
  () =>
    import("@/features/admin-dashboard/pages/addons-management/add-addons/add-addons"),
);
// const PageAnalytics = lazy(() =>
//     import("@/features/admin-dashboard/pages/page-analytics/page-analytics")
// );
const BookingManagement = lazy(
  () => import("@/features/admin-dashboard/pages/booking-management/booking-management"),
);

const AddBooking = lazy(
  () =>
    import("@/features/admin-dashboard/pages/booking-management/add-booking/add-booking"),
);
const CategoryManagement = lazy(
  () =>
    import("@/features/admin-dashboard/pages/category-management/category-management"),
);
const AdminManagement = lazy(
  () => import("@/features/admin-dashboard/pages/admin-management/admin-management"),
);
const UserManagement = lazy(
  () => import("@/features/admin-dashboard/pages/user-management/user-management"),
);
const UserProfileInfo = lazy(
  () => import("@/features/admin-dashboard/pages/user-management/[id]/user-profile-info"),
);
const CouponManagement = lazy(
  () => import("@/features/admin-dashboard/pages/coupon-management/coupon-management"),
);

const adminRoutes = [
  // Dashboard
  {
    path: "",
    element: <Dashboard />,
    permission: "manage:dashboard",
    index: true,
  },

  // Setting
  { path: "studio", element: <StudioManagement />, permission: "manage:setting" },
  { path: "studio/add", element: <AddStudio />, permission: "manage:setting" },
  { path: "category", element: <CategoryManagement />, permission: "manage:setting" },
  { path: "price", element: <PriceManagement />, permission: "manage:setting" },
  { path: "service", element: <ServiceManagement />, permission: "manage:setting" },
  { path: "service/add", element: <AddService />, permission: "manage:setting" },
  { path: "addons", element: <AddonsManagement />, permission: "manage:setting" },
  { path: "addons/add", element: <AddAddons />, permission: "manage:setting" },
  { path: "admins", element: <AdminManagement />, permission: "manage:setting" },
  { path: "coupon", element: <CouponManagement />, permission: "manage:setting" },

  // CRM
  { path: "booking", element: <BookingManagement />, permission: "manage:crm" },
  { path: "booking/add", element: <AddBooking />, permission: "manage:crm" },
  { path: "users", element: <UserManagement />, permission: "manage:crm" },
  { path: "users/:id", element: <UserProfileInfo />, permission: "manage:crm" },
];

export default function AdminRoute() {
  const { user } = useAuth();

  const redirectTo = [SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.MANAGER].includes(user?.role)
    ? "/admin-dashboard"
    : "/";

  const filteredAdminRoutes = adminRoutes.filter((route) =>
    hasPermission(user?.role, route.permission),
  );

  return (
    <Route
      path="/admin-dashboard/*"
      element={
        <ProtectedRoute
          allowedRoles={[SYSTEM_ROLES.ADMIN, SYSTEM_ROLES.MANAGER]}
          redirectTo={redirectTo}
        >
          <AdminDashboardLayout userRole={user?.role} />
        </ProtectedRoute>
      }
    >
      {filteredAdminRoutes.map(({ path, element, permission, index }) => (
        <Route key={path || "index"} path={path} index={index} element={element} />
      ))}

      <Route path="*" element={<Navigate to={redirectTo} replace />} />
    </Route>
  );
}
