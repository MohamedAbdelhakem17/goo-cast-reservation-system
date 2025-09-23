import { useDeleteCategory } from "@/apis/admin/manage-category.api";
import { Popup } from "@/components/common";
import { useQueries } from "@tanstack/react-query";
import { Loader } from "lucide-react";

export default function CategoryDeleteModel({ setDeleteCategory, deletedCategory }) {
  const queryClient = useQueries();
  const { deleteCategory, isPending } = useDeleteCategory();

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
        <h2 className="mb-4 text-lg font-semibold">Delete Category</h2>
        <p className="mb-4">Are you sure you want to delete this category?</p>
        <span className="bg-main/70 mx-auto my-4 block w-fit rounded-full px-4 py-1 font-semibold text-white">
          {deletedCategory?.name?.en}
        </span>
        <div className="flex justify-end">
          <button
            onClick={() => setDeleteCategory(null)}
            className="mr-2 rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            disabled={isPending}
            onClick={() => handelDeleteCategory(deletedCategory._id)}
            className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isPending ? <Loader className="animate-spin" /> : "Delete"}
          </button>
        </div>
      </Popup>
    </>
  );
}
