import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SelectInput } from "@/components/common";
import { PlusCircle } from "lucide-react";
import PackageCard from "./_components/package-card";
import { Loading, ErrorFeedback, EmptyState } from "@/components/common";
import { useGetAllPackages } from "@/apis/admin/manage-package.api";
import useLocalization from "@/context/localization-provider/localization-context";
import { AnimatePresence } from "framer-motion";
import PackageDeleteModal from "./_components/package-delete-modal";

const ServiceManagement = () => {
  // Localization
  const { t } = useLocalization();

  // hooks
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatus = searchParams.get("status") || "all";

  // state
  const [status, setStatus] = useState(initialStatus);
  const [selectedDeletedPackage, setSelectedDeletedPackage] = useState(null);

  // Query
  const { packages, isLoading, error } = useGetAllPackages(initialStatus);

  // Variables
  const PACKAGE_STATUS = [
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

  const handleStatusChange = async (e) => {
    const selectedValue = e.target.value;
    setStatus(selectedValue);
    setSearchParams({ status: selectedValue });
  };

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
          {t("package-management")}
        </h1>

        {/* Filter and add new addons */}
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
          {/* Link  */}
          <Link
            to="/admin-dashboard/service/add"
            className="bg-main/80 hover:bg-main mb-6 rounded-lg px-4 py-3 text-white transition-colors"
          >
            <PlusCircle className="me-2 inline-block" />
            {t("add-new-package")}
          </Link>

          {/* Select Filter */}
          <SelectInput
            value={status}
            options={PACKAGE_STATUS}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      {/* Display Data */}
      <div className="overflow-x-auto rounded-lg p-2.5">
        {/* Empty State  */}
        {packages?.data?.length === 0 ? (
          <EmptyState
            message={t("no-package-found")}
            subMessage={t("add-new-package-now")}
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {/* include Data */}
            {packages?.data?.map((pkg) => (
              <PackageCard
                key={pkg?._id}
                pkg={pkg}
                setSelectedDeletedPackage={setSelectedDeletedPackage}
              />
            ))}
          </div>
        )}
      </div>

      {/* Delete Modal */}
      <AnimatePresence>
        {selectedDeletedPackage && (
          <PackageDeleteModal
            selectedDeletedPackage={selectedDeletedPackage}
            setSelectedDeletedPackage={setSelectedDeletedPackage}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ServiceManagement;
