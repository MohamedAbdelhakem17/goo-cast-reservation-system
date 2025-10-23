import { useState } from "react";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { Check } from "lucide-react";
import usePriceFormat from "@/hooks/usePriceFormat";
import { useApplyCoupon } from "@/apis/public/coupon.api";
import useLocalization from "@/context/localization-provider/localization-context";

function CouponInput({ coupon, setCoupon, onApply, disabled, isPending, t }) {
  return (
    <div className="my-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="text"
        placeholder={t("enter-coupon-code")}
        value={coupon.toUpperCase()}
        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
        className="focus:border-main focus:ring-main w-full flex-1 rounded-md border-2 border-gray-200 bg-transparent px-3 py-2 text-gray-700 placeholder-gray-400 focus:ring-1 focus:outline-none sm:text-sm"
      />
      <button
        disabled={disabled || isPending}
        onClick={onApply}
        className={`w-full rounded-md border-2 border-gray-100 bg-gray-100 px-4 py-2 text-sm font-medium text-black shadow-sm transition-all duration-200 sm:w-auto ${
          disabled ? "cursor-not-allowed opacity-50" : "hover:bg-gray-200"
        }`}
      >
        {isPending ? t("applying") : t("apply")}
      </button>
    </div>
  );
}

export default function ApplyDiscount({ getBookingField, setBookingField }) {
  const { t } = useLocalization();

  const priceFormat = usePriceFormat();
  const [coupon, setCoupon] = useState(getBookingField("couponCode") || "");
  const { addToast } = useToast();
  const { applyCoupon, isPending } = useApplyCoupon();

  const discount = getBookingField("discount");
  const totalPackagePrice = getBookingField("totalPackagePrice");
  const totalAddOns =
    getBookingField("selectedAddOns")?.reduce(
      (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
      0,
    ) || 0;

  const handleApplyCoupon = () => {
    applyCoupon(
      { coupon_id: coupon },
      {
        onSuccess: (response) => {
          setBookingField("couponCode", coupon);

          const discount = response.data.discount;
          const packageAfterDiscount =
            totalPackagePrice - totalPackagePrice * (discount / 100);

          const totalPriceAfterDiscount = packageAfterDiscount + totalAddOns;

          setBookingField("totalPriceAfterDiscount", totalPriceAfterDiscount);
          setBookingField("discount", discount);

          addToast(response.message || "Coupon Applied Successfully", "success");
        },
        onError: (error) => {
          const errorMessage = error.response?.data?.message || "Coupon is not valid";
          addToast(errorMessage, "error");
        },
      },
    );
  };

  return (
    <div className="my-3 w-full rounded-xl py-2">
      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
        <i className="fa-solid fa-tag text-gray-600"></i>
        {t("promo-code")}
      </h2>

      {discount ? (
        <div className="mt-3 flex flex-col rounded-lg border border-green-200 bg-green-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2 sm:items-center">
            <Check className="mt-[2px] h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">{coupon}</div>
              <div className="text-xs text-green-600">
                {t("discount-discount-on-package-only")}
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center sm:mt-0">
            <span className="text-sm font-medium text-green-600">
              - {priceFormat(totalPackagePrice * (discount / 100))}
            </span>
          </div>
        </div>
      ) : (
        <CouponInput
          coupon={coupon}
          setCoupon={setCoupon}
          onApply={handleApplyCoupon}
          disabled={!coupon}
          t={t}
          isPending={isPending}
        />
      )}
    </div>
  );
}
