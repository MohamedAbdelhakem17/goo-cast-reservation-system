import { motion } from "framer-motion";

export default function Button({
  isPending,
  type = "submit",
  className,
  children,
  fallback = "loading ..",
}) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      disabled={isPending}
      transition={{
        delay: 0.8,
        duration: 0.4,
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      className={`mt-6 rounded-lg px-4 py-3 font-medium shadow-md transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:outline-none ${
        isPending
          ? "cursor-not-allowed bg-gray-200 text-gray-700"
          : "bg-gradient-to-r from-[#ed1e26] to-[#ff5b60] text-white hover:from-[#d91c23] hover:to-[#e64b50]"
      } ${className}`}
    >
      {isPending ? fallback : children}
    </motion.button>
  );
}
