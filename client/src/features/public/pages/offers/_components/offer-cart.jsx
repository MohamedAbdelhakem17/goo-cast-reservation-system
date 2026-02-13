import {
  AddOnsSection,
  ApplyDiscount,
  PackageSection,
  StudioSection,
} from "@/components/booking";
import useLocalization from "@/context/localization-provider/localization-context";
import useCartCalculations from "@/hooks/use-cart-calculations";
import useNumberFormat from "@/hooks/use-number-format";
import useDataFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { ShoppingCart } from "lucide-react";

export default function OfferCart({ data, setFieldValue, getFieldValue }) {
  const { t, lng } = useLocalization();
  const formatDate = useDataFormat();
  const formatTime = useTimeConvert();
  const numberFormat = useNumberFormat();
  const priceFormat = usePriceFormat();
  const { subtotal, discountAmount, totalAfterDiscount } = useCartCalculations({
    bookingData: data,
    setBookingField: setFieldValue,
  });

  const isEmpty =
    !data?.studio?.id || Object.values(data?.selectedPackage || {}).length === 0;

  if (isEmpty) return null;

  return (
    <>
      <h3 className="flex items-center text-2xl font-bold">
        <ShoppingCart className="text-main me-2" />
        {t("reservation-summary", "Reservation Summary")}
      </h3>
      <div className="space-y-5 rounded-md bg-white px-5 py-3 shadow dark:bg-gray-900">
        <h2 className="my-2 py-2 text-lg font-bold">{t("reservation-summary")}</h2>

        <StudioSection
          studio={data.studio}
          date={formatDate(data.date)}
          startSlot={data.startSlot}
          duration={numberFormat(data.duration)}
          formatTime={formatTime}
          lng={lng}
        />

        <PackageSection
          selectedPackage={data.selectedPackage}
          duration={numberFormat(data.duration)}
          priceFormat={priceFormat}
          lng={lng}
        />

        <AddOnsSection
          selectedAddOns={data.selectedAddOns}
          priceFormat={priceFormat}
          lng={lng}
        />

        <div className="my-2 space-y-2 border-t border-b border-gray-200 py-2">
          <div className="text-md flex justify-between">
            <span>{t("subtotal")}</span>
            <span>{priceFormat(subtotal)}</span>
          </div>

          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-600">
              <span>
                {t("promo-discount")} ({data.couponCode})
              </span>
              <span>- {priceFormat(discountAmount)}</span>
            </div>
          )}
        </div>

        <ApplyDiscount getBookingField={getFieldValue} setBookingField={setFieldValue} />

        <div className="flex items-center justify-between py-1 pt-2">
          <p className="text-md font-bold">{t("total")}</p>
          <p className="text-md text-gray-500">{priceFormat(totalAfterDiscount)}</p>
        </div>
      </div>
    </>
  );
}
