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
    <div className="px-4  lg:px-8 lg:sticky top-0 bg-white z-[51] w-[100vw] mt-5">
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
      <div className="sm:hidden">
        {/* Steps List (Alternative mobile view - uncomment if preferred) */}
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="flex items-center space-x-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 flex-shrink-0 ${step.id < currentStep
                  ? "bg-[#FF3B30] border-[#FF3B30] text-white"
                  : step.id === currentStep
                    ? "border-[#FF3B30] text-[#FF3B30] bg-white"
                    : "border-gray-300 text-gray-400 bg-white"
                  }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <span className="text-xs font-medium">{step.id}</span>
                )}
              </div>
              <div
                className={`text-sm ${step.id === currentStep
                  ? "text-[#FF3B30] font-medium"
                  : step.id < currentStep
                    ? "text-gray-800"
                    : "text-gray-500"
                  }`}
              >
                {step.title}
              </div>
            </div>
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