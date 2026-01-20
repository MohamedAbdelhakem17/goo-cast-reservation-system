import { useGetAutoApplyCoupon } from "@/apis/admin/manage-coupon.api";
import { useApplyCoupon } from "@/apis/public/coupon.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";

/* ---------------------------------- */
/* Coupon Input */
/* ---------------------------------- */
function CouponInput({ coupon, setCoupon, onApply, disabled, isPending, t }) {
  return (
    <div className="my-3 flex flex-col gap-3 sm:flex-row sm:items-center">
      <input
        type="text"
        placeholder={t("enter-coupon-code")}
        value={coupon}
        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
        className="focus:border-main focus:ring-main w-full flex-1 rounded-md border-2 border-gray-200 px-3 py-2 text-sm focus:ring-1"
      />
      <button
        disabled={disabled || isPending}
        onClick={onApply}
        className={`rounded-md px-4 py-2 text-sm font-medium transition ${
          disabled || isPending
            ? "cursor-not-allowed bg-gray-100 opacity-50"
            : "bg-gray-100 hover:bg-gray-200"
        }`}
      >
        {isPending ? t("applying") : t("apply")}
      </button>
    </div>
  );
}

/* ---------------------------------- */
/* Main Component */
/* ---------------------------------- */
export default function ApplyDiscount({ getBookingField, setBookingField }) {
  const { t } = useLocalization();
  const { addToast } = useToast();
  const priceFormat = usePriceFormat();

  const [coupon, setCoupon] = useState(getBookingField("couponCode") || "");
  const [autoApplied, setAutoApplied] = useState(false);

  const { data: autoCoupon } = useGetAutoApplyCoupon();
  const { applyCoupon, isPending } = useApplyCoupon();

  const discount = getBookingField("discount");
  const totalPackagePrice = getBookingField("totalPackagePrice") || 0;
  const selectedAddOns = getBookingField("selectedAddOns") || [];

  const totalAddOns = selectedAddOns.reduce(
    (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
    0,
  );

  /* ---------------------------------- */
  /* Apply Coupon Logic */
  /* ---------------------------------- */
  const handleApplyCoupon = (code) => {
    const appliedCode = code || coupon;
    if (!appliedCode) return;

    applyCoupon(
      { coupon_id: appliedCode },
      {
        onSuccess: (res) => {
          const discountValue = res.data.discount;

          const totalAfterDiscount =
            totalPackagePrice * (1 - discountValue / 100) + totalAddOns;

          setBookingField("couponCode", appliedCode);
          setBookingField("discount", discountValue);
          setBookingField("totalPriceAfterDiscount", totalAfterDiscount);

          addToast(res.message || t("coupon-applied"), "success");
        },
        onError: (err) => {
          addToast(err.response?.data?.message || t("invalid-coupon"), "error");
        },
      },
    );
  };

  /* ---------------------------------- */
  /* Auto Apply Coupon */
  /* ---------------------------------- */
  useEffect(() => {
    if (autoCoupon?.data && !autoApplied && !coupon) {
      const autoCode = autoCoupon.data.code;
      setCoupon(autoCode);
      handleApplyCoupon(autoCode);
      setAutoApplied(true);
    }
  }, [autoCoupon, autoApplied, coupon]);

  /* ---------------------------------- */
  /* UI */
  /* ---------------------------------- */
  return (
    <div className="my-3 w-full rounded-xl py-2">
      <h2 className="flex items-center gap-2 text-sm font-bold">
        <i className="fa-solid fa-tag"></i>
        {t("promo-code")}
      </h2>

      {discount ? (
        <div className="mt-3 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium">{coupon}</div>
              <div className="text-xs text-green-600 capitalize">
                {t("discount-applied-on-package")}
              </div>
            </div>
          </div>

          <span className="text-sm font-medium text-green-600">
            - {priceFormat(totalPackagePrice * (discount / 100))}
          </span>
        </div>
      ) : (
        <CouponInput
          coupon={coupon}
          setCoupon={setCoupon}
          onApply={() => handleApplyCoupon()}
          disabled={!coupon}
          isPending={isPending}
          t={t}
        />
      )}
    </div>
  );
}
