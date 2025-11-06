import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import KanbanColumn from "./_kanban-column";

const COLUMNS = [
  { id: "new", label: "New" },
  { id: "pending-payment", label: "Pending Payment" },
  { id: "paid", label: "Paid" },
  { id: "scheduled", label: "Scheduled" },
  { id: "in-studio", label: "In Studio" },
  { id: "completed", label: "Completed" },
  { id: "needs-edit", label: "Needs Edit" },
  { id: "canceled", label: "Canceled" },
];

export default function BookingKanban({ bookings = [], onUpdateBooking }) {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [draggedBookingId, setDraggedBookingId] = useState(null);
  const [hoverColumn, setHoverColumn] = useState(null);

  useEffect(() => {
    setLocalBookings(bookings);
  }, [bookings]);

  const handleDrop = async (bookingId, newStatus) => {
    // Optimistic UI
    setLocalBookings((prev) =>
      prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b)),
    );

    if (onUpdateBooking) {
      try {
        await onUpdateBooking(bookingId, newStatus);
      } catch (err) {
        setLocalBookings(bookings);
        console.error("Update failed:", err);
      }
    }

    setDraggedBookingId(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="w-full overflow-x-auto bg-zinc-50 py-4">
        <div className="inline-flex gap-4 px-6 pb-4">
          {COLUMNS.map((column) => {
            const columnBookings = localBookings.filter((b) => b.status === column.id);

            return (
              <KanbanColumn
                key={column.id}
                status={column.id}
                label={column.label}
                bookings={columnBookings}
                onDrop={handleDrop}
                draggedBookingId={draggedBookingId}
                setDraggedBookingId={setDraggedBookingId}
                hoverColumn={hoverColumn}
                setHoverColumn={setHoverColumn}
              />
            );
          })}
        </div>
      </div>
    </DndProvider>
  );
}
