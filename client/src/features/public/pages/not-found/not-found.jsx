import useQuickBooking from "@/hooks/useQuickBooking";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  const { handleQuickBooking } = useQuickBooking();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 transition-none sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="w-full max-w-md space-y-8 text-center">
        {/* Animated 404 text */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-main text-9xl font-extrabold tracking-tight">404</h1>
        </motion.div>

        {/* Animated subtitle */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 transition-none dark:text-gray-100">
            Page not found
          </h2>
          <p className="mt-2 text-base text-gray-500 transition-none dark:text-gray-400">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </motion.div>

        {/* Animated button */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center gap-5"
        >
          <Link
            to={"/"}
            className="text-main hover:bg-opacity-90 border-main mt-8 inline-flex items-center rounded-md border bg-white px-4 py-2 text-sm font-medium shadow-sm transition-none focus:ring-2 focus:ring-offset-2 focus:outline-none dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <i className="fa-solid fa-arrow-left mr-2 h-4 w-4"></i>
            Back to home
          </Link>

          <button
            onClick={() => handleQuickBooking(1)}
            className="hover:bg-opacity-90 bg-main mt-8 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium text-white shadow-sm transition-none focus:ring-2 focus:ring-offset-2 focus:outline-none"
          >
            Booking Now
            <i className="fa-solid fa-arrow-right ml-2 h-4 w-4"></i>
          </button>
        </motion.div>

        {/* Animated decorative elements */}
        <div className="relative mt-12">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-main absolute rounded-full"
              style={{
                left: `${10 + i * 20}%`,
                width: `${8 - i}px`,
                height: `${8 - i}px`,
                opacity: 0.7,
              }}
              initial={{ y: 0 }}
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
