import { useState } from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetPackagesByCategory } from "../../../../apis/services/services.api";
import { useEffect } from "react";
import usePriceFormat from "../../../../hooks/usePriceFormat";

export default function HourlyRecording() {
  const { setBookingField, handleNextStep, bookingData } = useBooking();
  const { mutate: getPackages, data: packages } = GetPackagesByCategory()
  const [selectedPackage, setSelectedPackage] = useState(bookingData.selectedPackage?.id || null);

  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg._id);
    setBookingField("selectedPackage", {
      id: pkg._id,
      name: pkg.name,
      category: pkg.category._id,
      slug: pkg.category.slug,
    });
    setBookingField("startSlot", null);
    setBookingField("endSlot", null);
    setBookingField("studio", null);
    handleNextStep()
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
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

  const benefitVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const priceFormat = usePriceFormat()

  useEffect(() => {
    getPackages({ category: "681c913473e625151f4f075d" });
  }, [getPackages]);


  return (
    <motion.div
      className="grid md:grid-cols-2 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {packages?.data?.map((pkg) => (
        <motion.div
          key={pkg._id}
          variants={cardVariants}
          whileHover={{ y: -5 }}
          className={` flex flex-col rounded-xl
    overflow-hidden border-1 transition-colors duration-300 cursor-pointer ${selectedPackage === pkg._id
              ? "border-main shadow-sm shadow-main/20"
              : "border-gray-200 hover:border-main/30 shadow-md"
            } `}
          onClick={() => handlePackageSelect(pkg)}
        >
          {/* Header */}
          <div
            className={` p-5 flex items-center gap-4 ${selectedPackage === pkg._id
              ? "bg-gradient-to-r from-main/10 to-main/30"
              : "bg-gray-50"
              } `}
          >
            {/* Icon */}
            <div
              className={` p-3 rounded-full w-10 h-10 flex items-center justify-center ${selectedPackage === pkg._id
                ? "bg-gradient-to-r from-main/10 to-main text-white"
                : "bg-gray-200 text-gray-700"
                } `}
            >
              <i className="fa-solid fa-cubes"></i>
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
              <p className="text-gray-800 text-sm">{pkg.description}</p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-800">Fixed price</p>
            </div>
          </div>

          {/* Content with grow */}
          <div className="p-5 bg-white flex-1 flex flex-col">
            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <span className="bg-indigo-100 text-indigo-700 rounded-full mr-2 w-7 h-7 flex items-center justify-center">
                  <i className="fa-solid fa-check"></i>
                </span>
                Package includes:
              </h4>
              <ul className="space-y-2 pl-8">
                {pkg.details.map((detail, index) => (
                  <motion.li
                    key={index}
                    variants={benefitVariants}
                    className="text-gray-600 text-sm flex items-start"
                  >
                    <span className="text-purple-500 mr-2">•</span>
                    {detail}
                  </motion.li>
                ))}
              </ul>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <span className="bg-teal-100 text-teal-700 mr-2 rounded-full w-7 h-7 flex items-center justify-center">
                  <i className="fa-solid fa-bolt"></i>
                </span>
                Post Session benefits:
              </h4>
              <ul className="space-y-2 pl-8">
                {pkg.post_session_benefits.map((benefit, index) => (
                  <motion.li
                    key={index}
                    variants={benefitVariants}
                    className="text-gray-600 text-sm flex items-start"
                  >
                    <span className="text-teal-500 mr-2">•</span>
                    {benefit}
                  </motion.li>
                ))}
              </ul>

              <p className="py-3 text-main text-xl font-bold">{priceFormat(pkg.price)} per hour</p>
            </div>

            {/* Button always at bottom */}
            <div className="mt-auto">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={` w-full py-3 px-4 rounded-lg
          flex items-center justify-center gap-2 font-medium cursor-pointer ${selectedPackage === pkg._id
                    ? "bg-gradient-to-r from-main to-main/70 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  } `}
              >
                {selectedPackage === pkg._id ? "Selected" : "Select Package"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
