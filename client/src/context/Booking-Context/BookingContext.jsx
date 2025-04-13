/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useBookingFormik from "../Booking-Formik/useBookingFormik";

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export default function BookingProvider({ children }) {
    // Constants
    const STEP_LABELS = ["Select Studio", "Select Date & Time", "Select Additional Services", "Personal Information"];
    const TOTAL_STEPS = STEP_LABELS.length;
    const STEP_FIELDS = {
        1: ["studio"],
        2: ["date", "timeSlot", "duration", "persons"],
        3: ["selectedPackage", "selectedAddOns"],
        4: ["personalInfo.fullName", "personalInfo.phone", "personalInfo.email"],
    };

    // Hooks
    const location = useLocation();
    const navigate = useNavigate();
    const { setBookingField, getBookingField, getBookingError, values, handleSubmit, formik, getField } = useBookingFormik();

    // Step Initialization
    const { step = 1, selectedStudio } = location.state || {};

    // Check if the current step is valid and set it accordingly
    const getInitialStep = () => {
        const storedStep = localStorage.getItem("bookingStep");
        const parsedStep = parseInt(storedStep);
        if (Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS) {
            return parsedStep;
        }
        return step;
    };

    const [currentStep, setCurrentStep] = useState(getInitialStep);

    // set Selected Studio in Formik
    useEffect(() => {
        if (selectedStudio) {
            setBookingField("studio", selectedStudio);
        }
    }, []);


    // Restore formik booking data from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("bookingData");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                Object.entries(parsed).forEach(([key, value]) => {
                    if (values[key] !== value) {
                        setBookingField(key, value);
                    }
                });
            } catch (err) {
                console.error("Corrupted bookingData in localStorage", err);
                localStorage.removeItem("bookingData");
            }
        }
    }, []);

    // Update step and URL
    useEffect(() => {
        localStorage.setItem("bookingStep", currentStep);
        const slug = STEP_LABELS[currentStep - 1]?.toLowerCase().replace(/ /g, "-");

        if (slug) {
            navigate(`/booking?step=${slug}`, {
                state: { step: currentStep, selectedStudio: values?.studio },
            });
        }
    }, [currentStep]);

    // Save booking data in localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("bookingData", JSON.stringify(values));
    }, [values]);

    // Navigation handlers
    const handleNextStep = useCallback(() => {
        setCurrentStep((prevStep) => Math.min(prevStep + 1, TOTAL_STEPS));
    }, []);

    const handlePrevStep = useCallback(() => {
        setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
    }, []);

    // Reset all data
    const resetBooking = () => {
        localStorage.removeItem("bookingData");
        localStorage.removeItem("bookingStep");

        Object.keys(values).forEach((key) => setBookingField(key, ""));
        setCurrentStep(1);
    };

    // Check if current step has validation errors
    const hasError = () => {
        const fields = STEP_FIELDS[currentStep] || [];
        return fields.some((field) => {
            const value = getBookingField(field);
            const error = getBookingError(field);
            return !value || error;
        });
    };

    // Context value
    const bookingContextValue = {
        TOTAL_STEPS,
        currentStep,
        stepLabels: STEP_LABELS,
        bookingData: values,
        hasError,
        setBookingField,
        getBookingField,
        getBookingError,
        setCurrentStep,
        handleNextStep,
        handlePrevStep,
        resetBooking,
        handleSubmit,
        formik,
        getField
    };

    return (
        <BookingContext.Provider value={bookingContextValue}>
            {children}
        </BookingContext.Provider>
    );
}
