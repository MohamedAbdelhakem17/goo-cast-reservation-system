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
import { useNavigate } from "react-router-dom"
import usePriceFormat from "../../hooks/usePriceFormat"
import { PDFDownloadLink } from "@react-pdf/renderer"
import BookingReceiptPDF from "../../components/shared/Booking-Receipt-PDF/BookingReceiptPDF"
import useDateFormat from "../../hooks/useDateFormat"

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
    <div className="flex justify-between py-2 items-center">
        <span className={`text-gray-600 ${bold ? "text-lg font-semibold text-gray-900" : ""}`}>{label}</span>
        <span className={`font-medium ${bold ? "text-lg font-bold text-gray-900" : ""}`}>{value}</span>
    </div>
)

export default function BookingConfirmation() {
    const navigate = useNavigate();
    const bookingData = JSON.parse(localStorage.getItem("bookingConfirmation"))?.bookingResponse;

    

    const priceFormat = usePriceFormat();
    const dateFormat = useDateFormat()

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
                                <span className="text-md font-bold bg-gray-300 rounded-md px-3 py-2">{bookingData?._id}</span>
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
                                        <span className="font-medium text-gray-900">{bookingData?.package?.name}</span>
                                    </div>
                                    <DetailRow icon={MapPin} label="Studio" value={bookingData?.studio?.name} />
                                </div>
                                <DetailRow icon={Calendar} label="Date" value={dateFormat(bookingData?.date)} />
                                <DetailRow icon={Clock} label="Time & Duration" value={`${bookingData?.startSlot} (${bookingData?.duration}h)`} />
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
                                <DetailRow icon={User} label="Name" value={bookingData?.personalInfo?.fullName} />
                                <DetailRow icon={Phone} label="Phone" value={bookingData?.personalInfo?.phone} />
                                <DetailRow icon={Mail} label="Email" value={bookingData?.personalInfo?.email} />
                                <DetailRow icon={CreditCard} label="Payment Method" value={bookingData?.paymentMethod} />
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
                            <div className="space-y-3 divide-y divide-gray-200">
                                <PriceRow label={bookingData?.package?.name} value={priceFormat(bookingData?.totalPackagePrice)} />
                                <div>
                                    <PriceRow label="Subtotal" value={priceFormat(bookingData?.totalPrice)} />
                                    <PriceRow label="VAT (0)" value={priceFormat(0)} />
                                </div>
                                <div className="pt-3">
                                    <PriceRow label="Total" value={priceFormat(bookingData?.totalPrice)} bold />
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
                            <div>

                                <PDFDownloadLink
                                    document={<BookingReceiptPDF booking={bookingData} />}
                                    fileName="booking-receipt.pdf"
                                >
                                    {({ loading }) => (
                                        <motion.button className="w-full flex items-center justify-center space-x-2 my-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition">
                                            <Download className="w-4 h-4" />
                                            <span>{loading ? "Loading..." : "Download Receipt"}</span>
                                        </motion.button>
                                    )}
                                </PDFDownloadLink>

                                <motion.button className="w-full px-4 py-2 my-2  bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium" onClick={() => {
                                    localStorage.removeItem("bookingData");
                                    localStorage.removeItem("bookingStep");
                                    localStorage.removeItem("bookingConfirmation");
                                    navigate("/booking");
                                }}>
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
                                <DetailRow icon={Phone} label="Studio Phone" value="01010955331" />
                                <DetailRow icon={Mail} label="Email Support" value="support@goocaststudio.com" />
                                <DetailRow icon={MapPin} label="Studio Address" value="8 Abd El-Rahman Fahmy , Qasr El Nile, Garden City" />
                            </div>
                        </motion.div>
                    </div>

                </div>
            </motion.div>
        </div>
    )
}


// {
//   "studio": "68487d7e5a067463a3298a64",
//   "date": "2025-07-29T09:00:00.000Z",
//   "startSlot": "12:00",
//   "endSlot": "17:00",
//   "duration": 5,
//   "persons": 1,
//   "package": "681c9c7499ea41aecd27ad77",
//   "addOns": [
//     {
//       "item": "67fe85767663f45575657beb",
//       "quantity": 1,
//       "price": 1000,
//       "_id": "6886b961aa15dbbf3aa165f6"
//     }
//   ],
//   "personalInfo": {
//     "fullName": "Mohamed   Abdelhakem",
//     "phone": "01151680381",
//     "email": "mohamed.abdelhakem200@gmail.com",
//     "brand": ""
//   },
//   "status": "pending",
//   "totalPrice": 41000,
//   "totalAddOnsPrice": 1000,
//   "totalPackagePrice": 40000,
//   "isGuest": true,
//   "startSlotMinutes": 720,
//   "endSlotMinutes": 1020,
//   "paymentMethod": "CARD",
//   "isPaid": false,
//   "paymentAt": null,
//   "totalPriceAfterDiscount": 41000,
//   "_id": "6886b961aa15dbbf3aa165f5",
//   "createdAt": "2025-07-27T23:42:29.103Z",
//   "updatedAt": "2025-07-27T23:42:29.103Z",
//   "__v": 0
// }