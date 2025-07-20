import { useState } from 'react'
import { motion } from 'framer-motion'
import { useBooking } from '../../../context/Booking-Context/BookingContext';
import Loading from '../../shared/Loading/Loading';
import { useGetAvailableStudio } from '../../../apis/Booking/booking.api';

export default function SelectStudio() {
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

    const benefitVariants = {
        hidden: { opacity: 0, x: -10 },
        visible: {
            opacity: 1,
            x: 0,
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
                    <div className="text-center mb-8">
                        <h2 className="text-2xl mb-2">Choose Your Studio</h2>
                        <p className="text-gray-600">Select the studio that best fits your needs</p>
                    </div>


                    <div className="flex flex-wrap justify-evenly gap-3 ">
                        {studiosData.data.map((studio) => (
                            <motion.div
                                key={studio.id}
                                onClick={() =>
                                    selectStudio({
                                        id: studio._id,
                                        name: studio.name,
                                        image: studio.thumbnail,
                                    })
                                }
                                className={`bg-white rounded-2xl overflow-hidden shadow-md  transition-shadow duration-300 cursor-pointer w-[45%]  border-2 border-gray-300 hover:border-main ${selectedStudio === studio._id && "border-main/50 scale-[.98]"
                                    }`}
                                variants={itemVariants}
                                whileHover={{
                                    y: -10,
                                    transition: { type: "spring", stiffness: 300 },
                                }}
                            >
                                {/* Image */}
                                <motion.div
                                    className="relative h-64 overflow-hidden p-5"
                                > {
                                        selectedStudio === studio._id &&
                                        <div className='h-8 w-8 bg-main text-white rounded-full flex items-center justify-center top-8 right-8 absolute'>
                                            <i className="fa-solid fa-check"></i>
                                        </div>
                                    }

                                    <img
                                        src={studio.thumbnail || "/placeholder.svg"}
                                        alt={studio.name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                </motion.div>

                                {/* Info */}
                                <div className="p-5">
                                    <h3 className="text-xl font-bold text-gray-800">
                                        {studio.name}
                                    </h3>

                                    <ul className="text-gray-600  mt-3">
                                        <li className="text-gray-600 text-sm flex items-start "><span className={`mr-2 ${selectedStudio === studio._id ? "text-main" : "text-black"}`}>•</span>  {studio.recording_seats} Recording Seats</li>
                                        <li className="text-gray-600 text-sm flex items-start "><span className={`mr-2 ${selectedStudio === studio._id ? "text-main" : "text-black"}`}>•</span>  {studio.address}</li>
                                    </ul>

                                    <ul className="space-y-2 mb-4 ">
                                        {studio.facilities.map((text, index) => (
                                            <motion.li
                                                key={index}
                                                variants={benefitVariants}
                                                className="text-gray-600 text-sm flex items-start "
                                            >
                                                <span className={`mr-2 ${selectedStudio === studio._id ? "text-main" : "text-black"}`}>•</span>{text}
                                            </motion.li>
                                        ))}
                                    </ul>

                                    {/* Action Button */}
                                    <div className="mt-auto">
                                        <motion.button
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.97 }}
                                            onClick={() =>
                                                selectStudio({
                                                    id: studio._id,
                                                    name: studio.name,
                                                    image: studio.thumbnail,
                                                })
                                            }
                                            className={`w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center  ${selectedStudio === studio._id
                                                ? "bg-main text-white"
                                                : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
                                                }`}
                                        >
                                            {selectedStudio === studio._id ? "Selected" : "Select"}
                                        </motion.button>
                                    </div>

                                </div>
                            </motion.div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
