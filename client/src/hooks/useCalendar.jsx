import { useState, useEffect } from "react";
import { GetFullBookedStudios } from "../apis/Booking/booking.api";

export function useCalendar(studioId, selectedBookingDate, duration) {
    const today = new Date();
    const handleStartDate = () => {
        const date = new Date();
        const hour = date.getHours();
        if (hour > 18) {
            date.setDate(date.getDate() + 1);
        }
        return date;
    };

    const { isLoading, data } = GetFullBookedStudios(studioId, duration);
    const disabledDates = data?.data?.map((dateStr) => new Date(dateStr)) || [];

    const [currentDate, setCurrentDate] = useState(
        selectedBookingDate ? new Date(selectedBookingDate) : handleStartDate()
    );

    const [selectedDate, setSelectedDate] = useState(
        selectedBookingDate ? new Date(selectedBookingDate) : null
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
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

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

    const isDateInPastOrDisabled = (day) => {
        const dateToCheck = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

        const isPast = dateToCheck < todayStart;

        const isDisabled = disabledDates.some(
            (d) =>
                d.getFullYear() === dateToCheck.getFullYear() &&
                d.getMonth() === dateToCheck.getMonth() &&
                d.getDate() === dateToCheck.getDate()
        );

        return isPast || isDisabled;
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

    for (let i = 0; i < firstDayWeekday; i++) {
        calendarDays.push({ date: null, blocked: true, isEmpty: true });
    }

    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push({
            date: day,
            blocked: isDateInPastOrDisabled(day),
            isEmpty: false,
            isToday: isToday(day),
            isSelected: isSelected(day),
        });
    }

    const remainingCells = 42 - calendarDays.length;
    for (let i = 0; i < remainingCells; i++) {
        calendarDays.push({ date: null, blocked: true, isEmpty: true });
    }

    const daysOfWeek = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
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
        daysOfWeek
    };
} 