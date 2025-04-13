import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.css";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";

export default function Calendar() {
    const startDate = new Date();
    const { setBookingField, bookingData } = useBooking();

    const disableDate = new Date(2025, 3, 25);

    const isDateDisabled = (date) => {
        return date.getDate() === disableDate.getDate() &&
            date.getMonth() === disableDate.getMonth() &&
            date.getFullYear() === disableDate.getFullYear();
    };

    return (
        <div className="border-b-1 border-t-1 border-gray-300 rounded-lg md:p-4">
            <DatePicker
                selected={bookingData.date || startDate}
                onChange={(date) => setBookingField("date", date)}
                dateFormat="dd/MM/yyyy"
                calendarClassName="w-full"
                inline
                minDate={new Date()}
                filterDate={(date) => !isDateDisabled(date)}
            />
        </div>
    )
}
