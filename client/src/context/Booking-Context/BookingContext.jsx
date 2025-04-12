/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const initialState = {
    studio: null,
    date: null,
    timeSlot: null,
    duration: 1,
    persons: 1,
    selectedPackage: null,
    selectedDuration: null,
    selectedAddOns: {},
    personalInfo: {},
}

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export default function BookingProvider({ children }) {
    // Constants
    const TOTAL_STEPS = 4;
    const STEP_LABELS = ["Select Studio", "Select Date & Time", "Select Additional Services", "Personal Information"];

    // States
    const location = useLocation();
    const navigate = useNavigate();

    const [bookingData, setBookingData] = useState(initialState);
    const { step = 1, selectedStudio = null } = location.state || {};
    const [currentStep, setCurrentStep] = useState(step);
    const [studio, setStudio] = useState(selectedStudio);

    // Side Effects: Load session storage
    useEffect(() => {
        try {
            const storedData = sessionStorage.getItem("bookingData");
            if (storedData) {
                setBookingData(JSON.parse(storedData));
            }
        } catch (e) {
            console.error("Invalid session data", e);
            sessionStorage.removeItem("bookingData");
        }

        const storedStep = sessionStorage.getItem("bookingStep");
        const validStep = Number.isInteger(parseInt(storedStep)) && parseInt(storedStep) >= 1 && parseInt(storedStep) <= TOTAL_STEPS;

        if (validStep) {
            setCurrentStep(parseInt(storedStep));
        } else if (location.state?.step) {
            setCurrentStep(location.state.step);
        }
    }, []);

    // Sync storage with state
    useEffect(() => {
        sessionStorage.setItem("bookingData", JSON.stringify(bookingData));
    }, [bookingData]);

    // Update link
    useEffect(() => {
        sessionStorage.setItem("bookingStep", currentStep);
        const slug = STEP_LABELS[currentStep - 1]?.toLowerCase().replace(/ /g, "-");
        if (slug) {
            navigate(`/booking?step=${slug}`, {
                state: { step: currentStep, selectedStudio: bookingData.studio },
            });
        }
    }, [currentStep]);

    // Functions
    const handleNextStep = useCallback(() => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, TOTAL_STEPS));
    }, []);

    const handlePrevStep = useCallback(() => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    }, []);

    const updateBookingData = useCallback((newData) => {
        setBookingData((prev) => ({ ...prev, ...newData }));
    }, []);

    const resetBooking = () => {
        sessionStorage.removeItem("bookingData");
        setBookingData(initialState);
    };

    // Retention Data
    const bookingContextValue = {
        studio,
        TOTAL_STEPS,
        currentStep,
        stepLabels: STEP_LABELS,
        bookingData,
        setBookingData,
        setStudio,
        setCurrentStep,
        handleNextStep,
        handlePrevStep,
        updateBookingData,
        resetBooking
    };

    return (
        <BookingContext.Provider value={bookingContextValue}>
            {children}
        </BookingContext.Provider>
    );
}
