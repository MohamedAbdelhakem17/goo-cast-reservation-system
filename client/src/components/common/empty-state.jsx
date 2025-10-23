import { CircleAlert } from "lucide-react";

export default function EmptyState({
  message = "Notfound data to display",
  subMessage = "",
  Icon = CircleAlert,
}) {
  return (
    <div className="flex flex-col items-center justify-center bg-white px-4 py-20 text-center shadow sm:px-6 lg:px-8">
      {Icon && <Icon className="mb-4 h-24 w-24 text-gray-400" />}

      <h2 className="text-xl font-semibold text-gray-700">{message}</h2>

      {subMessage && <p className="mt-2 max-w-md text-sm text-gray-500">{subMessage}</p>}
    </div>
  );
}
