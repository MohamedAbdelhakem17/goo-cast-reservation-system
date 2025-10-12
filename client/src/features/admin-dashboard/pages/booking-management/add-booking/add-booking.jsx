import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { Calendar, UserCheck, FilePlus2, Loader } from "lucide-react";
import TimeCalendar from "./time";
import {
  AdminSelectAddon,
  AdminSelectPackage,
  AdminSelectStudio,
  AdminSelectSlots,
  AdminBookingCart,
} from "./_components";

import { useGetAvailableSlots } from "@/apis/public/booking.api";
import useAdminCreateBooking from "./_hook/use-admin-create-booking";
import PaymentOptions from "../../../../booking/_components/steps/personal-information/_components/payment-way";
import { BookingInput } from "@/components/booking";

const motionProps = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: 0.5, duration: 0.4 },
};

export default function AddBooking() {
  // Localization
  const { t } = useLocalization();

  // Mutation
  const { getSlots, data: slots, isPending } = useGetAvailableSlots();

  const isEdit = false;

  // Hooks
  const {
    formik,
    values,
    setFieldValue,
    getFieldValue,
    handleSubmit,
    isPending: creatingBooking,
  } = useAdminCreateBooking();

  const getFieldError = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
  };

  const { firstName, lastName, phone, email, brand } = values.personalInfo;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto py-2"
    >
      <div className="space-y-5 md:p-1">
        {/* Header */}
        <h2 className="border-main mb-8 rounded-md border-b pb-4 text-center text-3xl font-bold text-gray-800">
          {isEdit ? t("update-booking-data") : t("create-new-booking")}
        </h2>

        {/* Select Package */}
        <AdminSelectPackage
          selectPackage={setFieldValue}
          selectedPackage={values?.selectedPackage.id}
          formik={formik}
        />

        {/* Select Studio */}
        <AdminSelectStudio
          selectStudio={setFieldValue}
          selectedStudio={values?.studio.id}
        />

        {/* Select Date and Time */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center text-2xl font-bold">
            <Calendar className="text-main me-2" />
            {t("date-and-time")}
          </h3>

          {/* Calender */}
          <TimeCalendar
            duration={values.duration}
            onDateSelect={getSlots}
            bookingData={values}
            setFieldValue={setFieldValue}
          />
        </div>

        {/* Select Slots */}
        <AdminSelectSlots
          slots={slots}
          isPending={isPending}
          setFieldValue={setFieldValue}
          values={values}
        />

        {/* Select addons */}
        <AdminSelectAddon bookingData={values} setBookingField={setFieldValue} />

        {/* Payment Info */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center text-2xl font-bold">
            <UserCheck className="text-main me-2" />
            {t("payment-info")}
          </h3>

          {/* Form */}
          <div className="w-full space-y-4 rounded-md border-1 border-gray-100 bg-white p-5 shadow-sm">
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
                errors={getFieldError("personalInfo.firstName")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setFieldValue("personalInfo.firstName", e.target.value);
                }}
                touched={formik.touched.firstName}
                value={firstName}
              />

              {/* Last name */}
              <BookingInput
                className="w-full lg:w-1/2"
                type="text"
                id="lastName"
                label={t("last-name")}
                placeholder={t("enter-your-last-name")}
                errors={getFieldError("personalInfo.lastName")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setFieldValue("personalInfo.lastName", e.target.value);
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
                errors={getFieldError("personalInfo.email")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setFieldValue("personalInfo.email", e.target.value);
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
                errors={getFieldError("personalInfo.phone")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setFieldValue("personalInfo.phone", e.target.value);
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
                errors={getFieldError("personalInfo.brand")}
                onBlur={(e) => {
                  formik.handleBlur(e);
                }}
                onChange={(e) => {
                  formik.handleChange(e);
                  setFieldValue("personalInfo.brand", e.target.value);
                }}
                touched={formik.touched.brandName}
              />
            </motion.div>
          </div>
        </div>

        <PaymentOptions setBookingField={setFieldValue} showInfo={false} />

        {/* Cart */}
        <AdminBookingCart
          data={values}
          setFieldValue={setFieldValue}
          getFieldValue={getFieldValue}
        />

        {/* Create button Action */}
        <button
          type="submit"
          disabled={creatingBooking || !formik.isValid}
          className="bg-main ms-auto flex w-fit items-center gap-x-3 rounded-md px-4 py-2 text-lg text-white disabled:bg-gray-100 disabled:text-gray-400"
          onClick={() => {
            handleSubmit();
            console.log("clicked");
          }}
        >
          {creatingBooking ? (
            <>
              <Loader className="animate-spin" />
              Creating Booking ...
            </>
          ) : (
            <>
              <FilePlus2 />
              Create Booking
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
