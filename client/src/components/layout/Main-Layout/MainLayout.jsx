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

        {/* <WhatsAppButton /> */}
      </div>
    </>
  );
};

export default MainLayout;
