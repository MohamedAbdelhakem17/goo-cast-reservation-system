import { motion } from "framer-motion"

export default function MostUserActive({ userData }) {
    const { personalInfo, mostBookedStudio, mostBookedPackage, mostBookedAddOn, studioBookings, addOnBookings, packageBookings, totalBookings } = userData

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { x: -20, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 },
        },
    }

    return (
        <motion.div
            className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className="flex flex-col md:flex-row">
                {/* Brand and User Info Section - Takes 1/3 width on desktop */}
                <div className="md:w-1/3 bg-gray-700 p-6 text-white">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex flex-col h-full justify-center"
                    >
                        {/* Brand Highlight */}
                        <motion.div
                            className="mb-6"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <h3 className="text-white text-sm uppercase tracking-wider">Brand</h3>
                            <h2 className="text-3xl font-bold mt-1">{personalInfo.brand}</h2>
                            <div className="h-1 w-16 bg-white/30 rounded-full mt-2"></div>
                        </motion.div>

                        {/* User Info */}
                        <motion.div className="space-y-3" variants={containerVariants} initial="hidden" animate="visible">
                            <motion.div variants={itemVariants} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm opacity-80">User</p>
                                    <p className="font-medium">{personalInfo.fullName}</p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm opacity-80">Email</p>
                                    <p className="font-medium">{personalInfo.email}</p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm opacity-80">Phone</p>
                                    <p className="font-medium">{personalInfo.phone}</p>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Activity Highlights Section - Takes 2/3 width on desktop */}
                <div className="md:w-2/3 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <motion.h3
                            className="text-lg font-semibold text-gray-800 "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            Most Popular Bookings
                        </motion.h3>

                        <p className="text-2xl font-semibold text-gray-800">{totalBookings}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Studio Card */}
                        <motion.div
                            className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="flex items-center gap-4 justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center ">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-teal-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-2xl font-semibold text-gray-800">{studioBookings}</p>
                            </div>
                            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Most Booked Studio</h4>
                            <p className="text-lg font-semibold text-gray-800">{mostBookedStudio}</p>
                        </motion.div>

                        {/* Package Card */}
                        <motion.div
                            className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="flex items-center gap-4 justify-between mb-4">
                                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center ">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-amber-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                        />
                                    </svg>
                                </div>
                                <p className="text-2xl font-semibold text-gray-800">{packageBookings}</p>
                            </div>
                            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Most Booked Package</h4>
                            <p className="text-lg font-semibold text-gray-800">{mostBookedPackage}</p>
                        </motion.div>

                        {/* Add-On Card */}
                        <motion.div
                            className="bg-gray-50 rounded-lg p-5 border border-gray-100 hover:shadow-md transition-shadow"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <div className="flex items-center gap-4 justify-between mb-4">

                                <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-rose-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-2xl font-semibold text-gray-800">{addOnBookings}</p>
                            </div>
                            <h4 className="text-xs uppercase tracking-wider text-gray-500 mb-1">Most Booked Add-On</h4>
                            <p className="text-lg font-semibold text-gray-800">{mostBookedAddOn}</p>
                        </motion.div>
                    </div>

                </div>
            </div>
        </motion.div>
    )
}
