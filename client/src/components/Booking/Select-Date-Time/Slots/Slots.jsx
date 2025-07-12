import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { useBooking } from "../../../../context/Booking-Context/BookingContext"
import useTimeConvert from "../../../../hooks/useTimeConvert"
import Loading from "../../../shared/Loading/Loading"




export default function Slots({ toggleSidebar, isOpen, setIsOpen, slots }) {
    const [selectedTime, setSelectedTime] = useState(null)
    const { handleNextStep, bookingData, setBookingField } = useBooking()

    function getEndTime(startTime, duration) {
    const [hours, minutes] = startTime.split(":").map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    date.setHours(date.getHours() + duration);

    const endHours = String(date.getHours()).padStart(2, "0");
    const endMinutes = String(date.getMinutes()).padStart(2, "0");

    setBookingField("endSlot" ,`${endHours}:${endMinutes}`) ;
}

    const handleTimeSelect = (time) => {
        setSelectedTime(time)

        setIsOpen(false)
        setBookingField("startSlot", time)
        getEndTime(time, +bookingData.duration)
        setBookingField("totalPackagePrice", +bookingData?.duration * +bookingData?.selectedPackage?.price)
        handleNextStep();

    }
    const timeFormat = useTimeConvert()

    return (
        <div className="min-h-screen bg-gray-50 p-8">
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
                        className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 overflow-y-auto"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">
                                        {bookingData?.date &&
                                            new Date(bookingData.date).toLocaleDateString("en-GB", {
                                                weekday: "long",
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric"
                                            })}
                                    </h2>
                                    <p className="text-sm text-gray-600 mt-1">  Choose the time that suits you </p>
                                </div>
                                <button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Time Slots */}
                        {
                            slots?.length === 0
                                ? <Loading />
                                : <div className="p-6 space-y-3">
                                    {slots?.map((item, index) => (
                                        <motion.button
                                            key={item.startTime}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: index * 0.1,
                                                duration: 0.3,
                                            }}
                                            onClick={() => {
                                                handleTimeSelect(item.startTime)
                                            }}
                                            className={`w-full p-4 text-center border-2 rounded-lg transition-all duration-200 hover:shadow-md ${selectedTime === item.startTime
                                                ? "border-main/50 bg-main/10 text-main/70"
                                                : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                                }`}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="text-lg font-medium">{timeFormat(item.startTime)}</span>
                                        </motion.button>
                                    ))}
                                </div>
                        }

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
