import { motion } from "framer-motion";

export default function NotfoundBooking({ searchTerm, filterStatus }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="rounded-3xl bg-white py-16 text-center shadow-md"
    >
      {/* Icon */}
      <i className="fa-regular fa-calendar-xmark mb-4 text-6xl text-gray-400"></i>

      {/* label  */}
      <h2 className="text-2xl font-semibold text-gray-600">No Bookings Found</h2>

      {/* Feedback search */}
      <p className="mx-auto mt-2 max-w-md text-gray-500">
        {searchTerm || filterStatus !== "all"
          ? "Try adjusting your search or filters to find what you're looking for."
          : "You haven't made any bookings yet. Ready to book your first studio session?"}
      </p>

      {/* Call to action booking studio */}
      {!searchTerm && filterStatus === "all" && (
        <button className="bg-main hover:bg-main/90 mt-6 rounded-xl px-6 py-3 font-medium text-white transition">
          Book a Studio
        </button>
      )}
    </motion.div>
  );
}
