import { AddOnsSection, PackageSection, StudioSection } from "@/components/booking";
import useLocalization from "@/context/localization-provider/localization-context";
import useCartCalculations from "@/hooks/use-cart-calculations";
import useNumberFormat from "@/hooks/use-number-format";
import useDataFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { ShoppingCart } from "lucide-react";

/**
 * OfferCart Component
 * Displays a comprehensive booking summary with studio, package, addons, and pricing details
 *
 * @param {Object} data - Booking data containing studio, package, addons, and pricing info
 * @param {Function} setFieldValue - Formik function to update form fields
 * @param {Function} getFieldValue - Formik function to retrieve form field values
 */
export default function OfferCart({ data, setFieldValue, getFieldValue, actualPrice }) {
  // Localization for translations and language settings
  const { t, lng } = useLocalization();

  // Formatting utilities for dates, times, numbers, and prices
  const formatDate = useDataFormat();
  const formatTime = useTimeConvert();
  const numberFormat = useNumberFormat();
  const priceFormat = usePriceFormat();

  // Calculate cart totals including discounts
  const { subtotal, discountAmount, totalAfterDiscount } = useCartCalculations({
    bookingData: data,
    setBookingField: setFieldValue,
  });

  // Check if cart is empty (no studio or package selected)
  const isEmpty =
    !data?.studio?.id || Object.values(data?.selectedPackage || {}).length === 0;

  // Don't render cart if empty
  if (isEmpty) return null;

  return (
    <>
      <h3 className="my-3 flex items-center text-2xl font-bold text-gray-900 dark:text-gray-100">
        <ShoppingCart className="text-main me-2" />
        {t("reservation-summary", "Reservation Summary")}
      </h3>

      {/* Main Cart Container */}
      <div className="space-y-5 rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 px-6 py-5 shadow-lg transition-shadow duration-300 hover:shadow-xl dark:border-gray-700 dark:from-gray-900 dark:to-gray-800">
        {/* Section Title */}
        <div className="border-b border-gray-200 pb-3 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {t("reservation-summary")}
          </h2>
        </div>

        {/* Studio Information Section */}
        <StudioSection
          studio={data.studio}
          date={formatDate(data.date)}
          startSlot={data.startSlot}
          duration={numberFormat(data.duration)}
          formatTime={formatTime}
          lng={lng}
        />

        {/* Selected Package Details */}
        <PackageSection
          selectedPackage={data.selectedPackage}
          duration={numberFormat(data.duration)}
          priceFormat={priceFormat}
          lng={lng}
        />

        {/* Actual Price Row (only shown if actualPrice exists and differs from subtotal) */}
        {actualPrice && (
          <div className="flex justify-between text-base font-medium text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              {t("actual-price", "Actual Price")}
            </span>
            <span className="line-through">
              {priceFormat(actualPrice * data.duration)} × {data.duration} h
            </span>
          </div>
        )}

        {/* Selected Add-ons List */}
        <AddOnsSection
          selectedAddOns={data.selectedAddOns}
          priceFormat={priceFormat}
          lng={lng}
        />

        {/*  Pricing Breakdown Section
        <div className="space-y-3 rounded-lg border-y border-gray-200 bg-gray-50/50 px-2 py-4 dark:border-gray-700 dark:bg-gray-800/30">
          Subtotal Row
          <div className="flex justify-between text-base font-medium text-gray-700 dark:text-gray-300">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-receipt text-sm text-gray-500"></i>
              {t("subtotal")}
            </span>
            <span className="font-semibold">{priceFormat(subtotal)}</span>
          </div>

          Discount Row (only shown if discount applied)
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm font-medium text-green-600 dark:text-green-500">
              <span className="flex items-center gap-1.5">
                <i className="fa-solid fa-tag text-sm"></i>
                {t("promo-discount")} ({data.couponCode})
              </span>
              <span className="font-semibold">- {priceFormat(discountAmount)}</span>
            </div>
          )}
        </div> */}

        {/* Coupon/Discount Application Section */}
        {/* <ApplyDiscount getBookingField={getFieldValue} setBookingField={setFieldValue} /> */}

        <div className="flex items-center justify-between border-t border-gray-200 py-1 pt-2 dark:border-gray-700">
          <p className="text-md font-bold">{t("total")}</p>
          <p className="text-md text-gray-500">{priceFormat(totalAfterDiscount)}</p>
        </div>
      </div>
    </>
  );
}
