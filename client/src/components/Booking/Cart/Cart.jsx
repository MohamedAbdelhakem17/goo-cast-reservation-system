
/* eslint-disable react-hooks/exhaustive-deps */
import { useBooking } from "../../../context/Booking-Context/BookingContext"
import useTimeConvert from "../../../hooks/useTimeConvert"
import ApplyDiscount from "../Apply-Discount/ApplyDiscount"
import { useAuth } from "../../../context/Auth-Context/AuthContext"
import { useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import usePriceFormat from "../../../hooks/usePriceFormat"

// Utility function for date formatting
const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : ""
}

function StudioSection({ studio, date, startSlot, formatTime, duration }) {
    if (!studio) return null
    return (
        <div className="space-y-1 border-b-1 border-gray-300 pb-3">
            <p className="text-sm text-gray-500">
                <i className="fa-solid fa-calendar-days mr-2 text-[12px]"></i>
                {formatDate(date)}
            </p>
            <p className="text-sm text-gray-500">
                <i className="fa-solid fa-clock mr-2 text-[12px]"></i>
                {formatTime(startSlot)} ({duration}h){" "}
            </p>
            <p className="text-sm text-gray-500">
                <i className="fa-solid fa-location-dot mr-2 text-[12px]"></i>
                {studio.name}
            </p>
        </div>
    )
}

function PackageSection({ selectedPackage, duration, totalPackagePrice, priceFormat }) {
    if (!selectedPackage || Object.keys(selectedPackage).length === 0) return null
    return (
        <div className="flex items-center justify-between pb-1 pt-2">
            <p className="text-sm text-gray-500">
                {selectedPackage.name} ({duration}h)
            </p>
            <p className="text-sm text-gray-500">{priceFormat(totalPackagePrice)}</p>
        </div>
    )
}

function AddOnsSection({ selectedAddOns }) {
    if (!selectedAddOns || selectedAddOns.length === 0) return null
    return (
        <ul className="border-b-1 border-gray-300 pb-2">
            {selectedAddOns.map((addon) => (
                <li className="flex items-center justify-between py-1" key={addon._id}>
                    <p className="text-sm text-gray-500">{addon.name}</p>
                    <p className="text-sm text-gray-500">
                        {" "}
                        x{addon.quantity} / {addon.price} EGP
                    </p>
                </li>
            ))}
        </ul>
    )
}

export default function Cart() {
    const { bookingData, handleNextStep, handlePrevStep, setBookingField, currentStep, hasError } = useBooking()
    const navigateTo = useNavigate()
    const { isAuthenticated } = useAuth()
    const formatTime = useTimeConvert()
    const priceFormat = usePriceFormat()

    const totalAddOnPrice = useMemo(() => {
        return (
            bookingData.selectedAddOns?.reduce(
                (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
                0,
            ) || 0
        )
    }, [bookingData.selectedAddOns])

    const totalPrice = useMemo(() => bookingData?.totalPrice, [bookingData?.totalPrice])

    const handelChangeStep = () => {
        currentStep === 5 ? navigateTo("/booking/confirmation") : handleNextStep()
    }

    useEffect(() => {
        const newTotalPrice = bookingData.totalPackagePrice + totalAddOnPrice
        setBookingField("totalPrice", newTotalPrice)
    }, [bookingData.selectedAddOns])

    if (!bookingData) {
        return <div>Loading...</div>
    }

    return (
        <div className="border rounded-lg border-gray-200 py-4 px-5 sticky top-0">
            <h2 className="p-2 text-bold text-lg">Reservation Summary</h2>
            <StudioSection
                studio={bookingData.studio}
                date={bookingData.date}
                startSlot={bookingData.startSlot}
                duration={bookingData.duration}
                formatTime={formatTime}
            />
            <PackageSection
                selectedPackage={bookingData.selectedPackage}
                duration={bookingData.duration}
                priceFormat={priceFormat}
                totalPackagePrice={bookingData.totalPackagePrice}
            />
            <AddOnsSection selectedAddOns={bookingData.selectedAddOns} totalAddOnPrice={totalAddOnPrice} />
            <div className="flex items-center justify-between py-1 pt-2">
                <p className="text-sm font-bold">Total</p>
                <p className="text-sm text-gray-500">{priceFormat(totalPrice)}</p>
            </div>
            {<ApplyDiscount />}
            {Boolean(bookingData.totalPriceAfterDiscount && bookingData.totalPriceAfterDiscount !== 0) && (
                <div className="flex items-center justify-between mt-2 p-4 border-t border-gray-300">
                    <h4 className="text-xl font-semibold mb-4 text-gray-800">Total Price After Discount</h4>
                    <p className="text-lg font-bold text-main">{bookingData.totalPriceAfterDiscount} EGP</p>
                </div>
            )}
            <div className="mt-4">
                <button
                    disabled={hasError()}
                    onClick={handelChangeStep}
                    className="disabled:bg-gray-100 disabled:text-gray-300 w-full py-[8px] px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center bg-main text-white my-2"
                >
                    <span className="m-0">Proceed to payment</span>
                </button>
                <button
                    onClick={handlePrevStep}
                    className="w-full py-[8px] px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center border border-gray-300"
                >
                    <span className="m-0">Back</span>
                </button>
            </div>
        </div>
    )
}
