<<<<<<< HEAD:client/src/components/layout/Main-Layout/MainLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import PageTracker from "../../PageTracker/PageTracker";
// import WhatsAppButton from "./../Footer/whats-app-button";

const MainLayout = () => {
  const location = useLocation();

  return (
    <>
      {/* Page Tracker */}

      <PageTracker />

      {/* Main Layout */}
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        {location.pathname !== "/booking" && <Navbar />}
=======
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
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/layout/main-layout/main-layout.jsx

        {/* Main Content */}
        <main
          className={`flex flex-col ${
            location.pathname !== "/booking" ? "pt-16" : ""
          } flex-1`}
        >
          <Outlet />
        </main>

        {/* Footer */}
        {location.pathname !== "/booking" && <Footer />}

<<<<<<< HEAD:client/src/components/layout/Main-Layout/MainLayout.jsx
        {/* <WhatsAppButton /> */}
      </div>
    </>
  );
=======
                {/* Main Content */}
                <main className={`flex flex-col ${location.pathname !== "/booking" ? "pt-16" : ""} flex-1`}>
                    <Outlet />
                </main>

                {/* Footer */}
                {!isBookingPage && <Footer />}
            </div>
        </>
    );
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/layout/main-layout/main-layout.jsx
};

export default MainLayout;
