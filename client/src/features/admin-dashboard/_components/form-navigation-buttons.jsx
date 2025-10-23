import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import useLocalization from "@/context/localization-provider/localization-context";

function NavButton({ children, ...props }) {
  return (
    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} {...props}>
      {children}
    </motion.button>
  );
}

export default function FormNavigationButtons({
  currentStep,
  TOTAL_STEPS,
  handleNextStep,
  handlePrevStep,
  handleSubmit,
  hasError,
  finalStepText = "submit",
  isLoading,
}) {
  const { t, lng } = useLocalization();
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;
  const isRTL = lng === "ar";

  return (
    <>
      <div className="pb-24 lg:hidden" />

      <div
        className={`fixed right-0 bottom-0 left-0 z-40 container mx-auto flex items-center justify-between border-t border-gray-200 px-4 py-3 lg:static lg:border-0 lg:bg-transparent ${
          isRTL ? "flex-row" : "flex-row-reverse"
        }`}
      >
        {/* Previous Button */}
        <div className="w-fit">
          {!isFirstStep && (
            <NavButton
              className="flex items-center rounded-md bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
              type="button"
              onClick={handlePrevStep}
            >
              {isRTL ? (
                <>
                  <ArrowRight className="me-1 inline-block" />
                  {t("previous")}
                </>
              ) : (
                <>
                  <ArrowLeft className="me-1 inline-block" />
                  {t("previous")}
                </>
              )}
            </NavButton>
          )}
        </div>

        {/* Next / Submit Button */}
        <NavButton
          className={`flex cursor-pointer items-center rounded-md px-4 py-2 ${
            isLastStep
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-main/90 hover:bg-main text-white"
          } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400`}
          disabled={hasError || isLoading}
          type="button"
          onClick={isLastStep ? handleSubmit : handleNextStep}
        >
          {isLoading ? (
            <Loader className="animate-spin" />
          ) : (
            <>
              {isLastStep ? finalStepText : t("next")}
              {isRTL ? (
                <ArrowLeft className="ms-1 inline-block" />
              ) : (
                <ArrowRight className="ms-1 inline-block" />
              )}
            </>
          )}
        </NavButton>
      </div>
    </>
  );
}
