import { motion } from "framer-motion";
import { useBooking } from "../../../../context/Booking-Context/BookingContext";
import { GetAllPackages } from "../../../../apis/services/services.api";
import Loading from "../../../shared/Loading/Loading";
import usePriceFormat from "../../../../hooks/usePriceFormat";
export default function HourlyRecording() {
  const { bookingData, setBookingField } = useBooking();
  const { data: packages, isLoading } = GetAllPackages()
  const priceFormat = usePriceFormat()

  const handlePackageSelect = (pkg, slot) => {


    setBookingField("selectedPackage", {
      id: pkg._id,
      name: pkg.name,
      duration: slot.endTime,
      price: slot.totalPrice,
      slot,
    });
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

  if (isLoading) return <Loading />
  return (
    <div className="space-y-6">
      <motion.div
        className="grid md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {packages?.data?.map((pkg) => (
          <motion.div
            variants={cardVariants}
            key={pkg._id}
            className="border border-gray-300 rounded-lg overflow-hidden shadow-sm"
          >
            <div className="bg-gray-300 text-main p-4 flex items-center">
              <i className={`fa-solid ${pkg.icon} mx-4`}></i>
              <h3 className="text-lg font-semibold">{pkg.name}</h3>
            </div>

            <div className="p-4">
              <p className="text-gray-700 mb-4">{pkg.description}</p>

              <div className="space-y-2 mb-4">
                {pkg.details.map((detail, index) => (
                  <div key={index} className="flex items-start">
                    <i className="fa-solid fa-check h-4 w-4 text-green-500 mt-1 mr-2"></i>
                    <p className="text-sm text-gray-600">{detail}</p>
                  </div>
                ))}
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 ">
                {pkg?.hourlyPrices?.slice(0, bookingData.duration).map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className={`flex flex-col  items-center justify-center p-1 border border-gray-300 rounded-lg shadow-sm cursor-pointer
                        ? "bg-main text-white"
                        : "bg-white hover:bg-gray-100"
                      }
                                          `}
                    onClick={() => handlePackageSelect(pkg, item)}
                  >
                    <p className="text-sm text-gray-700">{item.endTime} hour</p>
                    <p className="text-sm font-medium text-gray-800">{priceFormat(item.totalPrice)}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

    </div>
  );
}
