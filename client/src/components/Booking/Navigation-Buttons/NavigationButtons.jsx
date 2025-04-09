import React from "react";
import { motion } from "framer-motion";

export default function NavigationButtons({
    currentStep,
    setCurrentStep,
}) {

    const totalSteps = 4; // Total number of steps in the booking process

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }
    return (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between">
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md ${currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                onClick={handlePrevStep}
                disabled={currentStep === 1}
            >
                Previous
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md cursor-pointer ${currentStep === totalSteps
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-main/90 text-white hover:bg-main"
                    }`}
                onClick={
                    currentStep === totalSteps
                        ? () => alert("Booking completed!")
                        : handleNextStep
                }
            >
                {currentStep === totalSteps ? "Proceed to payment" : "Next Step"}
            </motion.button>
        </div>
    );
}
