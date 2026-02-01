import { useBooking } from "@/context/Booking-Context/BookingContext";
import { NavigationButtons, Stepper } from "@/features/booking/_components";
import BookingHeader from "@/layout/_components/booking-header/booking-header";
import PromotionsBar from "@/layout/_components/promotions-bar/promotions-bar";
import { trackBookingStep } from "@/utils/gtm";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  const { stepLabels } = useBooking();

  // 🔁 Scroll to top whenever ?step changes in the URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get("step");

    if (step) {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // smooth scroll
      });
    }
  }, [location.search]); // triggers every time query string changes

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const stepSlug = params.get("step");

    if (!currentStep || !stepSlug) return;

    trackBookingStep(currentStep, {
      step_slug: stepSlug,
      page_path: location.pathname,
    });
  }, [currentStep, location.search]);

  return (
    <div className="dark:transparent min-h-screen bg-white dark:bg-transparent">
      {/* Header and Stepper */}
      <div className="sticky top-0 z-[500]">
        <PromotionsBar />
        <BookingHeader />
        <Stepper />
      </div>

      {/* Main Content */}
      <div className="mx-auto mb-1 w-full px-3 md:px-4 lg:max-w-4xl lg:px-6 xl:max-w-6xl">
        <motion.div
          className="rounded-xl bg-white dark:bg-transparent"
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          // transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="wait" custom={currentStep}>
            <motion.div
              key={currentStep}
              // initial={{ opacity: 0 }}
              // animate={{ opacity: 1 }}
              // exit={{ opacity: 0 }}
              // transition={{ duration: 0.2 }}
            >
              <motion.div
                // variants={containerVariants}
                // initial="hidden"
                // animate="visible"
                // exit="exit"
                className="items-start space-y-1 md:space-y-2 lg:grid lg:grid-cols-1 lg:gap-6"
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

      {/* Footer */}
      {/* <BookingFooter /> */}
    </div>
  );
}
