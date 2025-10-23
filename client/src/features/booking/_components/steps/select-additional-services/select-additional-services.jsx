import { useEffect } from "react";
import { tracking } from "@/utils/gtm";
import useLocalization from "@/context/localization-provider/localization-context";
import { BookingLabel } from "@/features/booking/_components";
import AddOns from "./_components/select-addons";
// import Faq from "./_components/faq";
import Cart from "@/features/booking/_components/cart/cart";

export default function SelectAdditionalServices() {
  const { t } = useLocalization();

  useEffect(() => {
    tracking("initiate_checkout");
  }, []);

  return (
    <div className="space-y-6 duration-300">
      {/* Header */}
      <BookingLabel
        title={t("additional-services")}
        desc={t("enhance-your-session-with-our-professional-add-ons")}
      />

      {/* Grid Layout */}
      <div
        id="cart-wrapper"
        className="mb-6 grid grid-rows-[auto_auto] gap-6 lg:grid-cols-3 lg:grid-rows-1"
      >
        {/* AddOns (Top on Mobile, Left on Desktop) */}
        <div className="order-1 space-y-4 lg:order-1 lg:col-span-2">
          <AddOns />
          {/* <Faq /> */}
        </div>

        {/* Cart (Bottom on Mobile, Right on Desktop) */}
        <div className="order-2 lg:sticky lg:top-24 lg:order-2 lg:col-span-1">
          <Cart />
        </div>
      </div>
    </div>
  );
}
