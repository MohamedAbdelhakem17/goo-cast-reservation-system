import { Loading, Table, ResponsiveTable } from "@/components/common";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { Pencil, RefreshCw, Trash2 } from "lucide-react";
import useDataFormat from "@/hooks/useDateFormat";
import { GetAllCoupons } from "@/apis/coupon/coupon";

function CouponActions({ coupon, handleEdit, handleDeleteConfirm, couponToDelete }) {
  const isDeleting = couponToDelete?._id === coupon._id;

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
    </div>
  );
}

export default function DisplayData({ handleEdit, handleDeleteConfirm, couponToDelete }) {
  // query
  const { data, isLoading, error } = GetAllCoupons();

  // hooks
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // data
  const coupons = data?.data || [];

  // constants
  const TABLE_HEADERS = [
    "NAME",
    "CODE",
    "DISCOUNT",
    "EXPIRES AT",
    "MAX USES",
    "COUNT USED",
    "ACTIONS",
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
        <p className="text-sm">Error loading coupons. Please try refreshing the page.</p>
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
            No coupons found. Create your first coupon above.
          </div>
        </div>
        {/* Mobile no data */}
        <div className="py-8 text-center text-gray-400 md:hidden">
          <p>No coupons found. Create your first coupon above.</p>
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
          title={coupon.name}
          subtitle={coupon.code}
          fields={[
            { label: "Discount", value: coupon.discount + "%" },
            { label: "Expires", value: formatDate(coupon.expires_at) },
            { label: "Max Uses", value: coupon.max_uses },
            { label: "Used", value: coupon.times_used },
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
