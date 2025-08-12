import { Route } from "react-router-dom";
import UserDashboardLayout from "@/layout/user-dashboard/user-dashboard";
import { lazy } from "react";
import ProtectedRoute from "./protected-route";


// Authentication user
const UserProfile = lazy(() =>
    import("@/features/user-dashboard/pages/User-Profile/UserProfile")
);

const UserBookings = lazy(() =>
    import("@/features/user-dashboard/pages/User-Bookings/UserBookings")
);




export default function UserRoute() {
    return (
        <Route
            path="/user-dashboard/*"
            element={
                <ProtectedRoute allowedRoles={["user"]}>
                    <UserDashboardLayout />
                </ProtectedRoute>
            }
        >
            <Route path="profile" element={<UserProfile />} />
            <Route path="bookings" element={<UserBookings />} />
        </Route>

    );
}
