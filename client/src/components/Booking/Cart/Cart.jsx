import { useState } from "react";
import { useBooking } from "../../../context/Booking-Context/BookingContext";
import CartContent from "./Cart-content/CartContent";
import usePriceFormat from "../../../hooks/usePriceFormat";
import Sticky from "react-sticky-el";
import { ArrowLeft, ArrowRight, ShoppingCart, X } from "lucide-react";

export default function Cart() {
  const { bookingData, handleNextStep, handlePrevStep, hasError } =
    useBooking();
  const priceFormat = usePriceFormat();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const closeCart = () => setIsCartOpen(false);
  const openCart = () => setIsCartOpen(true);

  if (!bookingData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Desktop Cart - Hidden on mobile */}
      <div className="block ">
        <Sticky
          topOffset={-150}
          stickyStyle={{
            top: "170px",
            zIndex: 40,
            transition: "top 0.3s ease-in-out",
          }}
          boundaryElement="#cart-wrapper"
          // hideOnBoundaryHit={false}
        >
          <CartContent />
        </Sticky>
      </div>

      {/* Mobile Full Screen Cart Modal */}
      <div className="lg:hidden">
        {/* Overlay */}
        {isCartOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300"
            onClick={closeCart}
          />
        )}

        {/* Slide Panel */}
        <div
          className={`fixed top-0 right-0 h-full w-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-end p-4">
            <button onClick={closeCart} aria-label="Close cart">
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
          <CartContent />
        </div>
      </div>

      {/* Mobile Bottom Navigation - Fixed */}
      {/* <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">
                <div className="flex items-center justify-between max-w-md mx-auto">
                    <button
                        onClick={openCart}
                        className="flex items-center space-x-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                    >
                        <div className="relative">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                            <p className="text-sm font-medium">
                                {bookingData.totalPriceAfterDiscount && bookingData.totalPriceAfterDiscount !== 0
                                    ? priceFormat(bookingData.totalPriceAfterDiscount)
                                    : priceFormat(bookingData.totalPrice)}
                            </p>
                            <p className="text-xs text-gray-500">Total</p>
                        </div>
                    </button> */}

      {/* Navigation Buttons */}
      {/* <div className="flex items-center space-x-2">
                        {currentStep > 1 && (
                            <button
                                onClick={handlePrevStep}
                                className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                        )}

                        {currentStep === 4 && (
                            <button
                                disabled={hasError()}
                                onClick={handleNextStep}
                                className="disabled:bg-gray-100 disabled:text-gray-300 flex items-center space-x-2 px-6 py-2 rounded-full bg-main text-white font-medium hover:bg-main/90 transition-colors"
                            >
                                <span>Next</span>
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        )}

                        {currentStep === 5 && (
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1 px-3 py-2 bg-green-50 rounded-full">
                                    <span className="text-green-600 text-sm">🔒</span>
                                    <span className="text-green-700 text-xs font-medium">Secured</span>
                                </div>
                            </div>
                        )}
                    </div> */}
      {/* </div> */}
      {/* </div> */}

      {/* Padding for fixed bottom nav on mobile */}
      {/* <div className="lg:hidden pb-24" /> */}
    </>
  );
}
