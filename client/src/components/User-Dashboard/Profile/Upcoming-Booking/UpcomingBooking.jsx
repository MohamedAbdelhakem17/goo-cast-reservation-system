import { motion } from "framer-motion";
export default function UpcomingBooking() {
  // This is sample data, in a real app it would come from a database
  const upcomingBooking = {
    studioName: "Creative Studio",
    date: "May 25, 2025",
    time: "3:00 PM - 5:00 PM",
    location: "123 Main St, New York",
    price: "$120",
    status: "Confirmed",
    rating: 4.8,
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300 h-full">
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-100 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800">Upcoming Booking</h2>
          <span className="bg-emerald-100 text-emerald-700 text-xs font-medium px-2.5 py-1 rounded-full">
            {upcomingBooking.status}
          </span>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <motion.div
          className="flex justify-between items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Studio</p>
              <p className="font-medium text-slate-800">{upcomingBooking.studioName}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-amber-500"
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              <span className="text-sm font-medium text-slate-700">{upcomingBooking.rating}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-between items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Date</p>
              <p className="font-medium text-slate-800">{upcomingBooking.date}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-between items-center bg-slate-50 p-4 rounded-lg hover:bg-slate-100 transition-colors duration-200"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-indigo-600"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-sm text-slate-500">Time</p>
              <p className="font-medium text-slate-800">{upcomingBooking.time}</p>
            </div>
          </div>
          <div>
            <span className="font-medium text-indigo-600">{upcomingBooking.price}</span>
          </div>
        </motion.div>

        <motion.div className="mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
            </svg>
            Get Directions
          </button>
        </motion.div>
      </div>
    </div>
  )
}