import { Route } from "react-router-dom";
import UserDashboardLayout from "@/layout/user-dashboard/user-dashboard";
import { lazy } from "react";
import ProtectedRoute from "./protected-route";

// Authentication user
const UserProfile = lazy(
  () => import("@/features/user-dashboard/pages/user-profile/user-profile"),
);

const UserBookings = lazy(
  () => import("@/features/user-dashboard/pages/user-bookings/user-bookings"),
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
      <Route index={true} element={<UserProfile />} />
      <Route path="bookings" element={<UserBookings />} />
    </Route>
  );
}
