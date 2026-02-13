import BookingProvider from "@/context/Booking-Context/BookingContext";
import MainLayout from "@/layout/main-layout/main-layout";
import { Route } from "react-router-dom";

import { lazy } from "react";

// Pages Public
const Home = lazy(() => import("@/features/public/pages/home/home"));
const Studios = lazy(() => import("@/features/studio/pages/studios/studios"));
const StudioDetails = lazy(
  () => import("@/features/studio/pages/studio-details/studio-details"),
);
const Booking = lazy(() => import("@/features/booking/pages/booking/booking"));
const ConfirmationBooking = lazy(
  () => import("@/features/booking/pages/confirmation-booking/confirmation-booking"),
);
const Offers = lazy(() => import("@/features/public/pages/offers/offers"));

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
            <Booking />
          </BookingProvider>
        }
      />
      <Route
        path="/booking/confirmation"
        element={
          <BookingProvider>
            <ConfirmationBooking />
          </BookingProvider>
        }
      />

      <Route path="/offers/:slug" element={<Offers />} />
    </Route>
  );
}
