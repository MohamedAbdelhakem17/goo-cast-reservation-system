import { OptimizedImage } from "@/components/common";
import { memo } from "react";

const StudioSection = memo(function StudioSection({
  studio,
  date,
  startSlot,
  formatTime,
  duration,
  lng,
}) {
  if (!studio) return null;
  return (
    <div className="flex items-center justify-between space-y-1 border-b-1 border-gray-300 pb-4 dark:border-gray-700">
      <div className="flex-1 space-y-3">
        {/* Booking date */}
        <p className="text-md text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-calendar-days me-2 text-[12px]"></i>
          {date}
        </p>

        {/* Hour and duration */}
        <p className="text-md text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-clock me-2 text-[12px]"></i>
          {formatTime(startSlot)} ({duration} {lng === "ar" ? "ساعة" : "h"})
        </p>

        {/* Studio name */}
        <p className="text-md text-gray-500 dark:text-gray-400">
          <i className="fa-solid fa-location-dot me-2 text-[12px]"></i>
          {studio.name?.[lng]}
        </p>
      </div>
      <OptimizedImage
        isFullWidth={false}
        src={studio?.image}
        alt={studio.name?.[lng]}
        className="h-30 w-40 rounded-md"
      />
    </div>
  );
});

export default StudioSection;
