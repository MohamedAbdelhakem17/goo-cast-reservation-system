import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetPackagesByCategory } from "../../../../apis/services/services.api";


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
    transition: { type: "spring", stiffness: 60 },
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

export default function HourlyRecording() {
  const { setBookingField, handleNextStep } = useBooking();
  const { mutate: getPackages, data: packages } = GetPackagesByCategory();

<<<<<<< HEAD
  const [selectedPackage, setSelectedPackage] = useState(null);
=======
  const [selectedPackage, setSelectedPackage] = useState(bookingData.selectedPackage?.id || null);
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501

  useEffect(() => {
    getPackages({ category: "681c913473e625151f4f075d" });
  }, [getPackages]);

<<<<<<< HEAD
=======

>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
  const handlePackageSelect = (pkg) => {
    setSelectedPackage(pkg._id);

    setBookingField("selectedPackage", {
      id: pkg._id,
      name: pkg.name,
      category: pkg.category._id,
      slug: pkg.category.slug,
<<<<<<< HEAD
      price: pkg.price,
=======
      price: pkg.price
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
    });

    // Reset other fields
    setBookingField("startSlot", null);
    setBookingField("endSlot", null);
    setBookingField("studio", null);
<<<<<<< HEAD

    handleNextStep();
=======
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
  };

  return (
    <div>
      {/* Header */}
<<<<<<< HEAD
      <div>
        <h4 className="text-2xl lg:text-4xl font-bold py-2">
          Select the Service
        </h4>
        <p className="text-gray-600 text-md mb-5">
          We offer 2 different services depending on what type of content you would like to record
        </p>
      </div>

      {/* Packages Grid */}
=======
      <div className="text-center mb-8">
        <h2 className="text-2xl mb-2">Choose Your Service</h2>
        <p className="text-gray-900">Select the type of recording session you need</p>
      </div>

      {/* Packages */}
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
      <motion.div
        className="flex flex-wrap gap-8 mt-10 justify-center lg:justify-evenly"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {packages?.data?.map((pkg) => {
<<<<<<< HEAD
          const isActive = selectedPackage === pkg._id;
=======
          const isActive =
            selectedPackage === pkg._id ;
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501

          return (
            <motion.div
              key={pkg._id}
              variants={cardVariants}
              whileHover={{ y: -5 }}
              onClick={() => handlePackageSelect(pkg)}
              className="cursor-pointer w-full md:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <div
<<<<<<< HEAD
                className={`flex flex-col h-full p-4 rounded-xl border-2 transition-colors duration-300 overflow-hidden 
                  ${isActive
                    ? "border-main shadow-sm shadow-main/20"
                    : "border-gray-200 hover:border-main shadow-md hover:[&_button]:bg-main hover:[&_button]:text-white"
=======
                className={`flex flex-col rounded-xl h-full p-4 border-1 overflow-hidden transition-colors duration-300 ${isActive
                  ? "border-main border-2 shadow-sm shadow-main/20"
                  : "border-gray-200  border-2 shadow-md  "
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
                  }`}
              >
                {/* Image & Title */}
                <div className="flex flex-col items-center gap-4">
                  {/* <img
                    src={pkg.image}
                    alt={pkg.name}
                    className="object-contain h-[200px] w-full rounded-md"
<<<<<<< HEAD
                  />
                  <h5 className="text-center font-bold text-2xl">
                    {pkg.session_type}
                  </h5>
=======
                  /> */}

                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isActive ? 'bg-[#FF3B30] text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                    <i className={`fa-solid fa-${pkg.icon}`}></i>
                  </div>
                  <h5 className="text-center font-bold text-2xl">{pkg.session_type}</h5>
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
                </div>

                {/* Description */}
                <div className="flex-1 mt-2">
<<<<<<< HEAD
                  <p className="text-gray-800 text-md font-bold py-2">
                    {pkg.description}
                  </p>
                  <ul className="space-y-2 mb-4">
=======

                  <ul className="space-y-2 mb-4 list-disc-main">
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
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

                {/* Select Button */}
                <div className="mt-auto">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
<<<<<<< HEAD
                    className={`w-fit py-3 px-4 rounded-lg mx-auto md:text-2xl font-bold flex items-center justify-center gap-2 
                      ${isActive
                        ? "bg-main text-white"
                        : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
=======
                    className={`w-full py-2 px-4 rounded-lg mx-auto text-md font-semibold flex items-center justify-center  ${isActive
                      ? "bg-main text-white"
                      : "border-gray-200 border-2 text-gray-700 hover:bg-gray-200"
>>>>>>> 5f5d904117467ec44dcc2f9a227fbfa132df9501
                      }`}
                      onClick={()=>{
                        handlePackageSelect(pkg)
                        handleNextStep() 
                      }}
                  >
                    {isActive ? "Selected" : "Select & Continue"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
