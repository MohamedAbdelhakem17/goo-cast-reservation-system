import { useEffect, useMemo } from "react";

export default function useCartCalculations({ bookingData, setBookingField }) {
  const { totalAddOnPrice, subtotal, discountAmount, totalAfterDiscount } =
    useMemo(() => {
      const addOnPrice =
        bookingData?.selectedAddOns?.reduce(
          (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
          0,
        ) || 0;

      const basePrice = bookingData?.totalPackagePrice || 0;
      const discount = bookingData?.discount
        ? (basePrice * bookingData.discount) / 100
        : 0;

      const sub = basePrice + addOnPrice;
      const total = basePrice - discount + addOnPrice;

      return {
        totalAddOnPrice: addOnPrice,
        subtotal: sub,
        discountAmount: discount,
        totalAfterDiscount: total,
      };
    }, [
      bookingData?.totalPackagePrice,
      bookingData?.discount,
      bookingData?.selectedAddOns,
    ]);

  useEffect(() => {
    setBookingField("totalAddOnsPrice", totalAddOnPrice);
    setBookingField("totalPrice", subtotal);
    setBookingField("totalPriceAfterDiscount", totalAfterDiscount);
  }, [totalAddOnPrice, subtotal, totalAfterDiscount, setBookingField]);

  return {
    totalAddOnPrice,
    subtotal,
    discountAmount,
    totalAfterDiscount,
  };
}
