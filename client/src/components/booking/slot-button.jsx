import useTimeConvert from "@/hooks/useTimeConvert";
import { motion } from "framer-motion";

export default function SlotButton({ time, isSelected, onClick, index }) {
  const timeFormat = useTimeConvert();
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: Math.min(index * 0.05, 0.5),
        duration: 0.3,
      }}
      onClick={() => onClick(time)}
      className={`w-full rounded-lg border-2 p-4 text-center transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-main/50 bg-main/10 text-main/70 dark:border-main/60 dark:bg-main/20 dark:text-main"
          : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-gray-500 dark:hover:bg-gray-700"
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="text-lg font-medium">{timeFormat(time)}</span>
    </motion.button>
  );
}
