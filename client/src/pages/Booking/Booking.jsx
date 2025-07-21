import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// import StepIndicator from "../../components/Booking/Step-Indicator/StepIndicator";
import Stepper from "../../components/Booking/Step-Indicator/StepIndicator";
import NavigationButtons from "../../components/Booking/Navigation-Buttons/NavigationButtons";
import SelectStudio from "../../components/Booking/Select-Studio/SelectStudio";
import SelectDateTime from "../../components/Booking/Select-Date-Time/SelectDateTime";
import SelectAdditionalServices from "../../components/Booking/Select-Additional-Services/SelectAdditionalServices";
import PersonalInformation from "../../components/Booking/Personal-Information/PersonalInformation";
import { useBooking } from "../../context/Booking-Context/BookingContext";
import Cart from "../../components/Booking/Cart/Cart";
import SelectPackage from "../../components/Booking/Select-Package/SelectPackage";

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

export default function Booking() {

  const { currentStep , handlePrevStep } = useBooking();
  const [showMobileCart, setShowMobileCart] = useState(false);

  const stepComponents = {
    1: <SelectPackage />,
    2: <SelectStudio />,
    3: <SelectDateTime />,
    4: <SelectAdditionalServices />,
    5: <PersonalInformation />,
  };

  return (
    <div className="py-12 lg:px-8 lg:w-7xl w-full mx-auto">
      {/* Step Indicator */}

      <button onClick={handlePrevStep}>Back</button>

        {/* <StepIndicator /> */}
         <Stepper/>

      {/* Mobile Cart Button
      {currentStep === 4 && (
        <div className="lg:hidden text-right px-4 my-1">
          <button
            onClick={() => setShowMobileCart(true)}
            className="bg-primary text-main px-4 py-2 rounded-md shadow-md"
          >
            <i className="fa-solid fa-cart-shopping text-xl"></i>
          </button>
        </div>
      )} */}

      {/* Main Content */}
      <motion.div
        className="my-4 bg-white rounded-xl overflow-hidden"
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
            className="md:px-6 py-1"
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-6 lg:space-y-0 lg:gap-6 items-start mt-6"
            >
              <motion.div
                variants={itemVariants}
                className="md:p-1 rounded-lg "
              >
                {stepComponents[currentStep]}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Navigation Buttons */}
      {/* <NavigationButtons /> */}

      {/* Mobile Cart Modal */}
      <AnimatePresence>
        {showMobileCart && (
          <>
            {/* Background Overlay */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setShowMobileCart(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Cart Modal */}
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
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
