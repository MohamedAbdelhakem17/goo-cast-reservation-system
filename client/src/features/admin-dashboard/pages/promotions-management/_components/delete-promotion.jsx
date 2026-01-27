import { useDeletePromotion } from "@/apis/admin/manage-promotions.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { TriangleAlert } from "lucide-react";

export default function DeletePromotion({ onClose, promotion }) {
  //  Translation
  const { t, lng } = useLocalization();

  // Mutations
  const { mutate: deletePromotionMutate, isPending } = useDeletePromotion();

  // Hooks
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Functions
  const handleDeletePromotion = (id) => {
    deletePromotionMutate(id, {
      onSuccess: (response) => {
        // Toast Success Message
        const successMessage = response?.message || t("promotion-deleted-successfully");

        // toast
        addToast(successMessage, "success");

        // Invalidate Queries
        queryClient.invalidateQueries(["all-promotions"]);

        // Close Popup
        onClose();
      },
      onError: (error) => {
        // Toast Error Message
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          t("failed-to-delete-promotion");

        // add Toast
        addToast(errorMessage, "error");
      },
    });
  };

  return (
    <>
      {/* Icon */}
      <div className="mb-4 flex items-center justify-center">
        {/* Alert Icon  */}
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <TriangleAlert className="h-7 w-7 text-red-600" />
        </div>
      </div>

      {/* Message */}
      <h2
        id="delete-promotion-title"
        className="mb-3 text-center text-lg font-semibold text-gray-900"
      >
        {t("delete-promotion-confirmation")}
      </h2>

      {/* Description */}
      <p className="mb-4 text-center text-sm text-gray-600">
        {t("delete-promotion-warning")}
      </p>

      {/* Promotion Title */}
      <div className="mb-6 rounded-lg bg-gray-50 p-3 text-center text-sm font-medium text-gray-800">
        {promotion?.title?.[lng]}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {/* Cancel */}
        <button
          type="button"
          onClick={() => onClose()}
          className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
        >
          {t("cancel")}
        </button>

        {/* Confirm */}
        <button
          type="button"
          onClick={() => handleDeletePromotion(promotion._id)}
          disabled={isPending}
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:outline-none"
        >
          {isPending ? t("deleting") + "..." : t("confirm")}
        </button>
      </div>
    </>
  );
}
