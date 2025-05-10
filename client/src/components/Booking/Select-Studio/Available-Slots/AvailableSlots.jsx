/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetAvailableEndSlots } from "../../../../apis/Booking/booking.api";
import usePriceFormat from "../../../../hooks/usePriceFormat";
import useTimeConvert from "../../../../hooks/useTimeConvert";
export default function AvailableSlots({ slots }) {
    const priceFormat = usePriceFormat();
    const { bookingData, setBookingField } = useBooking();
    const { mutate: getSlots, data } = GetAvailableEndSlots();
    const timeFormat = useTimeConvert()

    useEffect(() => {
        if (bookingData.startSlot && bookingData.studio?.id && bookingData.date) {
            getSlots(
                {
                    startTime: bookingData.startSlot,
                    studioId: bookingData.studio.id,
                    date: bookingData.date,
                    package_id: bookingData.selectedPackage.id
                },
                {
                    onError: (error) => console.log("error fetching end slots", error),
                }
            );
        }
    }, [bookingData.startSlot, bookingData.studio?.id, bookingData.date]);

    useEffect(() => {
        if (bookingData.startSlot && bookingData.endSlot) {
            const startHour = parseInt(bookingData.startSlot?.split(":")[0]);
            const endHour = parseInt(bookingData.endSlot?.split(":")[0]);
            const duration = endHour - startHour;

            setBookingField("duration", duration);
        }
    }, [bookingData.startSlot, bookingData.endSlot]);

    const selectStartTimeSlot = (slot) => {
        setBookingField("startSlot", slot);
        setBookingField("endSlot", null);
        setBookingField("duration", 0);
    };

    const selectEndTimeSlot = (slot) => {
        setBookingField("endSlot", slot.endTime);
        setBookingField("totalPrice", slot.totalPrice || bookingData.studio?.totalPrice);
    };

    return slots?.length > 0
        ? <div className="mt-5">
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
                        <span className="text-sm font-medium">{timeFormat(slot.startTime)}</span>
                    </motion.div>
                ))}
            </div>

            {data?.data?.length > 0 && bookingData.startSlot && (
                <>

                    <p className="text-gray-700 pb-3 mt-3">Available End Time</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {data?.data?.map((slot, index) => {

                            return (
                                <motion.div
                                    key={index}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                    className={`flex items-center justify-center flex-col p-3 gap-2 border rounded-lg shadow-sm
                                        ${bookingData.endSlot === slot.endTime
                                            ? "bg-main text-white"

                                            : "bg-white hover:bg-gray-100 cursor-pointer border-gray-300"
                                        }
                                    `}
                                    onClick={() => selectEndTimeSlot(slot)}
                                >
                                    <span className="text-sm font-medium">{timeFormat(slot.endTime)}</span>
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
        : null
}
