import { motion } from "framer-motion"
import {
    Check,
    Download,
    Share2,
    MapPin,
    Calendar,
    Clock,
    User,
    Phone,
    Mail,
    CreditCard,
} from "lucide-react"

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, delay },
    }),
}

const iconPop = {
    hidden: { scale: 0 },
    visible: {
        scale: 1,
        transition: { type: "spring", stiffness: 200, damping: 10, delay: 0.2 },
    },
}

// eslint-disable-next-line no-unused-vars
function DetailRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center space-x-3">
            <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
                <span className="text-sm text-gray-500">{label}</span>
                <p className="font-medium text-gray-900 break-words">{value}</p>
            </div>
        </div>
    )
}

const PriceRow = ({ label, value, bold = false }) => (
    <div className="flex justify-between">
        <span className={`text-gray-600 ${bold ? "text-lg font-semibold text-gray-900" : ""}`}>{label}</span>
        <span className={`font-medium ${bold ? "text-lg font-bold text-gray-900" : ""}`}>{value}</span>
    </div>
)

export default function BookingConfirmation() {
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 my-4">
            <motion.div
                className="max-w-6xl mx-auto"
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.1 } },
                }}
            >
                {/* Header */}
                <motion.div className="text-center mb-8" variants={fadeInUp}>
                    <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
                        variants={iconPop}
                    >
                        <Check className="w-8 h-8 text-green-600" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
                    <p className="text-gray-600">Your studio session has been successfully booked</p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Booking Reference */}
                        <motion.div
                            className="bg-white rounded-lg  border border-gray-200 p-6"
                            variants={fadeInUp}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-gray-900">Booking Reference</h2>
                                <span className="text-md font-bold bg-gray-300 rounded-md px-3 py-2">GC757354</span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Please keep this reference number for your records. You'll need it for any changes or inquiries.
                            </p>
                        </motion.div>

                        {/* Session Details */}
                        <motion.div
                            className="bg-white rounded-lg  border border-gray-200 p-6"
                            variants={fadeInUp}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between">
                                    <div>
                                        <span className="text-sm text-gray-500 block">Service</span>
                                        <span className="font-medium text-gray-900">Podcast</span>
                                    </div>
                                    <DetailRow icon={MapPin} label="Studio" value="beta Studio" />
                                </div>
                                <DetailRow icon={Calendar} label="Date" value="Thursday, July 31, 2025" />
                                <DetailRow icon={Clock} label="Time & Duration" value="5:00 PM (3h)" />
                            </div>
                        </motion.div>

                        {/* Contact Info */}
                        <motion.div
                            className="bg-white rounded-lg  border border-gray-200 p-6"
                            variants={fadeInUp}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <DetailRow icon={User} label="Name" value="Mohamed Abdelhakem" />
                                <DetailRow icon={Phone} label="Phone" value="0123456789" />
                                <DetailRow icon={Mail} label="Email" value="mohamed.abdelhakem200@gmail.com" />
                                <DetailRow icon={CreditCard} label="Payment Method" value="Credit/Debit Card" />
                            </div>

                        </motion.div>

                        {/* Important Info */}
                        <motion.div
                            className="bg-white rounded-lg  border border-gray-200 p-6"
                            variants={fadeInUp}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-4">
                                <h3 className="font-medium text-blue-900 mb-2">Before Your Session</h3>
                                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                                    <li>Arrive 15 minutes early for setup</li>
                                    <li>Bring a valid ID for check-in</li>
                                    <li>Review our studio guidelines and policies</li>
                                </ul>
                            </div>

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                                <h3 className="font-medium text-yellow-900 mb-2">Cancellation Policy</h3>
                                <p className="text-sm text-yellow-800">
                                    Free cancellation up to 24 hours before your session. Cancellations within 24 hours may incur a 50%
                                    fee.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Price Summary */}
                        <motion.div
                            className="bg-white rounded-lg border border-gray-200 p-6"
                            variants={fadeInUp}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Price Summary</h2>
                            <div className="space-y-3 ">
                                <PriceRow label="Podcast (3h)" value="$199" />
                                <div>
                                    <PriceRow label="Subtotal" value="$199" />
                                    <PriceRow label="VAT (20%)" value="$39.80" />
                                </div>
                                <div className="pt-3">
                                    <PriceRow label="Total" value="$238.80" bold />
                                </div>
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <motion.div
                            className="bg-white rounded-lg  border border-gray-200 p-6"
                            variants={fadeInUp}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
                            <div className="space-y-3">
                                <motion.button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                    <Download className="w-4 h-4" />
                                    <span>Download Receipt</span>
                                </motion.button>
                                <motion.button className="w-full flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                    <Share2 className="w-4 h-4" />
                                    <span>Share Booking</span>
                                </motion.button>
                                <motion.button className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium">
                                    Book Another Session
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Need Help */}
                        <motion.div
                            className="bg-white rounded-lg  border border-gray-100 p-6"
                            variants={fadeInUp}
                            whileHover={{ y: -2, transition: { duration: 0.2 } }}
                        >
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h2>
                            <div className="space-y-3 text-sm">
                                <DetailRow icon={Phone} label="Studio Phone" value="(555) 123-4567" />
                                <DetailRow icon={Mail} label="Email Support" value="support@goocaststudio.com" />
                                <DetailRow icon={MapPin} label="Studio Address" value="123 Creator Lane, Media District, NY 10001" />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}
