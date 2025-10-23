import { useState } from "react";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import {
  useCreateNewCoupon,
  useDeleteCoupon,
  useUpdateCoupon,
} from "@/apis/admin/manage-coupon.api";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

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
        queryClient.refetchQueries("coupon");
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
          addToast(`Coupon ${values.name} has been updated successfully.`, "success");
          queryClient.refetchQueries("coupon");
          setEditingCoupon(null);
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

    deleteCoupon(couponToDelete._id, {
      onSuccess: () => {
        addToast(
          `Coupon ${couponToDelete.name} has been deleted successfully.`,
          "success",
        );
        queryClient.refetchQueries("coupon");
        setCouponToDelete(null);
        setDeleteDialogOpen(false);
      },
      onError: () => {
        addToast("Failed to delete coupon. Please try again.", "error");
        setDeleteDialogOpen(false);
      },
    });
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
