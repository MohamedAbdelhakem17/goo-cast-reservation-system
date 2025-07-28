import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetPackagesByCategory } from "../../../../apis/services/services.api";

export default function HourlyRecording() {
  const { setBookingField, handleNextStep, bookingData } = useBooking();
  const { mutate: getPackages, data: packages } = GetPackagesByCategory();

  const [selectedPackage, setSelectedPackage] = useState(bookingData.selectedPackage?.id || null);

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
      price: pkg.price
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

  const benefitVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-2">Choose Your Service</h2>
        <p className="text-gray-900">Select the type of recording session you need</p>
      </div>

      {/* Packages */}
      <motion.div
        className="flex flex-wrap gap-8 mt-10 justify-center lg:justify-evenly px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {packages?.data?.map((pkg) => {
          const isActive =
            selectedPackage === pkg._id;

          return (
            <motion.div
              key={pkg._id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => handlePackageSelect(pkg)}
              className="cursor-pointer w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <div
                className={`flex flex-col rounded-xl h-full p-4 border-1 overflow-hidden transition-colors duration-300 ${isActive
                  ? "border-main border-2 shadow-sm shadow-main/20"
                  : "border-gray-200  border-2 shadow-md  "
                  }`}
              >
                {/* Card Header */}
                <div className="flex flex-col items-center gap-4">
                  {/* <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="object-contain h-[200px] w-full rounded-md"
                  /> */}

                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isActive ? 'bg-[#FF3B30] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    <i className={`fa-solid fa-${pkg.icon}`}></i>
                  </div>
                  <h5 className="text-center font-bold text-2xl">{pkg.session_type}</h5>
                </div>

                {/* Description */}
                <div className="flex-1 mt-2">

                  <ul className="space-y-2 mb-4 list-disc-main">
                    {[...pkg.details, ...pkg.post_session_benefits].map((text, index) => (
                      <motion.li
                        key={index}
                        variants={benefitVariants}
                        className="text-gray-600 text-sm flex items-start "
                      >
                        <span className={`mr-2 ${isActive ? "text-main" : "text-black"}`}>•</span>                        {text}
                      </motion.li>
                    ))}
                  </ul>
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center  ${isActive
                      ? "bg-main text-white"
                      : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
                      }`}
                    onClick={() => {
                      handlePackageSelect(pkg)
                      handleNextStep()
                    }}
                  >
                    {selectedPackage === pkg._id ? "Selected" : "Select & Continue"}
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