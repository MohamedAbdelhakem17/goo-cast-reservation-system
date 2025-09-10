import { useState } from "react";
import { motion } from "framer-motion";
import {
  GetAllCoupons,
  CreateNewCoupon,
  UpdateCoupon,
  DeleteCoupon,
} from "@/apis/coupon/coupon";
import { Pencil, Trash2, Plus, X, RefreshCw } from "lucide-react";
import { Loading, Input, Table, Button } from "@/components/common";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import * as Yup from "yup";
import { useFormik } from "formik";
import useDataFormat from "@/hooks/useDateFormat";
import Popup from "@/components/common/popup";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const TABLE_HEADERS = [
  "NAME",
  "CODE",
  "DISCOUNT",
  "EXPIRES AT",
  "MAX USES",
  "COUNT USED",
  "ACTIONS",
];

export default function CouponManagement() {
  // state
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState(null);

  // query
  const { data, isLoading, error } = GetAllCoupons();

  // mutation
  const { mutate: createCoupon, isLoading: isCreating } = CreateNewCoupon();
  const { mutate: updateCoupon, isLoading: isUpdating } = UpdateCoupon();
  const { mutate: deleteCoupon, isLoading: isDeleting } = DeleteCoupon();

  // hooks
  const { addToast } = useToast();
  const isDesktop = useMediaQuery("(min-width: 768px)");

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

  // Format date for display
  const formatDate = useDataFormat();

  // Check if coupon is expired
  const isExpired = (dateString) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    return expiryDate < new Date();
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
        {isLoading ? (
          // loading state
          <Loading />
        ) : error ? (
          // error state
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
            <p className="text-sm">
              Error loading coupons. Please try refreshing the page.
            </p>
          </div>
        ) : (
          <div>
            {/* case: no data */}
            {data?.data?.length === 0 ? (
              <>
                {/* Desktop no data */}
                <div className="hidden md:block">
                  <div className="px-6 py-10 text-center text-gray-400">
                    No coupons found. Create your first coupon above.
                  </div>
                </div>
                {/* Mobile no data */}
                <div className="py-8 text-center text-gray-400 md:hidden">
                  <p>No coupons found. Create your first coupon above.</p>
                </div>
              </>
            ) : isDesktop ? (
              // ================= DESKTOP TABLE =================
              <Table headers={TABLE_HEADERS}>
                {data?.data?.map((coupon) => (
                  <tr
                    key={coupon._id}
                    className="hover:bg-gray-50 [&_td]:px-6 [&_td]:py-4 [&_td]:whitespace-nowrap"
                  >
                    <td className="font-medium">{coupon.name}</td>
                    <td>
                      <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-800 uppercase">
                        {coupon.code}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                        {coupon.discount}%
                      </span>
                    </td>
                    <td>
                      {isExpired(coupon.expires_at) ? (
                        <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                          Expired
                        </span>
                      ) : (
                        <span>{formatDate(coupon.expires_at)}</span>
                      )}
                    </td>
                    <td>{coupon.max_uses}</td>
                    <td>{coupon.times_used}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="rounded-full p-2 text-amber-600 hover:bg-amber-50 hover:text-amber-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(coupon)}
                          className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                          disabled={couponToDelete?._id === coupon._id}
                        >
                          {couponToDelete?._id === coupon._id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Table>
            ) : (
              // ================= MOBILE CARDS =================
              <div>
                {data?.data?.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="my-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">{coupon.name}</h4>
                        <span className="mt-1 inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-800 uppercase">
                          {coupon.code}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(coupon)}
                          className="rounded-full p-2 text-amber-600 hover:bg-amber-50 hover:text-amber-900"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(coupon)}
                          className="rounded-full p-2 text-red-600 hover:bg-red-50 hover:text-red-900"
                          disabled={couponToDelete?._id === coupon._id}
                        >
                          {couponToDelete?._id === coupon._id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="block text-gray-500">Discount</span>
                        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                          {coupon.discount}%
                        </span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Expires</span>
                        {isExpired(coupon.expires_at) ? (
                          <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                            Expired
                          </span>
                        ) : (
                          <span className="text-gray-900">
                            {formatDate(coupon.expires_at)}
                          </span>
                        )}
                      </div>
                      <div>
                        <span className="block text-gray-500">Max Uses</span>
                        <span className="text-gray-900">{coupon.max_uses}</span>
                      </div>
                      <div>
                        <span className="block text-gray-500">Used</span>
                        <span className="text-gray-900">{coupon.times_used}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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
