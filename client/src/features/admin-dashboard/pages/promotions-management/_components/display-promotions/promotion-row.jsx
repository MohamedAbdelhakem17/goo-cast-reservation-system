import ActionButtons from "./action-buttons";
import StatusBadge from "./status-badge";
import { formatDate } from "./utils";

// Desktop Table Row
const PromotionRow = ({ promotion, lng, onEdit, onDelete }) => {
  return (
    <tr className="border-b border-gray-200 transition-all duration-200 hover:bg-gradient-to-r hover:from-gray-50 hover:to-transparent">
      <td className="px-6 py-4 font-semibold whitespace-nowrap text-gray-900">
        {promotion.title[lng]}
      </td>
      <td className="max-w-xs truncate px-6 py-4 text-sm text-gray-600">
        {promotion.description[lng] || (
          <span className="text-gray-400 italic">No description</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-600">
        {formatDate(promotion.start_date)}
      </td>
      <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-600">
        {formatDate(promotion.end_date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge promotion={promotion} />
      </td>
      <td className="px-6 py-4 text-center text-sm whitespace-nowrap">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-purple-200 bg-purple-50 text-xs font-semibold text-purple-700">
          {promotion.priority || "—"}
        </span>
      </td>
      <td className="px-6 py-4 text-center whitespace-nowrap">
        {promotion.isEnabled ? "Yes" : "No"}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <ActionButtons promotion={promotion} onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  );
};

export default PromotionRow;
