import { motion, AnimatePresence } from 'framer-motion'
import useDateFormat from '../../../../hooks/useDateFormat'
import usePriceFormat from '../../../../hooks/usePriceFormat'

export default function BookingDetailsModal({ booking, closeModel }) {
    const formatDate = useDateFormat()
    const priceFormat = usePriceFormat()

    if (!booking) return null


    return (
        <AnimatePresence mode="wait">
            <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-xl shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                            <button
                                onClick={closeModel}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <i className="fa-solid fa-xmark text-2xl"></i>
                            </button>
                        </div>

                        <div className="space-y-6">

                            {/* Customer Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Name: {booking.personalInfo.fullName}</p>
                                    <p className="text-sm text-gray-600">Email: {booking.personalInfo.email}</p>
                                    <p className="text-sm text-gray-600">Phone: {booking.personalInfo.phone}</p>
                                    {booking.personalInfo.brand && (
                                        <p className="text-sm text-gray-600">Brand: {booking.personalInfo.brand}</p>
                                    )}
                                </div>
                            </div>

                            {/* Studio Information */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Studio Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Name: {booking?.studio?.name}</p>
                                </div>
                            </div>

                            {/* Booking Time Details */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Booking Time</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-600">Date: {formatDate(booking.date)}</p>
                                    <p className="text-sm text-gray-600">Time start: {booking.startSlot}</p>
                                    <p className="text-sm text-gray-600">Time end: {booking.endSlot}</p>
                                    <p className="text-sm text-gray-600">Duration: {booking.duration} hour(s)</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-800">Studio Price:</span>
                                        <span className="text-lg font-bold text-main">
                                            {priceFormat(booking.studioPrice)}
                                        </span>
                                    </div>
                                </div>
                            </div>


                            {/* Package Information */}
                            {booking.package && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Package Details</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm text-gray-600">Name: {booking.package.name} Package</p>
                                        <p className="text-sm text-gray-600">duration: {(booking?.package?.duration) || "no"} hour</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-800">Package Price:</span>
                                            <span className="text-lg font-bold text-main">
                                                {priceFormat(booking?.package?.price) || "no"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Add-ons */}
                            {booking.addOns && booking.addOns.length > 0 && booking.addOns.some(addon => addon && Object.keys(addon).length > 0 && addon.name && addon.quantity) ? (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Add-ons</h3>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        {booking.addOns.map((addon, index) => (
                                            <div key={index} className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">{addon.name}</span>
                                                <span className="text-sm text-gray-600">
                                                    {addon.quantity} x {priceFormat(addon.price)}
                                                </span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-800">Total Add-on Price:</span>
                                            <span className="text-lg font-bold text-main">
                                                {priceFormat(booking.totalAddOnsPrice)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-4 rounded-lg"><p>Not Select Add-on</p></div>
                            )}


                            {/* Total Price */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Payment Details</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-semibold text-gray-800">Total Price:</span>
                                        <span className="text-lg font-bold text-main">
                                            {priceFormat(booking.totalPrice)}
                                        </span>

                                    </div>
                                </div>
                            </div>

                            {/* Booking Status */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">Status</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <span className={`px-3 py-1 text-sm font-semibold rounded-full
                    ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                            booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                'bg-yellow-100 text-yellow-800'}`}
                                    >
                                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}