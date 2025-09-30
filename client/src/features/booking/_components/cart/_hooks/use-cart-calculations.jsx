import { useEffect, useMemo } from "react";
import { useBooking } from "@/context/Booking-Context/BookingContext";

export default function useCartCalculations() {
  const { bookingData, setBookingField } = useBooking();

  const { totalAddOnPrice, subtotal, discountAmount, totalAfterDiscount } =
    useMemo(() => {
      const addOnPrice =
        bookingData.selectedAddOns?.reduce(
          (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
          0,
        ) || 0;

      const sub = bookingData.totalPackagePrice + addOnPrice;

      const discount = bookingData.discount
        ? (bookingData.totalPackagePrice * bookingData.discount) / 100
        : 0;

      const total = bookingData.totalPackagePrice - discount + addOnPrice;

      return {
        totalAddOnPrice: addOnPrice,
        subtotal: sub,
        discountAmount: discount,
        totalAfterDiscount: total,
      };
    }, [bookingData]);

  useEffect(() => {
    setBookingField("totalPrice", subtotal);
    setBookingField("totalPriceAfterDiscount", totalAfterDiscount);
  }, [subtotal, totalAfterDiscount]);

  return {
    bookingData,
    totalAddOnPrice,
    subtotal,
    discountAmount,
    totalAfterDiscount,
  };
}
