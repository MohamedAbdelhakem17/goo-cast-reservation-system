import { useState } from 'react'
import { ApplyCoupon } from '../../../apis/coupon/coupon'
import { useToast } from '../../../context/Toaster-Context/ToasterContext'
import { useBooking } from '../../../context/Booking-Context/BookingContext'

function CouponInput({ coupon, setCoupon, onApply, disabled }) {
    return (
        <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-main bg-white transition-all duration-200">
            <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon.toUpperCase()}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="flex-grow px-2 py-3 text-gray-700 focus:outline-none bg-transparent"
            />
            <button
                disabled={disabled}
                onClick={onApply}
                className="bg-main text-white px-5 py-3 rounded-full hover:bg-main/90 transition-all duration-200 cursor-pointer"
            >
                Apply
            </button>
        </div>
    )
}

export default function ApplyDiscount() {
    const { getBookingField, setBookingField } = useBooking()
    const [coupon, setCoupon] = useState(getBookingField("couponCode") || "")
    const { addToast } = useToast()
    const { mutate: applyCoupon } = ApplyCoupon()

    const handleApplyCoupon = () => {
        applyCoupon(
            {
                email: getBookingField("personalInfo.email"),
                coupon_id: coupon
            },
            {
                onSuccess: (response) => {
                    setBookingField("couponCode", coupon)
                    const totalPrice = getBookingField("totalPrice")
                    const discount = response.data.discount
                    const totalPriceAfterDiscount = totalPrice - totalPrice * (discount / 100)
                    setBookingField("totalPriceAfterDiscount", totalPriceAfterDiscount)
                    addToast(response.message || "Coupon Applied Successfully", "success")
                },
                onError: (error) => {
                    const errorMessage = error.response?.data?.message || "Coupon is not valid"
                    addToast(errorMessage, "error")
                }
            }
        )
    }

    return (
        <div className="bg-white rounded-xl shadow-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Get Your Discount</h2>
            <CouponInput coupon={coupon} setCoupon={setCoupon} onApply={handleApplyCoupon} disabled={!coupon} />
            <p className="text-sm text-gray-400 text-center mt-4">
                Limited time offer. Don't miss out!
            </p>
        </div>
    )
}
