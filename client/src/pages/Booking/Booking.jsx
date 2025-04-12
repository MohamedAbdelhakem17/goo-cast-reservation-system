import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "../../components/Booking/Step-Indicator/StepIndicator";
import NavigationButtons from "../../components/Booking/Navigation-Buttons/NavigationButtons";
import SelectStudio from "../../components/Booking/Select-Studio/SelectStudio";
import SelectDateTime from "../../components/Booking/Select-Date-Time/SelectDateTime";
import SelectAdditionalServices from "../../components/Booking/Select-Additional-Services/SelectAdditionalServices";
import PersonalInformation from "../../components/Booking/Personal-Information/PersonalInformation";
import { useBooking } from "../../context/Booking-Context/BookingContext";

export default function Booking() {
  // Booking context
  const { studio, currentStep } = useBooking()

  console.log("Selected Studio:", studio);

  // Animation variants
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

  return (
    <div className=" py-12 lg:px-8">
      {/* Step indicator */}
      <StepIndicator />

      <motion.div
        className="my-4 bg-white rounded-xl shadow-lg overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >

        {/* Content */}
        <AnimatePresence mode="wait" custom={currentStep}>
          <motion.div key={currentStep} custom={currentStep} variants={slideVariants} initial="enter" animate="center" exit="exit" className="md:px-6 py-8">

            <motion.div variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="space-y-6" >

              <motion.div variants={itemVariants} className="md:p-6  rounded-lg " >
                {/* Select Studio */}
                {currentStep === 1 && (
                  <SelectStudio />)}

                {/* Select Date and Time */}
                {currentStep === 2 && <SelectDateTime />}

                {/* Select Additional Services */}
                {currentStep === 3 && (<SelectAdditionalServices />)}

                {/* Personal Information */}
                {currentStep === 4 && (<PersonalInformation />)}

              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.div>
      
      {/* Navigation buttons */}
      <NavigationButtons />
    </div>

  );
}
