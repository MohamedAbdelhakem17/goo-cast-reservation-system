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
                className=" bg-main/10 rounded-full flex items-center justify-center mx-auto p-6"
            >
                <h2 className='text-2xl text-main font-bold'>Select Additional Services</h2>

            </motion.div>
        </div>
    )
}

