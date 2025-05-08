import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { studio } from '../../../assets/images'
import StarRating from '../../../hooks/useRate'
import { useBooking } from '../../../context/Booking-Context/BookingContext';
import Loading from '../../shared/Loading/Loading';
import { useGetAvailableStudio } from '../../../apis/Booking/booking.api';

export default function SelectStudio() {
    const [hoveredId, setHoveredId] = useState(null);
    const { setBookingField } = useBooking()

    // Sample studio data
    const { data: studiosData, isLoading } = useGetAvailableStudio()

    const selectStudio = (studio) => {
        setBookingField("studio", studio)
        // handleNextStep()
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    };

    if (isLoading) return <Loading />

    return (
        <div className="space-y-2">
            <p className="text-gray-700 pb-3">Please select a studio to continue with your booking.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer" >
                {studiosData?.data.map((studio) => (
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
                        onClick={() => selectStudio(
                            {
                                id: studio._id,
                                name: studio.name,
                                image: studio.thumbnail,
                            }
                        )}
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
                                src={studio.thumbnail || "/placeholder.svg"}
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
                                <StarRating rating={studio.ratingAverage} />
                            </div>

                            <p className="text-gray-600 flex items-center gap-2">
                                <i className="fa-solid fa-location-dot text-main"></i>
                                <span className="text-lg">{studio.address}</span>
                            </p>

                            {/* <p className="text-main font-bold">{studio.basePricePerSlot} Egp per hour</p> */}

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
