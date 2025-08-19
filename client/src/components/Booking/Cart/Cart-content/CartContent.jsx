/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo } from 'react'
import usePriceFormat from '../../../../hooks/usePriceFormat'
import useTimeConvert from '../../../../hooks/useTimeConvert'
import { useBooking } from '../../../../context/Booking-Context/BookingContext'
import ApplyDiscount from "../../Apply-Discount/ApplyDiscount"

export default function CartContent() {
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "short", day: "numeric" }
        return dateString ? new Date(dateString).toLocaleDateString(undefined, options) : ""
    }

    function StudioSection({ studio, date, startSlot, formatTime, duration }) {
        if (!studio) return null
        return (
            <div className="pb-4 space-y-1 border-gray-300 border-b-1 flex items-center justify-between">
                <div className='flex-1 ml-3 '>
                    <p className="text-gray-500 text-md">
                        <i className="fa-solid fa-calendar-days mr-2 text-[12px]"></i>
                        {formatDate(date)}
                    </p>
                    <p className="text-gray-500 text-md">
                        <i className="fa-solid fa-clock mr-2 text-[12px]"></i>
                        {formatTime(startSlot)} ({duration}h)
                    </p>
                    <p className="text-gray-500 text-md">
                        <i className="fa-solid fa-location-dot mr-2 text-[12px]"></i>
                        {studio.name}
                    </p>
                </div>
                <img src={studio?.image} alt={studio.name} className='w-20 h-20 rounded-md' />
            </div>
        )
    }

    function PackageSection({ selectedPackage, duration, priceFormat }) {
        if (!selectedPackage || Object.keys(selectedPackage).length === 0) return null
        return (
            <div className="flex  items-center justify-between py-1">
                    <p className="text-gray-500 text-md">
                        {selectedPackage.name}
                    </p>
                    <p className="text-gray-500 text-md">
                        {priceFormat(selectedPackage.price)}   x {duration}h
                    </p>
            </div>
        )
    }

    function AddOnsSection({ selectedAddOns }) {
        if (!selectedAddOns || selectedAddOns.length === 0) return null
        return (
            <ul className="pb-2">
                {selectedAddOns.map((addon) => (
                    <li className="flex items-center justify-between py-1" key={addon._id}>
                        <p className="text-gray-500 text-md">{addon.name}</p>
                        <p className="text-gray-500 text-md">
                            {priceFormat(addon.price)} /  x{addon.quantity}
                        </p>
                    </li>
                ))}
            </ul>
        )
    }

    const { bookingData, handleNextStep, handlePrevStep, setBookingField, currentStep, hasError } = useBooking()
    const formatTime = useTimeConvert()
    const priceFormat = usePriceFormat()

    const totalAddOnPrice = useMemo(() => {
        return bookingData.selectedAddOns?.reduce(
            (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
            0,
        ) || 0
    }, [bookingData.selectedAddOns])

    const subtotal = useMemo(() => {
        return bookingData.totalPackagePrice + totalAddOnPrice
    }, [bookingData.totalPackagePrice, totalAddOnPrice])

    // const vatAmount = useMemo(() => {
    //     return calculateVAT(subtotal)
    // }, [subtotal])

    const totalBeforeDiscount = useMemo(() => {
        return subtotal
    }, [subtotal])

    const discountAmount = useMemo(() => {
        return bookingData.discount ? (totalBeforeDiscount * bookingData.discount) / 100 : 0
    }, [totalBeforeDiscount, bookingData.discount])

    const totalAfterDiscount = useMemo(() => {
        return totalBeforeDiscount - discountAmount
    }, [totalBeforeDiscount, discountAmount])

    useEffect(() => {
        setBookingField("totalPrice", totalBeforeDiscount)
        setBookingField("totalPriceAfterDiscount", totalAfterDiscount)
    }, [totalBeforeDiscount, totalAfterDiscount])

    return (
        <div className=" px-5 py-4 border border-gray-200 rounded-lg">
            <h2 className="py-2 my-2 text-lg font-bold">Reservation Summary</h2>

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

            <AddOnsSection selectedAddOns={bookingData.selectedAddOns} />

            <div className="py-2 my-2 space-y-2 border-t border-b border-gray-200">
                <div className="flex justify-between text-md">
                    <span>Subtotal</span>
                    <span>{priceFormat(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Promo Discount ({bookingData.couponCode})</span>
                        <span>- {priceFormat(discountAmount)}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between py-1 pt-2">
                <p className="font-bold text-md">Total</p>
                <p className="text-gray-500 text-md">{priceFormat(totalAfterDiscount)}</p>
            </div>

            <ApplyDiscount />

            {currentStep === 4 && (
                <div className="mt-4">
                    <button
                        disabled={hasError()}
                        onClick={handleNextStep}
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
            )}

            {currentStep === 5 && (
                <div className="p-3 border border-green-200 rounded-lg bg-green-50">
                    <p className="text-xs text-green-700">
                        🔒 Your booking is secured with SSL encryption and protected by our privacy policy.
                    </p>
                </div>
            )}
        </div>
    )
}
