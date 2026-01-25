import { Loading } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useCalendar } from "../_hooks/useCalendar";
import CounterInput from "./counter-input";

export default function Calendar({ openToggle, getAvailableSlots }) {
  /* =======================
     Localization
  ======================= */
  const { lng, t } = useLocalization();

  /* =======================
     Booking Context
  ======================= */
  const { bookingData, setBookingField } = useBooking();

  const { date, duration = 1, persons = 0, studio } = bookingData;

  /* =======================
     Calendar Hook
  ======================= */
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
    isLoading,
  } = useCalendar(date, duration);

  /* =======================
     Constants
  ======================= */
  const MAX_DURATION = 8;
  const MIN_DURATION = 1;
  const MAX_PERSONS = 4;
  const isCalendarDisabled = persons === 0;

  /* =======================
     Helpers
  ======================= */
  const updateBooking = (updates) => {
    Object.entries(updates).forEach(([key, value]) => setBookingField(key, value));
  };

  /* =======================
     Handlers
  ======================= */
  const handleDayClick = (day) => {
    if (day.blocked) return;

    const selected = DateTime.fromObject(
      {
        year: currentDate.getFullYear(),
        month: currentDate.getMonth() + 1,
        day: day.date,
        hour: 12,
      },
      { zone: "Africa/Cairo" },
    ).toJSDate();

    setSelectedDate(selected);

    updateBooking({
      date: selected,
      startSlot: null,
      endSlot: null,
    });

    openToggle(true);

    getAvailableSlots({
      studioId: studio?.id,
      date: selected,
      duration,
    });
  };

  const changeDuration = (delta) => {
    const value = Math.min(MAX_DURATION, Math.max(MIN_DURATION, duration + delta));

    setBookingField("duration", value);
  };

  const changePersons = (delta) => {
    const value = Math.min(MAX_PERSONS, Math.max(0, persons + delta));

    setBookingField("persons", value);
  };

  /* =======================
     Render
  ======================= */
  return (
    <div className="mx-auto w-full bg-white">
      {/* Counters */}
      <div className="mb-6 grid grid-cols-2 gap-6">
        <CounterInput
          label={t("duration-0")}
          value={duration}
          unit={t("hour")}
          unitPlural={t("hours")}
          min={MIN_DURATION}
          max={MAX_DURATION}
          helperText={t("select-session-duration")}
          increment={() => changeDuration(1)}
          decrement={() => changeDuration(-1)}
        />

        <CounterInput
          label={t("number-of-people")}
          value={persons}
          unit={t("person")}
          unitPlural={t("people")}
          min={0}
          max={MAX_PERSONS}
          helperText={`${t("maximum-allowed")} ${MAX_PERSONS} ${t("people")}`}
          increment={() => changePersons(1)}
          decrement={() => changePersons(-1)}
        />
      </div>

      {/* Month Navigation */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* go to last month */}
          <button
            className="h-8 w-8 disabled:opacity-40"
            onClick={() => navigateMonth("prev")}
            disabled={isPrevDisabled}
          >
            <ChevronLeft className={`h-4 w-4 ${lng === "ar" && "-scale-100"}`} />
          </button>

          {/* Month */}
          <h1 className="text-center text-xl font-medium lg:min-w-[140px]">
            {monthNames[currentDate.getMonth()]}{" "}
            {currentDate.getFullYear().toLocaleString(`${lng}-EG`)}
          </h1>

          {/* go to next month */}
          <button className="h-8 w-8" onClick={() => navigateMonth("next")}>
            <ChevronRight className={`h-4 w-4 ${lng === "ar" && "-scale-100"}`} />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="relative">
        {isCalendarDisabled && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/40">
            <p className="rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow">
              {t("please-select-number-of-people")}
            </p>
          </div>
        )}

        <div
          className={`transition-all duration-300 ${
            isCalendarDisabled ? "pointer-events-none blur-sm" : ""
          }`}
        >
          {isLoading ? (
            <Loading />
          ) : (
            <div className="overflow-hidden rounded-lg border border-gray-200">
              {/* Days header */}
              <div className="grid grid-cols-7 bg-gray-50">
                {daysOfWeek.map((day) => (
                  <div
                    key={day}
                    className="border-r border-gray-200 p-4 text-center text-sm font-medium text-gray-700 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`relative h-10 border-r border-b border-gray-200 last:border-e-0 lg:h-16 ${
                      day.blocked
                        ? "cursor-not-allowed bg-gray-50"
                        : "cursor-pointer bg-white transition-colors hover:bg-blue-50"
                    } ${
                      (selectedDate ? isSelected(day.date) : isToday(day.date))
                        ? "ring-main bg-blue-100 ring-2 ring-inset"
                        : ""
                    }`}
                    onClick={() => handleDayClick(day)}
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

                    {/* Date */}
                    {day.date && (
                      <div
                        className={`absolute top-2 left-2 text-sm font-medium ${
                          day.blocked
                            ? "text-gray-400"
                            : (selectedDate ? isSelected(day.date) : isToday(day.date))
                              ? "text-main font-bold"
                              : "text-gray-900"
                        }`}
                      >
                        {day.date.toLocaleString(`${lng}-EG`)}
                      </div>
                    )}

                    {/* Dot */}
                    {(selectedDate ? isSelected(day.date) : day.isToday) && (
                      <div className="bg-main absolute right-2 bottom-2 h-2 w-2 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
