import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Alert, Popup, Loading } from "@/components/common";
import { PlusCircle } from "lucide-react";
import StudioTable from "./_components/studio-table";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ResponsiveStudioData from "./_components/responsive-studio-data";
import { useGetStudio } from "@/apis/public/studio.api";
import { useDeleteStudio } from "@/apis/admin/manage-studio.api";

const StudioManagement = () => {
  const { data: studiosData, isLoading } = useGetStudio();
  const { deleteStudio } = useDeleteStudio();

  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const confirmDelete = () => {
    deleteStudio(selectedStudio._id, {
      onSuccess: () => {
        setSelectedStudio(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      },
    });
  };

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isLoading) return <Loading />;

  return (
    <div className="py-6 md:p-6">
      {showSuccess && <Alert type="success">Studio deleted successfully.</Alert>}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800 md:text-2xl">Studio Management</h1>
        <Link
          to="/admin-dashboard/studio/add"
          className="bg-main/80 hover:bg-main rounded-lg px-2 py-1 text-white transition-colors"
        >
          <PlusCircle className="mr-2 inline-block" />
          Add New Studio
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white p-2.5 shadow">
        {isDesktop ? (
          <StudioTable studiosData={studiosData} setSelectedStudio={setSelectedStudio} />
        ) : (
          <ResponsiveStudioData
            studiosData={studiosData}
            setSelectedStudio={setSelectedStudio}
          />
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedStudio && (
          <Popup>
            <h3 className="mb-4 text-lg font-semibold">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this studio?</p>
            <p className="mb-6 text-center text-red-500">
              <strong>{selectedStudio.name}</strong>
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setSelectedStudio(null)}
                className="rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </Popup>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudioManagement;
