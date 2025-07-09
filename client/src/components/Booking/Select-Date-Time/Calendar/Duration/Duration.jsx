import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Clock } from 'lucide-react'
import { useBooking } from "../../../../../context/Booking-Context/BookingContext"

export default function Duration({ isOpen, setIsOpen }) {
    const { setBookingField, bookingData } = useBooking()

    const durationOptions = [
        { value: "2", label: "2 hours" },
        { value: "3", label: "3 hours" },
        { value: "4", label: "4 hours" },
        { value: "5", label: "5 hours" },
        { value: "6", label: "6 hours" },
        { value: "7", label: "7 hours" },
        { value: "8", label: "All day" },
    ]

    const [selectedDuration, setSelectedDuration] = useState(bookingData.duration || 2)

    const handleDurationSelect = (duration) => {
        setSelectedDuration(duration)
        setBookingField("duration", duration)
        setIsOpen(false)
    }


    return (
        <div className="relative">
            {/* Main Duration Display */}
            <div
                className="flex items-center gap-4 border-2 border-gray-100 rounded-md px-3 cursor-pointer hover:border-gray-200 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex items-center gap-2 px-4 py-3">
                    <Clock className="h-4 w-4 text-gray-600" />
                    <span className="text-sm text-gray-700 border-r-2 px-2 border-gray-100">Duration of filming</span>
                </div>
                <span className="text-red-500 font-medium">{selectedDuration} {selectedDuration === 1 ? "hour" : "hours"}</span>
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
                            className="fixed inset-0 bg-white/5 backdrop-blur-[3px] z-50"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2  bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-gray-600" />
                                        <span className="text-sm text-gray-700">Duration of filming</span>
                                    </div>
                                    <span className="text-red-500 font-medium">{selectedDuration} {selectedDuration === 1 ? "hour" : "hours"}</span>
                                </div>
                            </div>

                            {/* Duration Options */}
                            <div className="py-2">
                                {durationOptions.map((option, index) => (
                                    <motion.button
                                        key={option.value}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        onClick={() => handleDurationSelect(option.value)}
                                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedDuration === option.value
                                            ? "bg-red-50 border-l-2 border-red-500 text-red-600"
                                            : "text-gray-700"
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{option.label}</span>
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