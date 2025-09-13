import { useState } from "react";
import { motion } from "framer-motion";
import {  CreateNewCoupon,
  UpdateCoupon,
  DeleteCoupon,
} from "@/apis/coupon/coupon";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import {Input, Button , Popup } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import * as Yup from "yup";
import { useFormik } from "formik";

import DisplayData from "./_components/display-data";



export default function CouponManagement() {
  // state
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);


  // mutation
  const { mutate: createCoupon, isLoading: isCreating } = CreateNewCoupon();
  const { mutate: updateCoupon, isLoading: isUpdating } = UpdateCoupon();
  const { mutate: deleteCoupon, isLoading: isDeleting } = DeleteCoupon();

  // hooks
  const { addToast } = useToast();

  // Handle edit
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    // Reset form with coupon data - formik will handle this with enableReinitialize: true
  };

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingCoupon(null);
    formik.resetForm();
  };

  // Handle delete confirmation
  const handleDeleteConfirm = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  // Handle delete
  const handleDelete = () => {
    if (!couponToDelete) return;

    deleteCoupon(
      { id: couponToDelete._id },
      {
        onSuccess: () => {
          addToast(
            `Coupon ${couponToDelete.name} has been deleted successfully.`,
            "success",
          );
          setCouponToDelete(null);
          setDeleteDialogOpen(false);
        },
        onError: () => {
          addToast("Failed to delete coupon. Please try again.", "error");
          setDeleteDialogOpen(false);
        },
      },
    );
  };



  const slideIn = {
    hidden: {
      opacity: 0,
      x: 100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: 100,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
  };

  // Dynamic initial values based on editing state
  const initialValues = {
    name: editingCoupon?.name || "",
    code: editingCoupon?.code?.toUpperCase() || "",
    discount: editingCoupon?.discount || "",
    expires_at: editingCoupon?.expires_at?.slice(0, 10) || "",
    max_uses: editingCoupon?.max_uses || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string("Code name must be string")
      .required("Code name can not be blank")
      .min(3, "Code name must be at least 3 characters"),
    code: Yup.string().required("Code cannot be blank"),
    discount: Yup.number("Discount must be number")
      .required("Discount can not be blank")
      .min(1, "Discount must be greater than 0")
      .max(100, "Discount must be at most 100"),
    expires_at: Yup.date().required("Expires at can not be blank"),
    max_uses: Yup.number("Max uses must be number")
      .required("Max uses can not be blank")
      .min(1, "Max uses must be at least 1"),
  });

  // Handle create or update
  const onSubmit = (values) => {
    if (editingCoupon) {
      // Update existing coupon
      updateCoupon(
        { id: editingCoupon._id, payload: values },
        {
          onSuccess: () => {
            setEditingCoupon(null);
            addToast(`Coupon ${values.name} has been updated successfully.`, "success");
            formik.resetForm();
          },
          onError: () => {
            addToast("Failed to update coupon. Please try again.", "error");
          },
        },
      );
    } else {
      // Create new coupon
      createCoupon(values, {
        onSuccess: () => {
          addToast(`Coupon ${values.name} has been created successfully.`, "success");
          formik.resetForm();
        },
        onError: () => {
          addToast("Failed to create coupon. Please try again.", "error");
        },
      });
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      className="mx-auto space-y-6 p-4 md:p-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight md:text-3xl">
          Coupon Management
        </h2>
        <p className="mt-1 text-sm text-gray-500 md:text-base">
          Create and manage discount coupons for your customers
        </p>
      </div>

      {/* Create/Edit Coupon Form */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg md:p-6">
        {/* Form Header */}
        <div className="mb-4 border-b border-gray-100 pb-3 md:mb-6">
          {/* label */}
          <h3 className="flex items-center gap-2 text-lg font-semibold md:text-xl">
            {editingCoupon ? (
              <>
                <Pencil className="h-4 w-4 text-amber-500 md:h-5 md:w-5" />
                Edit Coupon
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 text-emerald-500 md:h-5 md:w-5" />
                Create New Coupon
              </>
            )}
          </h3>

          {/* description */}
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            {editingCoupon
              ? `Editing coupon: ${editingCoupon.name}`
              : "Fill in the details to create a new discount coupon"}
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-1 md:space-y-3">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {/* Coupon Name */}
            <div className="space-y-2">
              <Input
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Summer Sale"
                label="Coupon Name"
                errors={formik.errors.name}
                touched={formik.touched.name}
              />
            </div>

            {/* Coupon Code */}
            <div className="space-y-2">
              <Input
                id="code"
                name="code"
                value={formik.values.code}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="SUMMER20"
                label="Coupon Code"
                errors={formik.errors.code}
                touched={formik.touched.code}
              />
            </div>

            {/* Discount */}
            <div className="space-y-2">
              <Input
                id="discount"
                name="discount"
                value={formik.values.discount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="20"
                type="number"
                label="Discount (%)"
                errors={formik.errors.discount}
                touched={formik.touched.discount}
              />
            </div>

            {/* Expiry Date */}
            <div className="space-y-2">
              <Input
                id="expires_at"
                name="expires_at"
                value={formik.values.expires_at}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                type="date"
                label="Expiry Date"
                errors={formik.errors.expires_at}
                touched={formik.touched.expires_at}
              />
            </div>

            {/* Max Uses */}
            <div className="space-y-2 sm:col-span-2 lg:col-span-1">
              <Input
                id="max_uses"
                name="max_uses"
                value={formik.values.max_uses}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="100"
                type="number"
                label="Max Uses"
                errors={formik.errors.max_uses}
                touched={formik.touched.max_uses}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center">
            <Button
              type="submit"
              disabled={isCreating || isUpdating}
              isPending={isCreating || isUpdating}
              fallback="processing..."
            >
              {editingCoupon ? "Update Coupon" : "Create Coupon"}
            </Button>

            {editingCoupon && (
              <button
                type="button"
                className="mt-6 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2.5 text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none"
                onClick={handleCancelEdit}
              >
                <X className="mr-2 h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Coupon List */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg md:p-6">
        {/* Header */}
        <div className="mb-4 border-b border-gray-100 pb-3 md:mb-6">
          <h3 className="text-lg font-semibold md:text-xl">Available Coupons</h3>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Manage your existing discount coupons
          </p>
        </div>

<DisplayData handleDeleteConfirm={handleDeleteConfirm} handleEdit={handleEdit} couponToDelete ={couponToDelete}/>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <Popup>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Are you sure?
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Do you really want to delete the coupon{" "}
                    <strong>{couponToDelete?.name}</strong>? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
            <button
              type="button"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCouponToDelete(null);
              }}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </Popup>
      )}
    </motion.div>
  );
}
