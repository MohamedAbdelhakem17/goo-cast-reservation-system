import { Route } from "react-router-dom";
import AdminDashboardLayout from "@/layout/admin-dashboard/admin-dashboard";
import ProtectedRoute from "./protected-route";

import { lazy } from "react";

// Authentication admin
const Welcome = lazy(() => import("@/features/admin-dashboard/pages/home/home"));

const StudioManagement = lazy(() =>
    import("@/features/admin-dashboard/pages/studio-management/studio-management")
);
const PriceManagement = lazy(() =>
    import("@/features/admin-dashboard/pages/price-management/price-management")
);
const ServiceManagement = lazy(() =>
    import("@/features/admin-dashboard/pages/service-management/service-management")
);
// const PageAnalytics = lazy(() =>
//     import("@/features/admin-dashboard/pages/page-analytics/page-analytics")
// );
const BookingManagement = lazy(() =>
    import("@/features/admin-dashboard/pages/booking-management/booking-management")
);
const CategoryManagement = lazy(() =>
    import("@/features/admin-dashboard/pages/category-management/category-management")
);
const UserManagement = lazy(() =>
    import("@/features/admin-dashboard/pages/user-management/user-management")
);
const CouponManagement = lazy(() =>
    import("@/features/admin-dashboard/pages/coupon-management/coupon-management")
);
const AddStudio = lazy(() =>
    import("@/features/admin-dashboard/pages/add-studio/add-studio")
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
            <Route path="welcome" element={<Welcome />} />
            <Route path="studio-management" element={<StudioManagement />} />
            <Route
                path="category-management"
                element={<CategoryManagement />}
            />
            <Route path="studio-management/add" element={<AddStudio />} />
            <Route path="price-management" element={<PriceManagement />} />
            <Route path="service-management" element={<ServiceManagement />} />
            <Route path="booking-management" element={<BookingManagement />} />
            <Route path="user-management" element={<UserManagement />} />
            <Route path="coupon-management" element={<CouponManagement />} />
            {/* <Route path="analytics" element={<PageAnalytics />} /> */}
        </Route>
    );
}
