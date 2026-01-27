import { ResponsiveTable } from "@/components/common";
import ActionButtons from "./action-buttons";
import StatusBadge from "./status-badge";
import { formatDate } from "./utils";

// Mobile Card
const PromotionCard = ({ promotion, lng, onEdit, onDelete }) => {
  return (
    <ResponsiveTable
      key={promotion._id}
      title={promotion.title[lng]}
      subtitle={<StatusBadge promotion={promotion} />}
      fields={[
        { label: "Description", value: promotion.description[lng] || "N/A" },
        { label: "Start Date", value: formatDate(promotion.start_date) },
        { label: "End Date", value: formatDate(promotion.end_date) },
        { label: "Priority", value: promotion.priority || "N/A" },
        {
          label: "Active",
          value: promotion.isEnabled ? "Yes" : "No",
        },
        { label: "Created At", value: formatDate(promotion.createdAt) },
      ]}
      actions={
        <ActionButtons promotion={promotion} onEdit={onEdit} onDelete={onDelete} />
      }
    />
  );
};

export default PromotionCard;
