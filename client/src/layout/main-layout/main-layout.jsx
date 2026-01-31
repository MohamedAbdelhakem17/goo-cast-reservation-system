import Footer from "@/layout/_components/footer/footer";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../_components/navbar/navbar";
import PromotionsBar from "../_components/promotions-bar/promotions-bar";

const MainLayout = () => {
  const location = useLocation();
  const isBookingPage = location.pathname === "/booking";

  return (
    <>
      {/* Main Layout */}
      <div className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        {/* Fixed Header Container: Promotions Bar + Navbar */}

        <div className="fixed top-0 left-0 z-50 w-full">
          <PromotionsBar />

          {location.pathname !== "/booking" && <Navbar />}
        </div>

        {/* Main Content */}
        <main
          className={`flex flex-col ${location.pathname !== "/booking" ? "pt-16" : ""} flex-1`}
        >
          <Outlet />
        </main>

        {/* Footer */}
        {!isBookingPage && <Footer />}
      </div>
    </>
  );
};

export default MainLayout;
