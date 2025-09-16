import React from "react";
import { Check } from "lucide-react";

export default function FormStepper({ steps, currentStep }) {
  const totalSteps = steps.length;

  return (
    <div className="w-full px-4 py-2 lg:px-8">
      {/* Desktop/Tablet View */}
      <div className="mx-auto hidden max-w-5xl scale-[.9] items-center justify-between sm:flex">
        {steps.map((step, index) => {
          const stepId = index;
          return (
            <React.Fragment key={index}>
              <div className="flex cursor-default flex-col items-center focus:outline-none">
                <div
                  className={`mb-2 flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors duration-300 ${
                    index < currentStep
                      ? "border-[#FF3B30] bg-[#FF3B30] text-white"
                      : index === currentStep
                        ? "border-[#FF3B30] bg-white text-[#FF3B30]"
                        : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {index < currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{stepId + 1}</span>
                  )}
                </div>
                <div
                  className={`max-w-fit text-center text-sm lg:max-w-fit ${
                    stepId === currentStep
                      ? "font-medium text-[#FF3B30]"
                      : "text-gray-600"
                  }`}
                >
                  {step}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 transition-colors duration-300 lg:mx-4 ${
                    stepId < currentStep ? "bg-[#FF3B30]" : "bg-gray-300"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Mobile View */}
      <div className="py-3 sm:hidden">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              Step {currentStep + 1} of {totalSteps}
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF6B60] transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Current Step Display */}
        <div className="rounded-xl border border-[#FF3B30]/20 bg-gradient-to-r from-[#FF3B30]/5 to-[#FF6B60]/5 p-4">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[#FF3B30] to-[#FF6B60] shadow-lg">
              {currentStep < totalSteps ? (
                <span className="text-xs font-bold text-white">{currentStep + 1}</span>
              ) : (
                <Check className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">
                {steps[currentStep]}
              </div>
              <div className="text-xs text-gray-500">Current step</div>
            </div>
          </div>
        </div>

        {/* Mini Steps Overview */}
        <div className="mt-4 flex justify-center space-x-2">
          {steps.map((step, index) => {
            const stepId = index;
            return (
              <div
                key={stepId}
                className={`h-2 w-2 cursor-default rounded-full transition-all duration-300 ${
                  stepId < currentStep
                    ? "scale-110 bg-[#FF3B30]"
                    : stepId === currentStep
                      ? "scale-125 bg-[#FF3B30] shadow-lg"
                      : "scale-100 bg-gray-300"
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
