import { useBooking } from "@/context/Booking-Context/BookingContext";
import BookingLayout from "@/layout/booking-layout/booking-layout";
import { useEffect } from "react";

import {
  PersonalInformation,
  SelectAdditionalServices,
  SelectDateTime,
  SelectPackage,
  SelectStudio,
} from "../../_components/steps";

export default function Booking() {
  // Hooks
  const { currentStep } = useBooking();

  // Variables
  const stepComponents = {
    1: <SelectStudio />,
    2: <SelectDateTime />,
    3: <SelectPackage />,
    4: <SelectAdditionalServices />,
    5: <PersonalInformation />,
  };

  // Effects
  useEffect(() => {
    return () => {
      localStorage.removeItem("bookingData");
      localStorage.removeItem("maxStepReached");
      localStorage.removeItem("bookingStep");
    };
  }, []);

  return (
    <BookingLayout currentStep={currentStep}>{stepComponents[currentStep]}</BookingLayout>
  );
}
