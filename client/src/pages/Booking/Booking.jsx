import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Stepper from "../../components/Booking/Step-Indicator/StepIndicator";
import SelectStudio from "../../components/Booking/Select-Studio/SelectStudio";
import SelectDateTime from "../../components/Booking/Select-Date-Time/SelectDateTime";
import SelectAdditionalServices from "../../components/Booking/Select-Additional-Services/SelectAdditionalServices";
import PersonalInformation from "../../components/Booking/Personal-Information/PersonalInformation";
import SelectPackage from "../../components/Booking/Select-Package/SelectPackage";
import Cart from "../../components/Booking/Cart/Cart";

import { useBooking } from "../../context/Booking-Context/BookingContext";
import Header from "../../components/Booking/Header/Header";
import NavigationButtons from "../../components/Booking/Navigation-Buttons/NavigationButtons";
import { useEffect } from "react";

// Slide animation: simple and smooth
const slideVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: 0.4, ease: "easeInOut" },
      opacity: { duration: 0.3 },
    },
  },
  exit: (direction) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
    transition: {
      x: { duration: 0.4, ease: "easeInOut" },
      opacity: { duration: 0.2 },
    },
  }),
};

// Simple fade-in/out for children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: { opacity: 0 },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
  exit: { opacity: 0, y: -10 },
};

export default function Booking() {
  const { currentStep } = useBooking();
  const [showMobileCart, setShowMobileCart] = useState(false);

  const stepComponents = {
    1: <SelectPackage />,
    2: <SelectStudio />,
    3: <SelectDateTime />,
    4: <SelectAdditionalServices />,
    5: <PersonalInformation />,
  };

  useEffect(() => {
    return () => {
      localStorage.removeItem("bookingData");
      localStorage.removeItem("maxStepReached");
      localStorage.removeItem("bookingStep");
    }
  }, [])

  return <div className="min-h-screen">
    <div className="sticky top-0 z-[300]">
      <Header />
      <Stepper />
    </div>

    <div className="px-3 md:px-4 lg:px-6 w-full lg:max-w-4xl xl:max-w-6xl mx-auto ">
      {/* Step Indicator */}

      {/* Main Content */}
      <motion.div
        className="bg-white rounded-xl overflow-hidden "
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
          >
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 md:space-y-6 lg:grid lg:grid-cols-1 lg:gap-6 items-start"
            >
              <motion.div variants={itemVariants} className="rounded-lg">
                {stepComponents[currentStep]}
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <NavigationButtons />

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
              className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-main/50 rounded-t-xl shadow-xl p-4 sm:p-6 overflow-auto max-h-[45vh] md:max-h-[55vh] lg:max-h-[60vh]"
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
  </div>

}
