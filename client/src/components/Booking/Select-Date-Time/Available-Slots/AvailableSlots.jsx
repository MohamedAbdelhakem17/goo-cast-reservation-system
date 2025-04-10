import { useState } from "react";
import { motion } from "framer-motion";

export default function AvailableSlots() {
    const timeSlots = [
        "09:00 AM",
        "10:00 AM",
        "11:00 AM",
        "12:00 PM",
        "01:00 PM",
        "02:00 PM",
        "03:00 PM",
        "04:00 PM",
        "05:00 PM",
    ];
    const [selectedSlot, setSelectedSlot] = useState(null);

    const selectTimeSlot = (slot) => {
        console.log(`Selected time slot: ${slot}`);
        setSelectedSlot(slot);
    };

    return (
        <div>
            <p className="text-gray-700 pb-3">Available Time</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {timeSlots.map((slot, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className={`flex items-center justify-center p-4 border border-gray-300 rounded-lg shadow-sm cursor-pointer
                            ${selectedSlot === index
                                ? "bg-main text-white"
                                : "bg-white hover:bg-gray-100"
                            }
                        `}
                        onClick={() => selectTimeSlot(index)}
                    >
                        <span className="text-sm font-medium">{slot}</span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
