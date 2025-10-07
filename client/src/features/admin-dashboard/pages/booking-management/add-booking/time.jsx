import React, { useReducer } from "react";
import { motion } from "framer-motion";
import { useCalendar } from "../../../../../features/booking/_components/steps/select-date-time/_hooks/useCalendar";

function reducer(state, action) {
  switch (action.type) {
    case "DECREMENT_DURATION":
      return { ...state, duration: Math.max(1, state.duration - 1) };
    case "INCREMENT_DURATION":
      return { ...state, duration: Math.min(10, state.duration + 1) };
    case "SET_DURATION":
      return { ...state, duration: Math.max(1, Math.min(10, action.payload)) };
    default:
      return state;
  }
}

export default function TimeCalendar({ selectedBookingDate, duration, onDateSelect }) {
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
  } = useCalendar(selectedBookingDate, duration);

  const [state, dispatch] = useReducer(reducer, { duration: duration || 1 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10 text-gray-500">
        <i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading calendar...
      </div>
    );
  }

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
    if (onDateSelect) onDateSelect(date, state.duration);
  };

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-6 shadow-md">
      {/* Duration Selector */}
      <div className="mb-5 flex flex-col items-center justify-between gap-3 md:flex-row">
        <p className="text-sm font-medium text-gray-700">Session duration (hours)</p>

        <div className="flex items-center overflow-hidden rounded-xl border border-gray-300 bg-gray-50 shadow-sm">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: "DECREMENT_DURATION" })}
            className="flex h-10 w-10 items-center justify-center border-r border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          >
            <i className="fa-solid fa-minus"></i>
          </motion.button>

          <div className="flex h-10 w-16 items-center justify-center bg-white text-center text-base font-semibold text-gray-800">
            {state.duration}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch({ type: "INCREMENT_DURATION" })}
            className="flex h-10 w-10 items-center justify-center border-l border-gray-200 bg-gray-100 text-gray-700 transition hover:bg-gray-200"
          >
            <i className="fa-solid fa-plus"></i>
          </motion.button>
        </div>
      </div>

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
      <motion.div layout className="mt-2 grid grid-cols-7 gap-1 text-center text-sm">
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
    </div>
  );
}
