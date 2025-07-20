import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBooking } from '../../../context/Booking-Context/BookingContext';
import Loading from '../../shared/Loading/Loading';
import { useGetAvailableStudio } from '../../../apis/Booking/booking.api';

export default function SelectStudio() {
    const [hoveredId, setHoveredId] = useState(null);
    const { setBookingField, bookingData, handlePrevStep, handleNextStep } = useBooking();
    const [selectedStudio, setSelectedStudio] = useState(bookingData?.studio?.id || null);

    const { data: studiosData, isLoading } = useGetAvailableStudio();

    const selectStudio = (studio) => {
        setBookingField("studio", studio);
        setBookingField("startSlot", null);
        setBookingField("endSlot", null);
        setSelectedStudio(studio.id);
        handleNextStep();
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    };

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-6">
            {studiosData?.data?.length === 0 ? (
                <div className="flex flex-col gap-3 justify-center items-center">
                    <p className="text-gray-700 text-center leading-[2]">
                        No studios available for the selected date. <br /> Please go back and try another date.
                    </p>
                    <button
                        onClick={handlePrevStep}
                        className="bg-main/70 hover:bg-main text-white py-2 px-4 rounded-md cursor-pointer"
                    >
                        Select another date
                    </button>
                </div>
            ) : (
                <>
                    <div>
                        <h4 className="text-2xl lg:text-4xl font-bold py-2">Select the Studio</h4>
                        <p className="text-gray-600 text-md mb-5">
                            Browse through our range of studios and pick the one that fits your needs best.
                        </p>
                    </div>

                    <div className="flex flex-wrap justify-evenly gap-6">
                        {studiosData.data.map((studio) => (
                            <motion.div
                                key={studio.id}
                                onHoverStart={() => setHoveredId(studio.id)}
                                onHoverEnd={() => setHoveredId(null)}
                                onClick={() =>
                                    selectStudio({
                                        id: studio._id,
                                        name: studio.name,
                                        image: studio.thumbnail,
                                    })
                                }
                                className={`bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer w-[350px] border-2 border-gray-300 ${selectedStudio === studio._id && "border-main/50 scale-[.98]"
                                    }`}
                                variants={itemVariants}
                                whileHover={{
                                    y: -10,
                                    transition: { type: "spring", stiffness: 300 },
                                }}
                            >
                                {/* Image */}
                                <motion.div
                                    className="relative h-64 overflow-hidden"
                                    whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
                                >
                                    <img
                                        src={studio.thumbnail || "/placeholder.svg"}
                                        alt={studio.name}
                                        className="w-full h-full object-cover"
                                    />
                                </motion.div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-2xl font-bold text-gray-800 border-b pb-3 border-gray-200">
                                        {studio.name}
                                    </h3>

                                    <ul className="text-gray-600 space-y-2 list-disc px-4 mt-3">
                                        <li className="text-base">{studio.recording_seats} Recording Seats</li>
                                        <li className="text-base">{studio.address}</li>
                                    </ul>

                                    {selectedStudio === studio._id && (
                                        <p className="text-white font-bold bg-main rounded-full py-1 px-4 w-fit mt-3">
                                            Selected
                                        </p>
                                    )}

                                    {/* Bottom border animation */}
                                    <motion.div
                                        className="h-1 bg-main rounded-full mt-4"
                                        initial={{ width: "0%" }}
                                        animate={{ width: hoveredId === studio.id ? "100%" : "0%" }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
