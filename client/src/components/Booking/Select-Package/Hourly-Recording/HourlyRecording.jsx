import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetPackagesByCategory } from "../../../../apis/services/services.api";
import BookingHeader from "../../../shared/Booking-Header/BookingHeader";
import usePriceFormat from "./../../../../hooks/usePriceFormat";
import { Check } from "lucide-react";

export default function HourlyRecording() {
  const { setBookingField, handleNextStep, bookingData } = useBooking();
  const { mutate: getPackages, data: packages } = GetPackagesByCategory();
  const priceFormat = usePriceFormat();

  const [selectedPackage, setSelectedPackage] = useState(
    bookingData.selectedPackage?.id || null
  );

  useEffect(() => {
    getPackages({ category: "681c913473e625151f4f075d" });
  }, [getPackages]);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg._id);
    setBookingField("selectedPackage", {
      id: pkg._id,
      name: pkg.name,
      category: pkg.category._id,
      slug: pkg.category.slug,
      price: pkg.price,
    });
    setBookingField("startSlot", null);
    setBookingField("endSlot", null);
    setBookingField("studio", null);
  };

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

  // const benefitVariants = {
  //   hidden: { opacity: 0, x: -10 },
  //   visible: {
  //     opacity: 1,
  //     x: 0,
  //     transition: { type: "spring", stiffness: 100 },
  //   },
  // };

  return (
    <>
      {/* Header */}
      <BookingHeader
        title="Choose Your Service"
        desc="Select the type of recording session you need"
      />

      {/* Packages */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 px-8 lg:px-0  lg:justify-around scale-90"
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
              className="cursor-pointer  w-full md:w-[40%]"
            >
              <div
                className={`flex flex-col rounded-xl h-full  py-3 border-1 overflow-hidden transition-colors duration-300 ${isActive
                  ? "border-main border-2 shadow-sm shadow-main/20"
                  : "border-gray-100  border-1 shadow-sm  "
                  }`}
              >
                {/* Card Header */}
                <div className="flex flex-col items-center gap-2">
                  {/* <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="object-contain h-[200px] w-full rounded-md"
                  /> */}

                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isActive
                      ? "bg-[#FF3B30] text-white"
                      : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    <i className={`fa-solid fa-${pkg.icon}`}></i>
                  </div>
                  <h5 className="text-2xl font-bold text-center">
                    {pkg.session_type}
                  </h5>
                </div>

                <div className={`text-3xl font-bold text-center ${isActive ? 'text-main' : 'text-gray-900'} p-2`}>
                  {priceFormat(pkg.price)}
                  <span className="inline-block my-1 text-sm font-normal text-gray-600">/hour</span>
                </div>

                {/* Content */}
                <div className="px-6">
                  {/* Header */}
                  <motion.div
                    className="mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3 text-center">
                      {pkg.description}
                    </p>


                  </motion.div>

                  {/* Package Details */}
                  <motion.div
                    className="mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">{"What's Included:"}</h4>
                    <ul className="space-y-2">
                      {pkg.details.map((detail, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.7 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-main mt-0.5 flex-shrink-0" />
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
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">After Your Session:</h4>
                    <ul className="space-y-2">
                      {pkg.post_session_benefits.map((benefit, idx) => (
                        <motion.li
                          key={idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.9 + idx * 0.1 }}
                          className="flex items-start gap-2 text-sm text-gray-600"
                        >
                          <Check className="w-4 h-4 text-main mt-0.5 flex-shrink-0" />
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
                    className={`w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center  ${isActive
                      ? "bg-main text-white"
                      : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
                      }`}
                    onClick={() => {
                      handlePackageSelect(pkg);
                      handleNextStep();
                    }}
                  >
                    {selectedPackage === pkg._id
                      ? "Selected"
                      : "Select & Continue"}
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
