import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function StudioCard({ studio }) {
    const [scrollDir, setScrollDir] = useState("down");

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const updateScrollDir = () => {
            const currentScrollY = window.scrollY;
            if (currentScrollY > lastScrollY) {
                setScrollDir("down");
            } else if (currentScrollY < lastScrollY) {
                setScrollDir("up");
            }
            lastScrollY = currentScrollY;
        };

        window.addEventListener("scroll", updateScrollDir);
        return () => window.removeEventListener("scroll", updateScrollDir);
    }, []);


    return <motion.div
        key={studio._id}
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
        whileHover={{
            y: -5,
            transition: { type: "spring", stiffness: 300 },
        }}
        initial={{
            opacity: 0,
            y: 50,
            scale: 0.7,
            rotate: scrollDir === "down" ? 4 : -4,
        }}
        whileInView={{
            opacity: 1,
            y: 0,
            scale: 1,
            rotate: 0,
        }}
        transition={{ duration: 0.8 }}
        viewport={{ once: false, amount: 0.2 }}
    >
        <div className="flex flex-col md:flex-row">
            {/* Studio Image */}
            <div className="relative md:w-1/3 h-64 md:h-auto overflow-hidden">
                <motion.div
                    whileHover={{
                        scale: 1.05,
                        transition: { duration: 0.3 },
                    }}
                    className="h-full"
                >
                    <img
                        src={studio.thumbnail}
                        alt={studio.name}
                        className="w-full h-full object-cover"
                    />
                </motion.div>

                <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end md:opacity-0 md:hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                >
                    <div className="p-4 text-white">
                        <Link
                            to={`/setups/${studio.slug}`}
                            className="text-xl font-semibold flex items-center gap-2"
                        >
                            <span>View Details</span>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Studio Details */}
            <div className="flex-1 p-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                            {studio.name}
                        </h3>
                        <p className="text-gray-600 flex items-center gap-2 mb-3">
                            <i className="fa-solid fa-location-dot text-rose-500"></i>
                            <span>{studio.address}</span>
                        </p>
                    </div>


                </div>

                <div className="grid grid-cols-2 gap-4 my-4">
                    {
                        studio.facilities.map((facility, index) => (

                            index <= 3 && (
                                <div className="flex items-center gap-2" key={index}>
                                    <i className="fa-solid fa-ticket"></i>
                                    <span className="text-gray-600">
                                        {facility}
                                    </span>
                                </div>
                            )

                        ))
                    }
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <p className="text-rose-500 font-bold text-2xl mb-4 sm:mb-0">
                        {/* {priceFormat(studio.pricePerHour || studio.basePricePerSlot)}  per hour */}
                    </p>

                    <div className="flex gap-3">
                        {/* <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <i className="fa-solid fa-bookmark mr-2"></i>
                        Save
                      </button> */}
                        {/* <button
                        onClick={() => handleQuickBooking(2, {
                          image: studio.thumbnail,
                          name: studio.name,
                          price: studio.basePricePerSlot,
                          id: studio._id,
                        })}
                        className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors cursor-pointer"
                      >
                        Book Now
                      </button> */}
                    </div>
                </div>

                <motion.div
                    className="mt-4 h-1 bg-main rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: "100%" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    viewport={{ once: true }}
                />
            </div>
        </div>
    </motion.div>
}
