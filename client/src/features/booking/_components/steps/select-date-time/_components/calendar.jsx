import { Loading } from "@/components/common";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import useLocalization from "@/context/localization-provider/localization-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DateTime } from "luxon";
import { useCalendar } from "../_hooks/useCalendar";
import CounterInput from "./counter-input";

export default function Calendar({ openToggle, getAvailableSlots }) {
  // Localization
  const { lng, t } = useLocalization();
  //hooks
  const { setBookingField, bookingData } = useBooking();
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
  } = useCalendar(bookingData.date, bookingData.duration);

  // stat
  // const [isOpen, setIsOpen] = useState(
  //   !bookingData.duration || bookingData.duration === 1,
  // );

  // useLockBodyScroll(isOpen);

  // Functions
  const handleDayClick = (day, currentDate, isBlocked) => {
    switch (true) {
      case isBlocked:
        return;

      default: {
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
        setBookingField("date", selected);
        setBookingField("startSlot", null);
        setBookingField("endSlot", null);
        openToggle(true);
        getAvailableSlots({
          studioId: bookingData?.studio?.id,
          date: selected,
          duration: bookingData.duration || 1,
        });
      }
    }
  };

  // Functions
  const handleIncrement = () => {
    const newValue = Math.min(8, currentDuration + 1);
    const totalPricePackage = newValue * +bookingData.totalPackagePrice;
    setBookingField("duration", newValue);
  };

  const handleDecrement = () => {
    const newValue = Math.max(1, currentDuration - 1);
    const totalPricePackage = newValue * +bookingData.totalPackagePrice;
    setBookingField("duration", newValue);
  };

  const handleIncrementPerson = () => {
    const newValue = Math.min(8, currentPersonCount + 1);
    const totalPricePackage = newValue * +bookingData.totalPackagePrice;
    setBookingField("persons", newValue);
  };

  const handleDecrementPerson = () => {
    const newValue = Math.max(1, currentPersonCount - 1);
    const totalPricePackage = newValue * +bookingData.totalPackagePrice;
    setBookingField("persons", newValue);
  };

  // Variables
  const currentDuration = bookingData.duration || 1;
  const currentPersonCount = bookingData.persons || 1;
  const maxPersonCount = bookingData.studio.recording_seats;

  return (
    <div className="mx-auto w-full bg-white">
      {/* Header */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:mb-8 md:grid-cols-2 md:gap-6">
        <CounterInput
          label={t("duration-0")}
          value={currentDuration}
          unit={t("hour")}
          unitPlural={t("hours")}
          min={1}
          max={8}
          helperText={t("select-session-duration")}
          increment={handleIncrement}
          decrement={handleDecrement}
        />

        <CounterInput
          label={t("number-of-people")}
          value={currentPersonCount}
          unit={t("person")}
          unitPlural={t("people")}
          min={1}
          max={maxPersonCount}
          helperText={`${t("maximum-allowed")} ${maxPersonCount} ${t("people")}`}
          increment={handleIncrementPerson}
          decrement={handleDecrementPerson}
        />
      </div>

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* go to last month */}
          <button
            className="h-8 w-8 disabled:opacity-40"
            onClick={() => navigateMonth("prev")}
            disabled={isPrevDisabled}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          {/* Month */}
          <h1 className="text-center text-xl font-medium lg:min-w-[140px]">
            {monthNames[currentDate.getMonth()]}{" "}
            {currentDate.getFullYear().toLocaleString(`${lng}-EG`)}
          </h1>

          {/* go to next month */}
          <button className="h-8 w-8" onClick={() => navigateMonth("next")}>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Duration selection */}
        {/* <Duration isOpen={isOpen} setIsOpen={setIsOpen} /> */}
      </div>

      {/* Calendar */}
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-hidden rounded-lg border border-gray-200">
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

          <div className="grid grid-cols-7">
            {calendarDays.map((day, index) => (
              <div
                key={index}
                className={`relative h-10 border-r border-b border-gray-200 last:border-e-0 lg:h-14 ${
                  day.blocked
                    ? "cursor-not-allowed bg-gray-50"
                    : "cursor-pointer bg-white transition-colors hover:bg-blue-50"
                } ${
                  (selectedDate ? isSelected(day.date) : isToday(day.date))
                    ? "ring-main bg-blue-100 ring-2 ring-inset"
                    : ""
                } `}
                onClick={() => handleDayClick(day, currentDate, day.blocked)}
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
                    className={`absolute top-2 left-2 text-sm font-medium ${
                      day.blocked
                        ? "text-gray-400"
                        : (selectedDate ? isSelected(day.date) : isToday(day.date))
                          ? "text-main font-bold"
                          : "text-gray-900"
                    } `}
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
  );
}
