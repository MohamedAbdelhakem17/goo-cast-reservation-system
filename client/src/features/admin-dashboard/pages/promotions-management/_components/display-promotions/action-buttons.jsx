import { useEditPromotion } from "@/apis/admin/manage-promotions.api";
import RadioButton from "@/components/common/radio-button";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2 } from "lucide-react";

// Action Buttons Component
const ActionButtons = ({ promotion, onEdit, onDelete }) => {
  // Mutation
  const { mutate: editPromotionMutate, isPending } = useEditPromotion();

  // Hooks
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Handle delete Promotion action
  const handleDelete = () => {
    onDelete(promotion);
  };

  // Handle edit Promotion action
  const handleEdit = () => {
    onEdit(promotion);
  };

  // Handle toggle promotion status
  const handleToggleStatus = async (newValue) => {
    return new Promise((resolve) => {
      editPromotionMutate(
        {
          id: promotion._id,
          values: { isEnabled: newValue },
        },
        {
          onSuccess: (response) => {
            const successMessage =
              response?.message || "Promotion status updated successfully";
            addToast(successMessage, "success");

            // Invalidate queries to refresh the data
            queryClient.invalidateQueries(["all-promotions"]);
            queryClient.invalidateQueries(["active-promotions"]);

            resolve(true);
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message ||
              error?.message ||
              "Failed to update promotion status";
            addToast(errorMessage, "error");

            resolve(false);
          },
        },
      );
    });
  };

  return (
    <div className="flex items-center justify-center gap-3">
      <RadioButton
        initialValue={promotion.isEnabled || false}
        callback={handleToggleStatus}
        isPending={isPending}
      />
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
