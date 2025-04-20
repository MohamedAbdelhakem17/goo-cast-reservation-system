import { Routes, Route, useLocation } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import LoadingScreen from "../components/loading-screen/LoadingScreen";
import ProtectedRoute from "../components/Protected-Route/ProtectedRoute";
import BookingProvider from "../context/Booking-Context/BookingContext";
import AdminDashboardLayout from "../components/layout/Admin-Dashboard/AdminDashboard";
import MainLayout from "../components/layout/Main-Layout/MainLayout";
import UserDashboardLayout from "../components/layout/User-Dashboard/UserDashboard";

// Pages Public
const Home = lazy(() => import("../pages/Home/Home"));
const Studios = lazy(() => import("../pages/Studios/Studios"));
const StudioDetails = lazy(() => import("../pages/Studio-Details/StudioDetails"));
const Booking = lazy(() => import("../pages/Booking/Booking"));
const NotFound = lazy(() => import("../pages/Not-Found/NotFound"));

// Authentication admin
const Welcome = lazy(() => import("../pages/Admin-Dashboard/Wellcome/Welcome"));
const StudioManagement = lazy(() => import("../pages/Admin-Dashboard/Studio-Management/StudioManagement"));
const PriceManagement = lazy(() => import("../pages/Admin-Dashboard/Price-Management/PriceManagement"));
const ServiceManagement = lazy(() => import("../pages/Admin-Dashboard/Service-Management/ServiceManagement"));
const PageAnalytics = lazy(() => import("../pages/Admin-Dashboard/Page-Analytics/PageAnalytics"));

// Authentication user
const UserProfile = lazy(() => import("../pages/User-Dashboard/User-Profile/UserProfile"));
const UserBookings = lazy(() => import("../pages/User-Dashboard/User-Bookings/UserBookings"));

export default function AppRouter() {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0, { behavior: "smooth" });
    }, [location.pathname]);

    useEffect(() => {
        const cleanLocalStorage = () => {
            if (
                location.pathname !== "/booking" &&
                !location.search.startsWith("?step=")
            ) {
                localStorage.removeItem("bookingData");
            }
        };
        cleanLocalStorage();
    }, [location]);


    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes location={location} key={location.pathname}>
                {/* Main Layout with Navbar and Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/studios" element={<Studios />} />
                    <Route path="/studio/:id" element={<StudioDetails />} />
                    <Route path="/booking" element={
                        <BookingProvider>
                            <Booking />
                        </BookingProvider>
                    } />

                </Route>

                {/* Admin Dashboard Layout */}
                <Route path="/admin-dashboard/*" element={
                    <ProtectedRoute allowedRoles={["admin"]}>
                        <AdminDashboardLayout />
                    </ProtectedRoute>}>
                    <Route path="welcome" element={<Welcome />} />
                    <Route path="studio-management" element={<StudioManagement />} />
                    <Route path="price-management" element={<PriceManagement />} />
                    <Route path="service-management" element={<ServiceManagement />} />
                    <Route path="analytics" element={<PageAnalytics />} />
                </Route>

                {/* User Dashboard Layout */}
                <Route path="/user-dashboard/*" element={<ProtectedRoute allowedRoles={["user"]}>
                    <UserDashboardLayout />
                </ProtectedRoute>}>
                    <Route path="profile" element={<UserProfile />} />
                    <Route path="bookings" element={<UserBookings />} />
                </Route>

                {/* Not Found */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
