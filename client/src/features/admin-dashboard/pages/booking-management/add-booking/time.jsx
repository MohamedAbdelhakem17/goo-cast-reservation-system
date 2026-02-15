import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useCalendar } from "../../../../../features/booking/_components/steps/select-date-time/_hooks/useCalendar";

export default function TimeCalendar({
  duration,
  onDateSelect,
  bookingData,
  setFieldValue,
  isBlocked = true,
}) {
  // Localization
  const { t } = useLocalization();

  // Hooks
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

  // Functions
  const handleIncrement = () => {
    const newValue = Math.min(10, currentDuration + 1);
    const totalPricePackage = newValue * +bookingData.selectedPackage?.price;
    setFieldValue("duration", newValue);
    setFieldValue("totalPackagePrice", totalPricePackage);
  };

  const handleDecrement = () => {
    const newValue = Math.max(1, currentDuration - 1);
    const totalPricePackage = newValue * +bookingData.selectedPackage?.price;
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
    onDateSelect({
      studioId: bookingData?.studio?.id,
      date: date || currentDate,
      duration: currentDuration,
    });
    setFieldValue("startSlot", null);
  };

  useEffect(() => {
    if (
      bookingData?.date && // فيه تاريخ محفوظ (يعنى edit mode)
      bookingData?.studio?.id &&
      bookingData?.selectedPackage?.id &&
      duration // فيه مدة
    ) {
      // نحول التاريخ من string إلى Date لو جاى من السيرفر
      const parsedDate = new Date(bookingData.date);

      // ننادى onDateSelect بنفس الطريقة اللى بتستخدمها handleDateClick
      onDateSelect({
        studioId: bookingData?.studio?.id,
        date: parsedDate,
        duration,
      });
    }
  }, [
    bookingData?.date,
    bookingData?.studio?.id,
    bookingData?.selectedPackage?.id,
    duration,
  ]);
  return (
    <div
      className={`relative w-full rounded-2xl border border-gray-200 bg-white p-6 text-gray-800 shadow-md transition-all duration-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 ${
        !isStudioAndPackageSelected && isBlocked
          ? "pointer-events-none opacity-60 backdrop-blur-sm"
          : ""
      }`}
    >
      {/* Overlay when no studio selected */}
      {!isStudioAndPackageSelected && isBlocked && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-md dark:bg-slate-950/60">
          <p className="text-xl font-medium text-zinc-600 dark:text-slate-300">
            {t("please-select-a-studio-and-package-first")}
          </p>
        </div>
      )}

      {/* Duration Selector */}

      {isBlocked && (
        <div className="mb-5 flex flex-col items-center justify-between gap-3 md:flex-row">
          {/* Title */}
          <p className="text-sm font-medium text-gray-700 dark:text-slate-200">
            {t("session-duration-hours")}
          </p>

          {/* Duration controller container */}
          <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-50 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            {/* Decrement duration button*/}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleDecrement}
              disabled={!isStudioAndPackageSelected}
              className="flex h-10 w-10 items-center justify-center border-r border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <i className="fa-solid fa-minus"></i>
            </motion.button>

            {/* Duration value */}
            <div className="flex h-10 w-16 items-center justify-center bg-white text-center text-base font-semibold text-gray-800 dark:bg-slate-900 dark:text-slate-100">
              {currentDuration}
            </div>

            {/* Increment duration button*/}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleIncrement}
              disabled={!isStudioAndPackageSelected}
              className="flex h-10 w-10 items-center justify-center border-l border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
            >
              <i className="fa-solid fa-plus"></i>
            </motion.button>
          </div>
        </div>
      )}

      {/* Calendar Container */}
      <div className="relative min-h-[350px]">
        {/* Loading calendar stat */}
        {isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-gray-50 dark:border-slate-800 dark:bg-slate-800">
            <i className="fa-solid fa-spinner fa-spin text-main mb-2 text-2xl"></i>
            <p className="text-sm text-gray-500 dark:text-slate-300">
              {t("loading-calendar")}
            </p>
          </div>
        ) : (
          <>
            {/* Calendar Header */}
            <div className="mb-4 flex items-center justify-between">
              {/* Previous month button*/}
              <button
                disabled={isPrevDisabled}
                onClick={() => navigateMonth("prev")}
                className={`rounded-lg px-3 py-1 text-gray-600 transition hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800 ${
                  isPrevDisabled ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>

              {/* Date */}
              <h2 className="text-lg font-semibold text-gray-800 dark:text-slate-100">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              {/* Next month button */}
              <button
                onClick={() => navigateMonth("next")}
                className="rounded-lg px-3 py-1 text-gray-600 transition hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-gray-500 uppercase dark:text-slate-400">
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
              {/* Days */}
              {calendarDays.map((day, index) => (
                <motion.div
                  key={index}
                  layout
                  onClick={() => handleDateClick(day)}
                  className={`flex h-10 cursor-pointer items-center justify-center rounded-lg transition-all duration-200 ${
                    day.isEmpty
                      ? "cursor-default bg-transparent"
                      : day.blocked
                        ? "cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500"
                        : day.isSelected
                          ? "bg-main font-semibold text-white shadow-sm"
                          : day.isToday
                            ? "border-main text-main border-2 font-semibold"
                            : "text-gray-700 hover:bg-gray-100 dark:text-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {!day.isEmpty && day.date}
                </motion.div>
              ))}
            </motion.div>

            {/* Legend */}
            <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-gray-500 dark:text-slate-400">
              <div className="flex items-center gap-1">
                <div className="bg-main h-3 w-3 rounded"></div> {t("selected")}
              </div>
              <div className="flex items-center gap-1">
                <div className="border-main h-3 w-3 rounded border-2"></div> {t("today")}
              </div>
              <div className="flex items-center gap-1">
                <div className="h-3 w-3 rounded bg-gray-200 dark:bg-slate-700"></div>
                {t("booked-unavailable")}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
