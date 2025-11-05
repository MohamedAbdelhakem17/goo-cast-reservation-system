import useDataFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import useTimeConvert from "@/hooks/useTimeConvert";
import { Calendar, Mail, MessageCircle, MoreVertical } from "lucide-react";
import { useDrag } from "react-dnd";

export default function KanbanCard({ booking, isGhost = false, setDraggedBookingId }) {
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

  if (!booking._id && !isGhost) return null;

  return (
    <div
      ref={isGhost ? null : drag}
      className={`group mx-auto my-3 cursor-pointer rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-200 hover:border-zinc-300 hover:shadow-lg ${
        isGhost ? "border-dashed opacity-40" : ""
      } ${isDragging ? "scale-[0.97] opacity-50" : ""}`}
      style={{ width: "300px" }}
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-[11px] font-medium tracking-wide text-zinc-400">
          #{booking._id?.slice(0, 6)}
        </span>
        <button className="flex h-7 w-7 items-center justify-center rounded-md transition hover:bg-zinc-100">
          <MoreVertical className="h-4 w-4 text-zinc-500" />
        </button>
      </div>

      <div className="mb-4 space-y-1.5">
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-zinc-500" />
          <span className="font-medium text-zinc-700">{formatDate(booking.date)}</span>
        </div>
        <p className="text-sm text-zinc-600">
          {booking.studio.name.en} - {formatPrice(booking.totalPrice)}
        </p>
        <p className="text-sm text-zinc-600">
          {formatTime(booking.startSlot)} — {formatTime(booking.endSlot)}
        </p>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-100 pt-3">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-red-600 text-xs font-semibold text-white">
            {booking.personalInfo?.fullName?.slice(0, 1)}
          </span>
          <span className="text-xs font-medium text-zinc-700 capitalize">
            {booking.personalInfo?.fullName}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-zinc-100">
            <Mail className="h-4 w-4 text-zinc-600" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-zinc-100">
            <MessageCircle className="h-4 w-4 text-zinc-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
