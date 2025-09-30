import { Suspense, lazy, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useAuth } from "../context/Auth-Context/AuthContext";
import { LoadingScreen, ErrorBoundary } from "@/components/common";

import { trackPageView } from "@/utils/gtm";
import { AdminRoute, PublicRoute, UserRoute } from "./_components";
import { useCleanLocalStorage } from "@/hooks";

const SuccessLogin = lazy(
  () => import("@/features/auth/pages/success-login/success-login"),
);
const NotFound = lazy(() => import("@/features/public/pages/Not-Found/NotFound"));

export default function AppRouter() {
  const { loading } = useAuth();
  const location = useLocation();
  const cleanLocalStorage = useCleanLocalStorage();

  useEffect(() => {
    window.scrollTo(0, 0, { behavior: "smooth" });
  }, [location.pathname]);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location]);

  useEffect(() => {
    cleanLocalStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (loading) return <LoadingScreen />;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <ErrorBoundary>
        <Routes location={location} key={location.pathname}>
          {/* Main Layout with Navbar and Footer */}
          {PublicRoute()}

          {/* Admin Dashboard Layout */}
          {AdminRoute()}

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
