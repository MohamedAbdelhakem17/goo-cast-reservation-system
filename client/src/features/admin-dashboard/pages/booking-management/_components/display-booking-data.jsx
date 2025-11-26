import { useChangeBookingStatus } from "@/apis/admin/manage-booking.api";
import { Loading, Popup, ResponsiveTable, Table } from "@/components/common";
import useLocalization from "@/context/localization-provider/localization-context";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import useDataFormat from "@/hooks/useDateFormat";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import usePriceFormat from "@/hooks/usePriceFormat";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Expand, SquarePen } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

// 🔹 Available Status Options
const COLUMNS = [
  { id: "new", label: "New" },
  { id: "paid", label: "Paid" },
  { id: "completed", label: "Completed" },
  { id: "canceled", label: "Canceled" },
];

// 🔹 Actions component
function BookingAction({ setConfirmPopup, setSelectedBooking, booking, t, isDesktop }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="relative flex flex-wrap items-center gap-2">
      {/* 🟦 Show Details */}
      <button
        onClick={() => setSelectedBooking(booking)}
        className="flex items-center justify-center rounded-lg p-2 text-blue-600 hover:bg-blue-50 md:p-0 md:hover:bg-transparent"
      >
        {isDesktop ? t("show-info") : <Expand size={18} />}
      </button>

      {/* 🟨 Edit Booking */}
      <Link
        to={`add?edit=${booking._id}`}
        className="flex items-center justify-center rounded-lg p-2 text-sky-700 hover:bg-sky-50 md:p-0 md:hover:bg-transparent"
      >
        {isDesktop ? t("edit-booking") : <SquarePen size={18} />}
      </Link>

      {/* 🟥 Change Status Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="text-main hover:bg-main/10 flex items-center gap-1 rounded-lg p-2 md:p-0 md:hover:bg-transparent"
        >
          {isDesktop ? t("change-status") : <ChevronDown size={18} />}
        </button>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="absolute right-0 z-20 mt-1 w-40 rounded-lg border border-gray-200 bg-white shadow-md"
            >
              {COLUMNS.map((status) => (
                <li key={status.id}>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      setConfirmPopup({ status: status.id, booking });
                    }}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <span>{t(status.label.toLowerCase())}</span>
                    {booking.status === status.id && (
                      <Check size={14} className="text-green-600" />
                    )}
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
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

  if (isLoading) return <Loading />;
  if (error)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
        <p className="text-sm">
          {t("error-loading-bookings-please-try-refreshing-the-page")}
        </p>
      </div>
    );
  if (!bookingsData?.length)
    return (
      <div className="py-10 text-center text-gray-400">
        {t("no-booking-found-wait-the-first-booking")}
      </div>
    );

  return (
    <>
      <AnimatePresence mode="wait">
        {isDesktop ? (
          <motion.div
            key="desktop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-4"
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
                      {booking.personalInfo?.fullName}
                    </div>
                    <div className="text-sm break-words text-gray-500">
                      {booking.personalInfo?.email}
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
                    <span className="inline-flex rounded-full bg-gray-100 px-2 text-xs font-semibold text-gray-700">
                      {booking.status?.replace("-", " ")}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <BookingAction
                      setSelectedBooking={setSelectedBooking}
                      setConfirmPopup={setConfirmPopup}
                      booking={booking}
                      t={t}
                      isDesktop={isDesktop}
                    />
                  </td>
                </motion.tr>
              ))}
            </Table>
          </motion.div>
        ) : (
          // 📱 Mobile
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
                    value: `${convertTo12HourFormat(booking.startSlot)} - ${convertTo12HourFormat(
                      booking.endSlot,
                    )}`,
                  },
                  { label: t("duration"), value: `${booking.duration} ${t("hour-s")}` },
                  { label: t("user-name"), value: booking.personalInfo?.fullName },
                  { label: t("user-email"), value: booking.personalInfo?.email },
                ]}
                actions={
                  <BookingAction
                    setSelectedBooking={setSelectedBooking}
                    setConfirmPopup={setConfirmPopup}
                    booking={booking}
                    t={t}
                    isDesktop={isDesktop}
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
                  confirmPopup.status === "completed"
                    ? "text-green-600"
                    : confirmPopup.status === "canceled"
                      ? "text-red-600"
                      : "text-main"
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
                {convertTo12HourFormat(confirmPopup.booking.startSlot)} -{" "}
                {convertTo12HourFormat(confirmPopup.booking.endSlot)}
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
                  confirmPopup.status === "completed"
                    ? "bg-green-600 hover:bg-green-700"
                    : confirmPopup.status === "canceled"
                      ? "bg-red-600 hover:bg-red-700"
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
