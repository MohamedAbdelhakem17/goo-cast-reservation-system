import { useBooking } from "@/context/Booking-Context/BookingContext";
import { useEffect } from "react";
import BookingLayout from "@/layout/booking-layout/booking-layout";
import {
  SelectDateTime,
  SelectPackage,
  SelectStudio,
  SelectAdditionalServices,
  PersonalInformation,
} from "../../_components/steps";

export default function Booking() {
  // Hooks
  const { currentStep } = useBooking();

  // Variables
  const stepComponents = {
    1: <SelectPackage />,
    2: <SelectStudio />,
    3: <SelectDateTime />,
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
