import { useState } from "react";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { Check } from "lucide-react";
import usePriceFormat from "@/hooks/usePriceFormat";
import { useApplyCoupon } from "@/apis/public/coupon.api";

function CouponInput({ coupon, setCoupon, onApply, disabled, isPending }) {
  return (
    <div className="my-3 flex items-center justify-between gap-3">
      <input
        type="text"
        placeholder="Enter coupon code"
        value={coupon.toUpperCase()}
        onChange={(e) => setCoupon(e.target.value.toUpperCase())}
        className="flex-grow-1 rounded-md border-2 border-gray-100 bg-transparent px-2 py-1 text-gray-700 focus:outline-none"
      />
      <button
        disabled={disabled || isPending}
        onClick={onApply}
        className="cursor-pointer rounded-md border-2 border-gray-100 bg-gray-100 px-2 py-1 text-sm text-black shadow-sm transition-all duration-200"
      >
        {isPending ? "Applying .." : "Apply"}
      </button>
    </div>
  );
}

export default function ApplyDiscount() {
  const { getBookingField, setBookingField } = useBooking();
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
    <div className="my-2 w-full rounded-xl py-2">
      <h2 className="text-sm font-bold text-gray-800">
        <i className="fa-solid fa-tag mr-3"></i>Promo Code
      </h2>
      {discount ? (
        <div className="mt-2 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">
          <div className="flex items-center space-x-2">
            <Check className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm">{coupon}</div>
              <div className="text-xs text-green-600">
                {discount} % Discount (on package only)
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Show discount value calculated from the package price */}
            <span className="text-sm text-green-600">
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
          isPending={isPending}
        />
      )}
    </div>
  );
}
