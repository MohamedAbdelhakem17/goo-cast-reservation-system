import React from "react";
import { motion } from "framer-motion";
import { useCalendar } from "../../../../../features/booking/_components/steps/select-date-time/_hooks/useCalendar";

export default function TimeCalendar({
  duration,
  onDateSelect,
  bookingData,
  setFieldValue,
}) {
  const {
    calendarDays,
    currentDate,
    selectedDate,
    navigateMonth,
    setSelectedDate,
    isPrevDisabled,
    monthNames,
    daysOfWeek,
    isLoading,
  } = useCalendar(bookingData.date, duration);

  // Variables
  const currentDuration = duration || 1;
  const isStudioAndPackageSelected = Boolean(
    bookingData?.studio?.id && bookingData?.selectedPackage?.id,
  );

  const handleIncrement = () => {
    const newValue = Math.min(10, currentDuration + 1);
    const totalPricePackage = newValue * +bookingData.totalPackagePrice;
    setFieldValue("duration", newValue);
    setFieldValue("totalPackagePrice", totalPricePackage);
  };

  const handleDecrement = () => {
    const newValue = Math.max(1, currentDuration - 1);
    const totalPricePackage = newValue * +bookingData.totalPackagePrice;
    setFieldValue("duration", newValue);
    setFieldValue("totalPackagePrice", totalPricePackage);
  };

  const handleDateClick = (day) => {
    if (day.blocked || day.isEmpty) return;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day.date,
      12,
      0,
      0,
      0,
    );
    setSelectedDate(date);
    setFieldValue("date", date);
    if (onDateSelect)
      onDateSelect({
        studioId: bookingData?.studio?.id,
        date: selectedDate || currentDate,
        duration: currentDuration,
      });
    setFieldValue("startSlot", null);
  };

  return (
    <div
      className={`relative w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-md transition-all duration-300 ${
        !isStudioAndPackageSelected
          ? "pointer-events-none opacity-60 backdrop-blur-sm"
          : ""
      }`}
    >
      {/* Overlay when no studio selected */}
      {!isStudioAndPackageSelected && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-md">
          <p className="text-xl font-medium text-zinc-600">
            Please select a studio and package first
          </p>
        </div>
      )}

      {/* Duration Selector */}
      <div className="mb-5 flex flex-col items-center justify-between gap-3 md:flex-row">
        <p className="text-sm font-medium text-gray-700">Session duration (hours)</p>
        <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-50 shadow-sm">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleDecrement}
            disabled={!isStudioAndPackageSelected}
            className="flex h-10 w-10 items-center justify-center border-r border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:opacity-40"
          >
            <i className="fa-solid fa-minus"></i>
          </motion.button>

          <div className="flex h-10 w-16 items-center justify-center bg-white text-center text-base font-semibold text-gray-800">
            {currentDuration}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleIncrement}
            disabled={!isStudioAndPackageSelected}
            className="flex h-10 w-10 items-center justify-center border-l border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:opacity-40"
          >
            <i className="fa-solid fa-plus"></i>
          </motion.button>
        </div>
      </div>

      {/* Calendar Container */}
      <div className="relative min-h-[350px]">
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50">
            <i className="fa-solid fa-spinner fa-spin text-main mb-2 text-2xl"></i>
            <p className="text-sm text-gray-500">Loading calendar...</p>
          </div>
        ) : (
          <>
            {/* Calendar Header */}
            <div className="mb-4 flex items-center justify-between">
              <button
                disabled={isPrevDisabled}
                onClick={() => navigateMonth("prev")}
                className={`rounded-lg px-3 py-1 text-gray-600 transition hover:bg-gray-100 ${
                  isPrevDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              <h2 className="text-lg font-semibold text-gray-800">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <button
                onClick={() => navigateMonth("next")}
                className="rounded-lg px-3 py-1 text-gray-600 transition hover:bg-gray-100"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 uppercase">
              {daysOfWeek.map((day, index) => (
                <div key={index} className="py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <motion.div
              layout
              className="mt-2 grid grid-cols-7 gap-1 text-center text-sm"
            >
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  layout
                  onClick={() => handleDateClick(day)}
                  className={`flex h-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 ${
                    day.isEmpty
                      ? "cursor-default bg-transparent"
                      : day.blocked
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : day.isSelected
                          ? "bg-main font-semibold text-white shadow-sm"
                          : day.isToday
                            ? "border-main text-main border-2 font-semibold"
                            : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {!day.isEmpty && day.date}
                </motion.div>
              ))}
            </motion.div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="bg-main h-3 w-3 rounded"></div> Selected
              </div>
              <div className="flex items-center gap-1">
                <div className="border-main h-3 w-3 rounded border-2"></div> Today
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-gray-200"></div> Booked/Unavailable
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
