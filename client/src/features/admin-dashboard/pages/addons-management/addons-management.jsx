import { Link, useSearchParams } from "react-router-dom";
import { PlusCircle } from "lucide-react";
import { SelectInput, Loading, ErrorFeedback, EmptyState } from "@/components/common";
import { lazy, useEffect, useState } from "react";
import { useGetAddons } from "@/apis/admin/manage-addons.api";

import { AnimatePresence } from "framer-motion";
import AddonCart from "./_components/addon-card";

const AddonDeleteModal = lazy(() => import("./_components/addon-delete-modal"));
import useLocalization from "@/context/localization-provider/localization-context";

export default function AddonsManagement() {
  // Localization
  const { t, lng } = useLocalization();

  // hooks
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatus = searchParams.get("status") || "all";

  // state
  const [status, setStatus] = useState(initialStatus);
  const [selectedDeletedAddon, setSelectedDeletedAddon] = useState(null);

  // query
  const { addons, isLoading, error } = useGetAddons(status);

  // Functions
  const handleStatusChange = async (e) => {
    const selectedValue = e.target.value;
    setStatus(selectedValue);
    setSearchParams({ status: selectedValue });
  };

  // Variables
  const ADDONS_STATUS = [
    { label: t("all"), value: "all" },
    { label: t("active-0"), value: "true" },
    { label: t("in-active"), value: "false" },
  ];

  // Effects
  useEffect(() => {
    const urlStatus = searchParams.get("status") || "all";
    if (urlStatus !== status) {
      setStatus(urlStatus);
    }
  }, [searchParams]);

  // Loading state
  if (isLoading) return <Loading />;

  // Error State
  if (error) {
    return (
      <div className="flex items-center justify-center py-5">
        <ErrorFeedback>{error.message}</ErrorFeedback>
      </div>
    );
  }

  return (
    <div className="py-6 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        {/* Title */}
        <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
          {t("add-ons-management")}
        </h1>

        {/* Filter and add new addons */}
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
          {/* Link  */}
          <Link
            to="/admin-dashboard/addons/add"
            className="bg-main/80 hover:bg-main mb-6 rounded-lg px-4 py-3 text-white transition-colors"
          >
            <PlusCircle className="me-2 inline-block" />
            {t("add-new-addons")}
          </Link>

          {/* Select Filter */}
          <SelectInput
            value={status}
            options={ADDONS_STATUS}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Display Data */}
      <div className="overflow-x-auto rounded-lg p-2.5">
        {/* Empty State  */}
        {addons?.data?.length === 0 ? (
          <EmptyState
            message={t("no-addons-found")}
            subMessage={t("add-new-addons-now")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* include Data */}
            {addons.data.map((addon) => (
              <AddonCart addon={addon} setDeletedAddon={setSelectedDeletedAddon} />
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {selectedDeletedAddon && (
          <AddonDeleteModal
            selectedDeletedAddon={selectedDeletedAddon}
            setSelectedDeletedAddon={setSelectedDeletedAddon}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
