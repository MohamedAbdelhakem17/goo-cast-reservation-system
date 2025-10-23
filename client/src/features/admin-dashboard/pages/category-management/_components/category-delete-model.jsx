import { useDeleteCategory } from "@/apis/admin/manage-category.api";
import { Popup } from "@/components/common";
import { useQueryClient } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";

export default function CategoryDeleteModel({ setDeleteCategory, deletedCategory }) {
  // Localization
  const { t, lng } = useLocalization();

  // Hooks
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Mutation
  const { deleteCategory, isPending } = useDeleteCategory();

  // Function
  const handelDeleteCategory = (id) => {
    deleteCategory(id, {
      onSuccess: ({ message }) => {
        addToast(message || "Category deleted successfully", "success");
        queryClient.refetchQueries("categories");

        setDeleteCategory(null);
      },
      onError: ({ response }) =>
        addToast(response?.data?.message || "Something went wrong", "error"),
    });
  };

  return (
    <>
      <Popup>
        <h2 className="mb-4 text-lg font-semibold">{t("delete-category")}</h2>
        <p className="mb-4">{t("are-you-sure-you-want-to-delete-this-category")}</p>
        <span className="bg-main/70 mx-auto my-4 block w-fit rounded-full px-4 py-1 font-semibold text-white">
          {deletedCategory?.name?.[lng]}
        </span>
        <div className="flex justify-end">
          <button
            onClick={() => setDeleteCategory(null)}
            className="me-2 rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            {t("cancel")}
          </button>
          <button
            disabled={isPending}
            onClick={() => handelDeleteCategory(deletedCategory._id)}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isPending ? <Loader className="animate-spin" /> : t("delete")}
          </button>
        </div>
      </Popup>
    </>
  );
}
