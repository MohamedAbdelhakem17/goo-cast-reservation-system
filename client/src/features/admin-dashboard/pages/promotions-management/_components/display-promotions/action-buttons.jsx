import { Edit, Trash2 } from "lucide-react";

// Action Buttons Component
const ActionButtons = ({ promotion, onEdit, onDelete }) => {
  // Handle delete Promotion action
  const handleDelete = () => {
    onDelete(promotion);
  };

  // Handle edit Promotion action
  const handleEdit = () => {
    onEdit(promotion);
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        className="rounded-lg bg-green-50 p-2 text-green-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-green-100 hover:shadow-md active:scale-95"
        title="Edit"
        onClick={handleEdit}
      >
        <Edit className="h-4 w-4" />
      </button>
      <button
        className="rounded-lg bg-red-50 p-2 text-red-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-100 hover:shadow-md active:scale-95"
        title="Delete"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ActionButtons;
