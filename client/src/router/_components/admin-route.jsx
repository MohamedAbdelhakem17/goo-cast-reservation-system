import { Route } from "react-router-dom";
import AdminDashboardLayout from "@/layout/admin-dashboard/admin-dashboard";
import ProtectedRoute from "./protected-route";

import { lazy } from "react";

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
const CouponManagement = lazy(
  () => import("@/features/admin-dashboard/pages/coupon-management/coupon-management"),
);

export default function AdminRoute() {
  return (
    <Route
      path="/admin-dashboard/*"
      element={
        <ProtectedRoute allowedRoles={["admin"]}>
          <AdminDashboardLayout />
        </ProtectedRoute>
      }
    >
      <Route index={true} element={<Dashboard />} />
      <Route path="studio" element={<StudioManagement />} />
      <Route path="category" element={<CategoryManagement />} />
      <Route path="studio/add" element={<AddStudio />} />
      <Route path="price" element={<PriceManagement />} />
      <Route path="service" element={<ServiceManagement />} />
      <Route path="service/add" element={<AddService />} />
      <Route path="addons" element={<AddonsManagement />} />
      <Route path="addons/add" element={<AddAddons />} />
      <Route path="booking" element={<BookingManagement />} />
      <Route path="admins" element={<AdminManagement />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="coupon" element={<CouponManagement />} />
      {/* <Route path="analytics" element={<PageAnalytics />} /> */}
    </Route>
  );
}
