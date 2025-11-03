// KanbanColumn.jsx
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
}) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "booking",
    hover: () => setHoverColumn(status),
    drop: (item) => {
      setHoverColumn(null);
      setDraggedBookingId(null);
      onDrop(item.id, status);
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  }));

  const totalValue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0);

  const draggedBooking = bookings.find((b) => b._id === draggedBookingId);

  return (
    <div className="flex max-w-[370px] min-w-[370px] flex-col">
      <div className="rounded-t-xl border border-b-0 border-zinc-200 bg-white px-4 py-4 shadow-sm">
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

      <div
        ref={drop}
        className={`min-h-[calc(100vh-310px)] flex-1 space-y-3 overflow-x-hidden overflow-y-auto rounded-b-xl border border-t-0 border-zinc-200 bg-zinc-50 px-3 py-4 transition-all ${
          isOver ? "border-blue-300 bg-blue-50" : ""
        }`}
      >
        {bookings.map((booking) => (
          <KanbanCard
            key={booking._id}
            booking={booking}
            setDraggedBookingId={setDraggedBookingId}
          />
        ))}

        {hoverColumn === status && draggedBookingId && (
          <KanbanCard booking={draggedBooking || {}} isGhost />
        )}
      </div>
    </div>
  );
}
