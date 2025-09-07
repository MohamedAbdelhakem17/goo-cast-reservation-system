import { motion } from "framer-motion";

export default function UserBookingHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      {/* title */}
      <h1 className="text-4xl font-bold mb-2 text-gray-800 bg-gradient-to-r from-main to-main/80 bg-clip-text ">
        My Bookings
      </h1>

      {/* description */}
      <p className="text-gray-500 max-w-2xl mx-auto">
        Manage and track all your studio bookings in one place
      </p>
    </motion.div>
  );
}
