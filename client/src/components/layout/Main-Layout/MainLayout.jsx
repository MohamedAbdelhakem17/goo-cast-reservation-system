import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import PageTracker from '../../PageTracker/PageTracker';

const MainLayout = () => {
    return (
        <>
            {/* Page Tracker */}

            <PageTracker />

            {/* Main Layout */}
            <div className="flex flex-col min-h-screen">

                {/* Navbar */}
                <Navbar />

                {/* Main Content */}
                <main className="flex-1 container mx-auto px-4 py-8 mt-10">
                    <Outlet />
                </main>

                {/* Footer */}
                <Footer />
            </div>
        </>
    );
};

export default MainLayout;