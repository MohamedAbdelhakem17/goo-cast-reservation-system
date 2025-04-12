import { motion } from "motion/react";
import { useBooking } from "../../../context/Booking-Context/BookingContext";

export default function StepIndicator() {
    const { currentStep, TOTAL_STEPS , stepLabels } = useBooking()

    return (
        <div className="md:px-6 py-2">
            <div className="flex items-center justify-between mb-2">
                {[...Array(TOTAL_STEPS)].map((_, index) => (
                    <div key={index} className="flex flex-col items-center">
                        <motion.div
                            className={`flex items-center justify-center w-10 h-10 rounded-full ${index + 1 === currentStep
                                ? "bg-blue-500 text-white"
                                : index + 1 < currentStep
                                    ? "bg-green-500 text-white"
                                    : "bg-gray-200 text-gray-500"
                                } font-semibold text-lg`}
                            initial={false}
                            animate={
                                index + 1 === currentStep
                                    ? { scale: [1, 1.2, 1], backgroundColor: "#ed1e26" }
                                    : index + 1 < currentStep
                                        ? { backgroundColor: "#ff8a8e" }
                                        : { backgroundColor: "#E5E7EB" }
                            }
                            transition={{ duration: 0.3 }}
                        >
                            {index + 1 < currentStep ? (
                                <svg
                                    className="w-6 h-6"
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
                        <span className="text-xs mt-2 font-medium text-gray-500 text-center">
                            {stepLabels[index]}
                        </span>
                    </div>
                ))}
            </div>

            <div className="relative mt-1">
                <div className="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 bg-main/10 rounded"></div>
                <motion.div
                    className="absolute top-1/2 left-0 h-1 -translate-y-1/2 bg-main/80 rounded"
                    initial={{
                        width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%`,
                    }}
                    animate={{
                        width: `${((currentStep - 1) / (TOTAL_STEPS - 1)) * 100}%`,
                    }}
                    transition={{ duration: 0.3 }}
                ></motion.div>
            </div>
        </div>
    );
}
