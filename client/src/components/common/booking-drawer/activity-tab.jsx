import useLocalization from "@/context/localization-provider/localization-context";
import useDataFormat from "@/hooks/useDateFormat";
import { useQuery } from "@tanstack/react-query";
import { ActivityIcon } from "lucide-react";
import useTimeConvert from "./../../../hooks/useTimeConvert";
import axiosInstance from "./../../../utils/axios-instance";

export default function ActivityTab({ bookingId }) {
  const { lng } = useLocalization();
  const timeFormat = useTimeConvert();
  const dateFormat = useDataFormat();

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
        {error?.message || "Can not find any logs for this item"}
      </p>
    );

  if (!data?.data || data.data.length === 0)
    return <p className="text-gray-500">No activities found for this booking.</p>;

  const activities = data.data
    .map((item) => {
      const actorDisplay = `${item.actor.name} (${item.actor.role})`;
      const description = `${actorDisplay} ${item.action.toLowerCase()} ${item.model}`;

      // Filter out empty changes (changes with only _id)
      const validChanges = item.changes.filter(
        (c) => c.key && c.key !== "id" && c.key !== "_id",
      );

      // If no valid changes, skip this log entry
      if (validChanges.length === 0) {
        return null;
      }

      const details = validChanges
        .map((c) => {
          const isDateOrSlot = c.key === "date" || c.key === "startSlot";
          const isDate = c.key === "date";

          const oldValue = isDateOrSlot
            ? isDate
              ? dateFormat(c.old)
              : timeFormat(c.old)
            : c.old;

          const newValue = isDateOrSlot
            ? isDate
              ? dateFormat(c.new)
              : timeFormat(c.new)
            : c.new;

          switch (c.key) {
            case "date":
              return `The date was updated from ${oldValue} to ${newValue}`;

            case "startSlot":
              return `The start time was changed from ${oldValue} to ${newValue}`;

            case "status":
              return `Status changed from "${oldValue}" to "${newValue}"`;

            case "studio":
              const oldStudioName = oldValue?.name?.[lng] || "Unknown";
              // Check if newValue is an ID string or populated object
              const newStudioName =
                typeof newValue === "string"
                  ? `Studio ID: ${newValue}`
                  : newValue?.name?.[lng] || "Unknown";
              return `Studio changed from "${oldStudioName}" to "${newStudioName}"`;

            case "package":
              const oldPackageName = oldValue?.name?.[lng] || "Unknown";
              // Check if newValue is an ID string or populated object
              const newPackageName =
                typeof newValue === "string"
                  ? `Package ID: ${newValue}`
                  : newValue?.name?.[lng] || "Unknown";
              return `Package changed from "${oldPackageName}" to "${newPackageName}"`;

            case "selectedAddOns":
              // Handle selectedAddOns which is an array
              if (!oldValue && Array.isArray(newValue)) {
                const addOnNames = newValue
                  .map(
                    (addon) => `${addon.name?.[lng] || "Unknown"} (x${addon.quantity})`,
                  )
                  .join(", ");
                return `Add-ons selected: ${addOnNames}`;
              } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
                const oldNames = oldValue
                  .map(
                    (addon) => `${addon.name?.[lng] || "Unknown"} (x${addon.quantity})`,
                  )
                  .join(", ");
                const newNames = newValue
                  .map(
                    (addon) => `${addon.name?.[lng] || "Unknown"} (x${addon.quantity})`,
                  )
                  .join(", ");
                return `Add-ons changed from "${oldNames}" to "${newNames}"`;
              }
              return null;

            case "addOns":
              // Handle addOns which comes as object
              if (Array.isArray(oldValue)) {
                // Old format: array of items
                const oldNames = oldValue
                  .map(
                    (addon) =>
                      `${addon.item?.name?.[lng] || "Unknown"} (x${addon.quantity})`,
                  )
                  .join(", ");

                if (typeof newValue === "object" && !Array.isArray(newValue)) {
                  // New format: object with quantities
                  return `Add-ons updated from "${oldNames}" to quantity map`;
                }
              }
              return `Add-ons were updated`;

            case "Create":
              return newValue;

            default:
              const displayOld = oldValue ?? "—";
              const displayNew = newValue ?? "—";
              return `${c.key} changed from "${displayOld}" to "${displayNew}"`;
          }
        })
        .filter(Boolean) // Remove null entries
        .join("; ");

      return {
        id: item._id,
        description,
        details: details || null,
        timestamp: item.createdAt,
        user: actorDisplay,
      };
    })
    .filter(Boolean); // Remove null activities

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
