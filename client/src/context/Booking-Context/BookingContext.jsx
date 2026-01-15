/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import useLocalization from "@/context/localization-provider/localization-context";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useBookingFormik from "../Booking-Formik/useBookingFormik";

const BookingContext = createContext();

export const useBooking = () => useContext(BookingContext);

export default function BookingProvider({ children }) {
  const { t } = useLocalization();
  // Constants
  const STEP_LABELS = [
    t("select-studio"),
    t("date-and-time"),
    t("select-service"),
    t("additional-services"),
    t("payment-info"),
  ];
  const TOTAL_STEPS = STEP_LABELS.length;
  const STEP_FIELDS = {
    1: ["studio"],
    2: ["date", "startSlot", "duration"],
    3: ["selectedPackage"],
    4: ["selectedAddOns"],
    5: [
      "personalInfo.firstName",
      "personalInfo.lastName",
      "personalInfo.phone",
      "personalInfo.email",
      "paymentMethod",
    ],
  };

  // Hooks
  const location = useLocation();
  const navigate = useNavigate();
  const { setBookingField, getBookingField, getBookingError, values, formik } =
    useBookingFormik();

  // Step Initialization
  const { step = 1, studio } = location.state || {};

  const [currentStep, setCurrentStep] = useState(() => {
    const storedStep = localStorage.getItem("bookingStep");
    const parsedStep = parseInt(storedStep);
    if (Number.isInteger(parsedStep) && parsedStep >= 1 && parsedStep <= TOTAL_STEPS) {
      return parsedStep;
    }
    return step;
  });

  const [maxStepReached, setMaxStepReached] = useState(() => {
    const storedStep = localStorage.getItem("maxStepReached");
    return storedStep ? parseInt(storedStep) : 1;
  });

  const goToStep = (step) => {
    if (step <= maxStepReached) {
      setCurrentStep(step);
    }

    if (step > maxStepReached) {
      setMaxStepReached(step);
      localStorage.setItem("maxStepReached", step);
      setCurrentStep(step);
    }
  };

  // Utility function to validate studio object
  const isValidStudio = (studio) => {
    return (
      studio &&
      typeof studio === "object" &&
      studio.id !== null &&
      studio.name &&
      studio.image
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
            if (isValidStudio(value)) {
              setBookingField("studio", value);
            } else {
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

    if (
      currentSlug !== slug ||
      currentState?.step !== currentStep ||
      currentState?.studio !== studioToPass
    ) {
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
    localStorage.setItem("bookingData", JSON.stringify(values));
  }, [values]);

  // Navigation handlers
  const handleNextStep = useCallback(() => {
    setCurrentStep((prevStep) => {
      const nextStep = Math.min(prevStep + 1, TOTAL_STEPS);

      setMaxStepReached((prevMax) => {
        if (nextStep > prevMax) {
          localStorage.setItem("maxStepReached", nextStep);
          return nextStep;
        }
        return prevMax;
      });

      return nextStep;
    });
  }, [TOTAL_STEPS]);

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
  // const hasError = () => {
  //   const fields = STEP_FIELDS[currentStep] || [];

  //   return fields.some((field) => {
  //     const value = getBookingField(field);
  //     const error = getBookingError(field);

  //     // Check if value is considered empty
  //     const isEmpty =
  //       value === undefined ||
  //       value === null ||
  //       value === "" ||
  //       (Array.isArray(value) && value.length === 0);

  //     return isEmpty || Boolean(error);
  //   });
  // };

  const hasError = () => {
    const fields = STEP_FIELDS[currentStep] || [];

    const getNestedValue = (obj, path) =>
      path.split(".").reduce((acc, key) => acc?.[key], obj);

    return fields.some((field) => {
      const value = getNestedValue(values, field);
      const error = getBookingError(field);

      // Special handling for studio
      const isEmpty =
        value === undefined ||
        value === null ||
        value === "" ||
        (Array.isArray(value) && value.length === 0) ||
        (field === "studio" && (!value || !value.id)) ||
        (field === "selectedPackage" && (!value || !value.id));

      return isEmpty || Boolean(error);
    });
  };

  // Use Formik's built-in isSubmitting
  const handleBookingSubmit = async (...args) => {
    await formik.handleSubmit(...args);
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
    setCurrentStep: goToStep,
    handleNextStep,
    handlePrevStep,
    resetBooking,
    maxStepReached,
    handleSubmit: handleBookingSubmit,
    formik,
  };

  return (
    <BookingContext.Provider value={bookingContextValue}>
      {children}
    </BookingContext.Provider>
  );
}
