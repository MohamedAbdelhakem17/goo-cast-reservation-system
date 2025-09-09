import { Clock, CheckCircle, XCircle } from "lucide-react";

export default function UserSearchBooking(setFilterStatus, setSearchTerm) {
  //  variables
  const statusClasses = {
    all: "bg-main text-white",
    approved: "bg-gradient-to-r from-green-500 to-green-600 text-white",
    pending: "bg-gradient-to-r from-amber-400 to-amber-500 text-white",
    rejected: "bg-gradient-to-r from-red-500 to-red-600 text-white",
  };

  const statusIcons = {
    all: null,
    approved: <CheckCircle className="h-5 w-5 text-green-600" />,
    pending: <Clock className="h-5 w-5 text-yellow-500" />,
    rejected: <XCircle className="h-5 w-5 text-red-600" />,
  };

  const BUTTONS_ACTION = [
    { label: "All Bookings", status: "all" },
    { label: "Pending", status: "pending" },
    { label: "Approved", status: "approved" },
    { label: "Rejected", status: "rejected" },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-8 rounded-2xl bg-white p-4 shadow-md md:p-6"
    >
      <div className="flex flex-col items-center gap-4 md:flex-row">
        {/* Search field */}
        <div className="relative w-full md:w-2/3">
          {/* search icon  */}
          <i className="fa-solid fa-search absolute top-1/2 left-3 -translate-y-1/2 transform text-gray-400"></i>

          {/* Search input */}
          <input
            type="text"
            placeholder="Search by studio or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="focus:ring-main/30 focus:border-main w-full rounded-xl border border-gray-200 py-3 pr-4 pl-10 transition focus:ring-2 focus:outline-none"
          />
        </div>

        {/* Actions */}
        <div className="no-scrollbar flex w-full gap-2 overflow-x-auto pb-2 md:w-auto md:pb-0 [&_button]:mb-2">
          {BUTTONS_ACTION.map(({ label, status }) => (
            //  Booking status button
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-xl px-4 py-2 font-medium whitespace-nowrap transition ${
                filterStatus === status
                  ? statusClasses[status]
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {statusIcons[status] && (
                <span className="mr-2 inline-flex">{statusIcons[status]}</span>
              )}
              {label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
