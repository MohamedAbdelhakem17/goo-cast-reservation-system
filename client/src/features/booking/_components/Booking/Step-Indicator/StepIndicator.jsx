import React from "react";
import { useBooking } from "../../../context/Booking-Context/BookingContext";
import { Check } from "lucide-react";

export default function Stepper() {
  const { currentStep, stepLabels } = useBooking();

  const steps = stepLabels.map((title, index) => ({
    id: index + 1,
    title,
  }));

  return (
    <div className="px-4  lg:px-8 lg:sticky top-0 bg-white z-[51] w-[100vw] my-5">
      {/* Desktop/Tablet View */}
      <div className="hidden sm:flex items-center justify-between max-w-5xl mx-auto scale-[.9]">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${step.id < currentStep
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
                className={`text-sm text-center max-w-20 lg:max-w-24 ${step.id === currentStep
                  ? "text-[#FF3B30] font-medium"
                  : "text-gray-600"
                  }`}
              >
                {step.title}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 lg:mx-4 ${step.id < currentStep ? "bg-[#FF3B30]" : "bg-gray-300"
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
              <div className="text-sm font-semibold text-gray-900">{steps[currentStep - 1]?.title}</div>
              <div className="text-xs text-gray-500">Current step</div>
            </div>
          </div>
        </div>

        {/* Mini Steps Overview */}
        <div className="flex justify-center mt-4 space-x-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${step.id < currentStep
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

{
  // // // export default function StepIndicator() {
  // // //     const { currentStep, TOTAL_STEPS, stepLabels, handlePrevStep } = useBooking()

  // // //     return (
  // // //         <div className="relative">
  // // //             <div className="md:px-6 py-4 border border-gray-200 rounded-lg">
  // // //                 <div className="flex items-center justify-between">
  // // //                     {[...Array(TOTAL_STEPS)].map((_, index) => (
  // // //                         <div key={index} className="flex items-center gap-x-3">
  // // //                             <motion.div
  // // //                                 className={`flex items-center justify-center w-6 h-6 rounded-full border ${index + 1 === currentStep
  // // //                                     ? "text-main bg-transparent border-main "
  // // //                                     : index + 1 < currentStep
  // // //                                         ? "bg-main/50 text-white"
  // // //                                         : "text-gray-500"
  // // //                                     } font-semibold text-sm`}
  // // //                                 initial={false}
  // // //                                 animate={
  // // //                                     index + 1 === currentStep
  // // //                                         ? { scale: [1, 1.2, 1] }
  // // //                                         : ""
  // // //                                 }
  // // //                                 transition={{ duration: 0.3 }}
  // // //                             >
  // // //                                 {index + 1 < currentStep ? (
  // // //                                     <svg
  // // //                                         className="w-6 h-6"
  // // //                                         fill="none"
  // // //                                         stroke="currentColor"
  // // //                                         viewBox="0 0 24 24"
  // // //                                         xmlns="http://www.w3.org/2000/svg"
  // // //                                     >
  // // //                                         <path
  // // //                                             strokeLinecap="round"
  // // //                                             strokeLinejoin="round"
  // // //                                             strokeWidth={2}
  // // //                                             d="M5 13l4 4L19 7"
  // // //                                         />
  // // //                                     </svg>
  // // //                                 ) : (
  // // //                                     index + 1
  // // //                                 )}
  // // //                             </motion.div>
  // // //                             <span className={`text-xs font-bold ${index + 1 === currentStep ? "text-main" : "text-gray-500"} text-center`}>
  // // //                                 {stepLabels[index]}
  // // //                             </span>
  // // //                         </div>
  // // //                     ))}
  // // //                 </div>
  // // // </div>
  // // // {
  // // // currentStep !== 1 && <button
  // className = "flex items-center w-fit ml-auto p-2 my-2 cursor-pointer absolute left-[90%]"
  // onClick = { handlePrevStep } >
  //   // // <span
  //   className="w-5 h-5 bg-main text-white flex items-center justify-center rounded-full p-2 mr-2" > <i
  //     className="fa-solid fa-chevron-left text-[12px]"></i></span >
  //                  // // <span className="font-bold ">Back</span>
  //                  // // </button>
  //                // // }

  //                // // </div>
  //                // // );
  //                // // }

  //                // import { motion } from "framer-motion";
  //                // import { useBooking } from "../../../context/Booking-Context/BookingContext";

  //                // export default function StepIndicator() {
  //                // const { currentStep, TOTAL_STEPS, stepLabels, handlePrevStep } = useBooking();

  //                // return (
  //                // <div className="relative">
  //                  // <div className="md:px-6 py-4 border border-gray-200 rounded-lg">
  //                    // <div className="flex items-center justify-between">
  //                      // {[...Array(TOTAL_STEPS)].map((_, index) => {
  //                      // const stepNumber = index + 1;
  //                      // const isCompleted = stepNumber < currentStep; // const isCurrent=stepNumber===currentStep; //
  //                        return ( // <div key={index} className="flex items-center gap-x-3">
  //   // <motion.div // className={`flex items-center justify-center w-6 h-6 rounded-full border
  //   font - semibold text - sm transition - colors // ${isCurrent //
  //     ? "text-main bg-transparent border-main" // : isCompleted //
  //       ? "bg-main/50 text-white border-main/50" // : "text-gray-500 border-gray-300" // }`} //
  //                          initial = { false} // animate={isCurrent ? { scale: [1, 1.2, 1] } : {}} //
  // transition = {{ duration: 0.3 }} //>
  // // {isCompleted ? (
  // // <svg // className="w-4 h-4" // fill="none" // stroke="currentColor" //
  // viewBox = "0 0 24 24" // xmlns="http://www.w3.org/2000/svg" //>
  //   //
  //   < path // strokeLinecap="round" // strokeLinejoin="round" // strokeWidth={2} //
  // d = "M5 13l4 4L19 7" // />
  //                            // </svg>
  //                          // ) : (
  //                          // stepNumber
  //                          // )}
  //                          // </motion.div>

  //                        // <span // className={`text-xs font-bold text-center ${isCurrent ? "text-main" : "text-gray-500"
  //                          }`} //>
  //                          // {stepLabels[index]}
  //                          // </span>
  //                        // </div>
  //                    // );
  //                    // })}
  //                    // </div>
  //                  // </div>

  //                // {currentStep !== 1 && (
  //                // <button // className="flex items-center w-fit ml-auto p-2 my-2 cursor-pointer absolute left-[90%]" //
  //                  onClick={handlePrevStep} //>
  //                  // <span className="w-5 h-5 bg-main text-white flex items-center justify-center rounded-full p-2 mr-2">
  //                    // <i className="fa-solid fa-chevron-left text-[12px]"></i>
  //                    // </span>
  //                  // <span className="font-bold">Back</span>
  //                  // </button>
  //                // )}
  //                // </div>
  //                // );
  //                // }
}