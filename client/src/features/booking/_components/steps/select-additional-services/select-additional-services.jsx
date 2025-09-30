import { useEffect } from "react";
import { tracking } from "@/utils/gtm";
import useLocalization from "@/context/localization-provider/localization-context";
import { BookingLabel } from "@/features/booking/_components";
import AddOns from "./_components/select-addons";
import Faq from "./_components/faq";
import Cart from "@/features/booking/_components/cart/cart";

export default function SelectAdditionalServices() {
  // Localization
  const { t } = useLocalization();

  // Effects
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
          {/* Additional Serves */}
          <AddOns />

          {/* Faq */}
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
