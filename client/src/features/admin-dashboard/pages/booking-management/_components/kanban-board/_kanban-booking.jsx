import { useEffect, useRef, useState } from "react";
import { useDragDropManager } from "react-dnd";
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
  const containerRef = useRef(null);
  const dragDropManager = useDragDropManager();
  const scrollingRef = useRef(false);

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

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !dragDropManager) return;

    const monitor = dragDropManager.getMonitor();

    const threshold = 200;
    const maxSpeed = 25;
    const minSpeed = 8;

    const scroll = () => {
      if (!scrollingRef.current || !monitor.isDragging()) {
        scrollingRef.current = false;
        return;
      }

      const offset = monitor.getClientOffset();
      if (!offset) {
        scrollingRef.current = false;
        return;
      }

      const rect = container.getBoundingClientRect();
      const mouseX = offset.x;

      const leftDist = mouseX - rect.left;
      const rightDist = rect.right - mouseX;

      const computeSpeed = (dist) => {
        const pct = Math.max(0, Math.min(1, (threshold - dist) / threshold));
        return minSpeed + Math.pow(pct, 0.8) * (maxSpeed - minSpeed);
      };

      if (leftDist < threshold && leftDist > 0) {
        const speed = computeSpeed(leftDist);
        container.scrollBy({ left: -speed, behavior: "instant" });
      } else if (rightDist < threshold && rightDist > 0) {
        const speed = computeSpeed(rightDist);
        container.scrollBy({ left: speed, behavior: "instant" });
      }

      requestAnimationFrame(scroll);
    };

    const handleOffsetChange = () => {
      if (!monitor.isDragging()) {
        scrollingRef.current = false;
        return;
      }

      if (!scrollingRef.current) {
        scrollingRef.current = true;
        requestAnimationFrame(scroll);
      }
    };

    const unsubscribe = monitor.subscribeToOffsetChange(handleOffsetChange);

    return () => {
      unsubscribe && unsubscribe();
      scrollingRef.current = false;
    };
  }, [dragDropManager]);

  return (
    <div className="h-full w-full overflow-hidden py-4">
      <div className="h-full overflow-x-auto overflow-y-hidden px-2" ref={containerRef}>
        <div className="inline-flex h-full gap-4 pb-4">
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
  );
}
