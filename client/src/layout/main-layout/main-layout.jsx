import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/layout/_components/navbar/navbar';
import Footer from '@/layout/_components/footer/footer';


const MainLayout = () => {
    const location = useLocation();
    const isBookingPage = location.pathname === "/booking"

    return (
        <>
            {/* Main Layout */}
            <div className="flex flex-col min-h-screen">

                {/* Navbar */}
                {
                    location.pathname !== "/booking" && <Navbar />
                }


                {/* Main Content */}
                <main className={`flex flex-col ${location.pathname !== "/booking" ? "pt-16" : ""} flex-1`}>
                    <Outlet />
                </main>

                {/* Footer */}
                {!isBookingPage && <Footer />}
            </div>
        </>
    );
};

export default MainLayout;
