import { useState } from "react";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import {
  useCreateNewCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from "@/apis/admin/manage-coupon.api";

export function useCouponManager() {
  // state
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  //  mutation
  const { createCoupon, isLoading: isCreating } = useCreateNewCoupon();
  const { editCoupon: updateCoupon, isLoading: isUpdating } = useUpdateCoupon();
  const { deleteCoupon, isLoading: isDeleting } = useDeleteCoupon();

  // hooks
  const { addToast } = useToast();

  const onSubmit = (values, callback) => {
    if (editingCoupon) {
      handelUpdate(values, callback);
    } else {
      handleAdd(values, callback);
    }
  };

  // Functions
  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
  };

  const handleCancelEdit = (callback) => {
    setEditingCoupon(null);
    callback();
  };

  const handleDeleteConfirm = (coupon) => {
    setCouponToDelete(coupon);
    setDeleteDialogOpen(true);
  };

  const handleAdd = (values, callback) => {
    createCoupon(values, {
      onSuccess: () => {
        addToast(`Coupon ${values.name} has been created successfully.`, "success");
        callback();
      },
      onError: () => {
        addToast("Failed to create coupon. Please try again.", "error");
      },
    });
  };

  const handelUpdate = (values, callback) => {
    updateCoupon(
      { id: editingCoupon._id, payload: values },
      {
        onSuccess: () => {
          setEditingCoupon(null);
          addToast(`Coupon ${values.name} has been updated successfully.`, "success");
          callback();
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
    onSubmit,
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
