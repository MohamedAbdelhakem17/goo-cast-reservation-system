import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Popup, Loading, Table, ResponsiveTable } from "@/components/common";
import useDataFormat from "@/hooks/useDateFormat";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useChangeBookingStatus } from "@/apis/admin/mange-booking.api";
import { useQueryClient } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { CheckCheck, Expand, X } from "lucide-react";

function BookingAction({
  isPending,
  setConfirmPopup,
  isDesktop,
  setSelectedBooking,
  booking,
}) {
  if (!isPending) return null;

  return (
    <div className="flex items-center gap-x-2.5">
      <button
        onClick={() => setConfirmPopup({ status: "approved", booking })}
        className="text-sm text-green-600 hover:text-green-900 disabled:opacity-50"
      >
        {isDesktop ? "Approve" : <CheckCheck />}
      </button>

      <button
        onClick={() => setConfirmPopup({ status: "rejected", booking })}
        className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
      >
        {isDesktop ? "Reject" : <X />}
      </button>

      <button
        onClick={() => setSelectedBooking(booking)}
        className="text-sm text-blue-600 hover:text-blue-900 disabled:opacity-50"
      >
        {isDesktop ? "Show info" : <Expand />}
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
  const formatDate = useDataFormat();
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
      { id: booking._id, status: confirmPopup.status },
      {
        onSuccess: ({ message }) => {
          addToast(message || "Status changed successfully", "success");
          queryClient.invalidateQueries({ queryKey: ["get-bookings"] });
        },

        onError: ({ response }) =>
          addToast(response?.data?.message || "Something went wrong", "error"),

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
    "PERSONAL INFO",
    "STUDIO",
    "DATE",
    "DURATION",
    "TOTAL PRICE",
    "STATUS",
    "ACTIONS",
  ];

  // loading case
  if (isLoading) return <Loading />;

  // Error case
  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center text-red-700">
        <p className="text-sm">Error loading Bookings. Please try refreshing the page.</p>
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
            No Booking found. wait the first booking.
          </div>
        </div>
        {/* Mobile no data */}
        <div className="py-8 text-center text-gray-400 md:hidden">
          <p>No Booking found. wait the first booking.</p>
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
                  {booking.isGuest ? "Guest" : "Member"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="cursor-pointer text-sm font-medium text-gray-900">
                  {booking?.studio?.name || "Studio Name"}
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
                <div className="text-sm text-gray-900">{booking.duration} hour(s)</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {booking.totalPrice.toLocaleString()} EGP
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
                { label: "Price", value: booking.totalPrice },
                { label: "Data", value: formatDate(booking.date) },
                {
                  label: "Time",
                  value: `${convertTo12HourFormat(booking?.timeSlot || booking?.startSlot)} -
              ${convertTo12HourFormat(booking?.timeSlot || booking?.endSlot)}`,
                },
                { label: "Duration ", value: `${booking.duration} hour(s)` },
                { label: "User name ", value: booking.personalInfo.fullName },
                { label: "User email ", value: booking.personalInfo.email },
              ]}
              actions={
                <BookingAction
                  setSelectedBooking={setSelectedBooking}
                  isDesktop={isDesktop}
                  setConfirmPopup={setConfirmPopup}
                  isPending={booking.status === "pending"}
                  booking={booking}
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
            <h3 className="mb-4 text-lg font-semibold">Confirm Change Status</h3>
            <p className="mb-2">
              Are you sure you want to
              <span
                className={`font-bold ${
                  confirmPopup.status === "approved" ? "text-green-600" : "text-main"
                } mx-1`}
              >
                {confirmPopup.status}
              </span>
              this booking?
            </p>
            <ul className="mb-4 list-inside list-disc text-sm text-gray-700">
              <li>
                <strong>Studio:</strong> {confirmPopup.booking?.studio?.name}
              </li>
              <li>
                <strong>Date:</strong> {formatDate(confirmPopup.booking.date)}
              </li>
              <li>
                <strong>Time:</strong>{" "}
                {convertTo12HourFormat(confirmPopup.booking.startSlot)}
              </li>
              <li>
                <strong>Duration:</strong> {confirmPopup.booking.duration} hour(s)
              </li>
            </ul>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmPopup(null)}
                className="cursor-pointer rounded-lg bg-gray-200 px-4 py-2 transition-colors hover:bg-gray-300"
              >
                Cancel
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
                {isPending ? "loading .." : "Confirm"}
              </button>
            </div>
          </Popup>
        )}
      </AnimatePresence>
    </>
  );
}
