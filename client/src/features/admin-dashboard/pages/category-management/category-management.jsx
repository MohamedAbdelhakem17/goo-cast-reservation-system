import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { Loading, ResponsiveTable } from "@/components/common";
import { CategoryList, CategoryForm, CategoryDeleteModel } from "./_components";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Edit, Trash2 } from "lucide-react";
import {
  useGetAllCategories,
  useCreateCategory,
  useUpdateCategory,
} from "@/apis/admin/manage-category.api";
import { useQueryClient } from "@tanstack/react-query";
import useLocalization from "@/context/localization-provider/localization-context";

export default function CategoryManagement() {
  // Localization
  const { t, lng } = useLocalization();

  // State
  const [editingCategory, setEditingCategory] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deletedCategory, setDeleteCategory] = useState(false);

  // Query
  const { categories, isLoading } = useGetAllCategories();

  // Mutation
  const { createCategory } = useCreateCategory();
  const { editCategory } = useUpdateCategory();

  // Hooks
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Functions
  const addCategory = (category) => {
    createCategory(category, {
      onSuccess: (res) => {
        addToast(res?.message || t("category-added-successfully"), "success");
        setIsFormOpen(false);
        queryClient.refetchQueries("categories");
      },
      onError: (err) =>
        addToast(err?.response?.data?.message || t("failed-to-add-category"), "error"),
    });
  };

  const handelUpdateCategory = (updatedCategory) => {
    editCategory(
      { id: updatedCategory._id, payload: updatedCategory },
      {
        onSuccess: ({ message }) => {
          (addToast(message || t("category-updated-successfully"), "success"),
            setEditingCategory(null));
          queryClient.refetchQueries("categories");
        },
        onError: ({ response }) =>
          addToast(response?.data?.message || t("something-went-wrong"), "error"),
      },
    );
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsFormOpen(true);
  };

  const handleDelete = (category) => {
    setDeleteCategory(category);
  };

  // Loading state
  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="mb-2 text-3xl font-bold">{t("category-management")}</h1>
        <p className="text-gray-500">{t("manage-your-system-categories")}</p>
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
                {editingCategory ? t("edit-category") : t("add-new-category")}
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
                      {t("add-new-category")}
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
              <h2 className="text-xl font-semibold">{t("categories")}</h2>
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
        <CategoryDeleteModel
          setDeleteCategory={setDeleteCategory}
          deletedCategory={deletedCategory}
        />
      )}
    </div>
  );
}
