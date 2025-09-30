import { useState, useEffect } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetPackagesByCategory } from "../../../../apis/services/services.api";
import BookingHeader from "../../../shared/Booking-Header/BookingHeader";
import usePriceFormat from "./../../../../hooks/usePriceFormat";
=======
import { useBooking } from "@/context/Booking-Context/BookingContext";
import { tracking } from "@/utils/gtm";
import BookingLabel from "../../booking-label";
import usePriceFormat from "@/hooks/usePriceFormat";
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
import { Check } from "lucide-react";
import useLocalization from "@/context/localization-provider/localization-context";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";

<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
export default function HourlyRecording() {
  const { setBookingField, handleNextStep, bookingData } = useBooking();
  const { mutate: getPackages, data: packages } = GetPackagesByCategory();
=======
// Animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 50 },
  },
};

export default function SelectPackage() {
  const { t, lng } = useLocalization();
  // Hooks
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
  const priceFormat = usePriceFormat();
  const { setBookingField, handleNextStep, bookingData } = useBooking();

  //  State
  const [selectedPackage, setSelectedPackage] = useState(
    bookingData.selectedPackage?.id || null,
  );

  // Mutation
  const { packages } = useGetAllPackages(true);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg._id);
    setBookingField("selectedPackage", {
      id: pkg._id,
      name: pkg.name,
      category: pkg.category._id,
      slug: pkg.category.slug,
      price: pkg.price,
    });
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
=======

    tracking("add_to_cart", { package_name: pkg.name?.[lng], price: pkg.price });
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
    setBookingField("startSlot", null);
    setBookingField("endSlot", null);
    setBookingField("studio", null);
  };

  return (
    <>
      {/* Header */}
      <BookingLabel
        title={t("choose-your-service")}
        desc={t("select-the-type-of-recording-session-you-need")}
      />

      {/* Packages */}
      <motion.div
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
        className="flex flex-wrap justify-center gap-10 px-8 lg:px-0  lg:justify-around scale-90"
=======
        className="flex scale-90 flex-wrap justify-center gap-2 px-8 lg:justify-around lg:px-0"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {packages?.data?.map((pkg, index) => {
          const isActive = selectedPackage === pkg._id;
          return (
            <motion.div
              key={pkg._id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => handlePackageSelect(pkg)}
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
              className="cursor-pointer  w-full md:w-[45%]"
            >
              <div
                className={`flex flex-col rounded-xl h-full  py-3 border-1 overflow-hidden transition-colors duration-300 ${
                  isActive
                    ? "border-main border-2 shadow-sm shadow-main/20"
                    : "border-gray-100  border-1 shadow-sm  "
=======
              className="w-full cursor-pointer md:w-[40%]"
            >
              <div
                className={`flex h-full flex-col overflow-hidden rounded-xl border-1 py-3 transition-colors duration-300 ${
                  isActive
                    ? "border-main shadow-main/20 border-2 shadow-sm"
                    : "border-1 border-gray-100 shadow-sm"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                }`}
              >
                {/* Card Header */}
                <div className="flex flex-col items-center gap-2">
                  <div
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      isActive
                        ? "bg-[#FF3B30] text-white"
                        : "bg-gray-100 text-gray-600"
=======
                    className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${
                      isActive ? "bg-[#FF3B30] text-white" : "bg-gray-100 text-gray-600"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                    }`}
                  >
                    <i className={`fa-solid fa-${pkg.icon}`}></i>
                  </div>
                  <h5 className="text-center text-2xl font-bold">
                    {pkg.session_type?.[lng]}
                  </h5>
                </div>

                <div
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
                  className={`text-3xl font-bold text-center ${
=======
                  className={`text-center text-3xl font-bold ${
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                    isActive ? "text-main" : "text-gray-900"
                  } p-2`}
                >
                  {priceFormat(pkg.price)}
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
                  <span className="inline-block my-1 text-sm font-normal text-gray-600">
=======
                  <span className="my-1 inline-block text-sm font-normal text-gray-600">
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                    /hour
                  </span>
                </div>

                {/* Content */}
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
                <div className="px-6 py-3">
=======
                <div className="px-6 py-2">
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                  {/* Header */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <p className="mb-3 line-clamp-2 text-center text-sm text-gray-600">
                      {pkg.description?.[lng]}
                    </p>
                  </motion.div>

                  {/* Package Details */}
                  <motion.div
                    className="mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
=======
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                      {"What's Included:"}
                    </h4>
                    <ul className="space-y-2">
                      {pkg.details?.[lng].map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="text-main mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span>{detail}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  {/* Post Session Benefits */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">
=======
                    <h4 className="mb-2 text-sm font-semibold text-gray-900">
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                      After Your Session:
                    </h4>
                    <ul className="space-y-2">
                      {pkg.post_session_benefits?.[lng].map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="text-main mt-0.5 h-4 w-4 flex-shrink-0" />
                          <span>{benefit}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                </div>

                {/* Action Button */}
                <div className="mt-auto px-4">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
<<<<<<< HEAD:client/src/components/Booking/Select-Package/Hourly-Recording/HourlyRecording.jsx
                    className={`w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center  ${
                      isActive
                        ? "bg-main text-white"
                        : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
=======
                    className={`text-md mx-auto flex w-full items-center justify-center rounded-lg px-4 py-2 font-semibold ${
                      isActive
                        ? "bg-main text-white"
                        : "border-2 border-gray-200 text-gray-700 hover:bg-gray-200"
>>>>>>> d6e0283572ca03308adfcb2e44a14af7d4499395:client/src/features/booking/_components/steps/select-package/select-package.jsx
                    }`}
                    onClick={() => {
                      handlePackageSelect(pkg);
                      handleNextStep();
                    }}
                  >
                    {selectedPackage === pkg._id
                      ? t("selected")
                      : t("select-and-continue")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
}
