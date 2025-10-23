import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Popup, Loading, Table, ResponsiveTable } from "@/components/common";
import useDataFormat from "@/hooks/useDateFormat";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useChangeBookingStatus } from "@/apis/admin/manage-booking.api";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CheckCheck, Expand, SquarePen, X } from "lucide-react";
import useLocalization from "@/context/localization-provider/localization-context";
import usePriceFormat from "@/hooks/usePriceFormat";
import { Link } from "react-router-dom";

// 🔹 Actions component
function BookingAction({
  isPending,
  setConfirmPopup,
  isDesktop,
  setSelectedBooking,
  booking,
  t,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {isPending && (
        <>
          <button
            onClick={() => setConfirmPopup({ status: "approved", booking })}
            className="flex items-center justify-center rounded-lg p-2 text-green-600 hover:bg-green-50 md:p-0 md:hover:bg-transparent"
          >
            {isDesktop ? t("approve") : <CheckCheck size={18} />}
          </button>

          <button
            onClick={() => setConfirmPopup({ status: "rejected", booking })}
            className="flex items-center justify-center rounded-lg p-2 text-red-600 hover:bg-red-50 md:p-0 md:hover:bg-transparent"
          >
            {isDesktop ? t("reject") : <X size={18} />}
          </button>

          <Link
            to={`add?edit=${booking._id}`}
            className="flex items-center justify-center rounded-lg p-2 text-sky-700 hover:bg-sky-50 md:p-0 md:hover:bg-transparent"
          >
            {isDesktop ? t("edit-booking") : <SquarePen size={18} />}
          </Link>
        </>
      )}

      <button
        onClick={() => setSelectedBooking(booking)}
        className="flex items-center justify-center rounded-lg p-2 text-blue-600 hover:bg-blue-50 md:p-0 md:hover:bg-transparent"
      >
        {isDesktop ? t("show-info") : <Expand size={18} />}
      </button>
    </div>
  );
}

// 🔹 Main component
export default function DisplayBookingData({
  bookingsData,
  isLoading,
  error,
  setSelectedBooking,
}) {
  const { t, lng } = useLocalization();
  const formatDate = useDataFormat();
  const formatPrice = usePriceFormat();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const convertTo12HourFormat = (time) => {
    if (!time) return "";
    const [hour, minute] = time.split(":");
    const h = parseInt(hour);
    const hour12 = h % 12 || 12;
    const amPm = h < 12 ? "AM" : "PM";
    return `${hour12}:${minute} ${amPm}`;
  };

  const { changeStatus, isPending } = useChangeBookingStatus();
  const { addToast } = useToast();
  const [confirmPopup, setConfirmPopup] = useState(null);
  const queryClient = useQueryClient();

  const handleStatusChange = () => {
    changeStatus(
      { id: confirmPopup.booking._id, status: confirmPopup.status },
      {
        onSuccess: ({ message }) => {
          addToast(message || t("status-changed-successfully"), "success");
          queryClient.invalidateQueries({ queryKey: ["get-bookings"] });
        },
        onError: ({ response }) =>
          addToast(response?.data?.message || t("something-went-wrong"), "error"),
        onSettled: () => setConfirmPopup(null),
      },
    );
  };

  const TABLE_HEADERS = [
    t("personal-info"),
    t("studio-0"),
    t("date"),
    t("duration"),
    t("total-price"),
    t("status"),
    t("actions"),
  ];

  // 🔹 Loading state
  if (isLoading) return <Loading />;

  // 🔹 Error state
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
        <p className="text-sm">
          {t("error-loading-bookings-please-try-refreshing-the-page")}
        </p>
      </div>
    );
  }

  // 🔹 Empty state
  if (!bookingsData || bookingsData.length === 0) {
    return (
      <div className="py-10 text-center text-gray-400">
        {t("no-booking-found-wait-the-first-booking")}
      </div>
    );
  }

  // 🔹 Data display
  return (
    <>
      <AnimatePresence mode="wait">
        {isDesktop ? (
          // 💻 Desktop Table
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Table headers={TABLE_HEADERS}>
              {bookingsData.map((booking) => (
                <motion.tr
                  key={booking._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="transition-all hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {booking.personalInfo.fullName}
                    </div>
                    <div className="text-sm break-words text-gray-500">
                      {booking.personalInfo.email}
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        booking.isGuest ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {booking.isGuest ? t("guest") : t("member")}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {booking?.studio?.name?.[lng] || t("studio-name")}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(booking.date)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {convertTo12HourFormat(booking.startSlot)} -{" "}
                      {convertTo12HourFormat(booking.endSlot)}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-900">
                    {booking.duration} {t("hour-s")}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                    {formatPrice(booking.totalPriceAfterDiscount || booking.totalPrice)}
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                        booking.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "rejected"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <BookingAction
                      setSelectedBooking={setSelectedBooking}
                      isDesktop={isDesktop}
                      setConfirmPopup={setConfirmPopup}
                      isPending={booking.status === "pending"}
                      booking={booking}
                      t={t}
                    />
                  </td>
                </motion.tr>
              ))}
            </Table>
          </motion.div>
        ) : (
          // 📱 Mobile Responsive View
          <motion.div
            key="mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {bookingsData.map((booking) => (
              <ResponsiveTable
                key={booking._id}
                title={`${booking?.studio?.name?.[lng] || t("studio-name")} booking`}
                subtitle={booking.status}
                fields={[
                  {
                    label: t("price"),
                    value: formatPrice(
                      booking.totalPriceAfterDiscount || booking.totalPrice,
                    ),
                  },
                  { label: t("date-0"), value: formatDate(booking.date) },
                  {
                    label: t("time"),
                    value: `${convertTo12HourFormat(booking.startSlot)} - ${convertTo12HourFormat(booking.endSlot)}`,
                  },
                  { label: t("duration"), value: `${booking.duration} ${t("hour-s")}` },
                  { label: t("user-name"), value: booking.personalInfo.fullName },
                  { label: t("user-email"), value: booking.personalInfo.email },
                ]}
                actions={
                  <BookingAction
                    setSelectedBooking={setSelectedBooking}
                    isDesktop={isDesktop}
                    setConfirmPopup={setConfirmPopup}
                    isPending={booking.status === "pending"}
                    booking={booking}
                    t={t}
                  />
                }
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔹 Confirm Popup */}
      <AnimatePresence mode="wait">
        {confirmPopup && (
          <Popup className="mx-auto w-full max-w-md p-4 md:max-w-lg">
            <h3 className="mb-4 text-lg font-semibold">{t("confirm-change-status")}</h3>
            <p className="mb-2">
              {t("are-you-sure-you-want-to")}
              <span
                className={`font-bold ${
                  confirmPopup.status === "approved" ? "text-green-600" : "text-main"
                } mx-1`}
              >
                {confirmPopup.status}
              </span>
              {t("this-booking")}
            </p>
            <ul className="mb-4 list-inside list-disc space-y-1 text-sm text-gray-700">
              <li>
                <strong>{t("studio")}:</strong>{" "}
                {confirmPopup.booking?.studio?.name?.[lng]}
              </li>
              <li>
                <strong>{t("date-0")}:</strong> {formatDate(confirmPopup.booking.date)}
              </li>
              <li>
                <strong>{t("time")}:</strong>{" "}
                {convertTo12HourFormat(confirmPopup.booking.startSlot)}
              </li>
              <li>
                <strong>{t("duration")}:</strong> {confirmPopup.booking.duration}{" "}
                {t("hour-s")}
              </li>
            </ul>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmPopup(null)}
                className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleStatusChange}
                disabled={isPending}
                className={`cursor-pointer rounded-lg px-4 py-2 text-white transition-colors ${
                  confirmPopup.status === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-main/90 hover:bg-main"
                }`}
              >
                {isPending ? t("loading") : t("confirm")}
              </button>
            </div>
          </Popup>
        )}
      </AnimatePresence>
    </>
  );
}
