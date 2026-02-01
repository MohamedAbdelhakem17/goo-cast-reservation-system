import { Calendar } from "lucide-react";

// State Display Component
const StateDisplay = ({ type, message }) => {
  const colors = {
    loading: "border-t-purple-600",
    error:
      "bg-gradient-to-br from-red-50 to-red-100 text-red-700 border-red-300 shadow-sm",
    empty:
      "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-600 border-gray-300 shadow-sm",
  };

  if (type === "loading")
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div
            className={`mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 ${colors.loading}`}
          ></div>
          <p className="mt-4 text-sm font-medium text-gray-500">Loading promotions...</p>
        </div>
      </div>
    );

  return (
    <div className={`rounded-xl border-2 p-12 text-center ${colors[type]}`}>
      {type === "empty" && (
        <Calendar className="mx-auto mb-4 h-16 w-16 text-gray-400 opacity-50" />
      )}
      <p className="text-lg font-medium">{message}</p>
    </div>
  );
};

export default StateDisplay;
