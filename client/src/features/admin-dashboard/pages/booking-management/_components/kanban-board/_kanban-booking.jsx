// _kanban-booking.jsx
import { useState } from "react";
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

export default function BookingKanban({ bookings, onUpdateBooking }) {
  const [localBookings, setLocalBookings] = useState(bookings);
  const [draggedBookingId, setDraggedBookingId] = useState(null);
  const [hoverColumn, setHoverColumn] = useState(null);

  // لما الريكويست يتم بنجاح أو يفشل
  const handleDrop = async (bookingId, newStatus) => {
    const prevBookings = [...localBookings];

    // ✅ تحديث فوري للواجهة
    const updated = localBookings.map((b) =>
      b._id === bookingId ? { ...b, status: newStatus } : b,
    );
    setLocalBookings(updated);

    try {
      await onUpdateBooking(bookingId, newStatus);
      alert("✅ Status updated successfully!");
    } catch (err) {
      alert("❌ Failed to update status!");
      setLocalBookings(prevBookings); // 🔁 إرجاع الحالة القديمة
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen flex-col bg-zinc-50">
        <div className="flex-1 overflow-x-auto overflow-y-hidden">
          <div className="flex h-full min-w-max gap-6 px-6 py-2">
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
      </div>
    </DndProvider>
  );
}
