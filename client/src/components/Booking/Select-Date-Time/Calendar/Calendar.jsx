/* eslint-disable react-hooks/exhaustive-deps */
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.css";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetFullBookedStudios } from "../../../../apis/Booking/booking.api";
import Loading from "../../../shared/Loading/Loading";
import { useEffect } from "react";

export default function Calendar({ getSlots }) {
    const startDate = new Date();
    const { setBookingField, bookingData } = useBooking();


    const { isLoading, data } = GetFullBookedStudios(bookingData.studio?.id);

    const disabledDates = data?.data?.map(dateStr => new Date(dateStr)) || [];

    const isDateDisabled = (date) => {
        return disabledDates.some(disabledDate =>
            date.getDate() === disabledDate.getDate() &&
            date.getMonth() === disabledDate.getMonth() &&
            date.getFullYear() === disabledDate.getFullYear()
        );
    };

    useEffect(() => {
        const storedDate = JSON.parse(localStorage.getItem("bookingData"))?.date;
        if (storedDate) {
            setBookingField("date", storedDate);
        } else {
            setBookingField("date", startDate);
        }
        getSlots();
    }, []);


    if (isLoading) return <Loading />
    return (
        <div className="border-b-1 border-t-1 border-gray-300 rounded-lg md:p-4">
            <DatePicker
                selected={bookingData.date || startDate}
                onChange={(date) => {
                    setBookingField("date", date);
                    setBookingField("startSlot", null);
                    setBookingField("endSlot", null);
                    getSlots();
                }}
                dateFormat="dd/MM/yyyy"
                calendarClassName="w-full"
                inline
                minDate={new Date()}
                filterDate={(date) => !isDateDisabled(date)}
            />
        </div>
    )
}
