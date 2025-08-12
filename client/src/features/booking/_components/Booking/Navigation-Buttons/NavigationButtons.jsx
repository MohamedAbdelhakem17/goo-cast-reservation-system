import { motion } from "framer-motion";
import { useBooking } from "../../../../../context/Booking-Context/BookingContext";

function NavButton({ children, ...props }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            {...props}
        >
            {children}
        </motion.button>
    );
}

export default function NavigationButtons({ handleGoToConfirmation }) {
    const { TOTAL_STEPS, currentStep, handleNextStep, handlePrevStep, hasError } = useBooking();

    const handlePaymentButton = () => {
        if (currentStep === TOTAL_STEPS) {
            handleGoToConfirmation();
        } else {
            handleNextStep();
        }
    };

    return (
        <div className="px-6 py-4  flex justify-between">

            <NavButton
                className={`px-4 py-2 rounded-md ${currentStep === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                disabled={currentStep === 1}
                onClick={handlePrevStep}
            >
                Previous
            </NavButton>
            <NavButton
                className={`px-4 py-2 rounded-md cursor-pointer ${currentStep === TOTAL_STEPS
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-main/90 text-white hover:bg-main"} disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
                disabled={hasError()}
                onClick={handlePaymentButton}
                type={currentStep === TOTAL_STEPS ? "submit" : "button"}
            >
                Next
            </NavButton>
        </div>
    );
}
