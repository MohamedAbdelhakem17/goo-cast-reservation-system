"use client";

import { useQuery } from "@tanstack/react-query";
import { ActivityIcon } from "lucide-react";
import axiosInstance from "./../../../utils/axios-instance";

export default function ActivityTab({ bookingId }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["booking-log", bookingId],
    queryFn: async () => {
      const { data } = await axiosInstance(`/logs/${bookingId}`);
      return data;
    },
    enabled: !!bookingId,
  });

  if (isLoading) return <p>Loading activities...</p>;

  if (isError)
    return (
      <p className="text-center text-lg font-bold text-zinc-600">
        activities: {"can not find any logs for this item" || "Unknown error"}
      </p>
    );

  if (!data?.data || data.data.length === 0)
    return <p className="text-gray-500">No activities found for this booking.</p>;

  const activities = data.data.map((item) => {
    const actorDisplay = `${item.actor.name} (${item.actor.role})`;

    const description = `${actorDisplay} performed ${item.action} on ${item.model}`;

    const details = item.changes
      .filter((c) => c.key !== "id")
      .map(
        (c) =>
          `${c.key} changed from ${c.old !== undefined ? `"${c.old}" to ` : ""}"${c.new}"`,
      )
      .join(", ");

    return {
      id: item._id,
      description,
      details: details || null,
      timestamp: item.createdAt,
      user: actorDisplay,
    };
  });

  return (
    <div className="space-y-4">
      {activities.map((activity, idx) => (
        <div key={activity.id} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
              <ActivityIcon className="h-4 w-4 text-gray-600" />
            </div>
            {idx < activities.length - 1 && (
              <div className="mt-2 h-full w-px bg-gray-200" />
            )}
          </div>
          <div className="flex-1 pb-4">
            <p className="text-sm">{activity.description}</p>
            {activity.details && (
              <p className="mt-1 text-sm text-gray-500">{activity.details}</p>
            )}
            <p className="mt-2 text-xs text-gray-400">
              {new Date(activity.timestamp).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              · {activity.user}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
