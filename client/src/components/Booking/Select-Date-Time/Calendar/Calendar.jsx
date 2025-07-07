import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./datePicker.css";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";

export default function Calendar() {
    const handelStartDate = () => {
        const date = new Date();
        const hour = date.getHours();
        hour > 18 ? date.setDate(date.getDate() + 1) : date.setDate(date.getDate());
        return date
    };
    const { setBookingField, bookingData, handleNextStep } = useBooking();

    return (
<div className="md:p-4">
  <DatePicker
    selected={bookingData.date || handelStartDate}
    onChange={(date) => {
      setBookingField("date", date);
      setBookingField("startSlot", null);
      setBookingField("endSlot", null);
      setBookingField("studio", null);
      handleNextStep();
    }}
    dateFormat="dd/MM/yyyy"
    calendarClassName="w-full"
    inline
    minDate={handelStartDate()}
    showMonthYearPicker={false}
    dayClassName={(date) => {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      // الأيام المشطوبة من 1 إلى 14 يوليو 2025
      if (year === 2025 && month === 6 && day >= 1 && day <= 14) {
        return "crossed-out-day";
      }
      return "";
    }}
    filterDate={(date) => {
      // منع اختيار الأيام المشطوبة
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      if (year === 2025 && month === 6 && day >= 1 && day <= 14) {
        return false;
      }
      return true;
    }}
  />
</div>

    )
}
