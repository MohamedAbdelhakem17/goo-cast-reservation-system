import { Button, Popup } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useQueryClient } from "@tanstack/react-query";
import { useDeletePackage } from "@/apis/admin/manage-package.api";
import useLocalization from "@/context/localization-provider/localization-context";

export default function PackageDeleteModal({
  selectedDeletedPackage,
  setSelectedDeletedPackage,
}) {
  // Localization
  const { lng, t } = useLocalization();

  // Mutation
  const { deletePackage, isPending } = useDeletePackage();

  // Hooks
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  // Functions
  const handelDeleteAddon = (id) => {
    deletePackage(id, {
      onSuccess: () => {
        addToast(t("package-deleted-successfully"), "success");
        queryClient.invalidateQueries("packages");
        setSelectedDeletedPackage(null);
      },

      onError: (error) => {
        const errorMessage =
          error?.response?.data?.message || t("failed-to-delete-package");

        addToast(errorMessage, "error");
      },
    });
  };
  return (
    <Popup>
      {/* title */}
      <h3 className="mb-4 text-lg font-semibold">{t("confirm-delete")}</h3>

      {/* description */}
      <p className="mb-4">{t("are-you-sure-you-want-to-delete-this-package")}</p>
      <p className="mb-6 text-center text-red-500">
        <strong>{selectedDeletedPackage.name?.[lng]}</strong>
      </p>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {/* Cancel deleting */}
        <button
          onClick={() => setSelectedDeletedPackage(null)}
          className="mt-6 rounded-lg bg-gray-200 px-4 py-3 transition-colors hover:bg-gray-300"
        >
          {t("cancel")}
        </button>

        {/* Confirm deleting */}
        <Button
          onClick={() => handelDeleteAddon(selectedDeletedPackage._id)}
          isPending={isPending}
          type="button"
          fallback={t("deleting")}
        >
          {t("delete")}
        </Button>
      </div>
    </Popup>
  );
}
