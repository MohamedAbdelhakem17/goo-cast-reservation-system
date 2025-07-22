import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import BookingInput from "../../shared/Booking-Input/BookingInput";
import { useBooking } from "../../../context/Booking-Context/BookingContext";
import Cart from "../Cart/Cart";

export default function PersonalInformation() {
    const inputRef = useRef(null);
    const { getBookingError, formik, bookingData, setBookingField, hasError } =
        useBooking();

    const { firstName, lastName, phone, email, brand } = bookingData.personalInfo;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const motionProps = {
        initial: { opacity: 0, x: -10 },
        animate: { opacity: 1, x: 0 },
        transition: { delay: 0.5, duration: 0.4 },
    };

    console.log(hasError())
    return (
        <div className="space-y-4 py-6 px-4 sm:px-6 lg:px-8 duration-300 mx-auto">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Payment Information</h2>
                <p className="text-gray-900 text-sm sm:text-base">
                    Complete your booking with your contact details
                </p>
            </div>

            {/* Responsive Content */}
            <div className="flex flex-col lg:flex-row items-start gap-6">
                <div className="border-1 border-gray-100 shadow-sm px-2 py-5 rounded-md">
                    {/* Form section */}
                    <form className="w-full  space-y-2 px-5">


                        <motion.div {...motionProps} className="flex flex-col lg:flex-row gap-4 w-full m-0 b-0">
                            <BookingInput
                                className="w-full lg:w-1/2"
                                type="text"
                                id="firstName"
                                label="First Name"
                                placeholder="Enter your First Name"
                                errors={getBookingError("personalInfo.firstName")}
                                onBlur={formik.handleBlur}
                                onChange={(e) => setBookingField("personalInfo.firstName", e.target.value)}
                                touched={formik.touched.firstName}
                                value={firstName}
                            />

                            <BookingInput
                                className="w-full lg:w-1/2"
                                type="text"
                                id="lastName"
                                label="Last Name"
                                placeholder="Enter your Last Name"
                                errors={getBookingError("personalInfo.lastName")}
                                onBlur={formik.handleBlur}
                                onChange={(e) => setBookingField("personalInfo.lastName", e.target.value)}
                                touched={formik.touched.lastName}
                                value={lastName}
                            />
                        </motion.div>


                        <motion.div {...motionProps}>
                            <BookingInput
                                type="text"
                                id="email"
                                label="Email"
                                inputRef={inputRef}
                                placeholder="Enter your Email"
                                errors={getBookingError("personalInfo.email")}
                                onBlur={formik.handleBlur}
                                onChange={(e) => setBookingField("personalInfo.email", e.target.value)}
                                touched={formik.touched.email}
                                value={email}
                            />
                        </motion.div>

                        <motion.div {...motionProps}>
                            <BookingInput
                                type="text"
                                id="phoneNumber"
                                value={phone}
                                label="Phone Number"
                                placeholder="Enter your Phone Number"
                                errors={getBookingError("personalInfo.phone")}
                                onBlur={formik.handleBlur}
                                touched={formik.touched.phoneNumber}
                                onChange={(e) => setBookingField("personalInfo.phone", e.target.value)}
                            />
                        </motion.div>


                        <motion.div {...motionProps}>
                            <BookingInput
                                type="text"
                                id="brandName"
                                label="Special Requests or Comments"
                                value={brand}
                                placeholder="Any special requirements, equipment needs, or additional information..."
                                errors={getBookingError("personalInfo.brand")}
                                onChange={(e) => setBookingField("personalInfo.brand", e.target.value)}
                                onBlur={formik.handleBlur}
                                touched={formik.touched.brandName}
                            />
                        </motion.div>
                    </form>
                    <div className="px-5 py-4">
                        <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                            <i className="fa-solid fa-credit-card mr-3"></i>
                            Payment Method
                        </h3>
                        <div className="mt-2 bg-gray-100 p-4 rounded text-sm text-gray-600">
                            Payment will be processed securely through our payment partner. You will be redirected to complete your payment after confirming your booking.
                            <br />
                            <span className="text-xs text-gray-500 block mt-2">We offer multiple secure payment options to suit your needs. You may choose to pay using Credit or Debit Cards, PayPal, Bank Transfer, or Cash .</span>
                        </div>
                    </div>

                </div>
                {/* Cart section */}
                <div className="w-full lg:w-1/3">
                    <Cart />
                </div>
            </div>
        </div>
    );

}
