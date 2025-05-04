/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetAvailableEndSlots } from "../../../../apis/Booking/booking.api";
import usePriceFormat from "../../../../hooks/usePriceFormat";
import { GetStudioByID } from "../../../../apis/studios/studios.api";
export default function AvailableSlots({ slots }) {
    const priceFormat = usePriceFormat();
    const { bookingData, setBookingField } = useBooking()
    const { data: singleStudio } = GetStudioByID(bookingData.studio?.id)
    const day = new Date(bookingData.date).getDay();
    const weakDays = Object.values(singleStudio?.data?.minSlotsPerDay || {});
    const minSlotsPerDay = weakDays[day];
    const { mutate: getSlots, data } = GetAvailableEndSlots()

    useEffect(() => {
        if (bookingData.startSlot && bookingData.studio?.id && bookingData.date) {
            getSlots(
                {
                    startTime: bookingData.startSlot,
                    studioId: bookingData.studio.id,
                    date: bookingData.date
                },
                {
                    onError: (error) => console.log("error fetching end slots", error),
                }
            );
        }
    }, [bookingData.startSlot, bookingData.studio?.id, bookingData.date]);

    const selectStartTimeSlot = (slot) => {
        setBookingField("startSlot", slot);
        // getSlots({ startTime: slot, studioId: bookingData.studio?.id, date: bookingData.date }, { onError: (error) => console.log("error", error) });
    };

    const selectEndTimeSlot = (slot) => {
        const startHour = parseInt(bookingData.startSlot.split(":")[0]);
        const endHour = parseInt(slot.endTime.split(":")[0]);
        const duration = endHour - startHour;

        setBookingField("endSlot", slot.endTime);
        setBookingField("duration", duration);
        setBookingField("studio.price", slot.totalPrice || bookingData.studio?.price);
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

            {data?.data?.length > 0 && bookingData.startSlot && (
                <>
                    <p className="text-gray-700 pb-3 my-3 text-center text-main">The minimum duration  can be booked in this Day is {minSlotsPerDay} hours </p>
                    <p className="text-gray-700 pb-3 mt-3">Available End Time</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {data?.data?.map((slot, index) => {
                            const startHour = parseInt(bookingData.startSlot.split(":")[0]);
                            const endHour = parseInt(slot.endTime.split(":")[0]);
                            const duration = endHour - startHour;
                            const isDisabled = duration < minSlotsPerDay;
                            return (
                                <motion.div
                                    key={index}
                                    whileHover={!isDisabled ? { scale: 1.05 } : {}}
                                    whileTap={!isDisabled ? { scale: 0.95 } : {}}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className={`flex items-center justify-center flex-col p-3 gap-2 border rounded-lg shadow-sm
                            ${bookingData.endSlot === slot.endTime
                                            ? "bg-main text-white"
                                            : isDisabled
                                                ? "bg-gray-100 cursor-not-allowed text-gray-400 border-gray-200"
                                                : "bg-white hover:bg-gray-100 cursor-pointer border-gray-300"
                                        }
                        `}
                                    onClick={() => !isDisabled && selectEndTimeSlot(slot)}
                                >
                                    <span className="text-sm font-medium">{slot.endTime}</span>
                                    <span className={`text-sm font-semibold ${bookingData.endSlot === slot.endTime ? "text-white" : "text-main"}`}>
                                        {priceFormat(slot.totalPrice)}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </div>
                </>
            )}

        </div>
    );
}
