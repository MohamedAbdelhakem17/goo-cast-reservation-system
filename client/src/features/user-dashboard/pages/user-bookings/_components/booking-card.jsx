import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";

export default function BookingCard({ booking, setSelectedBooking, index }) {
  // hooks
  const formatDate = useDateFormat();
  const priceFormat = usePriceFormat();
  const convertTo12HourFormat = useTimeConvert();

  // variable
  const daysRemaining = getDaysRemaining(booking.date);
  const isUpcoming = daysRemaining >= 0;

  // function
  const getDaysRemaining = (dateString) => {
    const bookingDate = new Date(dateString);
    const today = new Date();
    const diffTime = bookingDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <motion.div
      key={booking._id}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{
        y: -5,
        boxShadow:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      }}
      className="overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-300 hover:shadow-xl"
    >
      {/* Studio Image */}
      <div className="relative h-40 overflow-hidden">
        <img
          src={booking.studio.thumbnail || "/placeholder.svg?height=160&width=400"}
          alt={booking.studio.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute right-0 bottom-0 left-0 p-4 text-white">
          <h2 className="truncate text-2xl font-bold">{booking.studio.name}</h2>
          <div className="mt-1 flex items-center">
            <i className="fa-solid fa-calendar-days mr-2"></i>
            <span className="text-sm">{formatDate(booking.date, "short")}</span>
          </div>
        </div>
        <div className="absolute top-3 right-3">
          <span
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium capitalize ${
              statusClasses[booking.status]
            }`}
          >
            <i className={`${statusIcons[booking.status]} text-xs`}></i>
            {booking.status}
          </span>
        </div>
        {isUpcoming && booking.status !== "rejected" && (
          <div className="absolute top-3 left-3">
            <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white">
              {daysRemaining === 0 ? "Today" : `${daysRemaining} days left`}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <i className="fa-solid fa-clock text-main mr-3 w-5 text-lg"></i>
            <span>
              {convertTo12HourFormat(booking.startSlot)} -{" "}
              {convertTo12HourFormat(booking.endSlot)}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <i className="fa-solid fa-user text-main mr-3 w-5 text-lg"></i>
            <span className="truncate">{booking.personalInfo.fullName}</span>
          </div>

          <div className="flex items-center text-gray-600">
            <i className="fa-solid fa-box text-main mr-3 w-5 text-lg"></i>
            <span className="truncate">
              {booking.package?.id?.name || "Custom Booking"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <i className="fa-solid fa-tag text-main mr-3 w-5 text-lg"></i>
            <span className="text-main font-semibold">
              {priceFormat(booking.totalPrice)}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => setSelectedBooking(booking)}
            className="from-main to-main/80 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r py-3 text-lg font-semibold text-white transition hover:opacity-90"
          >
            <i className="fa-solid fa-circle-info"></i>
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
}
