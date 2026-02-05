import { darkLoading, gooLoading } from "@/assets/images";
import useTheme from "@/context/theme-context/theme-context";
import { motion } from "framer-motion";
import THEMES from "../../utils/constant/themes.constant";

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

export default function LoadingScreen() {
  // Hooks
  const { theme } = useTheme();
  const loadingImage = theme === THEMES.LIGHT ? gooLoading : darkLoading;
  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-white transition-none dark:bg-gray-950"
      variants={containerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <div className="h-92 w-92 overflow-hidden">
        <img src={loadingImage} alt="goocast" className="h-full w-full object-cover" />
      </div>
    </motion.div>
  );
}
