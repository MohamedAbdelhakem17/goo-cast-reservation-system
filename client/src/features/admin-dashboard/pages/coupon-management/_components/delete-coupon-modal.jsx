import React from "react";
import { Trash2 } from "lucide-react";
import useLocalization from "@/context/localization-provider/localization-context";

export default function DeleteCouponModal({
  couponToDelete,
  handleDelete,
  isDeleting,
  setDeleteDialogOpen,
  setCouponToDelete,
}) {
  const { t } = useLocalization();
  return (
    <>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        {/* Header */}
        <div className="space-x-2.5 sm:flex sm:items-start">
          {/* Icon */}
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center gap-x-2 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>

          {/* accept deleting */}
          <div className="mx-2 mt-3 text-center sm:mt-0 sm:ml-4 sm:text-start">
            {/* question */}
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {t("are-you-sure")}
            </h3>

            {/* info */}
            <div className="mt-2">
              <p
                className="text-sm text-gray-500"
                dangerouslySetInnerHTML={{
                  __html: t("delete-coupon-confirm", { name: couponToDelete?.name }),
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="gap-x-3.5 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
        {/* Complete delete action */}
        <button
          type="button"
          onClick={handleDelete}
          className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
          disabled={isDeleting}
        >
          {isDeleting ? t("deleting") : t("delete")}
        </button>

        {/* Cancel Deleting */}
        <button
          type="button"
          onClick={() => {
            setDeleteDialogOpen(false);
            setCouponToDelete(null);
          }}
          className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm"
        >
          {t("cancel")}
        </button>
      </div>
    </>
  );
}
