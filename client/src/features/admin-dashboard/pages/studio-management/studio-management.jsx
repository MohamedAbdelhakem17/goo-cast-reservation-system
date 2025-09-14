import React, { useState } from "react";
import useGetAllStudios, { DeleteStudio } from "@/apis/studios/studios.api";
import { AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Alert, Popup, Loading, OptimizedImage } from "@/components/common";

const StudioManagement = () => {
  const { data: studiosData, isLoading } = useGetAllStudios();
  const { mutate: deleteStudio } = DeleteStudio();
  const priceFormat = usePriceFormat();
  const navigate = useNavigate();

  const [selectedStudio, setSelectedStudio] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleDelete = (studio) => {
    setSelectedStudio(studio);
  };

  const handleEdit = (studioId) => {
    navigate(`/admin-dashboard/studio-management/add?edit=${studioId}`);
  };

  const confirmDelete = () => {
    deleteStudio(selectedStudio._id, {
      onSuccess: () => {
        setSelectedStudio(null);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1000);
      },
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      {showSuccess && <Alert type="success">Studio deleted successfully.</Alert>}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Studio Management</h1>
        <Link
          to="/admin-dashboard/studio-management/add"
          className="rounded-lg bg-rose-500 px-4 py-2 text-white transition-colors hover:bg-rose-600"
        >
          <i className="fa-solid fa-plus mr-2"></i>
          Add New Studio
        </Link>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Price per Hour
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {studiosData?.data.map((studio) => (
              <tr key={studio._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <OptimizedImage
                    src={studio.thumbnail}
                    alt={studio.name}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{studio.name}</div>
                  <div className="text-sm text-gray-500">{studio.address}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {priceFormat(studio.pricePerHour || studio.basePricePerSlot)}{" "}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <button
                    className="mr-3 text-indigo-600 hover:text-indigo-900"
                    onClick={() => handleEdit(studio._id)}
                  >
                    <i className="fa-solid fa-edit"></i>
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(studio)}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
