import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import BookingInput from "../../shared/Booking-Input/BookingInput";
import { useBooking } from "../../../context/Booking-Context/BookingContext";
import Cart from "../Cart/Cart";
import PaymentOptions from "./Payment-Way/PaymentWay";
import BookingHeader from "../../shared/Booking-Header/BookingHeader";
import { Loader } from "lucide-react";
import { trackEvent } from "../../../GTM/gtm";

export default function PersonalInformation() {
  const inputRef = useRef(null);
  const {
    getBookingError,
    formik,
    bookingData,
    setBookingField,
    hasError,
    handlePrevStep,
    handleSubmit,
  } = useBooking();

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

  return (
    <div className="space-y-4 py-6 px-4 sm:px-6 lg:px-8 duration-300 mx-auto">
      {/* Header */}
      <BookingHeader
        title="Payment Information"
        desc="Complete your booking with your contact details"
      />

      {/* Responsive Content */}
      <div className="flex flex-col lg:flex-row items-start gap-6 w-full">
        <div className="border-1 border-gray-100 shadow-sm px-2 py-5 rounded-md lg:w-2/3 w-full">
          {/* Form section */}
          <form className="w-full space-y-2 px-5 ">
            <motion.div
              {...motionProps}
              className="flex flex-col lg:flex-row gap-4 w-full m-0 b-0"
            >
              <BookingInput
                className="w-full lg:w-1/2"
                type="text"
                id="firstName"
                label="First Name"
                placeholder="Enter your First Name"
                errors={getBookingError("personalInfo.firstName")}
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  setBookingField("personalInfo.firstName", e.target.value)
                }
                touched={formik.touched.firstName}
                value={firstName}
                inputRef={inputRef}
              />

              <BookingInput
                className="w-full lg:w-1/2"
                type="text"
                id="lastName"
                label="Last Name"
                placeholder="Enter your Last Name"
                errors={getBookingError("personalInfo.lastName")}
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  setBookingField("personalInfo.lastName", e.target.value)
                }
                touched={formik.touched.lastName}
                value={lastName}
              />
            </motion.div>

            <motion.div {...motionProps}>
              <BookingInput
                type="text"
                id="email"
                label="Email"
                placeholder="Enter your Email"
                errors={getBookingError("personalInfo.email")}
                onBlur={formik.handleBlur}
                onChange={(e) =>
                  setBookingField("personalInfo.email", e.target.value)
                }
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
                onChange={(e) =>
                  setBookingField("personalInfo.phone", e.target.value)
                }
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
                onChange={(e) =>
                  setBookingField("personalInfo.brand", e.target.value)
                }
                onBlur={formik.handleBlur}
                touched={formik.touched.brandName}
              />
            </motion.div>
          </form>
          <div className="px-5 py-4 border-t border-gray-200">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <i className="fa-solid fa-credit-card mr-3"></i>
              Payment Method
            </h3>
            <PaymentOptions />
            <div className="mt-3 flex items-center flex-col md:flex-row gap-4 px-5 ">
              <button
                type="button"
                disabled={hasError() || formik.isSubmitting}
                onClick={
                  !formik.isSubmitting
                    ? () => {
                        handleSubmit();
                        trackEvent("create_booking", {
                          totalPrice: bookingData.totalPrice,
                        });
                      }
                    : undefined
                }
                className={`w-full py-[8px] px-4 rounded-lg mx-auto text-md font-semibold flex items-center md:flex-row flex-col justify-center my-2 transition-all duration-200 
    ${
      hasError() || formik.isSubmitting
        ? "bg-gray-100 text-gray-300 cursor-not-allowed"
        : "bg-main text-white hover:opacity-90"
    }`}
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <span>Complete Booking</span>
                )}
              </button>

              <button
                onClick={handlePrevStep}
                className="w-full py-[8px] px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center border border-gray-300"
              >
                <span className="m-0">Back</span>
              </button>
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
