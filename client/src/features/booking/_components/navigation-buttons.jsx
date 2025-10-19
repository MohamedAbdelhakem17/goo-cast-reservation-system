import { motion } from "framer-motion";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { ArrowLeft, ArrowRight } from "lucide-react";
import useLocalization from "@/context/localization-provider/localization-context";

function NavButton({ children, ...props }) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} {...props}>
      {children}
    </motion.button>
  );
}

export default function NavigationButtons() {
  const { t, lng } = useLocalization();
  const {
    TOTAL_STEPS,
    currentStep,
    handleNextStep,
    handlePrevStep,
    hasError,
    getBookingField,
  } = useBooking();

  const isPackageSelected =
    Object.keys(getBookingField("selectedPackage") || {}).length > 0;

  const isDisabled = hasError() || currentStep === TOTAL_STEPS || !isPackageSelected;
  const isRTL = lng === "ar";

  return (
    <>
      <div className="pb-24 lg:hidden" />
      <div
        className={`fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 lg:hidden ${
          isRTL ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* Previous */}
        {currentStep !== 1 && (
          <NavButton
            className={`flex items-center gap-1 rounded-md px-6 py-2 ${
              currentStep === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            disabled={currentStep === 1}
            onClick={handlePrevStep}
          >
            <ArrowLeft
              className={`inline-block transition-transform duration-200 ${
                isRTL ? "-scale-x-100" : ""
              }`}
            />
            {t("back")}
          </NavButton>
        )}

        {/* Next */}
        {currentStep !== TOTAL_STEPS && (
          <NavButton
            className={`flex cursor-pointer items-center gap-1 rounded-md px-4 py-2 ${
              currentStep === TOTAL_STEPS
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-main/90 hover:bg-main text-white"
            } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400`}
            disabled={isDisabled}
            onClick={handleNextStep}
            type="button"
          >
            {t("next")}
            <ArrowRight
              className={`inline-block transition-transform duration-200 ${
                isRTL ? "-scale-x-100" : ""
              }`}
            />
          </NavButton>
        )}
      </div>
    </>
  );
}
