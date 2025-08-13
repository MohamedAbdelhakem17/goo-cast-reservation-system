import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock } from 'lucide-react'
import { useBooking } from "../../../../../context/Booking-Context/BookingContext"

export default function Duration({ isOpen, setIsOpen }) {
    const { setBookingField, bookingData } = useBooking()

    const durationOptions = [
        { value: "1", label: "1 hour" },
        { value: "2", label: "2 hours" },
        { value: "3", label: "3 hours" },
        { value: "4", label: "4 hours" },
        { value: "5", label: "5 hours" },
        { value: "6", label: "6 hours" },
        { value: "7", label: "7 hours" },
        { value: "8", label: "8 hours" },
    ]

    const [selectedDuration, setSelectedDuration] = useState(bookingData.duration || "1")

    const handleDurationSelect = (duration) => {
        setSelectedDuration(duration)
        setBookingField("duration", duration)
        setIsOpen(false)
    }

    return (
        <div className="relative z-[52]">
            {/* Main Display */}
            <div
                className="flex items-center justify-between w-full gap-4 px-3 py-2 transition-colors border-2 border-gray-100 rounded-md cursor-pointer hover:border-gray-200 sm:w-auto"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-600" />
                    <span className="hidden pr-2 text-sm text-gray-700 border-r-2 border-gray-200 sm:inline-block">
                        Duration of filming
                    </span>
                </div>
                <span className="text-sm font-medium text-red-500 sm:text-base">
                    {selectedDuration} {selectedDuration === "1" ? "hour" : "hours"}
                </span>
            </div>

            {/* Popup Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full lg:left-0 mt-2 w-[250px] right-0 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden "
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">Duration of filming</span>
                                    </div>
                                    <span className="text-sm font-medium text-red-500">
                                        {selectedDuration} {selectedDuration === "1" ? "hour" : "hours"}
                                    </span>
                                </div>
                            </div>

                            {/* Duration Options */}
                            <div className="py-2 max-h-[300px] overflow-y-auto ">
                                {durationOptions.map((option, index) => (
                                    <motion.button
                                        key={option.value}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleDurationSelect(option.value)}
                                        className={`w-full px-4 py-3 text-left text-sm transition-colors ${selectedDuration === option.value
                                            ? "bg-red-50 border-l-4 border-red-500 text-red-600 font-semibold"
                                            : "text-gray-700 hover:bg-gray-50"
                                            }`}
                                    >
                                        {option.label}
                                    </motion.button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
