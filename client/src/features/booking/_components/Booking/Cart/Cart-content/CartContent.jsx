/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from "react";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import ApplyDiscount from "../../Apply-Discount/ApplyDiscount";
import { OptimizedImage } from "@/components/common";

export default function CartContent() {
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : "";
  };

  function StudioSection({ studio, date, startSlot, formatTime, duration }) {
    if (!studio) return null;
    return (
      <div className="flex items-center justify-between space-y-1 border-b-1 border-gray-300 pb-4">
        <div className="flex-1">
          <p className="text-md text-gray-500">
            <i className="fa-solid fa-calendar-days mr-2 text-[12px]"></i>
            {formatDate(date)}
          </p>
          <p className="text-md text-gray-500">
            <i className="fa-solid fa-clock mr-2 text-[12px]"></i>
            {formatTime(startSlot)} ({duration}h)
          </p>
          <p className="text-md text-gray-500">
            <i className="fa-solid fa-location-dot mr-2 text-[12px]"></i>
            {studio.name}
          </p>
        </div>
        <OptimizedImage
          isFullWidth={false}
          src={studio?.image}
          alt={studio.name}
          className="h-20 w-20 rounded-md"
        />
      </div>
    );
  }

  function PackageSection({ selectedPackage, duration, priceFormat }) {
    if (!selectedPackage || Object.keys(selectedPackage).length === 0) return null;
    return (
      <div className="flex items-center justify-between py-1">
        <p className="text-md text-gray-500">{selectedPackage.name}</p>
        <p className="text-md text-gray-500">
          {priceFormat(selectedPackage.price)} x {duration}h
        </p>
      </div>
    );
  }

  function AddOnsSection({ selectedAddOns }) {
    if (!selectedAddOns || selectedAddOns.length === 0) return null;
    return (
      <ul className="pb-2">
        {selectedAddOns.map((addon) => (
          <li className="flex items-center justify-between py-1" key={addon._id}>
            <p className="text-md text-gray-500">{addon.name}</p>
            <p className="text-md text-gray-500">
              {priceFormat(addon.price)} / x{addon.quantity}
            </p>
          </li>
        ))}
      </ul>
    );
  }

  const {
    bookingData,
    handleNextStep,
    handlePrevStep,
    setBookingField,
    currentStep,
    hasError,
  } = useBooking();
  const formatTime = useTimeConvert();
  const priceFormat = usePriceFormat();

  const totalAddOnPrice = useMemo(() => {
    return (
      bookingData.selectedAddOns?.reduce(
        (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
        0,
      ) || 0
    );
  }, [bookingData.selectedAddOns]);

  const subtotal = useMemo(() => {
    return bookingData.totalPackagePrice + totalAddOnPrice;
  }, [bookingData.totalPackagePrice, totalAddOnPrice]);

  const discountAmount = useMemo(() => {
    return bookingData.discount
      ? (bookingData.totalPackagePrice * bookingData.discount) / 100
      : 0;
  }, [bookingData.totalPackagePrice, bookingData.discount]);

  const totalAfterDiscount = useMemo(() => {
    return bookingData.totalPackagePrice - discountAmount + totalAddOnPrice;
  }, [bookingData.totalPackagePrice, discountAmount, totalAddOnPrice]);

  // const vatAmount = useMemo(() => { // return calculateVAT(subtotal) // }, [subtotal])

  useEffect(() => {
    setBookingField("totalPrice", subtotal);
    setBookingField("totalPriceAfterDiscount", totalAfterDiscount);
  }, [subtotal, totalAfterDiscount]);

  return (
    <div className="rounded-lg border border-gray-200 px-5 py-4">
      <h2 className="my-2 py-2 text-lg font-bold">Reservation Summary</h2>

      <StudioSection
        studio={bookingData.studio}
        date={bookingData.date}
        startSlot={bookingData.startSlot}
        duration={bookingData.duration}
        formatTime={formatTime}
      />

      <PackageSection
        selectedPackage={bookingData.selectedPackage}
        duration={bookingData.duration}
        priceFormat={priceFormat}
        totalPackagePrice={bookingData.totalPackagePrice}
      />

      <AddOnsSection selectedAddOns={bookingData.selectedAddOns} />

      <div className="my-2 space-y-2 border-t border-b border-gray-200 py-2">
        <div className="text-md flex justify-between">
          <span>Subtotal</span>
          <span>{priceFormat(subtotal)}</span>
        </div>

        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Promo Discount ({bookingData.couponCode})</span>
            <span>- {priceFormat(discountAmount)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between py-1 pt-2">
        <p className="text-md font-bold">Total</p>
        <p className="text-md text-gray-500">{priceFormat(totalAfterDiscount)}</p>
      </div>

      <ApplyDiscount />

      {currentStep === 4 && (
        <div className="mt-4">
          <button
            disabled={hasError()}
            onClick={handleNextStep}
            className="text-md bg-main mx-auto my-2 flex w-full items-center justify-center rounded-lg px-4 py-[8px] font-semibold text-white disabled:bg-gray-100 disabled:text-gray-300"
          >
            <span className="m-0">Proceed to payment</span>
          </button>
          <button
            onClick={handlePrevStep}
            className="text-md mx-auto flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-[8px] font-semibold"
          >
            <span className="m-0">Back</span>
          </button>
        </div>
      )}

      {currentStep === 5 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-xs text-green-700">
            🔒 Your booking is secured with SSL encryption and protected by our privacy
            policy.
          </p>
        </div>
      )}
    </div>
  );
}
