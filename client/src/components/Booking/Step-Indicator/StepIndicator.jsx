import { motion } from "motion/react";
import { useBooking } from "../../../context/Booking-Context/BookingContext";

export default function StepIndicator() {
  const { currentStep, TOTAL_STEPS, stepLabels, handlePrevStep } = useBooking();
  return (
    <div className="relative">
      <div className="md:px-6 px-2 py-4 border border-gray-200 rounded-lg">
        <div className="flex flex-wrap md:flex-nowrap items-center justify-evenly md:justify-between gap-y-4 gap-x-4 mb-2">
          {[...Array(TOTAL_STEPS)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-1  w-fit" 
            >
              <motion.div
                className={`flex items-center justify-center w-6 h-6 rounded-full border 
                ${
                  index + 1 === currentStep
                    ? "text-main bg-transparent border-main"
                    : index + 1 < currentStep
                    ? "bg-main/50 text-white"
                    : "text-gray-500"
                } font-semibold text-sm`}
                initial={false}
                animate={
                  index + 1 === currentStep ? { scale: [1, 1.2, 1] } : ""
                }
                transition={{ duration: 0.3 }}
              >
                {index + 1 < currentStep ? (
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </motion.div>

              <span
                className={`text-xs font-bold  ${
                  index + 1 === currentStep ? "text-main" : "text-gray-500"
                }`}
              >
                {stepLabels[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {currentStep !== 1 && (
        <button
          className="flex items-center w-fit p-2 mt-4 md:mt-2 absolute right-4 md:right-6 bottom-[-50px] md:bottom-auto"
          onClick={handlePrevStep}
        >
          <span className="w-5 h-5 bg-main text-white flex items-center justify-center rounded-full p-2 mr-2">
            <i className="fa-solid fa-chevron-left text-[12px]"></i>
          </span>
          <span className="font-bold">Back</span>
        </button>
      )}
    </div>
  );
}
