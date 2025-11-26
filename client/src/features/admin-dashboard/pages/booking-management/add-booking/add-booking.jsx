import { useGetSingleBooking } from "@/apis/admin/manage-booking.api";
import { useGetAvailableSlots } from "@/apis/public/booking.api";
import { BookingInput } from "@/components/booking";
import { EmptyState, Loading } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { Calendar, FilePlus2, Loader, UserCheck } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import PaymentOptions from "../../../../booking/_components/steps/personal-information/_components/payment-way";
import {
  AdminBookingCart,
  AdminSelectAddon,
  AdminSelectPackage,
  AdminSelectSlots,
  AdminSelectStudio,
} from "./_components";
import useAdminCreateBooking from "./_hook/use-admin-create-booking";
import TimeCalendar from "./time";

const motionProps = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: 0.5, duration: 0.4 },
};

export default function AddBooking() {
  const { t } = useLocalization();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get("edit");
  const isEdit = Boolean(bookingId);

  // Fetch booking data if in edit mode
  const { singleBooking, isLoading } = useGetSingleBooking(bookingId);

  // Fetch available slots
  const { getSlots, data: slots, isPending } = useGetAvailableSlots();

  // Custom booking hook (create/update)
  const {
    formik,
    values,
    setFieldValue,
    getFieldValue,
    handleSubmit,
    isPending: isProcessing,
  } = useAdminCreateBooking({ data: singleBooking?.data, isEdit, bookingId });

  // Helper to get nested error message
  const getFieldError = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
  };

  // Destructure personal info for cleaner usage
  const { firstName, lastName, phone, email, brand } = values.personalInfo;

  if (isLoading) return <Loading />;

  if (isEdit && singleBooking === undefined) {
    return <EmptyState />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto py-2"
    >
      <div className="space-y-5 md:p-1">
        {/* Page header */}
        <h2 className="border-main mb-8 rounded-md border-b pb-4 text-center text-3xl font-bold text-gray-800">
          {isEdit ? t("update-booking-data") : t("create-new-booking")}
        </h2>

        {/* Step 1: Select package */}
        <AdminSelectPackage
          selectPackage={setFieldValue}
          selectedPackage={values?.selectedPackage?._id}
          formik={formik}
        />

        {/* Step 2: Select studio */}
        <AdminSelectStudio
          selectStudio={setFieldValue}
          selectedStudio={values?.studio.id}
        />

        {/* Step 3: Select date and time */}
        <div className="space-y-4">
          <h3 className="flex items-center text-2xl font-bold">
            <Calendar className="text-main me-2" />
            {t("date-and-time")}
          </h3>

          <TimeCalendar
            duration={values.duration}
            onDateSelect={getSlots}
            bookingData={values}
            setFieldValue={setFieldValue}
          />
        </div>

        {/* Step 4: Choose time slots */}
        <AdminSelectSlots
          isEdit={isEdit}
          slots={slots}
          isPending={isPending}
          setFieldValue={setFieldValue}
          values={values}
          currentSlot={singleBooking?.data?.startSlot}
        />

        {/* Step 5: Select add-ons */}
        <AdminSelectAddon bookingData={values} setBookingField={setFieldValue} />

        {/* Step 6: Personal and payment info */}
        <div className="space-y-4">
          <h3 className="flex items-center text-2xl font-bold">
            <UserCheck className="text-main me-2" />
            {t("payment-info")}
          </h3>

          <div className="w-full space-y-4 rounded-md border border-gray-100 bg-white p-5 shadow-sm">
            {/* Personal Info Inputs */}
            <motion.div {...motionProps} className="flex flex-col gap-4 lg:flex-row">
              {/* First Name */}
              <BookingInput
                className="w-full lg:w-1/2"
                id="firstName"
                label={t("first-name")}
                placeholder={t("enter-your-first-name")}
                errors={getFieldError("personalInfo.firstName")}
                onChange={(e) => setFieldValue("personalInfo.firstName", e.target.value)}
                onBlur={formik.handleBlur}
                touched={formik.touched?.personalInfo?.firstName}
                value={firstName}
              />

              {/* Last Name */}
              <BookingInput
                className="w-full lg:w-1/2"
                id="lastName"
                label={t("last-name")}
                placeholder={t("enter-your-last-name")}
                errors={getFieldError("personalInfo.lastName")}
                onChange={(e) => setFieldValue("personalInfo.lastName", e.target.value)}
                onBlur={formik.handleBlur}
                touched={formik.touched?.personalInfo?.lastName}
                value={lastName}
              />
            </motion.div>

            {/* Email */}
            <motion.div {...motionProps}>
              <BookingInput
                id="email"
                label={t("email")}
                placeholder={t("enter-your-email")}
                errors={getFieldError("personalInfo.email")}
                onChange={(e) => setFieldValue("personalInfo.email", e.target.value)}
                onBlur={formik.handleBlur}
                touched={formik.touched?.personalInfo?.email}
                value={email}
              />
            </motion.div>

            {/* Phone */}
            <motion.div {...motionProps}>
              <BookingInput
                id="phone"
                label={t("phone-number")}
                placeholder={t("enter-your-phone-number")}
                errors={getFieldError("personalInfo.phone")}
                onChange={(e) => setFieldValue("personalInfo.phone", e.target.value)}
                onBlur={formik.handleBlur}
                touched={formik.touched?.personalInfo?.phone}
                value={phone}
              />
            </motion.div>

            {/* Extra Comments */}
            <motion.div {...motionProps}>
              <BookingInput
                id="brand"
                label={t("special-requests-or-comments")}
                placeholder={t(
                  "any-special-requirements-equipment-needs-or-additional-information",
                )}
                errors={getFieldError("personalInfo.brand")}
                onChange={(e) => setFieldValue("personalInfo.brand", e.target.value)}
                onBlur={formik.handleBlur}
                touched={formik.touched?.personalInfo?.brand}
                value={brand}
              />
            </motion.div>
          </div>
        </div>

        {/* Payment Options */}
        <PaymentOptions setBookingField={setFieldValue} showInfo={false} />

        {/* Booking Summary Cart */}
        <AdminBookingCart
          data={values}
          setFieldValue={setFieldValue}
          getFieldValue={getFieldValue}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing || !formik.isValid}
          className="bg-main ms-auto flex w-fit items-center gap-x-3 rounded-md px-4 py-2 text-lg text-white disabled:bg-gray-100 disabled:text-gray-400"
          onClick={handleSubmit}
        >
          {isProcessing ? (
            <>
              <Loader className="animate-spin" />
              {t(isEdit ? "updating-booking" : "creating-booking")}
            </>
          ) : (
            <>
              <FilePlus2 />
              {t(isEdit ? "update-booking" : "create-booking")}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
