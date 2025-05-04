import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetAvailableEndSlots } from "../../../../apis/Booking/booking.api";
import usePriceFormat from "../../../../hooks/usePriceFormat";
export default function AvailableSlots({ slots }) {
    const priceFormat = usePriceFormat();
    const { bookingData, setBookingField } = useBooking()
    const { mutate: getSlots, data } = GetAvailableEndSlots()

    const selectStartTimeSlot = (slot) => {
        setBookingField("startSlot", slot);
        getSlots({ startTime: slot, studioId: bookingData.studio?.id, date: bookingData.date }, { onError: (error) => console.log("error", error) });
    };
    const selectEndTimeSlot = (slot) => {
        setBookingField("endSlot", slot.endTime);
        setBookingField("studio.price", slot.totalPrice);
        setBookingField("duration", +slot.endTime.split(":")[0] - +bookingData.startSlot.split(":")[0]);
    };

    return (
        <div>
            <p className="text-gray-700 pb-3">Available Start Time</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {slots?.map((slot, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer
                            ${bookingData.startSlot === slot.startTime
                                ? "bg-main text-white"
                                : "bg-white hover:bg-gray-100"
                            }
                        `}
                        onClick={() => selectStartTimeSlot(slot.startTime)}
                    >
                        <span className="text-sm font-medium">{slot.startTime}</span>
                    </motion.div>
                ))}
            </div>

            {
                data?.data?.length > 0 && (
                    <>
                        <p className="text-gray-700 pb-3 mt-3">Available End Time</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {data?.data?.map((slot, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className={`flex items-center justify-center flex-col p-3 gab-2 border border-gray-300 rounded-lg shadow-sm cursor-pointer
                            ${bookingData.endSlot === slot.endTime
                                            ? "bg-main text-white"
                                            : "bg-white hover:bg-gray-100"
                                        }
                        `}
                                    onClick={() => selectEndTimeSlot(slot)}
                                >
                                    <span className="text-sm font-medium">{slot.endTime}</span>
                                    <span className={`text-sm font-semibold ${bookingData.endSlot === slot.endTime ? "text-white" : "text-main"}`}>{priceFormat(slot.totalPrice)}</span>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )
            }
        </div>
    );
}
