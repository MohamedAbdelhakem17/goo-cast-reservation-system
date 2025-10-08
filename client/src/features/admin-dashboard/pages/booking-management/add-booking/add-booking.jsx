import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { Calendar, UserCheck, FilePlus2, Clock } from "lucide-react";
import TimeCalendar from "./time";
import { AdminSelectAddon, AdminSelectPackage, AdminSelectStudio } from "./_components";
import useAdminCreateBooking from "./_hook/use-admin-create-booking";
import { useGetAvailableSlots } from "@/apis/public/booking.api";
import { SlotButton } from "@/components/common";
import { Loading } from "@/components/common";

export default function AddBooking() {
  // Localization
  const { t } = useLocalization();

  // query
  const { getSlots, data: slots, isPending } = useGetAvailableSlots();

  const isEdit = false;

  // Hooks
  const { values, setFieldValue } = useAdminCreateBooking();

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
        {/* Booking Steps */}

        {/* Select Package */}
        <AdminSelectPackage
          selectPackage={setFieldValue}
          selectedPackage={values?.selectedPackage.id}
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
          <TimeCalendar duration={2} onDateSelect={getSlots} bookingData={values} />
        </div>

        {/* Select Slots */}
        {isPending ? (
          <Loading />
        ) : (
          slots?.data && (
            <>
              {/* Title */}
              <h3 className="flex items-center text-2xl font-bold">
                <Clock className="text-main me-2" />
                Select available slot
              </h3>

              <div className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-5">
                {slots.data.map((slot, index) => {
                  const isSelected = values.startSlot === slot.startTime;

                  return (
                    <SlotButton
                      key={index}
                      time={slot.startTime}
                      isSelected={isSelected}
                      onClick={() => setFieldValue("startSlot", slot.startTime)}
                      index={index}
                    />
                  );
                })}
              </div>
            </>
          )
        )}

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
          <div className="mx-auto rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your First Name"
                  className="focus:border-main focus:ring-main w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 transition outline-none focus:ring-1"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your Last Name"
                  className="focus:border-main focus:ring-main w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 transition outline-none focus:ring-1"
                />
              </div>
            </div>

            {/* Email */}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your Email"
                className="focus:border-main focus:ring-main w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 transition outline-none focus:ring-1"
              />
            </div>

            {/* Phone Number */}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="text"
                placeholder="Enter your Phone Number"
                className="focus:border-main focus:ring-main w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 transition outline-none focus:ring-1"
              />
            </div>

            {/* Special Requests */}
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Special Requests or Comments
              </label>
              <textarea
                rows="3"
                placeholder="Any special requirements, equipment needs, or additional information..."
                className="focus:border-main focus:ring-main w-full rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-gray-800 transition outline-none focus:ring-1"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Cart */}
        {/* Create button Action */}
        <button className="bg-main ms-auto flex w-fit items-center gap-x-3 rounded-md px-4 py-2 text-lg text-white">
          <FilePlus2 />
          Create Booking
        </button>
      </div>
    </motion.div>
  );
}

const endTime = calculateEndTime(time, +bookingData.duration);
const totalPrice = calculateTotalPrice(
  +bookingData.duration,
  +bookingData?.selectedPackage?.price,
);

setBookingField("startSlot", time);
setBookingField("endSlot", endTime);
setBookingField("totalPackagePrice", totalPrice);
