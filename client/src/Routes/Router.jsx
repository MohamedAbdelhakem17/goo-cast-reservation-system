import { Routes, Route, useLocation } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import LoadingScreen from "../components/loading-screen/LoadingScreen";
import ProtectedRoute from "../components/Protected-Route/ProtectedRoute";
import BookingProvider from "../context/Booking-Context/BookingContext";
import AdminDashboardLayout from "../components/layout/Admin-Dashboard/AdminDashboard";
import MainLayout from "../components/layout/Main-Layout/MainLayout";
import UserDashboardLayout from "../components/layout/User-Dashboard/UserDashboard";
import ErrorBoundary from "../components/Error-Boundary/ErrorBoundary";

// Pages Public
const Home = lazy(() => import("../pages/Home/Home"));
const Studios = lazy(() => import("../pages/Studios/Studios"));
const StudioDetails = lazy(() => import("../pages/Studio-Details/StudioDetails"));
const Booking = lazy(() => import("../pages/Booking/Booking"));
const ConfirmationBooking = lazy(() => import("../pages/Confirmation-Booking/ConfirmationBooking"));
const SuccessLogin = lazy(() => import("../pages/Success-Login/SuccessLogin"));
const NotFound = lazy(() => import("../pages/Not-Found/NotFound"));

// Authentication admin
const Welcome = lazy(() => import("../pages/Admin-Dashboard/Wellcome/Welcome"));
const StudioManagement = lazy(() => import("../pages/Admin-Dashboard/Studio-Management/StudioManagement"));
const PriceManagement = lazy(() => import("../pages/Admin-Dashboard/Price-Management/PriceManagement"));
const ServiceManagement = lazy(() => import("../pages/Admin-Dashboard/Service-Management/ServiceManagement"));
const PageAnalytics = lazy(() => import("../pages/Admin-Dashboard/Page-Analytics/PageAnalytics"));
const BookingManagement = lazy(() => import("../pages/Admin-Dashboard/Booking-Management/BookingManagement"));
const CategoryManagement = lazy(() => import("../pages/Admin-Dashboard/Category-Management/CategoryManagement"));
const UserManagement = lazy(() => import("../pages/Admin-Dashboard/User-Management/UserManagement"));
const CouponManagement = lazy(() => import("../pages/Admin-Dashboard/Coupon-Management/CouponManagement"));
const AddStudio = lazy(() => import("../pages/Admin-Dashboard/Studio-Management/Add-Studio/AddStudio"));

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
                localStorage.removeItem("bookingStep");

            }
        };
        cleanLocalStorage();
    }, [location]);


    return (
        <Suspense fallback={<LoadingScreen />}>
            <ErrorBoundary>
                <Routes location={location} key={location.pathname}>
                    {/* Main Layout with Navbar and Footer */}
                    <Route element={<MainLayout />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/setups" element={<Studios />} />
                        <Route path="/studio/:id" element={<StudioDetails />} />
                        <Route path="/booking" element={<BookingProvider> <Booking /> </BookingProvider>} />
                        <Route path="/booking/confirmation" element={<BookingProvider> <ConfirmationBooking /> </BookingProvider>} />
                    </Route>

                    {/* Admin Dashboard Layout */}
                    <Route path="/admin-dashboard/*" element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboardLayout />
                        </ProtectedRoute>}>
                        <Route path="welcome" element={<Welcome />} />
                        <Route path="studio-management" element={<StudioManagement />} />
                        <Route path="category-management" element={<CategoryManagement />} />
                        <Route path="studio-management/add" element={<AddStudio />} />
                        <Route path="price-management" element={<PriceManagement />} />
                        <Route path="service-management" element={<ServiceManagement />} />
                        <Route path="booking-management" element={<BookingManagement />} />
                        <Route path="user-management" element={<UserManagement />} />
                        <Route path="coupon-management" element={<CouponManagement />} />
                        <Route path="analytics" element={<PageAnalytics />} />
                    </Route>

                    {/* User Dashboard Layout */}
                    <Route path="/user-dashboard/*" element={<ProtectedRoute allowedRoles={["user"]}>
                        <UserDashboardLayout />
                    </ProtectedRoute>}>
                        <Route path="profile" element={<UserProfile />} />
                        <Route path="bookings" element={<UserBookings />} />
                    </Route>

                    {/* Success Login */}
                    <Route path="/login/success" element={<SuccessLogin />} />

                    {/* Not Found */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </ErrorBoundary>
        </Suspense>
    );
}
