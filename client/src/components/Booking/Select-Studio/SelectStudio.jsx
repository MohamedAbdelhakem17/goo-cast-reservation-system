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
    const { setBookingField, bookingData, handlePrevStep, handleNextStep } = useBooking()
    const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);

    // Sample studio data
    const { data: studiosData, isLoading } = useGetAvailableStudio()
    // const { mutate: getSlots, data } = GetAvailableSlots()

    const selectStudio = (studio) => {
        setBookingField("studio", studio)
        setBookingField("startSlot", null)
        setBookingField("endSlot", null)
        // getSlots({ studioId: studio.id, date: bookingData.date, categoryId: bookingData?.selectedPackage?.category })
        setSelectedStudio(studio.id)
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

    useEffect(() => {
        const studioId = bookingData?.studio?.id
        if (studioId) {
            // getSlots({ studioId: studioId, date: bookingData.date })
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
                        <div >
                            <h4 className="text-4xl font-bold py-2">Select the Studio</h4>
                            <p className="text-gray-600 text-md mb-5">
                                Browse through our range of studios and pick the one that fits your needs best.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 cursor-pointer " >
                            {studiosData?.data.map((studio) => (
                                <motion.div
                                    onHoverStart={() => setHoveredId(studio.id)}
                                    onHoverEnd={() => setHoveredId(null)}
                                    key={studio.id}
                                    className={`bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300  border-2 border-gray-300
                                        ${selectedStudio === studio._id && " border-main/50  scale-[.95]"}`}
                                    variants={itemVariants}
                                    whileHover={{
                                        y: -10,
                                        transition: { type: "spring", stiffness: 300 },
                                    }}
                                    onClick={() => {
                                        selectStudio(
                                            {
                                                id: studio._id,
                                                name: studio.name,
                                                image: studio.thumbnail,
                                            }
                                        )
                                    }}
                                >
                                    {/* Studio Image with hover effect */}
                                    <motion.div
                                        className="relative h-80 overflow-hidden rounded-b-3xl "
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
                                    <div className="p-5">
                                        <h3 className="text-3xl font-bold text-gray-800 border-b py-3 border-gray-300">
                                            {studio.name}
                                        </h3>

                                        <ul className="text-gray-600 space-y-3 list-disc px-4 my-3">

                                            <li className="text-lg">{studio.recording_seats} Recording Seats </li>
                                            <li className="text-lg">{studio.address}</li>
                                        </ul>



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

                        {/* <AvailableSlots slots={data?.data} /> */}
                    </>
            }
        </div>
    )
}
