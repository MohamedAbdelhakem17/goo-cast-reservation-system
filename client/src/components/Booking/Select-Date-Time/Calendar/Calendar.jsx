import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.css";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";

export default function Calendar() {
    const handelStartDate = ()=>{
        const date = new Date();
        const hour = date.getHours();
        hour > 18 ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate());
        return date
    };
    const { setBookingField, bookingData } = useBooking();

    return (
        <div className="border-b-1 border-t-1 border-gray-300 rounded-lg md:p-4">
            <DatePicker
                selected={bookingData.date || handelStartDate}
                onChange={(date) => {
                    setBookingField("date", date);
                    setBookingField("startSlot", null);
                    setBookingField("endSlot", null);
                    setBookingField("studio", null);
                }}
                dateFormat="dd/MM/yyyy"
                calendarClassName="w-full"
                inline
                minDate={handelStartDate()}
            />
        </div>
    )
}
