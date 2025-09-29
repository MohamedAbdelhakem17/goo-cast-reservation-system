import React from "react";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { Check } from "lucide-react";

export default function Stepper() {
  const { currentStep, stepLabels, setCurrentStep, maxStepReached } = useBooking();

  const steps = stepLabels.map((title, index) => ({
    id: index + 1,
    title,
  }));

  return (
    <div className="bg-white px-4 py-2 lg:px-8">
      {/* Desktop/Tablet View */}
      <div className="mx-auto hidden max-w-5xl scale-[.9] items-center justify-between sm:flex">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => {
                if (step.id <= maxStepReached) {
                  setCurrentStep(step.id);
                }
              }}
              disabled={step.id > maxStepReached}
              className="flex cursor-pointer flex-col items-center focus:outline-none disabled:cursor-not-allowed"
            >
              <div
                className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                  step.id < currentStep
                    ? "border-[#FF3B30] bg-[#FF3B30] text-white"
                    : step.id === currentStep
                      ? "border-[#FF3B30] bg-white text-[#FF3B30]"
                      : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <div
                className={`max-w-fit text-center text-sm lg:max-w-fit ${
                  step.id === currentStep ? "font-medium text-[#FF3B30]" : "text-gray-600"
                }`}
              >
                {step.title}
              </div>
            </button>

            {index < steps.length - 1 && (
              <div
                className={`mx-2 h-0.5 flex-1 transition-colors duration-300 lg:mx-4 ${
                  step.id < currentStep ? "bg-[#FF3B30]" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Mobile View */}
      <div className="py-3 sm:hidden">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF6B60] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Display */}
        <div className="rounded-xl border border-[#FF3B30]/20 bg-gradient-to-r from-[#FF3B30]/5 to-[#FF6B60]/5 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF6B60] shadow-lg">
              {currentStep < steps.length ? (
                <span className="text-xs font-bold text-white">{currentStep}</span>
              ) : (
                <Check className="h-4 w-4 text-white" />
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
        <div className="mt-4 flex cursor-pointer justify-center space-x-2">
          {steps.map((step) => (
            <button
              key={step.id}
              className={`h-2 w-2 cursor-pointer rounded-full transition-all duration-300 ${
                step.id < currentStep
                  ? "scale-110 bg-[#FF3B30]"
                  : step.id === currentStep
                    ? "scale-125 bg-[#FF3B30] shadow-lg"
                    : "scale-100 bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
