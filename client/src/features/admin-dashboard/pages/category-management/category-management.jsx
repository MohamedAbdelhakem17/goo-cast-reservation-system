import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { Popup, Loading, ResponsiveTable } from "@/components/common";
import { CategoryList, CategoryForm } from "./_components";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Edit, Trash2 } from "lucide-react";
import {
  useGetAllCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/apis/admin/manage-category.api";

export default function CategoryManagement() {
  const { addToast } = useToast();
  const { categories, isLoading } = useGetAllCategories();
  const { createCategory } = useCreateCategory();
  const { deleteCategory } = useDeleteCategory();
  const { editCategory } = useUpdateCategory();

  const [editingCategory, setEditingCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletedCategory, setDeleteCategory] = useState(false);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const addCategory = (category) => {
    createCategory(category, {
      onSuccess: (res) => {
        addToast(res?.message || "Category added successfully", "success");
        setIsFormOpen(false);
      },
      onError: (err) =>
        addToast(err?.response?.data?.message || "Failed to add category", "error"),
    });
  };

  const handelUpdateCategory = (updatedCategory) => {
    editCategory(
      { id: updatedCategory._id, payload: updatedCategory },
      {
        onSuccess: ({ message }) => {
          (addToast(message || "Category updated successfully", "success"),
            setEditingCategory(null));
        },
        onError: ({ response }) =>
          addToast(response?.data?.message || "Something went wrong", "error"),
      },
    );
  };

  const handelDeleteCategory = (id) => {
    deleteCategory(id, {
      onSuccess: ({ message }) => {
        addToast(message || "Category deleted successfully", "success");
        setDeleteCategory(null);
      },
      onError: ({ response }) =>
        addToast(response?.data?.message || "Something went wrong", "error"),
    });
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category) => {
    setDeleteCategory(category);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">Category Management</h1>
        <p className="text-gray-500">Manage your system categories</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-1"
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="border-main mb-5 border-b p-4">
              <h2 className="text-xl font-semibold">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h2>
            </div>
            <div className="p-4">
              <AnimatePresence mode="wait">
                {isFormOpen ? (
                  <CategoryForm
                    key="form"
                    initialCategory={editingCategory}
                    onSubmit={editingCategory ? handelUpdateCategory : addCategory}
                    onCancel={() => {
                      setIsFormOpen(false);
                      setEditingCategory(null);
                    }}
                  />
                ) : (
                  <motion.div
                    key="button"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <button
                      onClick={() => setIsFormOpen(true)}
                      className="bg-main hover:bg-main/90 flex w-full items-center justify-center rounded-md px-4 py-2 text-white transition-colors"
                    >
                      <i className="fa-solid fa-plus mr-2 text-white"></i>
                      Add New Category
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2"
        >
          <div className="overflow-hidden rounded-lg bg-white shadow-md">
            <div className="border-main border-b p-4">
              <h2 className="text-xl font-semibold">Categories</h2>
            </div>
            <div className="p-4">
              {isDesktop ? (
                <CategoryList
                  categories={categories?.data}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ) : (
                categories?.data.map((category) => (
                  <ResponsiveTable
                    key={category._id}
                    title={category.name?.en}
                    subtitle={`${category.minHours} hours`}
                    actions={
                      <>
                        <button
                          onClick={() => handleEdit(category)}
                          className="rounded-full p-1 text-blue-600 transition-colors hover:bg-blue-100 hover:text-blue-900"
                        >
                          <Edit className="h-5 w-5 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(category)}
                          className="rounded-full p-1 text-red-600 transition-colors hover:bg-red-100 hover:text-red-900"
                        >
                          <Trash2 className="text-main h-5 w-5" />
                        </button>
                      </>
                    }
                  />
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {deletedCategory && (
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
              onClick={() => handelDeleteCategory(deletedCategory._id)}
              className="rounded-md bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </Popup>
      )}
    </div>
  );
}
