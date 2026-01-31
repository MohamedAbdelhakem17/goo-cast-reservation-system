import { gooLoading } from "@/assets/images";
// import useLocalization from "@/context/localization-provider/localization-context";
import { motion } from "framer-motion";

// // Container animation variants
const containerVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.6,
      when: "afterChildren",
      staggerChildren: 0.1,
      staggerDirection: -1,
    },
  },
};

// // Logo animation variants
// const logoVariants = {
//   initial: {
//     opacity: 0,
//     scale: 0.8,
//     y: 20,
//   },
//   animate: {
//     opacity: 1,
//     scale: 1,
//     y: 0,
//     transition: {
//       duration: 0.6,
//       ease: [0.22, 1, 0.36, 1],
//     },
//   },
//   exit: {
//     opacity: 0,
//     scale: 0.8,
//     y: -20,
//     transition: {
//       duration: 0.4,
//     },
//   },
// };

// // Pulse animation for the logo glow
// const pulseVariants = {
//   initial: {
//     opacity: 0.3,
//     scale: 0.8,
//   },
//   animate: {
//     opacity: [0.3, 0.6, 0.3],
//     scale: [0.8, 1.2, 0.8],
//     transition: {
//       duration: 2,
//       repeat: Number.POSITIVE_INFINITY,
//       ease: "easeInOut",
//     },
//   },
// };

// // Rotation animation for the logo
// const rotateVariants = {
//   initial: {
//     rotate: 0,
//   },
//   animate: {
//     rotate: 360,
//     transition: {
//       duration: 6,
//       repeat: Number.POSITIVE_INFINITY,
//       ease: "linear",
//     },
//   },
// };

// // Text animation variants
// const textVariants = {
//   initial: {
//     opacity: 0,
//     y: 10,
//   },
//   animate: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//       ease: "easeOut",
//     },
//   },
//   exit: {
//     opacity: 0,
//     y: 10,
//     transition: {
//       duration: 0.3,
//     },
//   },
// };

// // Background circle animation variants
// const circleVariants = {
//   initial: {
//     scale: 0,
//     opacity: 0.7,
//   },
//   animate: {
//     scale: [0, 1.5, 1],
//     opacity: [0.7, 0.2, 0],
//     transition: {
//       duration: 3,
//       repeat: Number.POSITIVE_INFINITY,
//       repeatType: "loop",
//       ease: "easeOut",
//       times: [0, 0.7, 1],
//     },
//   },
// };

export default function LoadingScreen() {
  // const { t, lng } = useLocalization();

  // useEffect(() => {
  //   const baseText = t("loading");

  //   const interval = setInterval(() => {
  //     setLoadingText((prev) => {
  //       if (prev.endsWith("...")) return baseText;
  //       return prev + ".";
  //     });
  //   }, 500);

  //   return () => clearInterval(interval);
  // }, [t, lng]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white transition-none dark:bg-gray-950"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="h-92 w-92 overflow-hidden">
        <img src={gooLoading} alt="goocast" className="h-full w-full object-cover" />
      </div>
    </motion.div>
  );
}

// {
//   /* Background animated circles */
// }
// <div className="absolute inset-0 flex items-center justify-center">
//   {[...Array(3)].map((_, i) => (
//     <motion.div
//       key={i}
//       className="bg-main/10 absolute rounded-full md:h-[300px] md:w-[300px] lg:h-[400px] lg:w-[400px]"
//       variants={circleVariants}
//       initial="initial"
//       animate="animate"
//       custom={i}
//       transition={{
//         delay: i * 0.8,
//         duration: 3,
//         repeat: Number.POSITIVE_INFINITY,
//         repeatType: "loop",
//       }}
//     />
//   ))}
// </div>;

// {/* Logo container */}
// <div className="relative mb-8">
//   {/* Pulsing glow effect behind logo */}
//   <motion.div
//     className="bg-main/10 absolute inset-0 rounded-full blur-md filter"
//     variants={pulseVariants}
//     initial="initial"
//     animate="animate"
//   />

//   {/* Rotating ring around logo */}
//   <motion.div
//     className="border-main absolute inset-[-10px] rounded-full border-2 border-dashed"
//     variants={rotateVariants}
//     initial="initial"
//     animate="animate"
//   />

//   {/* Logo itself */}
//   <motion.div
//     variants={logoVariants}
//     className="relative flex h-24 w-24 items-center justify-center md:h-32 md:w-32 lg:h-40 lg:w-40"
//   >
//     <motion.img
//       src={loadingLogo}
//       alt="Loading"
//       className="h-16 w-16 object-contain md:h-20 md:w-20 lg:h-24 lg:w-24"
//       animate={{
//         scale: [1, 1.1, 1],
//       }}
//       transition={{
//         duration: 2,
//         repeat: Number.POSITIVE_INFINITY,
//         ease: "easeInOut",
//       }}
//     />
//   </motion.div>
// </div>

// {/* Loading text */}
// <motion.div variants={textVariants} className="flex flex-col items-center">
//   <motion.p
//     className="text-main text-lg font-medium tracking-wide md:text-xl lg:text-2xl"
//     animate={{ opacity: [0.7, 1, 0.7] }}
//     transition={{
//       duration: 1.5,
//       repeat: Number.POSITIVE_INFINITY,
//       ease: "easeInOut",
//     }}
//   >
//     {loadingText}
//   </motion.p>

//   {/* Optional progress bar */}
//   <motion.div
//     className="mt-4 h-1 w-40 overflow-hidden rounded-full bg-gray-100 md:w-60 lg:w-72"
//     initial={{ opacity: 0, y: 10 }}
//     animate={{
//       opacity: 1,
//       y: 0,
//       transition: { delay: 0.5, duration: 0.5 },
//     }}
//   >
//     <motion.div
//       className="bg-main/50 h-full"
//       initial={{ width: "0%" }}
//       animate={{
//         width: "100%",
//       }}
//       transition={{
//         duration: 3.5,
//         repeat: Number.POSITIVE_INFINITY,
//         ease: [0.34, 0.53, 0.37, 1],
//       }}
//     />
//   </motion.div>
// </motion.div>

// {/* Screen reader text for accessibility */}
// <div className="sr-only" role="status" aria-live="polite">
//   {t("loading-application-please-wait")}
// </div>
