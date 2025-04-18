import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { studio } from "../../../assets/images";
import StarRating from "../../../hooks/useRate";

export default function Studio() {
    // Animation variants for staggered animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    };

    const headerVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.6,
            },
        },
    };

    const linkVariants = {
        hidden: { x: 20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                duration: 0.6,
                delay: 0.2,
            },
        },
    };

    // Sample studio data
    const studios = [
        { id: 1, name: "Sunrise Studio", location: "Los Angeles", image: studio },
        { id: 2, name: "Moonlight Records", location: "New York", image: studio },
        { id: 3, name: "Echo Chamber", location: "Nashville", image: studio },
        { id: 4, name: "Harmony House", location: "Austin", image: studio },
        { id: 5, name: "Rhythm Works", location: "Chicago", image: studio },
        { id: 6, name: "Sound Haven", location: "Miami", image: studio },
    ];

    const textVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (custom) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: custom * 0.2,
                ease: [0.43, 0.13, 0.23, 0.96],
            },
        }),
    };


    return (
        <section className="py-8 my-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <motion.h2
                    className="text-4xl font-semibold font-sub text-main"
                    initial="hidden"
                    animate="visible"
                    variants={headerVariants}
                >
                    Studios
                </motion.h2>

                <motion.div initial="hidden" animate="visible" variants={linkVariants}>
                    <Link
                        to="/studios"
                        className="flex items-center gap-2 text-gray-700 hover:text-main transition-all duration-300 group"
                    >
                        <span className="font-bold">See all</span>
                        <i className="fa-solid fa-play text-main text-[10px] transition-all duration-300"></i>
                    </Link>
                </motion.div>
            </div>

            {/* Studios Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {studios.map((studio) => (
                    <motion.div
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

                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-main/30 to-transparent flex items-end"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                            >
                                <div className="py-4 px-8 text-white">
                                    <Link to={`/studio/${studio.id}`} className="font-bold">
                                        View Details
                                    </Link>
                                </div>
                            </motion.div>
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
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                viewport={{ once: true }}
                            />
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
