import { useState } from "react";
import BookingLabel from "../../booking-label";
import { Calendar, Slots } from "./_components";
import { useGetAvailableSlots } from "@/apis/public/booking.api";
import useLocalization from "@/context/localization-provider/localization-context";

export default function SelectDateTime() {
  // Localization
  const { t } = useLocalization();

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
        title={t("select-date-and-time")}
        desc={t("choose-your-preferred-date-and-session-duration")}
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
