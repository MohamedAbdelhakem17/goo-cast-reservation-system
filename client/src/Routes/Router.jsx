import { Routes, Route, useLocation } from "react-router-dom";
import React, { Suspense, lazy, useEffect } from "react";
import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import LoadingScreen from "../components/loading-screen/LoadingScreen";
import ProtectedRoute from "../components/Protected-Route/ProtectedRoute";
import BookingProvider from "../context/Booking-Context/BookingContext";
// import FackHeader from "../test/fack-token";

const Home = lazy(() => import("../pages/Home/Home"));
const Studios = lazy(() => import("../pages/Studios/Studios"));
const StudioDetails = lazy(() => import("../pages/Studio-Details/StudioDetails"));
const Booking = lazy(() => import("../pages/Booking/Booking"));
const NotFound = lazy(() => import("../pages/Not-Found/NotFound"));
const AdminDashboard = lazy(() => import("../Admin-Dashboard/AdminDashboard"));
const UserDashboard = lazy(() => import("../User-Dashboard/UserDashboard"));

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
            <Navbar />
            <main className="container mx-auto py-16 my-8 px-4">
                {/* Test Token */}
                {/* <FackHeader /> */}

                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Home />} />
                    <Route path="/studios" element={<Studios />} />
                    <Route path="/studio/:id" element={<StudioDetails />} />
                    <Route path="/booking" element={
                        <BookingProvider>
                            <Booking />
                        </BookingProvider>
                    } />
                    <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/user" element={
                        <ProtectedRoute allowedRoles={['user']}>
                            <UserDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </Suspense>
    );
}
