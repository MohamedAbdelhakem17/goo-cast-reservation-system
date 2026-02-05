import AdminDashboardLayout from "@/layout/admin-dashboard/admin-dashboard";
import { Navigate, Route } from "react-router-dom";

import ProtectedRoute from "./protected-route";

import { lazy } from "react";
import hasPermission from "../../utils/access-roles";

import POLICIES_ROLES from "../../utils/constant/system-policies-roles";
import SYSTEM_ROLES from "../../utils/constant/system-roles.constant";

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
const PromotionsManagement = lazy(
  () =>
    import(
      "@/features/admin-dashboard/pages/promotions-management/promotions-management"
    ),
);

const adminRoutes = [
  // Dashboard
  {
    path: "",
    element: <Dashboard />,
    permission: POLICIES_ROLES.MANAGE_DASHBOARD,
    index: true,
  },

  // Setting
  {
    path: "studio",
    element: <StudioManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "studio/add",
    element: <AddStudio />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "category",
    element: <CategoryManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "price",
    element: <PriceManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "service",
    element: <ServiceManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "service/add",
    element: <AddService />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "addons",
    element: <AddonsManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "addons/add",
    element: <AddAddons />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "admins",
    element: <AdminManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "promotions",
    element: <PromotionsManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },
  {
    path: "coupons",
    element: <CouponManagement />,
    permission: POLICIES_ROLES.MANAGE_SETTING,
  },

  // CRM
  {
    path: "booking",
    element: <BookingManagement />,
    permission: POLICIES_ROLES.MANAGE_CRM,
  },
  {
    path: "booking/add",
    element: <AddBooking />,
    permission: POLICIES_ROLES.MANAGE_CRM,
  },
  {
    path: "users",
    element: <UserManagement />,
    permission: POLICIES_ROLES.MANAGE_CRM,
  },
  {
    path: "users/:id",
    element: <UserProfileInfo />,
    permission: POLICIES_ROLES.MANAGE_CRM,
  },
];

export default function AdminRoute(user) {
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
