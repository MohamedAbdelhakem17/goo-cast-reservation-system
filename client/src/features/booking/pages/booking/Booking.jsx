import SelectAdditionalServices from "@/features/booking/_components/Booking/Select-Additional-Services/SelectAdditionalServices";
import PersonalInformation from "@/features/booking/_components/Booking/Personal-Information/PersonalInformation";

import { useBooking } from "@/context/Booking-Context/BookingContext";
import { useEffect } from "react";
import BookingLayout from '@/layout/booking-layout/booking-layout';
import { SelectDateTime, SelectPackage, SelectStudio } from "../../_components/steps";

export default function Booking() {
  const { currentStep } = useBooking();

  const stepComponents = {
    1: <SelectPackage />,
    2: <SelectStudio />,
    3: <SelectDateTime />,
    4: <SelectAdditionalServices />,
    5: <PersonalInformation />,
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("bookingData");
      localStorage.removeItem("maxStepReached");
      localStorage.removeItem("bookingStep");
    };
  }, []);

  return (
    <BookingLayout currentStep={currentStep}>
      {stepComponents[currentStep]}
    </BookingLayout>
  );
}