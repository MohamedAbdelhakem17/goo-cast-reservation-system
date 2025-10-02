import React from "react";
import MatrixCard from "./matrix-card";
import useTimeConvert from "@/hooks/useTimeConvert";
import useDateFormat from "@/hooks/useDateFormat";
import useNumberFormat from "@/hooks/use-number-format";
import useLocalization from "@/context/localization-provider/localization-context";

export default function UpcomingBooking({ upcomingBookings }) {
  // Localization
  const { t, lng } = useLocalization();

  // Hooks
  const timeFormat = useTimeConvert();
  const dateFormat = useDateFormat();
  return (
    <MatrixCard className={"p-4 sm:col-span-4 lg:col-span-4"}>
      {/* Title */}
      <h2 className="text-md font-bold">{t("upcoming-bookings")}</h2>

      {/* Description */}
      <p className="mb-4 text-sm text-gray-500">{t("next-scheduled-sessions")}</p>

      {/* Bookings */}
      <div className="my-2 space-y-4">
        {upcomingBookings.map((booking) => (
          <div
            key={booking._id}
            className="flex items-center justify-between gap-y-2 rounded-lg bg-gray-50 p-3"
          >
            {/* Customer and service */}
            <div>
              {/* Customer Name */}
              <p className="font-medium">{booking.customer}</p>

              {/* Service type */}
              <p className="text-sm text-gray-500">{booking.service?.[lng]}</p>
            </div>

            {/* Studio and Time */}
            <div className="text-end">
              {/* Studio name */}
              <span className="rounded-lg border-1 border-gray-300 p-1.5 text-sm">
                {booking.studio?.[lng]}
              </span>

              {/* Date and time */}
              <p className="mt-2.5 text-sm text-gray-500">
                {t("booking-time", {
                  date: dateFormat(booking.date),
                  time: timeFormat(booking.time),
                })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </MatrixCard>
  );
}
