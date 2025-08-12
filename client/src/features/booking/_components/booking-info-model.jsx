import React from 'react'
import { motion } from 'framer-motion'
import { PDFDownloadLink } from '@react-pdf/renderer';
import BookingReceiptPDF from '../Booking-Receipt-PDF/BookingReceiptPDF';
import useDateFormat from '../../../hooks/useDateFormat'
import usePriceFormat from '../../../hooks/usePriceFormat'
import useTimeConvert from '../../../hooks/useTimeConvert'


const statusClasses = {
    approved: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    pending: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
    rejected: "bg-gradient-to-r from-red-500 to-red-600 text-white",
}

const statusIcons = {
    approved: "fa-solid fa-circle-check",
    pending: "fa-solid fa-clock",
    rejected: "fa-solid fa-circle-xmark",
}

export default function BookingInfoModel({ selectedBooking, setSelectedBooking }) {
    const priceFormat = usePriceFormat()
    const convertTo12HourFormat = useTimeConvert()
    const formatDate = useDateFormat()
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedBooking(null)}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-[60%] w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >

                {/* Modal Header with Studio Image */}
                <div className="relative h-48">
                    <img
                        src={selectedBooking.studio.thumbnail || "/placeholder.svg?height=192&width=672"}
                        alt={selectedBooking.studio.name}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold">{selectedBooking.studio.name}</h2>
                                <div className="flex items-center mt-1">
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize flex items-center gap-1 ${statusClasses[selectedBooking.status]}`}
                                    >
                                        <i className={`${statusIcons[selectedBooking.status]} text-xs`}></i>
                                        {selectedBooking.status}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedBooking(null)}
                                className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2 backdrop-blur-sm transition"
                            >
                                <i className="fa-solid fa-xmark text-xl"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        {/* Booking Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <i className="fa-solid fa-calendar-days text-main text-xl mb-2"></i>
                                <p className="text-xs text-gray-500">Date</p>
                                <p className="font-medium">{formatDate(selectedBooking.date, "short")}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <i className="fa-solid fa-clock text-main text-xl mb-2"></i>
                                <p className="text-xs text-gray-500">Time</p>
                                <p className="font-medium">{convertTo12HourFormat(selectedBooking.startSlot)}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <i className="fa-solid fa-hourglass-half text-main text-xl mb-2"></i>
                                <p className="text-xs text-gray-500">Duration</p>
                                <p className="font-medium">{selectedBooking.duration} hours</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl text-center">
                                <i className="fa-solid fa-users text-main text-xl mb-2"></i>
                                <p className="text-xs text-gray-500">Persons</p>
                                <p className="font-medium">{selectedBooking.persons}</p>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <i className="fa-solid fa-user-circle mr-2 text-main"></i>
                                Personal Information
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Full Name</p>
                                        <p className="font-medium">{selectedBooking.personalInfo.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="font-medium">{selectedBooking.personalInfo.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="font-medium">{selectedBooking.personalInfo.phone}</p>
                                    </div>
                                    {selectedBooking.personalInfo.brand && (
                                        <div>
                                            <p className="text-xs text-gray-500">Brand</p>
                                            <p className="font-medium">{selectedBooking.personalInfo.brand}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {selectedBooking.package && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <i className="fa-solid fa-box mr-2 text-main"></i>
                                    Package Details
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-lg font-medium">{selectedBooking.package.name}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total Package Price:</span>
                                            <span className="font-medium">{priceFormat(selectedBooking?.totalPackagePrice  || 0)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {selectedBooking.addOns && selectedBooking.addOns.length > 0 && (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <i className="fa-solid fa-puzzle-piece mr-2 text-main"></i>
                                    Add-ons
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-xl">
                                    {selectedBooking.addOns.map((addon, index) => (
                                        <div
                                            key={index}
                                            className={`flex justify-between items-center py-2 ${index !== selectedBooking.addOns.length - 1 ? "border-b border-gray-200" : ""
                                                }`}
                                        >
                                            <div>
                                                <p className="font-medium">{addon?.item?.name}</p>
                                                <p className="text-sm text-gray-500">Quantity: {addon?.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500">Price</p>
                                                <p className="font-medium">{priceFormat(addon?.price)}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="mt-3 pt-3 border-t border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <span className="font-medium">Total Add-ons:</span>
                                            <span className="font-medium">{priceFormat(selectedBooking?.totalAddOnsPrice)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                <i className="fa-solid fa-receipt mr-2 text-main"></i>
                                Payment Summary
                            </h3>
                            <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                                {selectedBooking.package && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Package Price:</span>
                                        <span className="text-gray-600">{priceFormat(selectedBooking.totalPackagePrice || 0)}</span>
                                    </div>
                                )}
                                {selectedBooking.totalAddOnsPrice > 0 && (
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Add-ons Price:</span>
                                        <span className="text-gray-600">{priceFormat(selectedBooking.totalAddOnsPrice)}</span>
                                    </div>
                                )}
                                <div className="pt-3 mt-1 border-t border-gray-200">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-semibold">Total Price:</span>
                                        <span className="text-xl font-bold text-main">{priceFormat(selectedBooking.totalPrice)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-end">
                        <button
                            onClick={() => setSelectedBooking(null)}
                            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition"
                        >
                            Close
                        </button>
                        <PDFDownloadLink
                            document={<BookingReceiptPDF booking={selectedBooking} />}
                            fileName="booking-receipt.pdf"
                        >
                            {({ loading }) => (
                                <button
                                    className="px-6 py-3 bg-main text-white rounded-xl hover:bg-main/90 transition flex items-center justify-center gap-2"
                                >
                                    <i className="fa-solid fa-download"></i>
                                    {loading ? 'Preparing...' : 'Download Receipt'}
                                </button>
                            )}
                        </PDFDownloadLink>

                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}
