import { motion } from "framer-motion";

export default function UserBookingHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 text-center"
    >
      {/* title */}
      <h1 className="from-main to-main/80 mb-2 bg-gradient-to-r bg-clip-text text-4xl font-bold text-gray-800">
        My Bookings
      </h1>

      {/* description */}
      <p className="mx-auto max-w-2xl text-gray-500">
        Manage and track all your studio bookings in one place
      </p>
    </motion.div>
  );
}
