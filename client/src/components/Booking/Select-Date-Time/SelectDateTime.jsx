import SelectDurationPersonsPar from './Select-Duration-Persons-Par/SelectDurationPersonsPar'
import Calendar from './Calendar/Calendar'
import AvailableSlots from './Available-Slots/AvailableSlots'
import { GetAvailableSlots } from '../../../apis/Booking/booking.api';
import { useBooking } from '../../../context/Booking-Context/BookingContext';
export default function SelectDateTime() {
    const { bookingData } = useBooking()
    const { mutate, data } = GetAvailableSlots();

    const studioId = localStorage.getItem("studioId")

    const handelAvailableSlots = () => {
        mutate({
            studioId: bookingData?.studio?.id,
            date: bookingData?.date || new Date(),
            duration: bookingData?.duration || 1
        });
    };

    return (
        <>

            <p className="text-gray-700 pb-3">Select your preferred date and time for the booking.</p>
            <div className="space-y-4 border border-gray-300 py-3 px-4 rounded-lg shadow-sm bg-white">

                {/* Duration And Person Number */}
                <SelectDurationPersonsPar getSlots={handelAvailableSlots} />

                {/* Calendar */}
                <Calendar getSlots={handelAvailableSlots} />

                {/* Available Slots */}
                <AvailableSlots slots={data?.data} />
            </div>
        </>
    )
}