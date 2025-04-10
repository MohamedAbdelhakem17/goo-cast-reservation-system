import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { studio } from '../../../assets/images'
import StarRating from '../../../hooks/useRate'
import { useBooking } from '../../../context/Booking-Context/BookingContext';
export default function SelectStudio() {
    const [hoveredId, setHoveredId] = useState(null);
    const { handleNextStep, setStudio } = useBooking()

    // Sample studio data
    const studios = [
        { id: 1, name: "Sunrise Studio", location: "Los Angeles", image: studio },
        { id: 2, name: "Moonlight Records", location: "New York", image: studio },
        { id: 3, name: "Echo Chamber", location: "Nashville", image: studio },
        { id: 4, name: "Harmony House", location: "Austin", image: studio },
        { id: 5, name: "Rhythm Works", location: "Chicago", image: studio },
        { id: 6, name: "Sound Haven", location: "Miami", image: studio },
    ];
    const selectStudio = () => {
        setStudio({ name: "Studio 1", image: "studio1.jpg", price: 100, description: "Lorem ipsum dolor sit amet." })
        handleNextStep()
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    };

    return (
        <div className="space-y-2">
            <p className="text-gray-700 pb-3">Please select a studio to continue with your booking.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer" onClick={selectStudio}>
                {studios.map((studio) => (
                    <motion.div
                        onHoverStart={() => setHoveredId(studio.id)}
                        onHoverEnd={() => setHoveredId(null)}
                        key={studio.id}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                        variants={itemVariants}
                        whileHover={{
                            y: -10,
                            transition: { type: "spring", stiffness: 300 },
                        }}
                    >
                        {/* Studio Image with hover effect */}
                        <motion.div
                            className="relative h-64 overflow-hidden"
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.3 },
                            }}
                        >
                            <img
                                src={studio.image || "/placeholder.svg"}
                                alt={studio.name}
                                className="w-full h-full object-cover"
                            />

                        </motion.div>

                        {/* Studio Name and Location */}
                        <div className="p-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold text-gray-800">
                                    {studio.name}
                                </h3>
                                <StarRating rating={4.5} />
                            </div>

                            <p className="text-gray-600 flex items-center gap-2">
                                <i className="fa-solid fa-location-dot text-main"></i>
                                <span className="text-lg">{studio.location}</span>
                            </p>

                            <p className="text-main font-bold">100 $ per hour</p>

                            <motion.div
                                className="mt-3 h-1 bg-main rounded-full"
                                initial={{ width: "0%" }}
                                animate={{
                                    width: hoveredId === studio.id ? "100%" : "0",
                                }}
                                transition={{ duration: 0.4 }}
                            />

                        </div>

                    </motion.div>
                ))
                }

            </div>
        </div>
    )
}
