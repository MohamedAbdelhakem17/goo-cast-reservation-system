/* eslint-disable react-hooks/exhaustive-deps */
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { useBooking } from "@/context/Booking-Context/BookingContext";

import { Loader } from "lucide-react";
import { tracking } from "@/utils/gtm";

import useLocalization from "@/context/localization-provider/localization-context";
import useDataFormat from "@/hooks/useDateFormat";
import useCartCalculations from "@/hooks/use-cart-calculations";
import {
  PackageSection,
  AddOnsSection,
  StudioSection,
  ApplyDiscount,
} from "@/components/booking";

export default function CartContent() {
  // Localization
  const { t, lng } = useLocalization();

  // Hooks
  const {
    handleNextStep,
    handlePrevStep,
    currentStep,
    hasError,
    bookingData,
    getBookingField,
    setBookingField,
    handleSubmit,
    formik,
  } = useBooking();

  const { subtotal, discountAmount, totalAfterDiscount } = useCartCalculations({
    bookingData,
    setBookingField,
  });

  const formatTime = useTimeConvert();
  const priceFormat = usePriceFormat();
  const formatDate = useDataFormat();

  return (
    <div className="rounded-lg border border-gray-200 px-5 py-4">
      {/* Title */}
      <h2 className="my-2 py-2 text-lg font-bold">{t("reservation-summary")}</h2>

      {/* Studio Section */}
      <StudioSection
        studio={bookingData.studio}
        date={formatDate(bookingData.date)}
        startSlot={bookingData.startSlot}
        duration={new Intl.NumberFormat(`${lng}-EG`).format(bookingData.duration)}
        formatTime={formatTime}
        lng={lng}
      />

      {/* Package Section */}
      <PackageSection
        selectedPackage={bookingData.selectedPackage}
        duration={new Intl.NumberFormat(`${lng}-EG`).format(bookingData.duration)}
        priceFormat={priceFormat}
        lng={lng}
      />

      {/* Addons Section */}
      <AddOnsSection
        selectedAddOns={bookingData.selectedAddOns}
        priceFormat={priceFormat}
        lng={lng}
      />

      {/* Subtotal & Discount */}
      <div className="my-2 space-y-2 border-t border-b border-gray-200 py-2">
        <div className="text-md flex justify-between">
          <span>{t("subtotal")}</span>
          <span>{priceFormat(subtotal)}</span>
        </div>

        {/* If has discount */}
        {discountAmount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>
              {t("promo-discount")} ({bookingData.couponCode})
            </span>
            <span>- {priceFormat(discountAmount)}</span>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="flex items-center justify-between py-1 pt-2">
        <p className="text-md font-bold">{t("total")}</p>
        <p className="text-md text-gray-500">{priceFormat(totalAfterDiscount)}</p>
      </div>

      {/* Apply Discount */}
      <ApplyDiscount
        getBookingField={getBookingField}
        setBookingField={setBookingField}
      />

      {/* Action Buttons */}
      <div className="mt-4">
        {/* Step 4 → Go to Payment */}
        {currentStep === 4 && (
          <button
            disabled={hasError()}
            onClick={handleNextStep}
            className="text-md bg-main mx-auto my-2 flex w-full items-center justify-center rounded-lg px-4 py-[8px] font-semibold text-white disabled:bg-gray-100 disabled:text-gray-300"
          >
            <span>{t("proceed-to-payment")}</span>
          </button>
        )}

        {/* Step 5 → Complete Booking */}
        {currentStep === 5 && (
          <button
            type="button"
            disabled={hasError() || formik.isSubmitting}
            onClick={
              !formik.isSubmitting
                ? () => {
                    handleSubmit();
                    tracking("create_booking", {
                      totalPrice: bookingData.totalPrice,
                    });
                  }
                : undefined
            }
            className={`text-md mx-auto my-2 flex w-full flex-col items-center justify-center rounded-lg px-4 py-[8px] font-semibold transition-all duration-200 md:flex-row ${
              hasError() || formik.isSubmitting
                ? "cursor-not-allowed bg-gray-100 text-gray-300"
                : "bg-main text-white hover:opacity-90"
            }`}
          >
            {formik.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader />
                <span>{t("processing-0")}</span>
              </div>
            ) : (
              <span>{t("complete-booking")}</span>
            )}
          </button>
        )}

        {/* Back Button */}
        <button
          onClick={handlePrevStep}
          className="text-md mx-auto flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-[8px] font-semibold"
        >
          <span>{t("back")}</span>
        </button>
      </div>
    </div>
  );
}
