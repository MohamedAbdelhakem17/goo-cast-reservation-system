import { useGetAvailableSlots } from "@/apis/public/booking.api";
import { BookingInput } from "@/components/booking";
import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { Calendar, FilePlus2, Loader, UserCheck } from "lucide-react";
import PaymentOptions from "../../../../booking/_components/steps/personal-information/_components/payment-way";
import {
  AdminBookingCart,
  AdminSelectAddon,
  AdminSelectPackage,
  AdminSelectSlots,
  AdminSelectStudio,
} from "./_components";
import PersonalInformation from "./_components/personal-info";
import useAdminCreateBooking from "./_hook/use-admin-create-booking";
import TimeCalendar from "./time";

const motionProps = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: 0.5, duration: 0.4 },
};

export default function AddBooking() {
  const { t } = useLocalization();

  // Fetch available slots
  const { getSlots, data: slots, isPending } = useGetAvailableSlots();

  // Custom booking hook (create only)
  const {
    formik,
    values,
    setFieldValue,
    getFieldValue,
    handleSubmit,
    isPending: isProcessing,
  } = useAdminCreateBooking({ data: null, isEdit: false, bookingId: null });

  // Helper to get nested error message
  const getFieldError = (field) => {
    const keys = field?.split(".");
    return keys.reduce((acc, key) => (acc ? acc[key] : undefined), formik.errors);
  };

  // Destructure personal info for cleaner usage

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="ms:p-8 container mx-auto py-2"
    >
      <div className="space-y-5 md:p-1">
        {/* Page header */}
        <h2 className="border-main mb-8 rounded-md border-b pb-4 text-center text-3xl font-bold text-gray-800">
          {t("create-new-booking")}
        </h2>

        {/* Step 1: Select package */}
        <AdminSelectPackage
          selectPackage={setFieldValue}
          selectedPackage={values?.selectedPackage?.id}
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
          slots={slots}
          isPending={isPending}
          setFieldValue={setFieldValue}
          values={values}
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
            {/* Select User */}
            <PersonalInformation
              setFieldValue={setFieldValue}
              formik={formik}
              getFieldError={getFieldError}
            />

            {/* Extra Comments */}
            <motion.div {...motionProps}>
              <BookingInput
                id="extraComment"
                label={t("special-requests-or-comments")}
                placeholder={t(
                  "any-special-requirements-equipment-needs-or-additional-information",
                )}
                errors={getFieldError("extraComment")}
                onChange={(e) => setFieldValue("extraComment", e.target.value)}
                onBlur={formik.handleBlur}
                touched={formik.touched?.extraComment}
                value={values?.extraComment}
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
              {t("creating-booking")}
            </>
          ) : (
            <>
              <FilePlus2 />
              {t("create-booking")}
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
