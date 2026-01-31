import { motion } from "framer-motion";

export default function EmailSuccessfully() {
  return (
    <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center bg-black/30 backdrop-blur-sm dark:bg-black/50">
      <motion.div
        initial={{ opacity: 0, y: -30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -30, scale: 0.95 }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1],
        }}
        className="flex items-center gap-3 rounded-2xl border border-white/20 bg-gradient-to-r from-green-400 to-green-600 px-6 py-4 text-white shadow-xl backdrop-blur-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <span className="font-medium tracking-wide">
          Email has been successfully verified!
        </span>
      </motion.div>
    </div>
  );
}
