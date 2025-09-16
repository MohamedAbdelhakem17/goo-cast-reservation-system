import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
  hasError,
  finalStepText = "Submit",
}) {
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === TOTAL_STEPS - 1;

  return (
    <>
      {/* Mobile Spacer to prevent overlap */}
      <div className="pb-24 lg:hidden" />

      {/* Navigation Buttons Wrapper */}
      <div className="fixed right-0 bottom-0 left-0 z-40 container mx-auto flex items-center justify-between border-t border-gray-200 px-4 py-3 lg:static lg:border-0 lg:bg-transparent">
        {/* Previous Button Container to preserve spacing */}
        <div className="w-fit">
          {!isFirstStep && (
            <NavButton
              className="rounded-md bg-gray-200 px-6 py-2 text-gray-700 hover:bg-gray-300"
              onClick={handlePrevStep}
            >
              <ArrowLeft className="me-1 inline-block" />
              Previous
            </NavButton>
          )}
        </div>

        {/* Next / Submit Button */}
        <NavButton
          className={`cursor-pointer rounded-md px-4 py-2 ${
            isLastStep
              ? "bg-green-500 text-white hover:bg-green-600"
              : "bg-main/90 hover:bg-main text-white"
          } disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400`}
          disabled={hasError}
          onClick={handleNextStep}
          type="button"
        >
          {isLastStep ? finalStepText : "Next"}
          <ArrowRight className="ms-1 inline-block" />
        </NavButton>
      </div>
    </>
  );
}
