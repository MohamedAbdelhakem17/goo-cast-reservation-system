import { useState } from 'react'
import { ApplyCoupon } from '@/apis/coupon/coupon'
import { useToast } from '@/context/Toaster-Context/ToasterContext'
import { useBooking } from '@/context/Booking-Context/BookingContext'
import { Check } from 'lucide-react'
import usePriceFormat from '@/hooks/usePriceFormat'

function CouponInput({ coupon, setCoupon, onApply, disabled }) {
    return (
        <div className="flex items-center justify-between gap-3 my-3">
            <input
                type="text"
                placeholder="Enter coupon code"
                value={coupon.toUpperCase()}
                onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                className="px-2 py-1 flex-grow-1 text-gray-700 focus:outline-none bg-transparent border-gray-100 border-2 rounded-md"
            />
            <button
                disabled={disabled}
                onClick={onApply}
                className="bg-gray-100 px-2 py-1 rounded-md transition-all duration-200 cursor-pointer text-black shadow-sm border-2 border-gray-100  text-sm"
            >
                Apply
            </button>
        </div>
    )
}

export default function ApplyDiscount() {
    const { getBookingField, setBookingField } = useBooking()
    const priceFormat = usePriceFormat()
    const [coupon, setCoupon] = useState(getBookingField("couponCode") || "")
    const { addToast } = useToast()
    const { mutate: applyCoupon } = ApplyCoupon()

    const discount = getBookingField("discount")
    const totalPackagePrice = getBookingField("totalPackagePrice") // package price only
    const totalAddOns = getBookingField("selectedAddOns")?.reduce(
        (acc, item) => acc + (item.quantity > 0 ? item.price * item.quantity : 0),
        0
    ) || 0

    const handleApplyCoupon = () => {
        applyCoupon(
            {
                email: getBookingField("personalInfo.email"),
                coupon_id: coupon
            },
            {
                onSuccess: (response) => {
                    setBookingField("couponCode", coupon)
                    const discount = response.data.discount

                    // Apply discount only on the package price
                    const packageAfterDiscount = totalPackagePrice - totalPackagePrice * (discount / 100)

                    // Final total = (discounted package) + (full add-ons price)
                    const totalPriceAfterDiscount = packageAfterDiscount + totalAddOns

                    setBookingField("totalPriceAfterDiscount", totalPriceAfterDiscount)
                    setBookingField("discount", discount)
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
        <div className="my-2 rounded-xl w-full py-2">
            <h2 className="text-sm text-gray-800 font-bold"><i className="fa-solid fa-tag mr-3"></i>Promo Code</h2>
            {
                discount
                    ? <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg mt-2">
                        <div className="flex items-center space-x-2">
                            <Check className="w-4 h-4 text-green-600" />
                            <div>
                                <div className="text-sm">{coupon}</div>
                                <div className="text-xs text-green-600">
                                    {discount} % Discount (applied on package only)
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {/* Show discount value calculated from the package price */}
                            <span className="text-sm text-green-600"> - {priceFormat(totalPackagePrice * (discount / 100))}</span>
                        </div>
                    </div>
                    : <CouponInput coupon={coupon} setCoupon={setCoupon} onApply={handleApplyCoupon} disabled={!coupon} />
            }
        </div>
    )
}
