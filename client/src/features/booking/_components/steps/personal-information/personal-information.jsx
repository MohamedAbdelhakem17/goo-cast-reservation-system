import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "@/context/Booking-Context/BookingContext";
import Cart from "@/features/booking/_components/cart/cart";
import { BookingInput } from "@/components/booking";
import PaymentOptions from "./_components/payment-way";
import { BookingLabel } from "@/features/booking/_components";
import { Loader } from "lucide-react";
import { tracking } from "@/utils/gtm";
import useLocalization from "@/context/localization-provider/localization-context";
import Faq from "./../select-additional-services/_components/faq";

const motionProps = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: 0.5, duration: 0.4 },
};

export default function PersonalInformation() {
  // Localization
  const { t } = useLocalization();

  // Ref
  const inputRef = useRef(null);

  // Hooks
  const {
    getBookingError,
    formik,
    bookingData,
    setBookingField,
    hasError,
    handlePrevStep,
    handleSubmit,
  } = useBooking();

  // Effects
  useEffect(() => {
    tracking("add_Payment_info");
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Variables
  const { firstName, lastName, phone, email, brand } = bookingData.personalInfo;

  return (
    <div className="mx-auto space-y-4 duration-300">
      {/* Header */}
      <BookingLabel
        title={t("payment-information")}
        desc={t("complete-your-booking-with-your-contact-details")}
      />

      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        {/* === Form Section === */}
        <div className="col-span-2 w-full rounded-md border border-gray-100 p-4 py-5 shadow-sm">
          <form className="w-full space-y-5 px-5">
            <motion.div
              {...motionProps}
              className="b-0 m-0 flex w-full flex-col gap-4 lg:flex-row"
            >
              {/* First name */}
              <BookingInput
                className="w-full lg:w-1/2"
                type="text"
                id="firstName"
                label={t("first-name")}
                placeholder={t("enter-your-first-name")}
                errors={getBookingError("personalInfo.firstName")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  tracking("user_data", { firstName });
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setBookingField("personalInfo.firstName", e.target.value);
                }}
                touched={formik.touched.firstName}
                value={firstName}
                inputRef={inputRef}
              />

              {/* Last name */}
              <BookingInput
                className="w-full lg:w-1/2"
                type="text"
                id="lastName"
                label={t("last-name")}
                placeholder={t("enter-your-last-name")}
                errors={getBookingError("personalInfo.lastName")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  tracking("user_data", { lastName });
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setBookingField("personalInfo.lastName", e.target.value);
                }}
                touched={formik.touched.lastName}
                value={lastName}
              />
            </motion.div>

            {/* Email */}
            <motion.div {...motionProps}>
              <BookingInput
                type="text"
                id="email"
                label={t("email")}
                placeholder={t("enter-your-email")}
                errors={getBookingError("personalInfo.email")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  tracking("user_data", { email });
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setBookingField("personalInfo.email", e.target.value);
                }}
                touched={formik.touched.email}
                value={email}
              />
            </motion.div>

            {/* Phone number */}
            <motion.div {...motionProps}>
              <BookingInput
                type="text"
                id="phoneNumber"
                value={phone}
                label={t("phone-number")}
                placeholder={t("enter-your-phone-number")}
                errors={getBookingError("personalInfo.phone")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  tracking("user_data", { phone });
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setBookingField("personalInfo.phone", e.target.value);
                }}
                touched={formik.touched.phoneNumber}
              />
            </motion.div>

            {/* Extra comments */}
            <motion.div {...motionProps}>
              <BookingInput
                type="text"
                id="brandName"
                label={t("special-requests-or-comments")}
                value={brand}
                placeholder={t(
                  "any-special-requirements-equipment-needs-or-additional-information",
                )}
                errors={getBookingError("personalInfo.brand")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                  tracking("user_data", { notes: brand });
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setBookingField("personalInfo.brand", e.target.value);
                }}
                touched={formik.touched.brandName}
              />
            </motion.div>
          </form>

          {/* Payment Section */}
          <div className="border-t border-gray-200 px-5 py-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-700">
              <i className="fa-solid fa-credit-card mr-3"></i>
              {t("payment-method")}
            </h3>
            <PaymentOptions setBookingField={setBookingField} />

            {/* Action Buttons */}
            <div className="mt-3 flex flex-col items-center gap-4 px-5 md:flex-row">
              {/* Complete booking button */}
              <button
                type="button"
                disabled={hasError() || formik.isSubmitting}
                onClick={
                  !formik.isSubmitting
                    ? () => {
                        handleSubmit();
                        tracking("create_booking", {
                          totalPrice: bookingData.totalPrice,
                        });
                      }
                    : undefined
                }
                className={`text-md mx-auto my-2 flex w-full flex-col items-center justify-center rounded-lg px-4 py-[8px] font-semibold transition-all duration-200 md:flex-row ${
                  hasError() || formik.isSubmitting
                    ? "cursor-not-allowed bg-gray-100 text-gray-300"
                    : "bg-main text-white hover:opacity-90"
                }`}
              >
                {formik.isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader />
                    <span>{t("processing-0")}</span>
                  </div>
                ) : (
                  <span>{t("complete-booking")}</span>
                )}
              </button>

              {/* Back button */}
              <button
                onClick={handlePrevStep}
                className="text-md mx-auto flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-[8px] font-semibold"
              >
                <span className="m-0">{t("back")}</span>
              </button>
            </div>
          </div>
        </div>

        {/* === Cart Section === */}
        <div className="order-1 w-full lg:order-none">
          <Cart />
        </div>
      </div>

      {/* === FAQ Section (same width as form) === */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
        <div className="order-2 col-span-2 w-full rounded-md border border-gray-100 p-4 py-5 shadow-sm lg:order-none">
          <Faq />
        </div>
      </div>
    </div>
  );
}
