import { BookingInput, BookingPhoneInput } from "@/components/booking";
import { useEffect, useState } from "react";
import PaymentOptions from "./../../../../booking/_components/steps/personal-information/_components/payment-way";
import OfferSectionTitle from "./offer-section-title";

/**
 * OffersPersonalInformation Component
 *
 * Displays and manages personal information collection for offer bookings.
 * This component handles user input for contact details and payment preferences.
 *
 * @param {Object} props - Component props
 * @param {Function} props.t - Translation function for i18n
 * @param {Object} props.values - Current form values from Formik
 * @param {Function} props.setFieldValue - Formik function to update field values
 * @param {Object} props.formik - Formik form instance with methods and state
 * @param {Function} props.getFieldError - Helper function to retrieve field errors
 *
 * @returns {JSX.Element} Personal information form component
 */
export default function OffersPersonalInformation({
  t,
  values,
  setFieldValue,
  formik,
  getFieldError,
}) {
  const [fullName, setFullName] = useState("");
  useEffect(() => {
    setFullName(
      `${values.personalInfo.firstName} ${values.personalInfo.lastName}`.trim(),
    );
  }, []);

  console.log(fullName);
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <OfferSectionTitle
        title={t("payment-info", "Personal Information")}
        info={t(
          "provide-your-contact-details",
          "Please provide your contact details to complete the booking",
        )}
      />

      {/* Personal Information Form Card */}
      <div className="w-full space-y-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:shadow-gray-800">
        {/* Full Name Input Field */}
        <div className="space-y-1">
          <BookingInput
            className="w-full"
            type="text"
            id="fullName"
            label={t("full-name")}
            placeholder={t("enter-your-full-name")}
            value={fullName}
            touched={
              formik.touched.personalInfo?.firstName ||
              formik.touched.personalInfo?.lastName
            }
            onChange={(e) => {
              const value = e.target.value;
              setFullName(value);

              const parts = value.trim().split(" ");
              const first = parts.shift() || "";
              const last = parts.join(" ");

              setFieldValue("personalInfo.firstName", first);
              setFieldValue("personalInfo.lastName", last);
            }}
            onBlur={() => {
              formik.setFieldTouched("personalInfo.firstName", true);
              formik.setFieldTouched("personalInfo.lastName", true);
            }}
          />
        </div>

        {/* Email Input Field */}
        <div className="space-y-1">
          <BookingInput
            type="email"
            id="email"
            label={t("email", "Email")}
            placeholder={t("enter-your-email", "Enter your email address")}
            errors={getFieldError("personalInfo.email")}
            onBlur={formik.handleBlur}
            onChange={(e) => setFieldValue("personalInfo.email", e.target.value)}
            touched={formik.touched.personalInfo?.email}
            value={values.personalInfo.email}
          />
        </div>

        {/* Phone Number Input Field */}
        <div className="space-y-1">
          <BookingPhoneInput
            label={t("phone-number", "Phone Number")}
            value={values.personalInfo.phone}
            onChange={(value) => setFieldValue("personalInfo.phone", value)}
            onBlur={() => formik.handleBlur({ target: { name: "personalInfo.phone" } })}
            errors={formik.errors.personalInfo?.phone}
            touched={formik.touched.personalInfo?.phone}
          />
        </div>

        {/* Additional Comments/Special Requests */}
        <div className="space-y-1">
          <BookingInput
            type="text"
            id="extraComment"
            label={t("special-requests-or-comments", "Special Requests or Comments")}
            placeholder={t(
              "any-special-requirements-equipment-needs-or-additional-information",
              "Any special requirements, equipment needs, or additional information",
            )}
            errors={getFieldError("extraComment")}
            onBlur={formik.handleBlur}
            onChange={(e) => setFieldValue("extraComment", e.target.value)}
            touched={formik.touched.extraComment}
            value={values.extraComment}
          />
        </div>

        {/* Payment Options Section */}
        <div className="mt-6 border-t border-gray-200 pt-6 dark:border-gray-700">
          <h3 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-200">
            {t("payment-method", "Payment Method")}
          </h3>
          <PaymentOptions setBookingField={setFieldValue} showInfo={false} />
        </div>
      </div>
    </div>
  );
}
