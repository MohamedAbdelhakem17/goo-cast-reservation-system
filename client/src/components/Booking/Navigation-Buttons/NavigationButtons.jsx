import { motion } from "framer-motion";
import { useBooking } from "../../../context/Booking-Context/BookingContext";
import { ArrowLeft, ArrowRight } from "lucide-react";

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

export default function NavigationButtons() {
    const { TOTAL_STEPS, currentStep, handleNextStep, handlePrevStep, hasError } = useBooking();

    const handlePaymentButton = () => {
        if (currentStep === TOTAL_STEPS) {
            return
        } else {
            handleNextStep();
        }
    };

    return (
        <>
            <div className="lg:hidden pb-24" />
            <div className="lg:hidden fixed flex items-center justify-between bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 z-40">

                <NavButton
                    className={`px-6 py-2 rounded-md ${currentStep === 1
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                    disabled={currentStep === 1}
                    onClick={handlePrevStep}
                >
                    <ArrowLeft className="me-1 inline-block" />
                    Previous
                </NavButton>
                <NavButton
                    className={`px-4 py-2  rounded-md cursor-pointer ${currentStep === TOTAL_STEPS
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-main/90 text-white hover:bg-main"} disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed`}
                    disabled={hasError()}
                    onClick={handlePaymentButton}
                    type={currentStep === TOTAL_STEPS ? "submit" : "button"}
                >
                    {currentStep === TOTAL_STEPS ? "Complete Booking" : "Next"}
                    <ArrowRight className="ms-1 inline-block" />
                </NavButton>
            </div>
        </>
    );
}
