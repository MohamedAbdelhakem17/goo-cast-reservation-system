import useLocalization from "@/context/localization-provider/localization-context";
import useDataFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { Calendar, Mail, MessageCircle } from "lucide-react";
import { useDrag } from "react-dnd";

export default function KanbanCard({
  booking,
  isGhost = false,
  setDraggedBookingId,
  setSelectedBooking,
}) {
  // Translation
  const { lng } = useLocalization();
  const formatDate = useDataFormat();
  const formatPrice = usePriceFormat();
  const formatTime = useTimeConvert();

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "booking",
      item: () => {
        if (setDraggedBookingId) setDraggedBookingId(booking._id);
        return { id: booking._id };
      },
      end: () => {
        if (setDraggedBookingId) setDraggedBookingId(null);
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [booking._id, setDraggedBookingId],
  );

  const bookingTitle = `#${booking._id?.slice(0, 6)} - ${booking?.personalInfo?.fullName || "_"} - ${booking?.package?.name?.en}`;

  if (!booking._id && !isGhost) return null;

  return (
    <div
      ref={isGhost ? null : drag}
      className={`group mx-auto my-3 cursor-pointer rounded-2xl border border-zinc-200 bg-white px-2 py-4 transition-all duration-200 hover:border-zinc-300 hover:shadow-lg ${
        isGhost ? "border-dashed opacity-40" : ""
      } ${isDragging ? "scale-[0.97] opacity-50" : ""}`}
      style={{ width: "330px" }}
      onClick={() => setSelectedBooking(booking)}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-sm font-medium tracking-wide text-zinc-400">
          {bookingTitle}
        </span>
        {/* <button className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-zinc-100">
          <MoreVertical className="h-4 w-4 text-zinc-500" />
        </button> */}
      </div>

      {/* Info line: Date & time, Duration, Studio, Guests */}
      <div className="mb-3 space-y-2">
        {/* time */}
        <div className="flex items-center gap-2 text-sm">
          {/* icon */}
          <Calendar className="h-4 w-4 text-gray-400" />

          {/* Booking data */}
          <span className="text-gray-700">{formatDate(booking.date)}</span>

          {/* Start and end time  */}
          <span className="text-gray-400">•</span>
          <span className="text-gray-600">
            {formatTime(booking.startSlot)}
            <span className="text-gray-400">•</span>
            {formatTime(booking.endSlot)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          {/* Duration */}
          <span>{booking.duration}h duration</span>
          <span className="text-gray-400">•</span>

          {/* Studio */}
          <span>{booking.studio?.name[lng]}</span>

          {/* Person */}
          {booking.persons > 0 && (
            <>
              <span className="text-gray-400">•</span>
              <span>
                {booking.persons} guest{booking.persons > 1 ? "s" : ""}
              </span>
            </>
          )}
        </div>
      </div>

      {/*  Add-ons */}
      <div className="mb-3 flex flex-wrap gap-1">
        {booking?.addOns?.map((addon, idx) => (
          <span
            key={idx}
            className="focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive [a&]:hover:bg-secondary/90 inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent bg-red-500/10 px-2 py-0.5 text-xs font-medium whitespace-nowrap text-red-600 transition-[color,box-shadow] hover:bg-red-500/20 focus-visible:ring-[3px]"
          >
            {addon?.item?.name[lng]}
          </span>
        ))}
      </div>

      {/* Amount */}
      <div className="mb-3">
        <span className="font-bold text-gray-900">
          {formatPrice(booking.totalPriceAfterDiscount || booking.totalPrice)}
        </span>
      </div>

      {/* User name and contact actions */}
      <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
        {/* User Name  */}
        <div className="flex items-center gap-2">
          {/* User avatar */}
          <span className="grid size-5 place-items-center rounded-full bg-red-600 text-xs font-semibold text-white">
            {booking.assignTo?.name?.slice(0, 1) || "S"}
          </span>

          {/* User name */}
          <span className="text-xs font-medium text-zinc-700 capitalize">
            {booking.assignTo?.name || "Some one"}
          </span>
        </div>

        {/* Contact  */}
        <div className="flex items-center gap-1">
          {/* Send Email */}
          <a
            className="flex size-5 cursor-pointer items-center justify-center rounded-md transition hover:bg-zinc-100"
            href={`mailto:${booking?.personalInfo?.email}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Mail className="h-4 w-4 text-zinc-600" />
          </a>

          {/* Whatsapp  chat */}
          <a
            className="flex size-5 cursor-pointer items-center justify-center rounded-md transition hover:bg-zinc-100"
            href={`https://wa.me/${booking?.personalInfo?.phone}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <MessageCircle className="h-4 w-4 text-zinc-600" />
          </a>
        </div>
      </div>
    </div>
  );
}
