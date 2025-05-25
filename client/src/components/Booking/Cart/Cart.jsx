/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react'
import { useBooking } from '../../../context/Booking-Context/BookingContext'
import useTimeConvert from '../../../hooks/useTimeConvert'
import ApplyDiscount from '../Apply-Discount/ApplyDiscount'
import { useAuth } from '../../../context/Auth-Context/AuthContext'
import { useEffect } from 'react'

export default function Cart() {
    const { bookingData, handleNextStep, setBookingField } = useBooking()
    const { isAuthenticated } = useAuth()
    const formatTime = useTimeConvert()

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" }
        return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : ''
    }

    const totalAddOnPrice = bookingData.selectedAddOns?.reduce((acc, item) => {
        return acc + (item.quantity > 0 ? item.price * item.quantity : 0)
    }, 0) || 0

    const totalPrice = bookingData?.totalPrice

    useEffect(() => {
        const newTotalPrice = bookingData.totalPackagePrice + totalAddOnPrice
        setBookingField("totalPrice", newTotalPrice)

    }, [bookingData.selectedAddOns])

    if (!bookingData) {
        return <div>Loading...</div>
    }





    return (
        <div>
            {/* Selected Studio */}
            {bookingData.studio && (
                <>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">Selected Studio</h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center gap-6">
                            <img
                                src={bookingData.studio.image}
                                alt={bookingData.studio.name}
                                className="w-20 h-20 rounded-lg object-cover border border-gray-200"
                            />
                            <div>
                                <h5 className="text-lg font-medium text-gray-900">{bookingData.studio.name}</h5>
                                <p className="text-sm text-gray-500">in : {formatDate(bookingData.date)}</p>
                                <p className="text-sm text-gray-500">From :  {formatTime(bookingData.startSlot)}</p>
                                <p className="text-sm text-gray-500">To :  {formatTime(bookingData.endSlot)}</p>
                            </div>
                        </div>

                    </div>
                </>
            )}

            {/* Selected Package */}
            {bookingData.selectedPackage && Object.keys(bookingData.selectedPackage).length > 0 && (
                <>
                    <h4 className="text-xl font-semibold my-4 text-gray-800">Selected Package</h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h5 className="text-lg font-medium text-gray-900">{bookingData.selectedPackage.name}</h5>
                                <p className="text-sm text-gray-500">duration: {bookingData.duration} hour</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-400">Package Price</p>
                                <p className="text-lg font-bold text-main">
                                    {bookingData.totalPackagePrice} EGP
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Selected Add-Ons */}
            {bookingData.selectedAddOns?.length > 0 && (
                <>
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">Selected Add-Ons</h4>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <ul className="divide-y divide-gray-100">
                            {bookingData.selectedAddOns.map((addon) => (
                                <li key={addon._id} className="py-2 flex justify-between items-center">
                                    <span className="text-gray-700">{addon.name}</span>
                                    <span className="text-gray-500 text-sm">x{addon.quantity} / {addon.price} EGP</span>
                                </li>
                            ))}
                        </ul>

                        {/* Total Price */}
                        <div className="pt-3 flex items-center justify-between">
                            <p className="text-sm text-gray-400">Total Price</p>
                            <p className="text-lg font-bold text-main">
                                {totalAddOnPrice.toLocaleString()} EGP
                            </p>
                        </div>
                    </div>
                </>
            )}

            {/* Apply Discount */}
            {isAuthenticated && < ApplyDiscount />}

            {/* Total Price For All Cart */}
            <div className="flex items-center justify-between mt-4 p-3">
                <h4 className="text-xl font-semibold mb-4 text-gray-800">Total Price</h4>
                <p className="text-lg font-bold text-main">
                    {totalPrice} EGP
                </p>
            </div>
            {
                bookingData.totalPriceAfterDiscount && bookingData.totalPriceAfterDiscount !== 0 && <div className="flex items-center justify-between mt-2 p-4 border-t border-gray-300">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">total Price After Discount</h4>
                    <p className="text-lg font-bold text-main">
                        {bookingData.totalPriceAfterDiscount} EGP
                    </p>
                </div>
            }


            <button onClick={handleNextStep} className="text-main flex items-baseline justify-center cursor-pointer mx-auto gap-1 text-md font-medium mt-1 bg-main/5 hover:bg-main/10 px-3 py-1.5 rounded-md transition-colors ">
                <span className='m-0'>complete booking</span>
                <i className="fa-solid fa-chevron-right text-xs m-0"></i>
            </button>
        </div>
    )
}
