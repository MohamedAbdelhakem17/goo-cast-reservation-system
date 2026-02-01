import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { tracking } from "@/utils/gtm";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
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
    handleSubmit,
    bookingData,
  } = useBooking();

  const isRTL = lng === "ar";

  useEffect(() => {
    if (getBookingField("selectedPackage")?.id) {
      formik.setFieldValue("selectedPackage", getBookingField("selectedPackage"));
    }
  }, [getBookingField("selectedPackage")]);

  return (
    <>
      {/* <div className="pb-24 lg:hidden" /> */}
      <div
        className={`fixed right-0 bottom-0 left-0 z-40 flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 backdrop-blur-lg lg:hidden dark:border-gray-700 dark:bg-gray-900`}
      >
        {/* Previous Button */}
        {currentStep !== 1 && (
          <NavButton
            className={`flex items-center gap-1 rounded-md px-6 py-2 ${
              currentStep === 1
                ? "cursor-not-allowed bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
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
                {currentStep === 4 ? t("skip") : t("next")}
              </>
            ) : (
              <>
                {currentStep === 4 ? t("skip") : t("next")}
                <ArrowRight className="inline-block" />
              </>
            )}
          </NavButton>
        )}

        {/* Handle Submit Button */}
        {currentStep === 5 && (
          <button
            type="button"
            disabled={hasError() || formik.isSubmitting}
            onClick={
              !formik.isSubmitting
                ? () => {
                    handleSubmit();
                    tracking("create_booking", {
                      totalPrice: bookingData.totalPrice,
                    });
                  }
                : undefined
            }
            className={`text-md flex w-fit flex-col items-center justify-center rounded-lg px-2 py-[8px] font-semibold transition-all duration-200 disabled:bg-green-50 md:flex-row ${
              hasError() || formik.isSubmitting
                ? "cursor-not-allowed bg-gray-100 text-gray-300"
                : "bg-main text-white hover:opacity-90"
            }`}
          >
            {formik.isSubmitting ? (
              <div className="flex items-center gap-2">
                <Loader />
                <span>{t("processing-0")}</span>
              </div>
            ) : (
              <span>{t("complete-booking")}</span>
            )}
          </button>
        )}
      </div>
    </>
  );
}
