import { useDeleteStudio } from "@/apis/admin/manage-studio.api";
import { useGetStudio } from "@/apis/public/studio.api";
import { Alert, EmptyState, Loading, Popup } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import StudioCard from "./_components/studio-card";

const StudioManagement = () => {
  const { lng, t } = useLocalization();
  const { data: studiosData, isLoading } = useGetStudio("all");
  const { deleteStudio } = useDeleteStudio();
  const queryClient = useQueryClient();

  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirmDelete = () => {
    deleteStudio(selectedStudio._id, {
      onSuccess: () => {
        setSelectedStudio(null);
        setShowSuccess(true);
        queryClient.invalidateQueries("studios");
        setTimeout(() => setShowSuccess(false), 1000);
      },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="py-6 md:p-6">
      {showSuccess && <Alert type="success">{t("studio-deleted-successfully")}</Alert>}

      <div className="mb-6 flex items-center justify-between border-b-1 border-gray-200 pb-4">
        <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
          {t("studio-management")}
        </h1>
        <Link
          to="/admin-dashboard/studio/add"
          className="bg-main/80 hover:bg-main rounded-lg px-2 py-1 text-white transition-colors"
        >
          <PlusCircle className="me-2 inline-block" />
          {t("add-new-studio")}
        </Link>
      </div>

      {/* Display Data */}
      <div className="overflow-x-auto rounded-lg p-2.5">
        {/* Empty State  */}
        {studiosData?.data?.length === 0 ? (
          <EmptyState
            message={t("no-studio-founded")}
            subMessage={t("add-new-one-now")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* include Data */}
            {studiosData?.data.map((studio) => (
              <StudioCard studio={studio} key={studio._id} onDelete={setSelectedStudio} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence mode="wait">
        {selectedStudio && (
          <Popup>
            <h3 className="mb-4 text-lg font-semibold">{t("confirm-delete")}</h3>
            <p className="mb-4">{t("are-you-sure-you-want-to-delete-this-studio")}</p>
            <p className="mb-6 text-center text-red-500">
              <strong>{selectedStudio.name?.[lng]}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedStudio(null)}
                className="rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
              >
                {t("cancel")}
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                {t("delete")}
              </button>
            </div>
          </Popup>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudioManagement;
