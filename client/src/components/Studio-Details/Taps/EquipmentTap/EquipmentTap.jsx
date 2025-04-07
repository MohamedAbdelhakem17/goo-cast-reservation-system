import React from 'react'
import { motion } from 'framer-motion'
export default function EquipmentTap() {

    const photographyEquipment = [
        "Multi-colored Backdrops",
        "Professional Lighting",
        "Light Reflectors",
        "Camera Tripods",
        "Softboxes",
        "Light Umbrellas",
        "Tables and Chairs for Photography"
    ];

    const listVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const listItemVariants = {
        hidden: { x: -10, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    }

    return (
        <div className="max-w-3xl mx-auto px-6 py-8 bg-white rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
                <i className="fa-solid fa-photo-film text-main text-2xl mr-2"></i>
                <motion.h2 className="text-2xl font-bold text-gray-800" whileHover={{ scale: 1.02 }}>
                    Equipment
                </motion.h2>
            </div>
            <motion.ul className="space-y-3 text-gray-600" variants={listVariants}>
                {photographyEquipment.map((rule, index) => (
                    <motion.li
                        key={index}
                        className="flex items-start"
                        variants={listItemVariants}
                        whileHover={{ x: 5, color: "#f43f5e" }}
                    >
                        <span className="inline-block w-2 h-2 mt-2 mr-2 bg-rose-500 rounded-full"></span>
                        {rule}
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    )
}
