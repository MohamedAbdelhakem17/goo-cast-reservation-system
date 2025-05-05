import React from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../../context/Booking-Context/BookingContext";

export default function NavigationButtons({ handelGoToConfirmation }) {
    // Get the booking context
    const { TOTAL_STEPS, currentStep, handleNextStep, handlePrevStep, handleSubmit, hasError } = useBooking()

    const handelPaymentButton = () => {
        if (currentStep === TOTAL_STEPS) {
            // handleSubmit()
            handelGoToConfirmation()

        } else {
            handleNextStep()
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
                    }
                    `}
                disabled={currentStep === 1}
                onClick={handlePrevStep}
            >
                Previous
            </motion.button>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-md cursor-pointer ${currentStep === TOTAL_STEPS
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-main/90 text-white hover:bg-main"
                    } 
                     disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed
                    `}
                disabled={hasError()}
                onClick={handelPaymentButton}
                type={currentStep === TOTAL_STEPS ? "submit" : "button"}
            >
                {currentStep === TOTAL_STEPS ? "Proceed to payment" : "Next Step"}
            </motion.button>
        </div>
    );
}
