import { useState, useEffect } from "react";
import { useGetFullyBookedDates } from "@/apis/public/booking.api";

export function useCalendar(selectedBookingDate, duration) {
  const today = new Date();
  const handleStartDate = () => {
    const date = new Date();
    const hour = date.getHours();
    if (hour > 18) {
      date.setDate(date.getDate() + 1);
    }
    return date;
  };

  const { data: data, isLoading } = useGetFullyBookedDates(duration);

  const disabledDates = data?.data || [];

  const [currentDate, setCurrentDate] = useState(
    selectedBookingDate ? new Date(selectedBookingDate) : handleStartDate(),
  );

  const [selectedDate, setSelectedDate] = useState(
    selectedBookingDate ? new Date(selectedBookingDate) : null,
  );

  useEffect(() => {
    if (selectedBookingDate) {
      const selected = new Date(selectedBookingDate);
      selected.setHours(12, 0, 0, 0);
      setCurrentDate(selected);
      setSelectedDate(selected);
    }
  }, [selectedBookingDate]);

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const daysInMonth = lastDayOfMonth.getDate();
  const firstDayWeekday = (firstDayOfMonth.getDay() + 6) % 7;

  const navigateMonth = (direction) => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(1);
      direction === "prev"
        ? newDate.setMonth(prev.getMonth() - 1)
        : newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const isPrevDisabled =
    currentDate.getFullYear() === today.getFullYear() &&
    currentDate.getMonth() === today.getMonth();

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateToString = (year, month, day) => {
    const date = new Date(year, month, day);
    return (
      date.getFullYear() +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getDate()).padStart(2, "0")
    );
  };

  const isDateInPastOrDisabled = (day) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const isPast = dateToCheck < todayStart;

    // استخدام الـ helper function بدلاً من toISOString
    const dateStr = formatDateToString(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    const isFullyBooked = disabledDates.includes(dateStr);

    return isPast || isFullyBooked;
  };

  const isDateFullyBooked = (day) => {
    // استخدام نفس الـ helper function هنا كمان
    const dateStr = formatDateToString(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return disabledDates.includes(dateStr);
  };

  const isToday = (day) => {
    const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return dateToCheck.toDateString() === today.toDateString();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getFullYear() === currentDate.getFullYear() &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getDate() === day
    );
  };

  const calendarDays = [];

  // Empty cells for days before month start
  for (let i = 0; i < firstDayWeekday; i++) {
    calendarDays.push({
      date: null,
      blocked: true,
      isEmpty: true,
      fullyBooked: false,
    });
  }

  // Days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const isBlocked = isDateInPastOrDisabled(day);
    const isBookedFully = isDateFullyBooked(day);

    calendarDays.push({
      date: day,
      blocked: isBlocked,
      isEmpty: false,
      isToday: isToday(day),
      isSelected: isSelected(day),
      fullyBooked: isBookedFully,
    });
  }

  // Empty cells after month end
  const remainingCells = 42 - calendarDays.length;
  for (let i = 0; i < remainingCells; i++) {
    calendarDays.push({
      date: null,
      blocked: true,
      isEmpty: true,
      fullyBooked: false,
    });
  }

  const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return {
    calendarDays,
    currentDate,
    selectedDate,
    navigateMonth,
    setSelectedDate,
    setCurrentDate,
    isPrevDisabled,
    isSelected,
    isToday,
    isLoading,
    monthNames,
    daysOfWeek,
    disabledDates,
    isDateFullyBooked,
  };
}
