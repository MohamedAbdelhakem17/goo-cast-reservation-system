import { useState, useMemo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useBooking } from "../../../../context/Booking-Context/BookingContext"
import Loading from "../../../shared/Loading/Loading"
import { calculateEndTime, calculateTotalPrice } from "../../../../hooks/useManageSlots"
import SlotButton from "./SlotButton/SlotButton"

export default function Slots({ toggleSidebar, isOpen, setIsOpen, slots }) {
    const [selectedTime, setSelectedTime] = useState(null)
    const { handleNextStep, bookingData, setBookingField } = useBooking()

    const formattedDate = useMemo(() => {
        if (!bookingData?.date) return ""
        return new Date(bookingData.date).toLocaleDateString("en-GB", {
            weekday: "long",
            day: "2-digit",
            month: "long",
            year: "numeric"
        })
    }, [bookingData?.date])

    const handleTimeSelect = useCallback(
        (time) => {
            setSelectedTime(time)
            setIsOpen(false)

            const endTime = calculateEndTime(time, +bookingData.duration)
            const totalPrice = calculateTotalPrice(+bookingData.duration, +bookingData?.selectedPackage?.price)

            setBookingField("startSlot", time)
            setBookingField("endSlot", endTime)
            setBookingField("totalPackagePrice", totalPrice)

            handleNextStep()
        },
        [bookingData.duration, bookingData?.selectedPackage?.price, setIsOpen, setBookingField, handleNextStep]
    )

    return (
        < >
            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-white/5 backdrop-blur-[3px] z-50"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                        }}
                        className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-[55] overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">{formattedDate}</h2>
                                    <p className="text-sm text-gray-600 mt-1">Choose the time that suits you</p>
                                </div>
                                <button onClick={toggleSidebar} className="hover:bg-gray-100 p-2 rounded-md">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Time Slots */}
                        {!slots ? (
                            <Loading />
                        ) : slots.length === 0 ? (
                            <div className="p-6 text-center text-gray-500 text-sm">
                                No available time slots for this day.
                            </div>
                        ) : (
                            <div className="p-6 space-y-3">
                                {slots.map((item, index) => (
                                    <SlotButton
                                        key={item.startTime}
                                        time={item.startTime}
                                        index={index}
                                        isSelected={selectedTime === item.startTime}
                                        onClick={handleTimeSelect}
                                    />
                                ))}
                            </div>
                        )}

                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
