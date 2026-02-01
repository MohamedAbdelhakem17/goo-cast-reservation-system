import { SlotButton } from "@/components/booking";
import { Loading } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import useDataFormat from "@/hooks/useDateFormat";
import { calculateEndTime, calculateTotalPrice } from "@/hooks/useManageSlots";
import { tracking } from "@/utils/gtm";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useCallback, useState } from "react";

export default function Slots({ toggleSidebar, isOpen, setIsOpen, slots }) {
  // Localization
  const { t } = useLocalization();

  // State
  const [selectedTime, setSelectedTime] = useState(null);

  // Hooks
  const { handleNextStep, bookingData, setBookingField } = useBooking();
  const { addToast } = useToast();
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
        startTime: time,
        duration: bookingData.duration,
      });

      addToast("Select data and time successfully", "success", 1000);
      handleNextStep();
    },
    [bookingData, setIsOpen, setBookingField, handleNextStep],
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
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[3px]"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Centered Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-1/2 left-1/2 z-[5500] w-[90%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
          >
            {/* Header */}
            <div className="sticky top-0 border-b border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {formattedDate(bookingData.date)}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t("choose-the-time-that-suits-you")}
                  </p>
                </div>
                <button
                  onClick={toggleSidebar}
                  className="rounded-md p-2 text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Time Slots */}
            <div className="max-h-[50vh] overflow-y-auto p-6">
              {!slots ? (
                <Loading />
              ) : slots.length === 0 ? (
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                  {t("no-available-time-slots-for-this-day")}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
