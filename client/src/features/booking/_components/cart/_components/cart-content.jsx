/* eslint-disable react-hooks/exhaustive-deps */
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import ApplyDiscount from "./apply-discount";

import useLocalization from "@/context/localization-provider/localization-context";
import useDataFormat from "@/hooks/useDateFormat";
import { StudioSection } from "./cart-studio-section";
import { PackageSection } from "./cart-package-section";
import { AddOnsSection } from "./cart-addons-section";
import useCartCalculations from "../_hooks/use-cart-calculations";

export default function CartContent() {
  // Localization
  const { t, lng } = useLocalization();

  // Hooks
  const { bookingData, subtotal, discountAmount, totalAfterDiscount } =
    useCartCalculations();

  const { handleNextStep, handlePrevStep, currentStep, hasError } = useBooking();

  const formatTime = useTimeConvert();
  const priceFormat = usePriceFormat();
  const formatDate = useDataFormat();

  return (
    <div className="rounded-lg border border-gray-200 px-5 py-4">
      {/* Title */}
      <h2 className="my-2 py-2 text-lg font-bold">{t("reservation-summary")}</h2>

      {/* Studio sections  */}
      <StudioSection
        studio={bookingData.studio}
        date={formatDate(bookingData.date)}
        startSlot={bookingData.startSlot}
        duration={bookingData.duration}
        formatTime={formatTime}
        lng={lng}
      />

      {/* Package Section */}
      <PackageSection
        selectedPackage={bookingData.selectedPackage}
        duration={bookingData.duration}
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
        {/* Sub title Section */}
        <div className="text-md flex justify-between">
          <span>{t("subtotal")}</span>
          <span>{priceFormat(subtotal)}</span>
        </div>

        {/* If has discount  */}
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

      {/* Add discount */}
      <ApplyDiscount />

      {/* Actions  in select additional serves*/}
      {currentStep === 4 && (
        <div className="mt-4">
          {/* Go to payment info */}
          <button
            disabled={hasError()}
            onClick={handleNextStep}
            className="text-md bg-main mx-auto my-2 flex w-full items-center justify-center rounded-lg px-4 py-[8px] font-semibold text-white disabled:bg-gray-100 disabled:text-gray-300"
          >
            <span>{t("proceed-to-payment")}</span>
          </button>

          {/* Back to select date */}
          <button
            onClick={handlePrevStep}
            className="text-md mx-auto flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-[8px] font-semibold"
          >
            <span>{t("back")}</span>
          </button>
        </div>
      )}

      {/* Footer in payment info */}
      {currentStep === 5 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
          <p className="text-xs text-green-700">
            🔒
            {t(
              "your-booking-is-secured-with-ssl-encryption-and-protected-by-our-privacy-policy",
            )}
          </p>
        </div>
      )}
    </div>
  );
}
