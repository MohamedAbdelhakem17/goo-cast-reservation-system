import { motion } from "framer-motion";
import useQuickBooking from "@/hooks/useQuickBooking";
import { trackEvent } from "@/utils/gtm";
import useLocalization from "@/context/localization-provider/localization-context";

// Animation variants for text elements
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: custom * 0.2,
      ease: [0.43, 0.13, 0.23, 0.96],
    },
  }),
};

// Animation variants for the booking box
const boxVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.8,
      ease: [0, 0.71, 0.2, 1.01],
    },
  },
};

// Animation for the gradient background
const gradientVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.5 },
  },
};

export default function Hero() {
  // Localization
  const { t, lng } = useLocalization();

  const { handleQuickBooking } = useQuickBooking();

  return (
    <section className="relative overflow-hidden py-16">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial="hidden"
        animate="visible"
        variants={gradientVariants}
      >
        <div className="absolute inset-0 rounded-md bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-70"></div>

        {/* color in top right corner */}
        <motion.div
          className="bg-main/20 absolute -top-40 -right-40 h-80 w-80 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.7, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>

        {/* color in bottom left corner */}
        <motion.div
          className="absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-blue-400/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: 1,
          }}
        ></motion.div>
      </motion.div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 text-center md:px-12">
        {/* Animated Welcome Text with letter animation */}
        <motion.div
          className="mb-2 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {lng === "ar" ? (
            <motion.span
              className="text-main font-arabic inline-block text-5xl font-extrabold md:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                ease: [0.43, 0.13, 0.23, 0.96],
              }}
            >
              {t("welcome")}
            </motion.span>
          ) : (
            Array.from(t("welcome")).map((letter, index) => (
              <motion.span
                key={index}
                className="text-main font-main inline-block text-5xl font-extrabold md:text-6xl lg:text-7xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.05 * index,
                  ease: [0.43, 0.13, 0.23, 0.96],
                }}
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))
          )}
        </motion.div>

        {/* Animated Subtitle */}
        <motion.p
          className="mb-6 text-xl font-bold text-gray-700 md:text-2xl"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          {t("elevate-your-voice-at-egypts-leading-podcast-studio")}
        </motion.p>

        {/* Animated Header */}
        <motion.h1
          className="mb-10 text-3xl font-bold md:text-4xl lg:text-5xl"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          {t("book-now-at")}
          <span className="relative">
            <span className="text-main px-1">{t("goocast")}</span>
            <motion.span
              className="bg-main absolute -bottom-2 left-0 h-1 w-full rounded-full"
              initial={{ width: 0, left: "50%" }}
              animate={{ width: "100%", left: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            ></motion.span>
          </span>
        </motion.h1>

        {/* Booking Box */}
        <motion.div
          className="bg-opacity-90 mx-auto flex w-full flex-col items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-white p-8 shadow-2xl backdrop-blur-sm md:w-3/4 md:flex-row lg:w-2/3"
          variants={boxVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side with icon and text */}
          <div className="flex w-full items-center gap-5 md:w-2/3">
            {/* Icon with pulse effect */}
            <div className="relative">
              <motion.i
                className="fa-solid fa-calendar-days text-main text-2xl md:text-4xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                  delay: 1.1,
                }}
              ></motion.i>

              <motion.span
                className="border-main/30 absolute -inset-2 rounded-full border-2"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 1,
                }}
              ></motion.span>
            </div>

            {/* Text */}
            <motion.div
              className="flex flex-col gap-0 text-start"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <span className="m-0 p-0 text-xl font-bold text-gray-800">
                {t("pick-a-date")}
              </span>
              <span className="m-0 p-0 text-sm text-gray-600">
                {t("find-available-studios-for-your-preferred-date")}
              </span>
            </motion.div>
          </div>

          {/* Button with hover effect */}
          <motion.button
            className="from-main/80 to-main group relative w-full cursor-pointer overflow-hidden rounded-lg bg-gradient-to-r px-8 py-3 font-semibold text-white shadow-lg md:w-auto"
            whileHover={{
              scale: 1.03,
              boxShadow:
                "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              handleQuickBooking(1);
              trackEvent("quick_booking_button_click", {
                event_category: "button",
                event_action: "click",
                event_label: "Book Now",
              });
            }}
          >
            <motion.span
              className="absolute inset-0 w-0 bg-white/20"
              whileHover={{ width: "100%" }}
              transition={{ duration: 0.3 }}
            ></motion.span>
            <span className="relative z-10 -mt-[20px]">{t("book-now")}</span>
          </motion.button>
        </motion.div>

        {/* Floating elements for visual interest */}
        {/* <motion.div
          className="border-main/20 absolute top-20 left-10 hidden h-12 w-12 rounded-full border-2 md:block"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>

        <motion.div
          className="bg-main/10 absolute right-20 bottom-10 hidden h-8 w-8 rounded-full md:block"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div> */}
      </div>
    </section>
  );
}
