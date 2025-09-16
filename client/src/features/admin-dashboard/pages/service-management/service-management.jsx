import Packages from "@/features/admin-dashboard/_components/Admin-Dashboard/Service-Management/Packages/Packages";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SelectInput } from "@/components/common";
import { PlusCircle } from "lucide-react";

const ServiceManagement = () => {
  // hooks
  const [searchParams, setSearchParams] = useSearchParams();

  const initialStatus = searchParams.get("status") || "all";

  // state
  const [status, setStatus] = useState(initialStatus);

  // Variables
  const ADDONS_STATUS = [
    { label: "All", value: "all" },
    { label: "Active", value: "true" },
    { label: "In active", value: "false" },
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
  return (
    <div className="py-6 md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="text-lg font-bold text-gray-800 md:text-2xl">
          Package Management
        </h1>

        {/* Filter and add new addons */}
        <div className="flex w-full flex-col gap-4 md:w-auto md:flex-row md:items-center">
          <Link
            to="/admin-dashboard/service/add"
            className="bg-main/80 hover:bg-main mb-6 rounded-lg px-4 py-3 text-white transition-colors"
          >
            <PlusCircle className="mr-2 inline-block" />
            Add New Package
          </Link>

          <SelectInput
            value={status}
            options={ADDONS_STATUS}
            onChange={handleStatusChange}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg p-2.5">
        <Packages />
      </div>
    </div>
  );
};

export default ServiceManagement;
