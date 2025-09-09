import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Popup } from "@/components/common";
import useDataFormat from "@/hooks/useDateFormat";
import { useToast } from "@/context/Toaster-Context/ToasterContext";
import { useChangeBookingStatus } from "@/apis/admin/mange-booking.api";
import { useQueryClient } from "@tanstack/react-query";

export default function TableRow({ booking, setSelectedBooking }) {
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

  return (
    <>
      <motion.tr
        onDoubleClick={() => setSelectedBooking(booking)}
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
            {convertTo12HourFormat(booking?.timeSlot || booking?.startSlot)} -{" "}
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
          {booking.status === "pending" && (
            <>
              <button
                onClick={() => setConfirmPopup({ status: "approved" })}
                className="text-green-600 hover:text-green-900 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => setConfirmPopup({ status: "rejected" })}
                className="text-red-600 hover:text-red-900 disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}
        </td>
      </motion.tr>

      <AnimatePresence mode="wait">
        {confirmPopup && (
          <Popup>
            <h3 className="mb-4 text-lg font-semibold">Confirm Change Status</h3>
            <p className="mb-2">
              Are you sure you want to
              <span
                className={`font-bold ${confirmPopup.status === "approved" ? "text-green-600" : "text-main"} mx-1`}
              >
                {confirmPopup.status}
              </span>
              this booking?
            </p>
            <ul className="mb-4 list-inside list-disc text-sm text-gray-700">
              <li>
                <strong>Studio:</strong> {booking?.studio?.name}
              </li>
              <li>
                <strong>Date:</strong> {formatDate(booking.date)}
              </li>
              <li>
                <strong>Time:</strong> {convertTo12HourFormat(booking.startSlot)}
              </li>
              <li>
                <strong>Duration:</strong> {booking.duration} hour(s)
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
                className={`cursor-pointer px-4 py-2 ${confirmPopup.status === "approved" ? "bg-green-600 hover:bg-green-700" : "bg-main/90 hover:bg-main"} rounded-lg text-white transition-colors`}
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
