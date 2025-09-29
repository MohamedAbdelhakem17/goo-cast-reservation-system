import BookingHeader from "@/layout/_components/booking-header/booking-header";
import Stepper from "./../../features/booking/_components/Booking/Step-Indicator/StepIndicator";
import { AnimatePresence, motion } from "framer-motion";
import NavigationButtons from "../../features/booking/_components/Booking/Navigation-Buttons/NavigationButtons";

// Container fade animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0 },
};

// Child items fade
const itemVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2 },
  },
  exit: { opacity: 0, y: -5, transition: { duration: 0.15 } },
};

export default function BookingLayout({ children, currentStep }) {
  return (
    <div className="min-h-screen">
      {/* Header and Stepper */}
      <div className="sticky top-0 z-[500]">
        <BookingHeader />
        <Stepper />
      </div>

      {/* Main Content */}
      <div className="mx-auto w-full px-3 py-3 md:px-4 lg:max-w-4xl lg:px-6 xl:max-w-6xl">
        <motion.div
          className="rounded-xl bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="items-start space-y-4 md:space-y-6 lg:grid lg:grid-cols-1 lg:gap-6"
              >
                <motion.div variants={itemVariants} className="rounded-lg">
                  {children}
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Next and Prev Buttons */}
        <NavigationButtons />
      </div>
    </div>
  );
}
