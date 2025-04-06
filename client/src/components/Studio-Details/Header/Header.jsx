import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Header({ title, rate = 3, location }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    }

    return (
        <motion.section className="py-2" initial="hidden" animate="show" variants={container}>
            {/* Back Button */}
            <motion.div variants={item}>
                <Link
                    to="/studios"
                    className="font-medium text-gray-600 hover:text-main transition-colors duration-300 group mb-4"
                >

                    <motion.div whileHover={{ x: -3 }} whileTap={{ x: -6 }} className="flex  items-center gap-2 mb-4">
                        <i className="fa-solid fa-caret-left"></i>
                        <span className="text-sm font-bold ">go back to studios</span>
                    </motion.div>

                </Link>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={item} className="text-3xl md:text-4xl font-extrabold text-main ">
                {title}
            </motion.h1>

            {/* Info */}
            <motion.div variants={item} className="flex flex-wrap gap-x-8 items-center py-1">
                <motion.p
                    className="text-gray-600 flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full"
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                    <i className="fa-solid fa-location-dot"></i>
                    <span className="text-base font-medium">{location}</span>
                </motion.p>

                <motion.div
                    className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-full"
                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                >
                    <i className="fa-solid fa-star text-yellow-400"></i>
                    <span className="text-gray-700 font-bold">{rate.toFixed(1)}</span>
                </motion.div>
            </motion.div>

        </motion.section>
    )
}
