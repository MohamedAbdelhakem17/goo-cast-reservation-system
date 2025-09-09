import { useState } from "react";
import BookingLabel from "../../booking-label";
import { Calendar, Slots } from "./_components";
import { useGetAvailableSlots } from "@/apis/public/booking.api";

export default function SelectDateTime() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // const { mutate: getAvailableSlots, data: slots } = GetAvailableSlots()
  const { getSlots, data: slots } = useGetAvailableSlots();

  return (
    <>
      {/* Header */}
      <BookingLabel
        title="Select Date & Time"
        desc="Choose your preferred date and session duration"
      />

      {/* Calendar */}
      <Calendar openToggle={setIsOpen} getAvailableSlots={getSlots} />

      {/* Slots */}
      <Slots
        toggleSidebar={toggleSidebar}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        slots={slots?.data}
      />
    </>
  );
}
