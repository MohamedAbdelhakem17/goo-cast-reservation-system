import { useBooking } from "@/context/Booking-Context/BookingContext";
import CartContent from "./_components/cart-content";
import { Loading } from "@/components/common";
import Sticky from "react-sticky-el";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Cart() {
  const { bookingData } = useBooking();

  if (!bookingData) {
    return <Loading />;
  }

  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      {/*  Cart */}
      <div className="block">
        {isDesktop ? (
          <Sticky
            topOffset={-150}
            bottomOffset={140}
            stickyStyle={{
              top: "190px",
              zIndex: 40,
              transition: "top 0.3s ease-in-out",
            }}
            boundaryElement="#cart-wrapper"
            hideOnBoundaryHit={true}
          >
            <CartContent />
          </Sticky>
        ) : (
          <CartContent />
        )}
      </div>
    </>
  );
}
