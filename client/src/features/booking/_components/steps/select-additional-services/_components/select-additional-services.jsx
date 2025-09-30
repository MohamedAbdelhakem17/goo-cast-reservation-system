import Sticky from "react-sticky-el";
import AddOns from "./select-addons";
import Cart from "../../../Booking/Cart/Cart";
import Faq from "./faq";
import { useEffect } from "react";
import { tracking } from "@/utils/gtm";
import BookingLabel from "../../../booking-label";
import useLocalization from "@/context/localization-provider/localization-context";

export default function SelectAdditionalServices() {
  const { t } = useLocalization();
  useEffect(() => {
    tracking("initiate_checkout");
  }, []);
  return (
    <div className="space-y-4 duration-300">
      {/* Header */}
      <BookingLabel
        title={t("additional-services")}
        desc={t("enhance-your-session-with-our-professional-add-ons")}
      />

      {/* Responsive Content */}
      <div className="mb-[10px] flex flex-col gap-6 lg:flex-row" id="cart-wrapper">
        {/* AddOns takes full width on mobile, 2/3 on large screens */}
        <div className="w-full space-y-4 lg:w-2/3">
          <AddOns />
          <Faq />
        </div>

        {/* Cart Sticky */}
        <div className="w-full lg:w-1/3">
          <Cart />
        </div>
      </div>
    </div>
  );
}
