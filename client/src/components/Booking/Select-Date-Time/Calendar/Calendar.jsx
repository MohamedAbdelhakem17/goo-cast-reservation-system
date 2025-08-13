import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { useCalendar } from "../../../../hooks/useCalendar";
import Duration from "./Duration/Duration";
import { useState } from "react";
import Loading from "../../../shared/Loading/Loading";

export default function Calendar({ openToggle, getAvailableSlots }) {
  const { setBookingField, bookingData } = useBooking();
  const [isOpen, setIsOpen] = useState(!bookingData.duration || bookingData.duration === 2);

  const {
    calendarDays,
    currentDate,
    selectedDate,
    navigateMonth,
    setSelectedDate,
    isPrevDisabled,
    isSelected,
    isToday,
    daysOfWeek,
    monthNames,
    isLoading
  } = useCalendar(bookingData?.studio?.id, bookingData.date, bookingData.duration);

  console.log(calendarDays);
  return (
    <div className="w-full mx-auto p-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            className="h-8 w-8 disabled:opacity-40"
            onClick={() => navigateMonth("prev")}
            disabled={isPrevDisabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h1 className="text-xl font-medium lg:min-w-[140px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h1>
          <button
            className="h-8 w-8"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <Duration isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>

      {/* Calendar */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-7 bg-gray-50">
            {daysOfWeek.map((day) => (
              <div
                key={day}
                className="p-4 text-center text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (

              <div
                key={index}
                className={`relative lg:h-20 border-r border-b border-gray-200 last:border-r-0 h-15
                  ${day.isEmpty ? "bg-gray-50"
                    : day.blocked ? "bg-white cursor-not-allowed"
                      : "bg-white hover:bg-blue-50 cursor-pointer transition-colors"}
                  ${(selectedDate ? isSelected(day.date) : isToday(day.date))
                    ? "bg-blue-100 ring-2 ring-main ring-inset"
                    : ""}
                `}
                onClick={() => {
                  if (!day.blocked && !day.isEmpty) {
                    const selected = DateTime.fromObject(
                      {
                        year: currentDate.getFullYear(),
                        month: currentDate.getMonth() + 1,
                        day: day.date,
                        hour: 12
                      },
                      { zone: "Africa/Cairo" }
                    ).toJSDate();

                    setSelectedDate(selected);
                    setBookingField("date", selected);
                    setBookingField("startSlot", null);
                    setBookingField("endSlot", null);
                    openToggle(true);
                    getAvailableSlots({
                      studioId: bookingData?.studio?.id,
                      date: selected,
                      duration: bookingData.duration || 2
                    });
                  }
                }}
              >
                {/* Blocked */}
                {day.blocked && !day.isEmpty && (
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage: `repeating-linear-gradient(
                        45deg,
                        #d1d5db,
                        #d1d5db 2px,
                        transparent 2px,
                        transparent 8px
                      )`,
                    }}
                  />
                )}

                {/* Date number */}
                {day.date && (
                  <div
                    className={`absolute top-2 left-2 text-sm font-medium
                      ${day.blocked
                        ? "text-gray-400"
                        : (selectedDate ? isSelected(day.date) : isToday(day.date))
                          ? "text-main font-bold"
                          : "text-gray-900"}
                    `}
                  >
                    {day.date}
                  </div>
                )}

                {/* Dot */}
                {(selectedDate ? isSelected(day.date) : day.isToday) && (
                  <div className="absolute bottom-2 right-2 w-2 h-2 bg-main rounded-full"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
