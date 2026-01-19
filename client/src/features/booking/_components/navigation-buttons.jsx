import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect } from "react";

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
    formik,
  } = useBooking();

  const isRTL = lng === "ar";

  useEffect(() => {
    if (getBookingField("selectedPackage")?.id) {
      formik.setFieldValue("selectedPackage", getBookingField("selectedPackage"));
    }
  }, [getBookingField("selectedPackage")]);

  return (
    <>
      <div className="pb-24 lg:hidden" />
      <div
        className={`fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 lg:hidden`}
      >
        {/* Previous Button */}
        {currentStep !== 1 && (
          <NavButton
            className={`flex items-center gap-1 rounded-md px-6 py-2 ${
              currentStep === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } ${isRTL ? "flex-row-reverse" : ""}`}
            disabled={currentStep === 1}
            onClick={handlePrevStep}
          >
            {isRTL ? (
              <>
                <ArrowRight className="inline-block" />
                {t("back")}
              </>
            ) : (
              <>
                <ArrowLeft className="inline-block" />
                {t("back")}
              </>
            )}
          </NavButton>
        )}

        {/* Next Button */}
        {currentStep !== TOTAL_STEPS && (
          <NavButton
            className={`ms-auto flex cursor-pointer items-center gap-1 rounded-md px-4 py-2 ${
              currentStep === TOTAL_STEPS
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-main/90 hover:bg-main text-white"
            } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 ${
              isRTL ? "flex-row-reverse" : ""
            }`}
            disabled={hasError()}
            onClick={handleNextStep}
            type="button"
          >
            {isRTL ? (
              <>
                <ArrowLeft className="inline-block" />
                {t("next")}
              </>
            ) : (
              <>
                {t("next")}
                <ArrowRight className="inline-block" />
              </>
            )}
          </NavButton>
        )}
      </div>
    </>
  );
}
