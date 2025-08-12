import { Route } from "react-router-dom";
import MainLayout from "@/layout/main-layout/main-layout";
import BookingProvider from "@/context/Booking-Context/BookingContext";

import { lazy } from "react";

// Pages Public
const Home = lazy(() => import("@/features/public/pages/Home/Home"));
const Studios = lazy(() => import("@/features/studio/pages/Studios/Studios"));
const StudioDetails = lazy(() =>
    import("@/features/studio/pages/studio-details/studio-details")
);
const Booking = lazy(() => import("@/features/booking/pages/Booking/Booking"));
const ConfirmationBooking = lazy(() =>
    import("@/features/booking/pages/Confirmation-Booking/ConfirmationBooking")
);

export default function PublicRoute() {
    return (
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/setups" element={<Studios />} />
            <Route path="/setups/:id" element={<StudioDetails />} />
            <Route
                path="/booking"
                element={
                    <BookingProvider>
                        {" "}
                        <Booking />{" "}
                    </BookingProvider>
                }
            />
            <Route
                path="/booking/confirmation"
                element={
                    <BookingProvider>
                        {" "}
                        <ConfirmationBooking />{" "}
                    </BookingProvider>
                }
            />
        </Route>
    );
}
