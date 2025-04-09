import React from 'react'
import { motion } from 'framer-motion'
export default function SelectAdditionalServices() {
    return (
        <div className="space-y-4 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto"
            >
                <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                    />
                </svg>
            </motion.div>
            <h3 className="text-xl font-bold text-gray-800">
                Booking Confirmed!
            </h3>
            <p className="text-gray-600">
                Thank you for your booking. We've sent a confirmation
                email with all the details.
            </p>
            <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mt-4">
                <p className="text-blue-800 font-medium">
                    Booking Reference: #BK12345
                </p>
            </div>
        </div>
    )
}
