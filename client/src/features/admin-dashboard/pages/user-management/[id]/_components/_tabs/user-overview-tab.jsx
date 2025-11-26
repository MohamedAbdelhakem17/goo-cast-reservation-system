import useLocalization from "@/context/localization-provider/localization-context";
import useDateFormat from "@/hooks/useDateFormat";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Mail, Phone, User } from "lucide-react";

export default function UserOverviewTab({ user, setActiveTab }) {
  // Translation
  const { t } = useLocalization();

  // Hooks
  const dateFormat = useDateFormat();
  const priceFormat = usePriceFormat();

  // Handle Booking Click
  const onBookingClick = (booking) => {
    setActiveTab("booking");
  };

  // Stats variables
  const stats = [
    {
      label: t("total-bookings") || "Total Bookings",
      value: user.totalBookingTimes ?? 0,
    },
    {
      label: t("total-spent") || "Total Spent",
      value: priceFormat(user.totalSpent ?? 0),
    },
    {
      label: t("last-booking") || "Last Booking",
      value: user.lastBookingTime
        ? dateFormat(user.lastBookingTime)
        : t("no-booking") || "No Booking",
    },
  ];

  return (
    <div className="container mx-auto grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Stats */}
      {stats.map(({ label, value }, index) => (
        <div
          key={index}
          className="col-span-full rounded-lg border border-gray-200 bg-white p-5 shadow-sm md:col-span-1"
        >
          <p className="mb-2 text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      ))}

      {/* Contact Info */}
      <div className="col-span-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-5 text-lg font-medium text-gray-800">
          {t("contact-info") || "Contact Information"}
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="mt-1 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">{t("email") || "Email"}</p>
              <p className="mt-1 text-sm break-words text-gray-900">
                {user.email || t("no-email") || "—"}
              </p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start gap-3">
            <Phone className="mt-1 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">{t("phone") || "Phone"}</p>
              <p className="mt-1 text-sm text-gray-900">
                {user.phone || t("no-phone") || "—"}
              </p>
            </div>
          </div>

          {/* Account Owner */}
          <div className="flex items-start gap-3">
            <User className="mt-1 h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">
                {t("account-owner") || "Account Owner"}
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-red-600 text-xs font-semibold text-white">
                  {user?.avatar ? user.avatar : "NA"}
                </span>
                <span className="text-sm text-gray-900">{user.name || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Next Booking */}
      {user.nextBooking && (
        <div className="col-span-full rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-800">
              {t("next-booking") || "Next Booking"}
            </h3>
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => setActiveTab("booking")}
            >
              {t("view-all") || "View All"}
            </button>
          </div>

          <div
            className="flex cursor-pointer items-center justify-between rounded-lg bg-gray-50 p-4 hover:bg-gray-100"
            onClick={() => onBookingClick(user.nextBooking)}
          >
            <div className="my-2">
              <p className="text-sm font-medium text-gray-900">
                #{user.nextBooking._id?.slice(0, 5)} •{" "}
                {user.nextBooking?.package?.name?.en || "Package"} • {user.name || "User"}
              </p>
              <p className="text-sm text-gray-500">
                {dateFormat(user.nextBooking.date)} •{" "}
                {user.nextBooking.studio?.name?.en || "Unknown Studio"}
              </p>
            </div>

            <div className="my-2 text-end">
              <span className="bg-main m-0 flex items-center justify-center rounded-full px-4 py-1 text-sm text-white">
                {user.nextBooking.status}
              </span>
              <p className="mt-1 text-sm text-gray-600">
                {priceFormat(user.nextBooking.totalPrice)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
