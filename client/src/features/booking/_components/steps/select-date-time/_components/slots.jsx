import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { Loading } from "@/components/common";
import { calculateEndTime, calculateTotalPrice } from "@/hooks/useManageSlots";
import { SlotButton } from "@/components/booking";
import { tracking } from "@/utils/gtm";
import useLocalization from "@/context/localization-provider/localization-context";
import useDataFormat from "@/hooks/useDateFormat";

export default function Slots({ toggleSidebar, isOpen, setIsOpen, slots }) {
  //  Localization
  const { t } = useLocalization();

  // State
  const [selectedTime, setSelectedTime] = useState(null);

  // Hooks
  const { handleNextStep, bookingData, setBookingField, currentStep } = useBooking();
  const formattedDate = useDataFormat();

  // Functions
  const handleTimeSelect = useCallback(
    (time) => {
      setSelectedTime(time);
      setIsOpen(false);

      const endTime = calculateEndTime(time, +bookingData.duration);
      const totalPrice = calculateTotalPrice(
        +bookingData.duration,
        +bookingData?.selectedPackage?.price,
      );

      setBookingField("startSlot", time);
      setBookingField("endSlot", endTime);
      setBookingField("totalPackagePrice", totalPrice);
      tracking("add_to_cart", {
        totalPrice: totalPrice,
        statTime: time,
        duration: bookingData.duration,
      });

      handleNextStep();
    },
    [
      bookingData.duration,
      bookingData?.selectedPackage?.price,
      setIsOpen,
      setBookingField,
      handleNextStep,
      currentStep,
    ],
  );

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-white/5 backdrop-blur-[3px]"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
            className="fixed top-0 right-0 z-[5500] h-full w-96 overflow-y-auto bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="sticky top-0 border-b border-gray-200 bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">{formattedDate}</h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {t("choose-the-time-that-suits-you")}
                  </p>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="rounded-md p-2 hover:bg-gray-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Time Slots */}
            {!slots ? (
              <Loading />
            ) : slots.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                {t("no-available-time-slots-for-this-day")}
              </div>
            ) : (
              <div className="space-y-3 p-6">
                {slots.map((item, index) => (
                  <SlotButton
                    key={item.startTime}
                    time={item.startTime}
                    index={index}
                    isSelected={selectedTime === item.startTime}
                    onClick={handleTimeSelect}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
