import { Routes, Route, useLocation } from 'react-router-dom';
import React, { Suspense, lazy, useEffect } from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import LoadingScreen from '../components/loading-screen/LoadingScreen';

// Lazy load the components to improve performance
const Home = lazy(() => import("../pages/Home/Home"));
const Studios = lazy(() => import("../pages/Studios/Studios"));
const StudioDetails = lazy(() => import("../pages/Studio-Details/StudioDetails"));
const Booking = lazy(() => import("../pages/Booking/Booking"));
const NotFound = lazy(() => import("../pages/Not-Found/NotFound"));

// This is the main router component that handles the routing of the application
export default function AppRouter() {
    const location = useLocation()

    useEffect(() => {
        window.scrollTo(0, 0, { behavior: 'smooth' });
    }, [location.pathname]);

    return (
        <Suspense fallback={<LoadingScreen />}>
            <Navbar />
            <main className='container mx-auto  py-16 my-8'>
                <Routes location={location} key={location.pathname}>
                    <Route index={true} path="/goocast" element={<Home />} />
                    <Route path="/studios" element={<Studios />} />
                    <Route path="/studio/:id" element={<StudioDetails />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
            <Footer />
        </Suspense>
    );
}


