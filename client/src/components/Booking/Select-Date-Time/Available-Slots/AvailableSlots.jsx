import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";

export default function AvailableSlots({ slots }) {

    const { bookingData, setBookingField } = useBooking()

    const selectTimeSlot = (slot) => {
        setBookingField("timeSlot", slot);
    };

    return (
        <div>
            <p className="text-gray-700 pb-3">Available Time</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {slots?.map((slot, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer
                            ${bookingData.timeSlot === slot
                                ? "bg-main text-white"
                                : "bg-white hover:bg-gray-100"
                            }
                        `}
                        onClick={() => selectTimeSlot(slot)}
                    >
                        <span className="text-sm font-medium">{slot.startTime}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
