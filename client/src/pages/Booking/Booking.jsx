import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "../../components/Booking/Step-Indicator/StepIndicator";
import NavigationButtons from "../../components/Booking/Navigation-Buttons/NavigationButtons";
import SelectStudio from "../../components/Booking/Select-Studio/SelectStudio";
import SelectDateTime from "../../components/Booking/Select-Date-Time/SelectDateTime";
import SelectAdditionalServices from "../../components/Booking/Select-Additional-Services/SelectAdditionalServices";
import PersonalInformation from "../../components/Booking/Personal-Information/PersonalInformation";
import { useBooking } from "../../context/Booking-Context/BookingContext";
import Cart from "../../components/Booking/Cart/Cart";
import { useNavigate } from "react-router-dom";
import SelectPackage from "../../components/Booking/Select-Package/SelectPackage";

export default function Booking() {
  const { currentStep } = useBooking();
  const navigate = useNavigate();
  const [showMobileCart, setShowMobileCart] = useState(false);




  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { when: "afterChildren" },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { y: -20, opacity: 0 },
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    }),
  };

  const handelGoToConfirmation = () => {
    navigate(`/booking/confirmation`);
  };


  return (
    <div className="py-12 lg:px-8">

      <>
        {/* Step Indicator */}
        <StepIndicator />

        {/* Mobile Cart Button */}
        {currentStep === 5&& (
          <div className="lg:hidden text-right px-4 my-1">
            <button
              onClick={() => setShowMobileCart(true)}
              className="bg-primary text-main px-4 py-2 rounded-md shadow-md"
            >
              <i className="fa-solid fa-cart-shopping text-xl"></i>
            </button>
          </div>
        )}

        {/* Main Content */}
        <motion.div
          className="my-4 bg-white rounded-xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              custom={currentStep}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="md:px-6 py-8"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6 lg:space-y-0 lg:flex lg:gap-6 items-start"
              >
                <motion.div
                  variants={itemVariants}
                  className="md:p-1 rounded-lg flex-1"
                >
                  {currentStep === 1 && <SelectPackage />}
                  {currentStep === 2 && <SelectDateTime />}
                  {currentStep === 3 && <SelectStudio />}
                  {currentStep === 4 && <PersonalInformation />}
                  {currentStep === 5 && <SelectAdditionalServices />}
                </motion.div>

                {/* Cart Sidebar on Large Screens */}
                {currentStep === 5 && (
                  <motion.div
                    variants={itemVariants}
                    className="md:px-2 md:py-6 rounded-lg w-full lg:w-1/3 hidden lg:block bg-gray-50 shadow-md sticky top-24 max-h-[calc(100vh-6rem)] overflow-y-auto"
                  >
                    <Cart />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Navigation Buttons */}
        <NavigationButtons handelGoToConfirmation={handelGoToConfirmation} />

        {/* Mobile Cart Modal */}
        <AnimatePresence>
          {showMobileCart && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-main/50 rounded-t-xl shadow-xl p-6 overflow-auto max-h-[400px]"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Cart</h2>
                <button
                  onClick={() => setShowMobileCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fa-solid fa-xmark text-2xl text-main"></i>
                </button>
              </div>
              <Cart />
            </motion.div>
          )}
        </AnimatePresence>
      </>

    </div>
  );
}
