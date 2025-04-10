/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { useLocation } from "react-router-dom";

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export default function BookingProvider({ children }) {
    //Constantans
    const TOTAL_STEPS = 4;

    //States
    const location = useLocation();
    const { step = 1, selectedStudio = null } = location.state || {};
    const [currentStep, setCurrentStep] = useState(step);
    const [studio, setStudio] = useState(selectedStudio);

    // Functions
    const handleNextStep = () => {
        if (currentStep < TOTAL_STEPS) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    // Retention Data
    const retentionData = {
        studio,
        TOTAL_STEPS,
        currentStep,
        setStudio,
        setCurrentStep,
        handleNextStep,
        handlePrevStep,
    };

    return (
        <BookingContext.Provider value={retentionData}>
            {children}
        </BookingContext.Provider>
    );
}
