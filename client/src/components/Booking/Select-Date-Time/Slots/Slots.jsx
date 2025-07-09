import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Calendar, Clock } from "lucide-react"

const timeSlots = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "16:30", "17:00"]

export default function Slots() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedTime, setSelectedTime] = useState(null)

    const toggleSidebar = () => {
        setIsOpen(!isOpen)
    }

    const handleTimeSelect = (time) => {
        setSelectedTime(time)
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            {/* Trigger Button */}
            <button onClick={toggleSidebar} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Calendar className="w-4 h-4" />
                اختر موعدك
            </button>

            {/* Selected Time Display */}
            {selectedTime && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                    <p className="text-green-800">
                        <Clock className="w-4 h-4 inline mr-2" />
                        الوقت المختار: {selectedTime}
                    </p>
                </div>
            )}

            {/* Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
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
                                    <h2 className="text-lg font-semibold text-gray-900">الخميس 24 يوليو 2025</h2>
                                    <p className="text-sm text-gray-600 mt-1">اختر الوقت المناسب لك</p>
                                </div>
                                <button variant="ghost" size="icon" onClick={toggleSidebar} className="hover:bg-gray-100">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="p-6 space-y-3">
                            {timeSlots.map((time, index) => (
                                <motion.button
                                    key={time}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{
                                        delay: index * 0.1,
                                        duration: 0.3,
                                    }}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`w-full p-4 text-center border-2 rounded-lg transition-all duration-200 hover:shadow-md ${selectedTime === time
                                        ? "border-blue-500 bg-blue-50 text-blue-700"
                                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <span className="text-lg font-medium">{time}</span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6">
                            <button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={!selectedTime}
                                onClick={() => {
                                    if (selectedTime) {
                                        alert(`تم اختيار الموعد: ${selectedTime}`)
                                        setIsOpen(false)
                                    }
                                }}
                            >
                                تأكيد الموعد
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
