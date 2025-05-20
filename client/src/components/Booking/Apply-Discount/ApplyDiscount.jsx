import { useState } from 'react'
import { ApplyCoupon } from '../../../apis/coupon/coupon'
import useBookingFormik from '../../../context/Booking-Formik/useBookingFormik'
import { useToast } from '../../../context/Toaster-Context/ToasterContext'


export default function ApplyDiscount() {
    const [coupon, setCoupon] = useState("")
    const { addToast } = useToast()
    const { getBookingField, setBookingField } = useBookingFormik()
    const { mutate: applyCoupon } = ApplyCoupon()

    const handelApplyCoupon = () => {
        console.log(setBookingField("coupon_code", coupon), "Set Coupon")
        applyCoupon(
            {
                email: getBookingField("personalInfo.email"),
                coupon_id: coupon
            },
            {
                onSuccess: (response) => {
                    const totalPrice = getBookingField("totalPrice")
                    const { discount } = response.data

                    const discountPercentage = discount || 0
                    const totalPriceAfterDiscount = totalPrice - totalPrice * (discountPercentage / 100)

                    console.log(setBookingField("totalPriceAfterDiscount", totalPriceAfterDiscount), "Set Price After Discount")
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

        <div className="bg-white rounded-xl shadow-md w-full  p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Get Your Discount</h2>

            <div className="flex items-center border border-gray-300 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-main bg-white transition-all duration-200">

                <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={coupon.toUpperCase()}
                    onChange={(e) => {
                        setCoupon(e.target.value.toUpperCase())
                    }}
                    className="flex-grow px-2 py-3 text-gray-700 focus:outline-none bg-transparent"
                />
                <button onClick={handelApplyCoupon} className="bg-main text-white px-5 py-3 rounded-full hover:bg-main/90 transition-all duration-200 cursor-pointer" >
                    Apply
                </button>
            </div>

            <p className="text-sm text-gray-400 text-center mt-4">
                Limited time offer. Don't miss out!
            </p>
        </div>
    )
}
