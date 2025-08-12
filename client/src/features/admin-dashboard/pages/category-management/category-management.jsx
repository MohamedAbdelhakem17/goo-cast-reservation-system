import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GetAllCategories, CreateCategory, DeleteCategory, UpdateCategory } from "@/apis/services/services.api"
import { useToast } from "@/context/Toaster-Context/ToasterContext"
import {Popup , Loading} from "@/components/common"
import { CategoryList, CategoryForm } from "./_components"

export default function CategoryManagement() {
  const { addToast } = useToast()
  const { data: categories, isLoading } = GetAllCategories()
  const { mutate: createCategory } = CreateCategory()
  const { mutate: deleteCategory } = DeleteCategory()
  const { mutate: updateCategory } = UpdateCategory()

  const [editingCategory, setEditingCategory] = useState(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deletedCategory, setDeleteCategory] = useState(false)

  const addCategory = (category) => {
    createCategory(category, {
      onSuccess: (res) => {
        addToast(res?.message || "Category added successfully", "success");
        setIsFormOpen(false);
      },
      onError: (err) =>
        addToast(
          err?.response?.data?.message || "Failed to add category",
          "error"
        ),
    });
  };

  const handelUpdateCategory = (updatedCategory) => {
    updateCategory({ id: updatedCategory._id, payload: updatedCategory }, {
      onSuccess: ({ message }) => {
        addToast(message || "Category updated successfully", "success"), setEditingCategory(null)
      },
      onError: ({ response }) => addToast(response?.data?.message || "Something went wrong", "error"),
    })
  }

  const handelDeleteCategory = (id) => {
    deleteCategory({ id }, {
      onSuccess: ({ message }) => {
        addToast(message || "Category deleted successfully", "success"); setDeleteCategory(null)
      },
      onError: ({ response }) => addToast(response?.data?.message || "Something went wrong", "error"),
    })
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    setIsFormOpen(true)
  }

  const handleDelete = (category) => {
    setDeleteCategory(category)
  }

  if (isLoading) return <Loading/>

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Category Management</h1>
        <p className="text-gray-500">Manage your system categories</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }} className="md:col-span-1">
          <div className="bg-white  rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-main  mb-5">
              <h2 className="text-xl font-semibold">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
            </div>
            <div className="p-4">
              <AnimatePresence mode="wait">
                {isFormOpen ? (
                  <CategoryForm key="form" initialCategory={editingCategory} onSubmit={editingCategory ? handelUpdateCategory
                    : addCategory} onCancel={() => {
                      setIsFormOpen(false)
                      setEditingCategory(null)
                    }}
                  />
                ) : (
                  <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button onClick={() => setIsFormOpen(true)}
                      className="w-full bg-main hover:bg-main/90 text-white py-2 px-4 rounded-md transition-colors flex
                  items-center justify-center"
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

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }} className="md:col-span-2">
          <div className="bg-white  rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-main">
              <h2 className="text-xl font-semibold">Categories</h2>
            </div>
            <div className="p-4">
              <CategoryList categories={categories?.data} onEdit={handleEdit} onDelete={handleDelete} />
            </div>
          </div>
        </motion.div>
      </div>

      {
        deletedCategory && <Popup>
          <h2 className="text-lg font-semibold mb-4">Delete Category</h2>
          <p className="mb-4">Are you sure you want to delete this category?</p>
          <span
            className="font-semibold bg-main/70 rounded-full py-1 px-4 text-white block w-fit mx-auto my-4 ">{deletedCategory?.name}</span>
          <div className="flex justify-end">
            <button onClick={() => setDeleteCategory(null)}
              className="mr-2 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button onClick={() => handelDeleteCategory(deletedCategory._id)}
              className="px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </button>
          </div>
        </Popup>
      }
    </div>
  )
}