import { Button, Popup } from "@/components/common";
import { useDeleteAddon } from "@/apis/admin/mange-addons.api";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";

export default function AddonDeleteModal({
  selectedDeletedAddon,
  setSelectedDeletedAddon,
}) {
  // Mutation
  const { deleteAddon, isPending } = useDeleteAddon();

  // Hooks
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Functions
  const handelDeleteAddon = (id) => {
    deleteAddon(id, {
      onSuccess: () => {
        addToast("addon deleted successfully", "success");
        queryClient.invalidateQueries("addons");
        setSelectedDeletedAddon(null);
      },

      onError: (error) => {
        const errorMessage = error?.response?.data?.message || "Failed to delete addon";

        addToast(errorMessage, "error");
      },
    });
  };

  return (
    <Popup>
      {/* title */}
      <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>

      {/* description */}
      <p className="mb-4">Are you sure you want to delete this Add-on?</p>
      <p className="mb-6 text-center text-red-500">
        <strong>{selectedDeletedAddon.name}</strong>
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {/* Cancel deleting */}
        <button
          onClick={() => setSelectedDeletedAddon(null)}
          className="mt-6 rounded-lg bg-gray-200 px-4 py-3 transition-colors hover:bg-gray-300"
        >
          Cancel
        </button>

        {/* Confirm deleting */}
        <Button
          onClick={() => handelDeleteAddon(selectedDeletedAddon._id)}
          isPending={isPending}
          type="button"
          fallback="Deleting .."
        >
          Delete
        </Button>
      </div>
    </Popup>
  );
}
