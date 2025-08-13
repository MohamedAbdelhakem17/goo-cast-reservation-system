import { motion } from "framer-motion";
import useQuickBooking from "../../../hooks/useQuickBooking";
import { trackEvent } from "../../../GTM/gtm";

export default function Hero() {
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

  const { handleQuickBooking } = useQuickBooking();

  return (
    <section className="relative py-16 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial="hidden"
        animate="visible"
        variants={gradientVariants}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-blue-50 opacity-70 rounded-md"></div>

        {/* color in top right corner */}
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-main/20 rounded-full blur-3xl"
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
          className="absolute -bottom-20 -left-20 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl"
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
      <div className="max-w-6xl mx-auto text-center px-6 md:px-12 relative z-10">
        {/* Animated Welcome Text with letter animation */}
        <motion.div
          className="overflow-hidden mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {Array.from("Welcome").map((letter, index) => (
            <motion.span
              key={index}
              className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-main font-sub inline-block"
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
          ))}
        </motion.div>

        {/* Animated Subtitle */}
        <motion.p
          className="text-xl md:text-2xl mb-6 font-bold text-gray-700"
          custom={2}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Elevate Your Voice at Egypt's Leading Podcast Studio
        </motion.p>

        {/* Animated Header */}
        <motion.h1
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10"
          custom={3}
          initial="hidden"
          animate="visible"
          variants={textVariants}
        >
          Book Now at{" "}
          <span className="relative">
            <span className="text-main">Goocast</span>
            <motion.span
              className="absolute -bottom-2 left-0 w-full h-1 bg-main rounded-full"
              initial={{ width: 0, left: "50%" }}
              animate={{ width: "100%", left: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            ></motion.span>
          </span>
        </motion.h1>

        {/* Booking Box */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-between gap-6 bg-white bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-2xl p-8 w-full md:w-3/4 lg:w-2/3 mx-auto border border-gray-100"
          variants={boxVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left side with icon and text */}
          <div className="flex items-center gap-5 w-full md:w-2/3">
            {/* Icon with pulse effect */}
            <div className="relative">
              <motion.i
                className="fa-solid fa-calendar-days text-2xl md:text-4xl text-main"
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
                className="absolute -inset-2 rounded-full border-2 border-main/30"
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
              className="flex flex-col gap-0 text-left"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.3, duration: 0.5 }}
            >
              <span className="text-xl font-bold text-gray-800 m-0 p-0">
                Pick a date
              </span>
              <span className="text-sm text-gray-600 m-0 p-0">
                Find available studios for your preferred date.
              </span>
            </motion.div>
          </div>

          {/* Button with hover effect */}
          <motion.button
            className="cursor-pointer w-full md:w-auto py-3 px-8 bg-gradient-to-r from-main/80 to-main text-white font-semibold rounded-lg shadow-lg relative overflow-hidden group"
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
            <span className="relative z-10 -mt-[20px]">Book Now</span>
          </motion.button>
        </motion.div>

        {/* Floating elements for visual interest */}
        <motion.div
          className="absolute top-20 left-10 w-12 h-12 rounded-full border-2 border-main/20 hidden md:block"
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
          className="absolute bottom-10 right-20 w-8 h-8 rounded-full bg-main/10 hidden md:block"
          animate={{
            y: [0, 20, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: 7,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        ></motion.div>
      </div>
    </section>
  );
}
