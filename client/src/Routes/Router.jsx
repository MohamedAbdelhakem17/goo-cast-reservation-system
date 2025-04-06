import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
import Navbar from '../components/layout/Navbar/Navbar';
import Footer from '../components/layout/Footer/Footer';
import LoadingScreen from '../components/loading-screen/LoadingScreen';

// Lazy load the components to improve performance
const Home = lazy(() => import("../pages/Home/Home"));
const Studios = lazy(() => import("../pages/Studios/Studios"));
const StudioDetails = lazy(() => import("../pages/Studio-Details/StudioDetails"));


// This is the main router component that handles the routing of the application
export default function AppRouter() {
    return (
        <Router>
            <Suspense fallback={<LoadingScreen />}>
                <Navbar />
                <main className='container mx-auto  py-16 my-8'>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/studios" element={<Studios />} />
                        <Route path="/studio/:id" element={<StudioDetails />} />
                    </Routes>
                </main>
                <Footer />
            </Suspense>
        </Router>
    );
}


