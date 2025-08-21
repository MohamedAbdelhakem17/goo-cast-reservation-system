import React from "react";
import { useBooking } from "../../../context/Booking-Context/BookingContext";
import { Check } from "lucide-react";

export default function Stepper() {
  const { currentStep, stepLabels, setCurrentStep, maxStepReached } = useBooking();

  const steps = stepLabels.map((title, index) => ({
    id: index + 1,
    title,
  }));

  return (
    <div className="px-4 lg:px-8 bg-white w-[100vw] py-4">
      {/* Desktop/Tablet View */}
      <div className="hidden sm:flex items-center justify-between max-w-5xl mx-auto scale-[.9]">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => {
                if (step.id <= maxStepReached) {
                  setCurrentStep(step.id);
                }
              }}
              disabled={step.id > maxStepReached}
              className="flex flex-col items-center focus:outline-none cursor-pointer disabled:cursor-not-allowed "
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 transition-colors duration-300
                ${step.id < currentStep
                    ? "bg-[#FF3B30] border-[#FF3B30] text-white"
                    : step.id === currentStep
                      ? "border-[#FF3B30] text-[#FF3B30] bg-white"
                      : "border-gray-300 text-gray-400 bg-white"
                  }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div
                className={`text-sm text-center max-w-fit lg:max-w-fit ${step.id === currentStep
                  ? "text-[#FF3B30] font-medium"
                  : "text-gray-600"
                  }`}
              >
                {step.title}
              </div>
            </button>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 lg:mx-4 transition-colors duration-300 ${step.id < currentStep ? "bg-[#FF3B30]" : "bg-gray-300"
                  }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile View */}
      <div className="sm:hidden py-3">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-gradient-to-r from-[#FF3B30] to-[#FF6B60] h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Display */}
        <div className="bg-gradient-to-r from-[#FF3B30]/5 to-[#FF6B60]/5 rounded-xl p-4 border border-[#FF3B30]/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF6B60] flex items-center justify-center shadow-lg">
              {currentStep < steps.length ? (
                <span className="text-xs font-bold text-white">{currentStep}</span>
              ) : (
                <Check className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {steps[currentStep - 1]?.title}
              </div>
              <div className="text-xs text-gray-500">Current step</div>
            </div>
          </div>
        </div>

        {/* Mini Steps Overview */}
        <div className="flex justify-center mt-4 space-x-2 cursor-pointer ">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${step.id < currentStep
                ? "bg-[#FF3B30] scale-110"
                : step.id === currentStep
                  ? "bg-[#FF3B30] scale-125 shadow-lg"
                  : "bg-gray-300 scale-100"
                }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
