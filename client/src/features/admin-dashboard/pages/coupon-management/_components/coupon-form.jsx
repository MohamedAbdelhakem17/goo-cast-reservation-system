import React from "react";
import { useCouponManager } from "../_hooks/use-coupon-manager";
import { Pencil, X, Plus } from "lucide-react";
import { Button, Input } from "@/components/common";

export default function CouponForm({
  editingCoupon,
  formik,
  isCreating,
  isUpdating,
  handleCancelEdit,
}) {
  return (
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
  );
}
