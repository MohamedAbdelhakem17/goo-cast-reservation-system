import { motion } from "framer-motion";
import DisplayData from "./_components/display-data";
import CouponForm from "./_components/coupon-form";
import DeleteCouponModal from "./_components/delete-coupon-modal";
import { useCouponManager } from "./_hooks/use-coupon-manager";
import { Popup } from "@/components/common";

export default function CouponManagement() {
  const couponManager = useCouponManager();

  const { handleDeleteConfirm, handleEdit, couponToDelete, deleteDialogOpen } =
    couponManager;

  const slideIn = {
    hidden: { opacity: 0, x: 100 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, x: 100, transition: { duration: 0.2, ease: "easeIn" } },
  };

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

      {/* Form */}
      <CouponForm {...couponManager} />

      {/* Display */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-lg md:p-6">
        <div className="mb-4 border-b border-gray-100 pb-3 md:mb-6">
          <h3 className="text-lg font-semibold md:text-xl">Available Coupons</h3>
          <p className="mt-1 text-xs text-gray-500 md:text-sm">
            Manage your existing discount coupons
          </p>
        </div>

        <DisplayData
          handleDeleteConfirm={handleDeleteConfirm}
          handleEdit={handleEdit}
          couponToDelete={couponToDelete}
        />
      </div>

      {/* Delete Modal */}
      {deleteDialogOpen && (
        <Popup>
          <DeleteCouponModal {...couponManager} />
        </Popup>
      )}
    </motion.div>
  );
}
