import { ErrorBoundary, LoadingScreen } from "@/components/common";
import { Suspense, lazy, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth-Context/AuthContext";

import { AdminRoute, PublicRoute, UserRoute } from "./_components";

const SuccessLogin = lazy(
  () => import("@/features/auth/pages/success-login/success-login"),
);
const NotFound = lazy(() => import("@/features/public/pages/not-found/not-found"));

export default function AppRouter() {
  // NAvigation
  const location = useLocation();

  // Hooks
  const { loading, user } = useAuth();

  // Effect
  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
  }, [location.pathname]);

  // Loading Case
  if (loading) return <LoadingScreen />;

  console.log("User in Router:", user);
  return (
    <Suspense fallback={<LoadingScreen />}>
      <ErrorBoundary>
        <Routes location={location} key={location.pathname}>
          {/* Main Layout with Navbar and Footer */}
          {PublicRoute()}

          {/* Admin Dashboard Layout */}
          {AdminRoute(user)}

          {/* User Dashboard Layout */}
          {UserRoute()}

          {/* Success Login */}
          <Route path="/login/success" element={<SuccessLogin />} />

          {/* Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ErrorBoundary>
    </Suspense>
  );
}
