import { Edit, Trash2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function ActionsButtons({ setSelectedStudio, studio }) {
  const navigate = useNavigate();
  const handleDelete = (studio) => {
    setSelectedStudio(studio);
  };

  const handleEdit = (studioId) => {
    navigate(`/admin-dashboard/studio/add?edit=${studioId}`);
  };

  return (
    <>
      <button
        className="mr-3 text-indigo-600 hover:text-indigo-900"
        onClick={() => handleEdit(studio._id)}
      >
        <Edit />
      </button>
      <button
        className="text-red-600 hover:text-red-900"
        onClick={() => handleDelete(studio)}
      >
        <Trash2 />
      </button>
    </>
  );
}
