/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import StarRating from '../../../hooks/useRate'
import { useBooking } from '../../../context/Booking-Context/BookingContext';
import Loading from '../../shared/Loading/Loading';
import { GetAvailableSlots, useGetAvailableStudio } from '../../../apis/Booking/booking.api';
import AvailableSlots from './Available-Slots/AvailableSlots';

export default function SelectStudio() {
    const [hoveredId, setHoveredId] = useState(null);
    const { setBookingField, bookingData, handlePrevStep } = useBooking()
    const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);

    // Sample studio data
    const { data: studiosData, isLoading } = useGetAvailableStudio()
    const { mutate: getSlots, data } = GetAvailableSlots()

    const selectStudio = (studio) => {
        setBookingField("studio", studio)
        setBookingField("startSlot", null)
        setBookingField("endSlot", null)
        getSlots({ studioId: studio.id, date: bookingData.date, categoryId: bookingData?.selectedPackage?.category })
        setSelectedStudio(studio.id)
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    };

    useEffect(() => {
        const studioId = bookingData?.studio?.id
        if (studioId) {
            getSlots({ studioId: studioId, date: bookingData.date })
        }
    }, [])

    if (isLoading) return <Loading />

    return (
        <div className="space-y-2">
            {
                studiosData?.data?.length === 0
                    ? <div className="flex flex-col gap-3 justify-center items-center">
                        <p className="text-gray-700 text-center leading-[2]">No studios available for the selected date. <br /> Please go back and try another date</p>
                        <button
                            onClick={handlePrevStep}
                            className="bg-main/70 hover:bg-main text-white py-2 px-4 rounded-md cursor-pointer"
                        >
                            Select another date
                        </button>

                    </div>
                    : <>
                        <p className="text-gray-700 pb-3">Please select a studio to continue with your booking.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer" >
                            {studiosData?.data.map((studio) => (
                                <motion.div
                                    onHoverStart={() => setHoveredId(studio.id)}
                                    onHoverEnd={() => setHoveredId(null)}
                                    key={studio.id}
                                    className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 
                                        ${selectedStudio === studio._id && "border-2 border-main/50  scale-[.90]"}`}
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


                                        {
                                            selectedStudio === studio._id &&
                                            <p className="text-white font-bold bg-main rounded-full py-1 px-4 w-fit my-2">Selected</p>
                                        }

                                        <motion.div
                                            className="h-1 bg-main rounded-full"
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

                        <AvailableSlots slots={data?.data} />
                    </>
            }
        </div>
    )
}
