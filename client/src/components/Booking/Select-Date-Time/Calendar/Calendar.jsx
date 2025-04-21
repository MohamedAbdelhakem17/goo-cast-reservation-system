import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.css";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetFullBookedStudios } from "../../../../apis/Booking/booking.api";

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

    if (isLoading) {
        return (

            <div className="loader"></div>

        )
    }

    return (
        <div className="border-b-1 border-t-1 border-gray-300 rounded-lg md:p-4">
            <DatePicker
                selected={bookingData.date || startDate}
                onChange={(date) => {
                    setBookingField("date", date);
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
