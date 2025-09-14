// hooks/useCouponManager.js

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CreateNewCoupon, UpdateCoupon, DeleteCoupon } from "@/apis/coupon/coupon";
import { useToast } from "@/context/Toaster-Context/ToasterContext";

export function useCouponManager() {
  // state
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  //  mutation
  const { mutate: createCoupon, isLoading: isCreating } = CreateNewCoupon();
  const { mutate: updateCoupon, isLoading: isUpdating } = UpdateCoupon();
  const { mutate: deleteCoupon, isLoading: isDeleting } = DeleteCoupon();

  // hooks
  const { addToast } = useToast();

  //  Form and validation
  const initialValues = {
    name: editingCoupon?.name || "",
    code: editingCoupon?.code?.toUpperCase() || "",
    discount: editingCoupon?.discount || "",
    expires_at: editingCoupon?.expires_at?.slice(0, 10) || "",
    max_uses: editingCoupon?.max_uses || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .required("Code name can not be blank")
      .min(3, "Code name must be at least 3 characters"),
    code: Yup.string().required("Code cannot be blank"),
    discount: Yup.number()
      .required("Discount can not be blank")
      .min(1, "Discount must be greater than 0")
      .max(100, "Discount must be at most 100"),
    expires_at: Yup.date().required("Expires at can not be blank"),
    max_uses: Yup.number()
      .required("Max uses can not be blank")
      .min(1, "Max uses must be at least 1"),
  });

  const onSubmit = (values) => {
    if (editingCoupon) {
      handelUpdate(values);
    } else {
      handleAdd(values);
    }
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
    enableReinitialize: true,
  });

  // Functions
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
  };

  const handleCancelEdit = () => {
    setEditingCoupon(null);
    formik.resetForm();
  };

  const handleDeleteConfirm = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleAdd = (values) => {
    createCoupon(values, {
      onSuccess: () => {
        addToast(`Coupon ${values.name} has been created successfully.`, "success");
        formik.resetForm();
      },
      onError: () => {
        addToast("Failed to create coupon. Please try again.", "error");
      },
    });
  };

  const handelUpdate = (values) => {
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
  };

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

  return {
    formik,
    editingCoupon,
    handleEdit,
    handleCancelEdit,
    deleteDialogOpen,
    handleDeleteConfirm,
    handleDelete,
    setDeleteDialogOpen,
    couponToDelete,
    isCreating,
    isUpdating,
    isDeleting,
    setCouponToDelete,
  };
}
