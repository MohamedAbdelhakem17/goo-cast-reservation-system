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

function BookingAction({
  isPending,
  setConfirmPopup,
  isDesktop,
  setSelectedBooking,
  booking,
  t,
}) {
  return (
    <div className="flex items-center gap-x-2.5">
      {isPending && (
        <>
          <button
            onClick={() => setConfirmPopup({ status: "approved", booking })}
            className="text-sm text-green-600 hover:text-green-900 disabled:opacity-50"
          >
            {isDesktop ? t("approve") : <CheckCheck />}
          </button>

          <button
            onClick={() => setConfirmPopup({ status: "rejected", booking })}
            className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
          >
            {isDesktop ? t("reject") : <X />}
          </button>

          <Link
            to={`add?edit=${booking._id}`}
            className="text-sm text-sky-900 hover:text-sky-500 disabled:opacity-50"
          >
            {isDesktop ? t("edit-booking") : <SquarePen />}
          </Link>
        </>
      )}

      <button
        onClick={() => setSelectedBooking(booking)}
        className="text-sm text-blue-600 hover:text-blue-900 disabled:opacity-50"
      >
        {isDesktop ? t("show-info") : <Expand />}
      </button>
    </div>
  );
}

export default function DisplayBookingData({
  bookingsData,
  isLoading,
  error,
  setSelectedBooking,
}) {
  const { t, lng } = useLocalization();

  const formatDate = useDataFormat();
  const formatPrice = usePriceFormat();

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":");
    const hour12 = hour % 12 || 12;
    const amPm = hour < 12 ? "AM" : "PM";
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

        onSettled: () => {
          setConfirmPopup(null);
        },
      },
    );
  };

  // hooks
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // variables
  const TABLE_HEADERS = [
    t("personal-info"),
    t("studio-0"),
    t("date"),
    t("duration"),
    t("total-price"),
    t("status"),
    t("actions"),
  ];

  // loading case
  if (isLoading) return <Loading />;

  // Error case
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
        <p className="text-sm">
          {t("error-loading-bookings-please-try-refreshing-the-page")}
        </p>
      </div>
    );
  }

  // Empty case
  if (bookingsData.length === 0) {
    return (
      <>
        {/* Desktop no data */}
        <div className="hidden md:block">
          <div className="px-6 py-10 text-center text-gray-400">
            {t("no-booking-found-wait-the-first-booking")}
          </div>
        </div>
        {/* Mobile no data */}
        <div className="py-8 text-center text-gray-400 md:hidden">
          <p>{t("no-booking-found-wait-the-first-booking")}</p>
        </div>
      </>
    );
  }

  return (
    <>
      {isDesktop ? (
        // Desktop display
        <Table headers={TABLE_HEADERS}>
          {bookingsData.map((booking) => (
            <motion.tr
              key={booking._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="hover:bg-gray-50"
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.personalInfo.fullName}
                </div>
                <div className="text-sm text-gray-500">{booking.personalInfo.email}</div>
                <div
                  className={`text-sm font-bold text-gray-500 ${booking.isGuest ? "text-red-600" : "text-green-600"}`}
                >
                  {booking.isGuest ? t("guest") : t("member")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="cursor-pointer text-sm font-medium text-gray-900">
                  {booking?.studio?.name?.[lng] || t("studio-name")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(booking.date)}</div>
                <div className="text-sm text-gray-500">
                  {convertTo12HourFormat(booking?.timeSlot || booking?.startSlot)} -
                  {convertTo12HourFormat(booking?.timeSlot || booking?.endSlot)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {booking.duration} {t("hour-s")}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {formatPrice(booking.totalPriceAfterDiscount || booking.totalPrice)}
                </div>
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
              <td className="text-md space-x-2 px-6 py-4 font-bold whitespace-nowrap">
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
      ) : (
        <div>
          {bookingsData.map((booking) => (
            <ResponsiveTable
              key={booking._id}
              title={`${booking?.studio?.name} booking`}
              subtitle={booking.status}
              fields={[
                { label: t("price"), value: booking.totalPrice },
                { label: t("data"), value: formatDate(booking.date) },
                {
                  label: t("time"),
                  value: `${convertTo12HourFormat(booking?.timeSlot || booking?.startSlot)} -
              ${convertTo12HourFormat(booking?.timeSlot || booking?.endSlot)}`,
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
        </div>
      )}

      {/* Confirm Popup */}
      <AnimatePresence mode="wait">
        {confirmPopup && (
          <Popup>
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
            <ul className="mb-4 list-inside list-disc text-sm text-gray-700">
              <li>
                <strong>{t("studio")}:</strong>
                {confirmPopup.booking?.studio?.name?.[lng]}
              </li>
              <li>
                <strong>{t("date-0")}:</strong> {formatDate(confirmPopup.booking.date)}
              </li>
              <li>
                <strong>{t("time")}:</strong>
                {convertTo12HourFormat(confirmPopup.booking.startSlot)}
              </li>
              <li>
                <strong>t('duration'):</strong> {confirmPopup.booking.duration}
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
                className={`cursor-pointer px-4 py-2 ${
                  confirmPopup.status === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-main/90 hover:bg-main"
                } rounded-lg text-white transition-colors`}
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
