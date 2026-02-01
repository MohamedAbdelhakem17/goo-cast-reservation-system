import { useChangeCouponStatus, useGetAllCoupons } from "@/apis/admin/manage-coupon.api";
import { Loading, RadioButton, ResponsiveTable, Table } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import useDataFormat from "@/hooks/useDateFormat";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";

function CouponActions({ coupon, handleEdit, handleDeleteConfirm, couponToDelete }) {
  const { t } = useLocalization();
  const isDeleting = couponToDelete?._id === coupon._id;

  const { changeStatus, isPending } = useChangeCouponStatus();

  const { addToast } = useToast();
  const queryClient = useQueryClient();
  // function
  const handelUpdateStatus = (value, id) => {
    return new Promise((resolve, reject) => {
      changeStatus(
        { payload: value, id },
        {
          onSuccess: () => {
            addToast(t("change-status-successfully"), "success");
            queryClient.invalidateQueries("addons");
            resolve();
          },
          onError: (error) => {
            const errorMessage =
              error?.response?.data?.message || t("failed-to-change-status");

            addToast(errorMessage, "error");

            reject(error);
          },
        },
      );
    });
  };
  return (
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
        disabled={isDeleting}
      >
        {isDeleting ? (
          <RefreshCw className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </button>

      {/* Change status button */}
      <RadioButton
        initialValue={coupon.isActive}
        isPending={isPending}
        callback={(value) => handelUpdateStatus(value, coupon._id)}
      />
    </div>
  );
}

export default function DisplayData({ handleEdit, handleDeleteConfirm, couponToDelete }) {
  // Localization
  const { t } = useLocalization();
  // query
  const { data, isLoading, error } = useGetAllCoupons();

  // hooks
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // data
  const coupons = data?.data || [];

  // constants
  const TABLE_HEADERS = [
    t("name"),
    t("code"),
    t("discount-0"),
    t("expires-at"),
    t("max-uses"),
    t("count-used"),
    t("priority"),
    t("actions"),
  ];

  // Format date
  const formatDate = useDataFormat();

  // Check expiry
  const isExpired = (dateString) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    return expiryDate < new Date();
  };

  // loading case
  if (isLoading) return <Loading />;

  // Error case
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
        <p className="text-sm">
          {t("error-loading-coupons-please-try-refreshing-the-page")}
        </p>
      </div>
    );
  }

  // Empty case
  if (coupons.length === 0) {
    return (
      <>
        {/* Desktop no data */}
        <div className="hidden md:block">
          <div className="px-6 py-10 text-center text-gray-400">
            {t("no-coupons-found-create-your-first-coupon-above")}
          </div>
        </div>
        {/* Mobile no data */}
        <div className="py-8 text-center text-gray-400 md:hidden">
          <p>{t("no-coupons-found-create-your-first-coupon-above")}</p>
        </div>
      </>
    );
  }

  return isDesktop ? (
    // desktop display
    <Table headers={TABLE_HEADERS}>
      {coupons.map((coupon) => (
        <tr
          key={coupon._id}
          className="hover:bg-gray-50 [&_td]:px-6 [&_td]:py-4 [&_td]:whitespace-nowrap"
        >
          <td className="font-medium">{coupon.name}</td>

          <td>
            <span className="inline-flex items-center rounded-md border border-gray-200 bg-gray-100 px-2 py-1 font-mono text-xs font-medium text-gray-800 uppercase">
              {coupon.code}
            </span>

            {/* auto apply */}
            <div className="mt-1 flex items-center gap-x-2">
              {/* indicator */}
              <span
                className={`size-2 rounded-full ${coupon.autoApply ? "bg-emerald-500" : "bg-gray-300"}`}
              />

              {/* Label */}
              <span
                className={`text-xs font-semibold ${coupon.autoApply ? "text-emerald-500" : "text-gray-400"}`}
              >
                {coupon.autoApply ? t("auto-apply") : t("manual")}
              </span>
            </div>
          </td>
          <td>
            <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              {coupon.discount}%
            </span>
          </td>
          <td>
            {isExpired(coupon.expires_at) ? (
              <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700">
                {t("expired")}
              </span>
            ) : (
              <span>{formatDate(coupon.expires_at)}</span>
            )}
          </td>
          <td>{coupon.max_uses}</td>
          <td>{coupon.times_used}</td>
          <td>{coupon.priority || 0}</td>
          <td>
            <CouponActions
              coupon={coupon}
              handleEdit={handleEdit}
              handleDeleteConfirm={handleDeleteConfirm}
              couponToDelete={couponToDelete}
            />
          </td>
        </tr>
      ))}
    </Table>
  ) : (
    // Mobile display
    <div>
      {coupons.map((coupon) => (
        <ResponsiveTable
          key={coupon._id}
          title={
            <>
              {coupon.name}
              {/* auto apply */}
              <div className="my-1 flex items-center gap-x-2">
                {/* indicator */}
                <span
                  className={`size-1 rounded-full ${coupon.autoApply ? "bg-emerald-500" : "bg-gray-300"}`}
                />

                {/* Label */}
                <span
                  className={`text-xs font-semibold ${coupon.autoApply ? "text-emerald-500" : "text-gray-400"}`}
                >
                  {coupon.autoApply ? t("auto-apply") : t("manual")}
                </span>
              </div>
            </>
          }
          subtitle={coupon.code}
          fields={[
            { label: t("discount"), value: coupon.discount + "%" },
            { label: t("expires"), value: formatDate(coupon.expires_at) },
            { label: t("max-uses"), value: coupon.max_uses },
            { label: t("priority"), value: coupon.priority },
            { label: t("used"), value: coupon.times_used },
          ]}
          actions={
            <CouponActions
              coupon={coupon}
              handleEdit={handleEdit}
              handleDeleteConfirm={handleDeleteConfirm}
              couponToDelete={couponToDelete}
            />
          }
        />
      ))}
    </div>
  );
}
