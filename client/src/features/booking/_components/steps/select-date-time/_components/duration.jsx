import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock } from "lucide-react";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";

export default function Duration({ isOpen, setIsOpen }) {
  const { t, lng } = useLocalization();
  const { setBookingField, bookingData } = useBooking();

  const durationOptions = [
    { value: "1", label: `1 ${t("hour")}` },
    { value: "2", label: `2 ${t("hours")}` },
    { value: "3", label: `3 ${t("hours")}` },
    { value: "4", label: `4 ${t("hours")}` },
    { value: "5", label: `5 ${t("hours")}` },
    { value: "6", label: `6 ${t("hours")}` },
    { value: "7", label: `7 ${t("hours")}` },
    { value: "8", label: `8 ${t("hours")}` },
  ];

  const [selectedDuration, setSelectedDuration] = useState(bookingData.duration || "1");

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
    setBookingField("duration", duration);
    setBookingField("totalPackagePrice", +duration * bookingData.selectedPackage.price);
    setIsOpen(false);
  };

  return (
    <div className="relative z-[30]">
      <div
        className="flex w-full cursor-pointer items-center justify-between gap-y-4 rounded-md border-2 border-gray-100 px-3 py-2 transition-colors hover:border-gray-200 sm:w-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="hidden border-e-2 border-gray-200 pe-2 text-sm text-gray-700 sm:inline-block">
            {t("duration-of-filming")}
          </span>
        </div>
        <span className="ps-2 text-sm font-medium text-red-500 sm:text-base">
          {new Intl.NumberFormat(`${lng}-EG`).format(selectedDuration)}
          {selectedDuration === "1" ? t("hour") : t("hours")}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 overflow-hidden bg-black/20 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="fixed end-100 top-[35%] z-[500] w-[250px] overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl"
            >
              <div className="border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {t("duration-of-filming")}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-red-500">
                    {new Intl.NumberFormat(`${lng}-EG`).format(selectedDuration)}{" "}
                    {selectedDuration === "1" ? t("hour") : t("hours")}
                  </span>
                </div>
              </div>
              <div className="min-h-[300px] overflow-x-hidden overflow-y-auto py-2">
                {durationOptions.map((option, index) => (
                  <motion.button
                    key={option.value}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleDurationSelect(option.value)}
                    className={`w-full px-4 py-3 text-left text-sm transition-colors ${
                      selectedDuration === option.value
                        ? "border-l-4 border-red-500 bg-red-50 font-semibold text-red-600"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
