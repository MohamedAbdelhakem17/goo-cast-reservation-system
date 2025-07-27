/* eslint-disable no-extra-boolean-cast */

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
<<<<<<< HEAD
        <>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <div className="flex items-center gap-6">
                    <img src={studio.image} alt={studio.name} className="w-20 h-20 rounded-lg object-cover border border-gray-200" />
                    <div>
                        <h5 className="text-lg font-medium text-gray-900">{studio.name}</h5>
                        <p className="text-sm text-gray-500">in : {formatDate(date)}</p>
                        <p className="text-sm text-gray-500">From :  {formatTime(startSlot)}</p>
                    </div>
                </div>
            </div>
        </>
    );
=======
        <div className="space-y-1 border-b-1 border-gray-300 pb-3">
            <p className="text-md text-gray-500">
                <i className="fa-solid fa-calendar-days mr-2 text-[12px]"></i>
                {formatDate(date)}
            </p>
            <p className="text-md text-gray-500">
                <i className="fa-solid fa-clock mr-2 text-[12px]"></i>
                {formatTime(startSlot)} ({duration}h){" "}
            </p>
            <p className="text-md text-gray-500">
                <i className="fa-solid fa-location-dot mr-2 text-[12px]"></i>
                {studio.name}
            </p>
        </div>
    )
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
}

function PackageSection({ selectedPackage, duration, totalPackagePrice, priceFormat }) {
    if (!selectedPackage || Object.keys(selectedPackage).length === 0) return null
    return (
<<<<<<< HEAD
        <>
            <div className="bg-white p-4 rounded-xl border border-gray-200 my-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h5 className="text-md font-medium text-gray-900">{selectedPackage.name}</h5>
                        <p className="text-sm text-gray-500">duration: {duration} hour</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-400">Package Price</p>
                        <p className="text-md font-bold text-main">{totalPackagePrice} EGP</p>
                    </div>
                </div>
            </div>
        </>
    );
=======
        <div className="flex items-center justify-between pb-1 pt-2">
            <p className="text-md text-gray-500">
                {selectedPackage.name} ({duration}h)
            </p>
            <p className="text-md text-gray-500">{priceFormat(totalPackagePrice)}</p>
        </div>
    )
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
}

function AddOnsSection({ selectedAddOns }) {
    if (!selectedAddOns || selectedAddOns.length === 0) return null
    return (
<<<<<<< HEAD
        <>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
                <ul className="divide-y divide-gray-100">
                    {selectedAddOns.map((addon) => (
                        <li key={addon._id} className="py-2 flex justify-between items-center">
                            <span className="text-gray-700">{addon.name}</span>
                            <span className="text-gray-500 text-sm">x{addon.quantity} / {addon.price} EGP</span>
                        </li>
                    ))}
                </ul>
                <div className="pt-3 flex items-center justify-between">
                    <p className="text-sm text-gray-400">Total Price</p>
                    <p className="text-lg font-bold text-main">{totalAddOnPrice.toLocaleString()} EGP</p>
                </div>
            </div>
        </>
    );
=======
        <ul className="pb-2">
            {selectedAddOns.map((addon) => (
                <li className="flex items-center justify-between py-1" key={addon._id}>
                    <p className="text-md text-gray-500">{addon.name}</p>
                    <p className="text-md text-gray-500">
                        {" "}
                        x{addon.quantity} / {addon.price} EGP
                    </p>
                </li>
            ))}
        </ul>
    )
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
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

    console.log((bookingData.totalPriceAfterDiscount))

    useEffect(() => {
        const newTotalPrice = bookingData.totalPackagePrice + totalAddOnPrice
        setBookingField("totalPrice", newTotalPrice)
    }, [bookingData.selectedAddOns])

    const vat = 0
    if (!bookingData) {
        return <div>Loading...</div>
    }

    return (
        <div className="border rounded-lg border-gray-200 py-4 px-5 sticky top-0">
            <h2 className="py-2 my-2 text-bold text-lg">Reservation Summary</h2>
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

            {/* Sub Total */}
            <div className="border-t border-b border-gray-200 py-2 space-y-2 my-2">
                <div className="flex justify-between text-md">
                    <span>Subtotal</span>
                    <span>{priceFormat(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-md text-gray-600">
                    <span>VAT (0%)</span>
                    <span>{priceFormat(vat)}</span>
                </div>
                {Boolean(bookingData.totalPriceAfterDiscount && bookingData.totalPriceAfterDiscount !== 0) && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Promo Discount ({bookingData.couponCode})</span>
                        <span> - {priceFormat(bookingData.totalPrice * (bookingData.discount / 100))}</span>
                    </div>
                )}
            </div>
            <div className="flex items-center justify-between py-1 pt-2">
                <p className="text-md font-bold">Total</p>
                <p className="text-md text-gray-500">{Boolean(bookingData.totalPriceAfterDiscount && bookingData.totalPriceAfterDiscount !== 0) ? priceFormat(bookingData.totalPriceAfterDiscount) : priceFormat(totalPrice)}</p>
            </div>

            {<ApplyDiscount />}


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
