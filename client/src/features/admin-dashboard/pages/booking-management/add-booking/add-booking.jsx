import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Blocks, Store, Calendar, PackagePlus, UserCheck, FilePlus2 } from "lucide-react";
import { useGetStudio } from "@/apis/public/studio.api";
import { OptimizedImage } from "@/components/common";
import image from "./gamma5.jpg";
import TimeCalendar from "./time";
import { useGetAddons } from "@/apis/admin/manage-addons.api";
import { useState } from "react";
import PersonalInformation from "./../../../../booking/_components/steps/personal-information/personal-information";

export default function AddBooking() {
  // Localization
  const { t, lng } = useLocalization();

  // query
  const { packages } = useGetAllPackages(true);
  const { data: studios } = useGetStudio(true);
  const { addons } = useGetAddons(true);
  const isEdit = false;

  // Hooks
  const priceFormat = usePriceFormat();

  const handleSelectDate = (date) => {
    console.log("Selected Date:", date);
  };

  const [count, setCount] = useState(0);

  const handleIncrement = () => setCount((prev) => prev + 1);
  const handleDecrement = () => setCount((prev) => Math.max(0, prev - 1));

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
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center text-2xl font-bold">
            <Blocks className="text-main me-2" />
            {t("select-service")}
          </h3>

          {/* Services */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            {packages?.data.map(({ name, _id, price, session_type }) => (
              <div
                key={_id}
                className="group hover:border-main relative col-span-1 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Title */}
                <h2 className="group-hover:text-main mb-1 text-lg font-semibold text-gray-800">
                  {name?.[lng]}
                </h2>

                {/* Session Type */}
                <span className="border-main bg-main/10 text-main inline-block rounded-full border px-3 py-0.5 text-xs font-medium">
                  {session_type?.[lng]}
                </span>

                {/* Price */}
                <div className="mt-4 flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-900">{priceFormat(price)}</p>
                  <span className="text-sm text-gray-500">/ {t("hour")}</span>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="bg-main absolute bottom-0 left-0 h-1 w-0 rounded-r-full transition-all duration-300 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Select Studio */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center text-2xl font-bold">
            <Store className="text-main me-2" />
            {t("select-studio")}
          </h3>

          {/* Studios */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            {studios?.data.map(({ name, _id, thumbnail }) => (
              <div
                key={_id}
                className="group relative col-span-1 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Image Wrapper */}
                <div className="relative h-56 w-full overflow-hidden rounded-t-2xl">
                  <OptimizedImage
                    src={image}
                    alt={name?.[lng]}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>

                  {/* Title Over Image */}
                  <h2 className="absolute bottom-3 left-4 z-10 text-lg font-semibold text-white drop-shadow-md">
                    {name?.[lng]}
                  </h2>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="bg-main absolute bottom-0 left-0 h-1 w-0 rounded-r-full transition-all duration-300 group-hover:w-full"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Select Date and Time */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center text-2xl font-bold">
            <Calendar className="text-main me-2" />
            {t("date-and-time")}
          </h3>

          {/* Calender */}
          <TimeCalendar duration={2} onDateSelect={handleSelectDate} />
        </div>
        {/* Select addons */}
        <div className="space-y-4">
          {/* Title */}
          <h3 className="flex items-center text-2xl font-bold">
            <PackagePlus className="text-main me-2" />
            {t("additional-services")}
          </h3>

          {/* Addons */}
          <div className="grid grid-cols-1 gap-2 md:grid-cols-4">
            {addons?.data.map(({ name, _id, price }) => {
              return (
                <div
                  key={_id}
                  className="group hover:border-main relative col-span-1 cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* Title */}
                  <h2 className="group-hover:text-main mb-1 text-lg font-semibold text-gray-800">
                    {name?.[lng]}
                  </h2>

                  {/* Price */}
                  <div className="mt-4 flex items-end justify-between">
                    <p className="text-3xl font-bold text-gray-900">
                      {priceFormat(price)}
                    </p>
                    <span className="text-sm text-gray-500">/ {t("hour")}</span>
                  </div>

                  {/* Quantity Selector */}
                  <div className="mt-5 flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-2">
                    <button
                      type="button"
                      onClick={handleDecrement}
                      className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-200 text-gray-800 transition hover:bg-gray-300"
                    >
                      −
                    </button>
                    <span className="text-lg font-semibold text-gray-900">{count}</span>
                    <button
                      type="button"
                      onClick={handleIncrement}
                      className="bg-main hover:bg-main/90 flex h-8 w-8 items-center justify-center rounded-md text-white transition"
                    >
                      +
                    </button>
                  </div>

                  {/* Decorative Bottom Bar */}
                  <div className="bg-main absolute bottom-0 left-0 h-1 w-0 rounded-r-full transition-all duration-300 group-hover:w-full"></div>
                </div>
              );
            })}
          </div>
        </div>

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

        {/* Create button Action */}
        <button className="bg-main ms-auto flex w-fit items-center gap-x-3 rounded-md px-4 py-2 text-lg text-white">
          <FilePlus2 />
          Create Booking
        </button>
      </div>
    </motion.div>
  );
}
