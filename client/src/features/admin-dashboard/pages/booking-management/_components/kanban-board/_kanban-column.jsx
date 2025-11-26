import { useDrop } from "react-dnd";
import KanbanCard from "./kanban-card";
export default function KanbanColumn({
  status,
  label,
  bookings,
  onDrop,
  draggedBookingId,
  setDraggedBookingId,
  hoverColumn,
  setHoverColumn,
  setSelectedBooking,
}) {
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "booking",
      hover: () => setHoverColumn(status),
      drop: (item) => {
        setHoverColumn(null);
        onDrop(item.id, status);
      },
      collect: (monitor) => ({ isOver: monitor.isOver() }),
    }),
    [status, onDrop],
  );

  const totalValue = bookings.reduce(
    (sum, b) => sum + (b?.totalPriceAfterDiscount || a?.totalPrice || 0),
    0,
  );

  const draggedBooking = bookings.find((b) => b._id === draggedBookingId);

  return (
    <div className="flex h-[80vh] max-w-[370px] min-w-[370px] flex-col rounded-xl border border-zinc-200 bg-white shadow-sm">
      {/* Header */}
      <div className="rounded-t-xl border-b border-zinc-200 bg-white px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-zinc-800">{label}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-700">
              {bookings.length}
            </span>
          </div>
          <span className="text-sm font-medium text-zinc-600">
            EGP {totalValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Content */}
      <div
        ref={drop}
        className={`h-[calc(100vh-200px)] flex-1 space-y-3 overflow-x-hidden overflow-y-auto px-2 py-4 transition-all ${isOver ? "border border-blue-300 bg-blue-50" : "bg-gray-200/50"} `}
      >
        {bookings.map((booking) => (
          <KanbanCard
            key={booking._id}
            booking={booking}
            setDraggedBookingId={setDraggedBookingId}
            setSelectedBooking={setSelectedBooking}
          />
        ))}

        {hoverColumn === status &&
          draggedBookingId &&
          !bookings.find((b) => b._id === draggedBookingId) &&
          draggedBooking && <KanbanCard booking={draggedBooking} isGhost />}

        {bookings.length === 0 && !isOver && (
          <div className="flex h-32 items-center justify-center text-sm text-zinc-400">
            Drop cards here
          </div>
        )}
      </div>
    </div>
  );
}
