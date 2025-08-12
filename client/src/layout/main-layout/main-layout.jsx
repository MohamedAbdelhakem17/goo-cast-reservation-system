import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/layout/navbar/Navbar';
import Footer from '@/layout/footer/footer';
import PageTracker from '@/components/page-tracker/page-tracker';

const MainLayout = () => {
    const location = useLocation();

    return (
        <>
            {/* Page Tracker */}

            <PageTracker />

            {/* Main Layout */}
            <div className="flex flex-col min-h-screen">

                {/* Navbar */}
                <Navbar />

                {/* Main Content */}
                <main className="flex-1 mt-10 ">
                    <Outlet />
                </main>

                {/* Footer */}
                {
                    location.pathname !== "/booking" && <Footer />
                }

            </div>
        </>
    );
};

export default MainLayout;