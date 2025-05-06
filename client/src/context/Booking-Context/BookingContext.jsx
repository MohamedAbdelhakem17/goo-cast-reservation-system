/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
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
        2: ["date", "startSlot", "endSlot", "persons"],
        3: ["selectedPackage", "selectedAddOns"],
        4: ["personalInfo.fullName", "personalInfo.phone", "personalInfo.email"],
    };

    // Hooks
    const location = useLocation();
    const navigate = useNavigate();
    const { setBookingField, getBookingField, getBookingError, values, formik } = useBookingFormik();

    // Step Initialization
    const { step = 1, studio } = location.state || {};

    // Check if the current step is valid and set it accordingly
    const [currentStep, setCurrentStep] = useState(() => {
        const storedStep = localStorage.getItem("bookingStep");
        const parsedStep = parseInt(storedStep);
        if (Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS) {
            return parsedStep;
        }
        return step;
    });

    // Utility function to validate studio object
    const isValidStudio = (studio) => {
        return (
            studio &&
            typeof studio === "object" &&
            studio.id !== null &&
            studio.name &&
            studio.image &&
            studio.price > 0
        );
    };

    // Set Selected Studio in Formik
    const didSetStudio = useRef(false);

    useEffect(() => {
        if (!didSetStudio.current) {
            if (isValidStudio(studio)) {
                setBookingField("studio", studio);
            }
            didSetStudio.current = true;
        }
    }, [studio]);



    // Restore formik booking data from localStorage
    useEffect(() => {
        const storedData = localStorage.getItem("bookingData");
        if (storedData) {
            try {
                const parsed = JSON.parse(storedData);
                Object.entries(parsed).forEach(([key, value]) => {
                    if (key === "studio") {
                        // Only set studio if it's valid
                        if (isValidStudio(value)) {
                            setBookingField("studio", value);
                        } else {
                            console.warn("Invalid studio data in localStorage:", value);
                            setBookingField("studio", null);
                        }
                    } else if (values[key] !== value) {
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
        const slug = STEP_LABELS[currentStep - 1]?.toLowerCase().replace(/ /g, "-");
        if (!slug) return;

        const studioToPass = isValidStudio(values.studio) ? values.studio : null;

        const currentSlug = new URLSearchParams(location.search).get("step");
        const currentState = location.state;

        // Avoid infinite loop by checking if the location is already correct
        if (currentSlug !== slug || currentState?.step !== currentStep || currentState?.studio !== studioToPass) {
            if (location.pathname !== "/booking/confirmation") {
                localStorage.setItem("bookingStep", currentStep);
                navigate(`/booking?step=${slug}`, {
                    state: { step: currentStep, studio: studioToPass },
                });
            }
        }
    }, [currentStep, values.studio]);


    // Save booking data in localStorage whenever it changes
    useEffect(() => {
        // Only save if studio is valid or null
        if (isValidStudio(values.studio) || values.studio === null) {
            localStorage.setItem("bookingData", JSON.stringify(values));
        }
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
        handleSubmit: formik.handleSubmit,
        formik,
    };

    return (
        <BookingContext.Provider value={bookingContextValue}>
            {children}
        </BookingContext.Provider>
    );
}